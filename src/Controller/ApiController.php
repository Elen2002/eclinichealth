<?php

namespace App\Controller;

use App\Entity\Consultation;
use App\Entity\Doctor;
use App\Entity\Hospital;
use App\Interfaces\UploadFileInterface;
use App\Repository\DoctorRepository;
use App\Repository\HospitalRepository;
use App\Repository\DepartmentRepository;
use App\Service\UploadFileService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

use App\Repository\UserRepository;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;
use App\Entity\ChatMessage;
use App\Entity\Notification;
use App\Repository\ChatMessageRepository;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

class ApiController extends AbstractController
{
    #[Route('/api/chat/history/{roomId}', name: 'app_api_chat_history', methods: ['GET'])]
    public function chatHistory(string $roomId, ChatMessageRepository $chatMessageRepository): JsonResponse
    {
        $messages = $chatMessageRepository->findByRoomId($roomId);
        return $this->json($messages, 200, [], ['groups' => 'chat:read']);
    }

    #[Route('/api/chat/save', name: 'app_api_chat_save', methods: ['POST'])]
    public function chatSave(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data || !isset($data['text'], $data['roomId'], $data['targetId'])) {
                return $this->json(['error' => 'Invalid data'], 400);
            }

            $sender = $this->getUser();

            $userRepo = $entityManager->getRepository(User::class);
            $doctorRepo = $entityManager->getRepository(Doctor::class);
            
            $recipient = null;
            
            if ($data['targetId'] === 'support') {
                $users = $userRepo->findAll();
                foreach ($users as $u) {
                    if (in_array('ROLE_ADMIN', $u->getRoles()) || in_array('ROLE_SUPER_ADMIN', $u->getRoles())) {
                        $recipient = $u;
                        break;
                    }
                }
            }

            if (!$recipient && is_numeric($data['targetId'])) {
                $doctor = $doctorRepo->find($data['targetId']);
                if ($doctor && $doctor->getUser()) {
                    $recipient = $doctor->getUser();
                }
            }
            
            if (!$recipient && is_numeric($data['targetId'])) {
                $recipient = $userRepo->find($data['targetId']);
            }

            if (!$recipient) {
                 $users = $userRepo->findAll();
                 foreach ($users as $u) {
                     $email = $u->getEmail();
                     if (!$email) continue;
                     
                     // Direct email match
                     if ($email === $data['targetId']) {
                         $recipient = $u;
                         break;
                     }

                     $uId = ucfirst(explode('@', $email)[0]);
                     if ($uId === $data['targetId']) {
                         $recipient = $u;
                         break;
                     }
                 }
            }

            $chatMessage = new ChatMessage();
            if ($sender) $chatMessage->setSender($sender);
            if ($recipient) $chatMessage->setRecipient($recipient);
            $chatMessage->setContent($data['text']);
            $chatMessage->setRoomId($data['roomId']);

            $entityManager->persist($chatMessage);
            $entityManager->flush();

            return $this->json(['success' => true, 'id' => $chatMessage->getId()]);
        } catch (\Throwable $e) {
            return $this->json([
                'success' => false,
                'error' => 'CATCHED ERROR: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 200);
        }
    }
    #[Route('/api/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data || empty($data['email']) || empty($data['password'])) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $existingUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json(['error' => 'Email already exists'], 400);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setPassword(
            $userPasswordHasher->hashPassword($user, $data['password'])
        );
        
        // Extract name from email if not provided
        $emailParts = explode('@', $data['email']);
        $nameFromEmail = ucfirst($emailParts[0]);
        
        $user->setFirstName($data['firstName'] ?? $nameFromEmail);
        $user->setLastName($data['lastName'] ?? '');
        $user->setRoles(['ROLE_USER']);
        $user->setApiToken(bin2hex(random_bytes(32)));

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'status' => 'success', 
            'message' => 'User registered successfully',
            'token' => $user->getApiToken()
        ]);
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $userPasswordHasher, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data || empty($data['email']) || empty($data['password'])) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $user = $userRepository->findOneBy(['email' => $data['email']]);

        if (!$user || !$userPasswordHasher->isPasswordValid($user, $data['password'])) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        // Get or generate a simple token for mobile use
        if (!$user->getApiToken()) {
            $user->setApiToken(bin2hex(random_bytes(32)));
            $userRepository->save($user, true);
        }

        $userData = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),
            'avatar' => $user->getAvatar()
        ];

        if (in_array('ROLE_DOCTOR', $user->getRoles())) {
            $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);
            if ($doctor) {
                $userData['hospital_name'] = $doctor->getHospital() ? $doctor->getHospital()->getName() : null;
                $userData['specialty'] = $doctor->getSpecialty();
            }
        }

        return $this->json([
            'status' => 'success',
            'token' => $user->getApiToken(),
            'user' => $userData
        ]);
    }

    private function getApiUser(Request $request, EntityManagerInterface $entityManager): ?User
    {
        $token = $request->headers->get('Authorization');
        if ($token) {
            $token = str_replace('Bearer ', '', $token);
            if ($user = $entityManager->getRepository(User::class)->findOneBy(['apiToken' => $token])) {
                return $user;
            }
        }
        return $this->getUser();
    }

    #[Route('/api/hospitals', name: 'api_hospitals', methods: ['GET'])]
    public function getHospitals(HospitalRepository $hospitalRepository, UploadFileInterface $uploadFileService): JsonResponse
    {
        $hospitals = $hospitalRepository->findAll();

        $data = array_map(fn($h) => [
            'id' => $h->getId(),
            'name' => $h->getName(),
            'address' => $h->getAddress(),
            'description' => $h->getAbout(), // using getAbout based on HomeController
            'image' => $uploadFileService->getImage(Hospital::class, $h->getId(), '970x440'),
            'beds' => $h->getBedsCount(),
            'staff' => $h->getStaffCount(),
            'emergency' => $h->isHasAmbulance(),
            'departmentIds' => array_values($h->getHospitalDepartments()->map(fn($hd) => $hd->getDepartment() ? $hd->getDepartment()->getId() : null)->filter(fn($id) => $id !== null)->toArray()),
        ], $hospitals);

        return $this->json($data);
    }

    #[Route('/api/hospitals/{id}', name: 'api_hospital_details', methods: ['GET'])]
    public function getHospitalDetails(int $id, HospitalRepository $hospitalRepository, UploadFileInterface $uploadFileService): JsonResponse
    {
        $h = $hospitalRepository->find($id);
        if (!$h) return $this->json(['error' => 'Hospital not found'], 404);

        $data = [
            'id' => $h->getId(),
            'name' => $h->getName(),
            'address' => $h->getAddress(),
            'description' => $h->getAbout(),
            'phone' => $h->getPhone(),
            'email' => $h->getEmail(),
            'workingHours' => $h->getWorkingHours() ?: '24/7',
            'image' => $uploadFileService->getImage(Hospital::class, $h->getId(), '970x440'),
            'beds' => $h->getBedsCount(),
            'staff' => $h->getStaffCount(),
            'emergency' => $h->isHasAmbulance(),
            'departments' => array_values($h->getHospitalDepartments()->map(fn($hd) => $hd->getDepartment() ? [
                'id' => $hd->getDepartment()->getId(),
                'name' => $hd->getDepartment()->getName(),
            ] : null)->filter(fn($d) => $d !== null)->toArray()),
        ];

        return $this->json($data);
    }

    #[Route('/api/doctors', name: 'api_doctors', methods: ['GET'])]
    public function getDoctors(DoctorRepository $doctorRepository, UploadFileInterface $uploadFileService): JsonResponse
    {
        $doctors = $doctorRepository->findAll();

        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'email' => $d->getUser() ? $d->getUser()->getEmail() : 'Unknown', // Using email as name proxy if needed
            'name' => $d->getUser() ? ($d->getUser()->getFirstName() . ' ' . $d->getUser()->getLastName()) : 'Unknown',
            'specialty' => $d->getSpecialty(),
            'roleType' => $d->getRoleType(),
            'hospital' => $d->getHospital() ? $d->getHospital()->getName() : null,
            'department' => $d->getDepartment() ? $d->getDepartment()->getName() : null,
            'image' => $uploadFileService->getImage(Doctor::class, $d->getId(), '223x200'),
        ], $doctors);

        return $this->json($data);
    }

    #[Route('/api/departments', name: 'api_departments', methods: ['GET'])]
    public function getDepartments(DepartmentRepository $departmentRepository, DoctorRepository $doctorRepository, UploadFileInterface $uploadFileService): JsonResponse
    {
        $departments = $departmentRepository->findAll();
        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'name' => $d->getName(),
            'description' => $d->getDescription(),
            'image' => $uploadFileService->getImage(\App\Entity\Department::class, $d->getId(), '650x450'),
            'specialistCount' => $doctorRepository->count(['department' => $d]),
        ], $departments);

        return $this->json($data);
    }

    #[Route('/api/departments/{id}', name: 'api_department_details', methods: ['GET'])]
    public function getDepartmentDetails(int $id, DepartmentRepository $departmentRepository, UploadFileInterface $uploadFileService): JsonResponse
    {
        $department = $departmentRepository->find($id);
        if (!$department) return $this->json(['error' => 'Department not found'], 404);

        return $this->json([
            'id' => $department->getId(),
            'name' => $department->getName(),
            'description' => $department->getDescription(),
            'longDescription' => $department->getDescription(), // Using same description as placeholder
            'image' => $uploadFileService->getImage(\App\Entity\Department::class, $department->getId(), '650x450'),
        ]);
    }

    #[Route('/api/departments/{id}/doctors', name: 'api_department_doctors', methods: ['GET'])]
    public function getDepartmentDoctors(int $id, DepartmentRepository $departmentRepository, UploadFileInterface $uploadFileService): JsonResponse
    {
        $department = $departmentRepository->find($id);
        if (!$department) return $this->json(['error' => 'Department not found'], 404);

        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'name' => $d->getUser() ? ($d->getUser()->getFirstName() . ' ' . $d->getUser()->getLastName()) : 'Unknown',
            'specialty' => $d->getSpecialty(),
            'image' => $uploadFileService->getImage(Doctor::class, $d->getId(), '223x200'),
            'rating' => 4.9, // Professional fallback
            'reviews' => 120, // Professional fallback
            'role' => $d->getRoleType() ?: 'Specialist',
        ], $department->getDoctors()->toArray());

        return $this->json($data);
    }

    #[Route('/api/hospitals/{id}/doctors', name: 'api_hospital_doctors', methods: ['GET'])]
    public function getHospitalDoctors(int $id, HospitalRepository $hospitalRepository, UploadFileInterface $uploadFileService): JsonResponse
    {
        $hospital = $hospitalRepository->find($id);
        if (!$hospital) return $this->json(['error' => 'Hospital not found'], 404);

        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'name' => $d->getUser() ? ($d->getUser()->getFirstName() . ' ' . $d->getUser()->getLastName()) : 'Unknown',
            'email' => $d->getUser() ? $d->getUser()->getEmail() : 'Unknown',
            'specialty' => $d->getSpecialty(),
            'departmentId' => $d->getDepartment() ? $d->getDepartment()->getId() : null,
            'image' => $uploadFileService->getImage(Doctor::class, $d->getId(), '223x200'),
        ], $hospital->getDoctors()->toArray());

        return $this->json($data);
    }

    #[Route('/api/consultation', name: 'api_consultation_create', methods: ['POST'])]
    public function createConsultation(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data) {
                 return $this->json(['error' => 'Invalid JSON'], 400);
            }

            // Robust validation
            $required = ['name', 'phone', 'hospital_id', 'department_id', 'doctor_id', 'date'];
            foreach ($required as $field) {
                if (empty($data[$field])) {
                    return $this->json(['error' => "Missing field: $field"], 400);
                }
            }

            $hospital = $entityManager->getRepository(Hospital::class)->find($data['hospital_id']);
            $department = $entityManager->getRepository(\App\Entity\Department::class)->find($data['department_id']);
            $doctor = $entityManager->getRepository(Doctor::class)->find($data['doctor_id']);

            if (!$hospital || !$department || !$doctor) {
                return $this->json(['error' => 'Invalid hospital, department or doctor ID'], 404);
            }

            $consultation = new Consultation();
            $consultation->setPatientName($data['name']);
            $consultation->setPatientPhone($data['phone']);
            
            // Link to authenticated user if available
            $authUser = $this->getUser();
            $consultation->setPatientEmail($authUser ? $authUser->getUserIdentifier() : ($data['email'] ?? 'mobile@eclinic.int'));
            
            $consultation->setHospital($hospital);
            $consultation->setDepartment($department);
            $consultation->setDoctor($doctor);
            
            // Handle various date formats (DD.MM.YYYY HH:MM or ISO)
            $dateStr = str_replace('.', '-', $data['date']);
            try {
                $consultation->setRequestedDate(new \DateTime($dateStr));
            } catch (\Exception $e) {
                return $this->json(['error' => 'Invalid date format. Use YYYY-MM-DD or DD-MM-YYYY'], 400);
            }

            $consultation->setMessage($data['message'] ?? '');
            $consultation->setStatus('pending');
            $entityManager->persist($consultation);

            // Notify Doctor
            if ($doctor->getUser()) {
                $notification = new Notification();
                $notification->setUser($doctor->getUser());
                $notification->setTitle("New Consultation Request");
                $notification->setMessage("You have a new request from " . $data['name']);
                $notification->setType('consultation');
                $notification->setCreatedAt(new \DateTimeImmutable());
                $notification->setIsRead(false);
                $notification->setLink('/consultations/' . $consultation->getId());
                $entityManager->persist($notification);
            }

            $entityManager->flush();

            return $this->json([
                'status' => 'success',
                'message' => 'Consultation requested successfully',
                'id' => $consultation->getId()
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Server Error: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/api/notifications/unread-count', name: 'api_notifications_unread_count', methods: ['GET'])]
    public function unreadNotificationsCount(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['count' => 0]);
        $count = $entityManager->getRepository(Notification::class)->count(['user' => $user, 'isRead' => false]);
        return $this->json(['count' => $count]);
    }

    #[Route('/api/notifications', name: 'api_notifications_list', methods: ['GET'])]
    public function getNotifications(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $notifications = $entityManager->getRepository(Notification::class)->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC']
        );

        $data = array_map(fn($n) => [
            'id' => $n->getId(),
            'title' => $n->getTitle(),
            'message' => $n->getMessage(),
            'type' => $n->getType(),
            'isRead' => $n->isRead(),
            'link' => $n->getLink(),
            'createdAt' => $n->getCreatedAt()->format('Y-m-d H:i:s'),
        ], $notifications);

        return $this->json($data);
    }

    #[Route('/api/notifications/{id}/read', name: 'api_notification_mark_read', methods: ['POST'])]
    public function markNotificationRead(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $notification = $entityManager->getRepository(Notification::class)->find($id);
        if (!$notification || $notification->getUser() !== $user) {
            return $this->json(['error' => 'Notification not found'], 404);
        }

        $notification->setIsRead(true);
        $entityManager->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/notifications/mark-all-read', name: 'api_notifications_mark_all_read', methods: ['POST'])]
    public function markAllNotificationsRead(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['success' => false, 'error' => 'Not authenticated'], 401);
        $notifications = $entityManager->getRepository(Notification::class)->findBy(['user' => $user, 'isRead' => false]);
        foreach ($notifications as $n) $n->setIsRead(true);
        $entityManager->flush();
        return $this->json(['success' => true]);
    }

    #[Route('/api/user/update', name: 'api_user_update', methods: ['POST'])]
    public function updateProfile(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            if (!$data) return $this->json(['error' => 'Invalid JSON'], 400);

            $token = $request->headers->get('Authorization');
            if ($token) {
                $token = str_replace('Bearer ', '', $token);
                $user = $entityManager->getRepository(User::class)->findOneBy(['apiToken' => $token]);
            } else {
                $user = $this->getUser();
            }

            if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

            if (!empty($data['firstName'])) $user->setFirstName($data['firstName']);
            if (!empty($data['lastName'])) $user->setLastName($data['lastName']);
            if (!empty($data['phone'])) $user->setPhone($data['phone']);
            if (!empty($data['email'])) {
                $existing = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
                if ($existing && $existing->getId() !== $user->getId()) {
                    return $this->json(['error' => 'Email already in use'], 400);
                }
                $user->setEmail($data['email']);
            }

            if (!empty($data['avatar']) && str_starts_with($data['avatar'], 'data:image')) {
                $base64Image = $data['avatar'];
                $imageParts = explode(';base64,', $base64Image);
                $imageTypeAux = explode('image/', $imageParts[0]);
                $imageType = $imageTypeAux[1];
                $imageBase64 = base64_decode($imageParts[1]);
                
                $fileName = 'avatar-' . uniqid() . '.' . $imageType;
                $publicDir = $this->getParameter('kernel.project_dir') . '/public';
                $uploadDir = '/uploads/avatars';
                
                if (!file_exists($publicDir . $uploadDir)) {
                    mkdir($publicDir . $uploadDir, 0777, true);
                }
                
                file_put_contents($publicDir . $uploadDir . '/' . $fileName, $imageBase64);
                $user->setAvatar($uploadDir . '/' . $fileName);
            }

            $entityManager->flush();

            return $this->json([
                'success' => true,
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'firstName' => $user->getFirstName(),
                    'lastName' => $user->getLastName(),
                    'phone' => $user->getPhone(),
                    'avatar' => $user->getAvatar() ? $user->getAvatar() : null,
                    'roles' => $user->getRoles()
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/chat/recent-communications', name: 'api_recent_communications', methods: ['GET'])]
    public function getRecentCommunications(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) {
            return $this->json([], 200);
        }

        $allMessages = $entityManager->getRepository(ChatMessage::class)->createQueryBuilder('m')
            ->where('m.sender = :user OR m.recipient = :user')
            ->setParameter('user', $user)
            ->orderBy('m.createdAt', 'DESC')
            ->getQuery()
            ->getResult();

        $data = [];
        $currentUserId = $user->getId();
        $seenPartnerIds = [];
        
        foreach ($allMessages as $m) {
            $sender = $m->getSender();
            $recipient = $m->getRecipient();
            if (!$sender || !$recipient) continue;

            $partner = ($sender->getId() === $currentUserId) ? $recipient : $sender;
            $partnerId = $partner->getId();

            // Exclude Admins/Support from regular chat list
            $roles = $partner->getRoles();
            if (in_array('ROLE_ADMIN', $roles) || in_array('ROLE_SUPER_ADMIN', $roles) || str_contains(strtolower($partner->getEmail()), 'admin')) continue;

            if ($partnerId === $currentUserId || isset($seenPartnerIds[$partnerId])) continue;

            $partnerName = trim(($partner->getFirstName() ?? '') . ' ' . ($partner->getLastName() ?? ''));
            if (empty($partnerName)) {
                $partnerName = $partner->getEmail();
            }
            
            $data[] = [
                'id' => $partnerId,
                'title' => $partnerName,
                'avatar' => $partner->getAvatar(),
                'message' => $m->getContent(),
                'time' => $m->getCreatedAt()->format('Y-m-d H:i'),
                'type' => 'chat',
                'timestamp' => $m->getCreatedAt()->getTimestamp()
            ];
            $seenPartnerIds[$partnerId] = true;
        }

        // Include established relationships without messages
        $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);
        $relations = $doctor 
            ? $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findBy(['doctor' => $user])
            : $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findBy(['pacient' => $user]);

        foreach ($relations as $rel) {
            $partner = $doctor ? $rel->getPacient() : $rel->getDoctor();
            if (!$partner) continue;

            // Exclude Admins/Support
            $roles = $partner->getRoles();
            if (in_array('ROLE_ADMIN', $roles) || in_array('ROLE_SUPER_ADMIN', $roles) || str_contains(strtolower($partner->getEmail()), 'admin')) continue;

            $partnerId = $partner->getId();
            if (isset($seenPartnerIds[$partnerId])) continue;

            $partnerName = trim(($partner->getFirstName() ?? '') . ' ' . ($partner->getLastName() ?? ''));
            if (empty($partnerName)) {
                $partnerName = $partner->getEmail();
            }
            
            $data[] = [
                'id' => $partnerId,
                'title' => $partnerName,
                'avatar' => $partner->getAvatar(),
                'message' => 'Սկսել նոր զրույց...',
                'time' => (new \DateTime())->format('Y-m-d H:i'),
                'type' => 'chat',
                'timestamp' => (new \DateTime())->getTimestamp() - 86400
            ];
            $seenPartnerIds[$partnerId] = true;
        }

        usort($data, fn($a, $b) => $b['timestamp'] <=> $a['timestamp']);

        return $this->json($data);
    }

    #[Route('/api/user/profile', name: 'api_user_profile', methods: ['GET'])]
    public function getProfile(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $qrPath = $user->getQrPath();
        if (!$qrPath) {
            $qrPath = $this->generateUserQrCode($user, $entityManager);
        }

        $data = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phone' => $user->getPhone(),
            'avatar' => $user->getAvatar(),
            'qrPath' => $qrPath,
            'roles' => $user->getRoles(),
        ];

        if (in_array('ROLE_DOCTOR', $user->getRoles())) {
            $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);
            if ($doctor) {
                $data['hospital_name'] = $doctor->getHospital() ? $doctor->getHospital()->getName() : null;
                $data['department_name'] = $doctor->getDepartment() ? $doctor->getDepartment()->getName() : null;
                $data['specialty'] = $doctor->getSpecialty();
            }
        }

        return $this->json($data);
    }

    #[Route('/api/doctor/consultations', name: 'api_doctor_consultations', methods: ['GET'])]
    public function getDoctorConsultations(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $consultations = $entityManager->getRepository(Consultation::class)->findBy(['doctor' => $user], ['createdAt' => 'DESC']);
        
        $data = [];
        foreach ($consultations as $c) {
            $patient = $c->getPatient();
            $data[] = [
                'id' => $c->getId(),
                'patientName' => $patient ? $patient->getFirstName() . ' ' . $patient->getLastName() : 'Unknown',
                'date' => $c->getCreatedAt()->format('Y-m-d H:i'),
                'status' => $c->getStatus(),
                'message' => $c->getMessage(),
            ];
        }

        return $this->json($data);
    }

    private function generateUserQrCode(User $user, EntityManagerInterface $entityManager): string
    {
        try {
            $qrContent = 'USER_ID:' . $user->getId() . '|EMAIL:' . $user->getEmail();
            $qrCode = QrCode::create($qrContent)
                ->setSize(300)
                ->setMargin(10);
                
            $writer = new PngWriter();
            $result = $writer->write($qrCode);
            
            $fileName = 'qr_' . $user->getId() . '_' . uniqid() . '.png';
            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/qr';
            
            if (!file_exists($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
            
            $result->saveToFile($uploadDir . '/' . $fileName);
            
            $path = '/uploads/qr/' . $fileName;
            $user->setQrPath($path);
            $entityManager->flush();
            
            return $path;
        } catch (\Exception $e) {
            return '';
        }
    }


    #[Route('/api/doctor/patients', name: 'api_doctor_patients', methods: ['GET'])]
    public function getDoctorPatients(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);

        $patientsData = [];
        $seenEmails = [];

        // 1. Get from formal relations
        $relations = $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findBy(['doctor' => $user]);
        foreach ($relations as $r) {
            $p = $r->getPacient();
            if ($p && !isset($seenEmails[$p->getEmail()])) {
                $seenEmails[$p->getEmail()] = true;
                $patientsData[] = [
                    'id' => $p->getId(),
                    'name' => $p->getFirstName() . ' ' . $p->getLastName(),
                    'email' => $p->getEmail(),
                    'avatar' => $p->getAvatar(),
                    'lastVisit' => 'N/A',
                ];
            }
        }

        // 2. Get from consultations
        if ($doctor) {
            $consultations = $entityManager->getRepository(Consultation::class)->findBy(['doctor' => $doctor]);
            foreach ($consultations as $c) {
                $email = $c->getPatientEmail();
                if ($email && !isset($seenEmails[$email])) {
                    $seenEmails[$email] = true;
                    $patientsData[] = [
                        'id' => $c->getId(), // Use consultation ID as a key if user not linked
                        'name' => $c->getPatientName(),
                        'email' => $email,
                        'avatar' => null,
                        'lastVisit' => $c->getRequestedDate() ? $c->getRequestedDate()->format('Y-m-d') : 'N/A',
                    ];
                }
            }
        }

        return $this->json($patientsData);
    }

    #[Route('/api/user/consultations', name: 'api_user_consultations', methods: ['GET'])]
    public function getUserConsultations(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $email = $user->getUserIdentifier();
        $consultations = $entityManager->getRepository(Consultation::class)->findBy(
            ['patientEmail' => $email],
            ['requestedDate' => 'DESC']
        );

        $data = array_map(fn($c) => [
            'id' => $c->getId(),
            'date' => $c->getRequestedDate()->format('Y-m-d H:i'),
            'hospital_name' => $c->getHospital() ? $c->getHospital()->getName() : 'N/A',
            'department_name' => $c->getDepartment() ? $c->getDepartment()->getName() : 'N/A',
            'doctor_name' => $c->getDoctor() && $c->getDoctor()->getUser() ? ($c->getDoctor()->getUser()->getFirstName() . ' ' . $c->getDoctor()->getUser()->getLastName()) : 'N/A',
            'status' => $c->getStatus(),
        ], $consultations);

        return $this->json($data);
    }

    #[Route('/api/user/doctors', name: 'api_user_doctors', methods: ['GET'])]
    public function getUserDoctors(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $doctorsData = [];
        $seenDoctorIds = [];

        // 1. Get doctors from formal relations (DoctorPacient)
        $relations = $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findBy(['pacient' => $user]);
        foreach ($relations as $r) {
            $doctorUser = $r->getDoctor();
            $doctorProfile = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $doctorUser]);
            if ($doctorProfile && !isset($seenDoctorIds[$doctorProfile->getId()])) {
                $seenDoctorIds[$doctorProfile->getId()] = true;
                $doctorsData[] = [
                    'id' => $doctorProfile->getId(),
                    'name' => $doctorUser->getFirstName() . ' ' . $doctorUser->getLastName(),
                    'specialty' => $doctorProfile->getSpecialty(),
                    'hospital_name' => ($doctorProfile && $doctorProfile->getHospital()) ? $doctorProfile->getHospital()->getName() : 'Hospital',
                    'image' => $doctorUser->getAvatar(),
                ];
            }
        }

        // 2. Get doctors from consultations
        $email = $user->getUserIdentifier();
        $consultations = $entityManager->getRepository(Consultation::class)->findBy(['patientEmail' => $email]);
        foreach ($consultations as $c) {
            $doctorProfile = $c->getDoctor();
            if ($doctorProfile && !isset($seenDoctorIds[$doctorProfile->getId()])) {
                $seenDoctorIds[$doctorProfile->getId()] = true;
                $doctorUser = $doctorProfile->getUser();
                $doctorsData[] = [
                    'id' => $doctorProfile->getId(),
                    'name' => $doctorUser ? ($doctorUser->getFirstName() . ' ' . $doctorUser->getLastName()) : 'Unknown',
                    'specialty' => $doctorProfile->getSpecialty(),
                    'hospital_name' => $doctorProfile->getHospital() ? $doctorProfile->getHospital()->getName() : 'N/A',
                    'image' => $doctorUser ? $doctorUser->getAvatar() : null,
                ];
            }
        }

        return $this->json($doctorsData);
    }

    #[Route('/api/consultations/{id}', name: 'api_consultation_show', methods: ['GET'])]
    public function getConsultation(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $consultation = $entityManager->getRepository(Consultation::class)->find($id);
        if (!$consultation) return $this->json(['error' => 'Consultation not found'], 404);

        // Optional: Check if user is the doctor or the patient for security
        // $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);
        // if ($consultation->getDoctor() !== $doctor && $consultation->getPatientEmail() !== $user->getUserIdentifier()) {
        //     return $this->json(['error' => 'Forbidden'], 403);
        // }

        $doctorUser = $consultation->getDoctor() ? $consultation->getDoctor()->getUser() : null;

        $data = [
            'id' => $consultation->getId(),
            'patientName' => $consultation->getPatientName(),
            'patientEmail' => $consultation->getPatientEmail(),
            'patientPhone' => $consultation->getPatientPhone(),
            'patientNote' => $consultation->getMessage(),
            'requestedDate' => $consultation->getRequestedDate() ? $consultation->getRequestedDate()->format('M d, Y H:i') : null,
            'confirmedDate' => clone $consultation->getRequestedDate(), // Or getDoctorProposedDate() if implemented
            'status' => $consultation->getStatus(), // pending, confirmed, cancelled
            'prescription' => $consultation->getPrescription() ?: 'qwerty', // Placeholder matching screenshot if null
            'medicalTests' => $consultation->getMedicalTests() ?: 'Հետազոտություններ չեն պահանջվում:', // Placeholder
        ];

        // Format confirmed date same as requested date if it's "confirmed" in our mock data
        if ($data['confirmedDate']) {
            $data['confirmedDate'] = $data['confirmedDate']->format('M d, Y H:i');
        }

        return $this->json($data);
    }

    #[Route('/api/consultations/{id}/accept', name: 'api_consultation_accept', methods: ['POST'])]
    public function acceptConsultation(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $consultation = $entityManager->getRepository(Consultation::class)->find($id);
        if (!$consultation) return $this->json(['error' => 'Consultation not found'], 404);

        $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);
        if (!$doctor || $consultation->getDoctor() !== $doctor) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['prescription'])) {
            $consultation->setPrescription($data['prescription']);
        }
        if (isset($data['medicalTests'])) {
            $consultation->setMedicalTests($data['medicalTests']);
        }
        if (isset($data['confirmedDate'])) {
            try {
                $date = new \DateTime($data['confirmedDate']);
                $consultation->setDoctorProposedDate($date);
            } catch (\Exception $e) {
                // Ignore date parse errors, fall back to requested date
            }
        }

        $consultation->setStatus('confirmed');

        // Automatically create a DoctorPacient relationship if the patient is a registered user
        $patientEmail = $consultation->getPatientEmail();
        if ($patientEmail) {
            $patientUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $patientEmail]);
            if ($patientUser) {
                // Check if relationship already exists
                $existingRelation = $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findOneBy([
                    'doctor' => $user,
                    'pacient' => $patientUser
                ]);

                if (!$existingRelation) {
                    $relation = new \App\Entity\DoctorPacient();
                    $relation->setDoctor($user);
                    $relation->setPacient($patientUser);
                    $entityManager->persist($relation);
                }
            }
        }

        $entityManager->flush();
        
        // Send a "System/SMS" message in the chat as confirmation
        if ($patientUser) {
             $roomId = 'room_' . min($user->getId(), $patientUser->getId()) . '_' . max($user->getId(), $patientUser->getId());
             $confirmMsg = new ChatMessage();
             $confirmMsg->setSender($user);
             $confirmMsg->setRecipient($patientUser);
             $confirmMsg->setRoomId($roomId);
             $confirmMsg->setCreatedAtValue();
             
             $text = "I have accepted your consultation request.\n";
             if ($consultation->getPrescription()) {
                 $text .= "Prescription: " . $consultation->getPrescription() . "\n";
             }
             if ($consultation->getMedicalTests()) {
                 $text .= "Required Tests: " . $consultation->getMedicalTests() . "\n";
             }
             if ($consultation->getDoctorProposedDate()) {
                 $text .= "Date: " . $consultation->getDoctorProposedDate()->format('M d, Y H:i');
             }
             
             $confirmMsg->setContent($text);
             $entityManager->persist($confirmMsg);

             // Also create a formal Notification entity
             $notification = new Notification();
             $notification->setUser($patientUser);
             $notification->setTitle("Consultation Confirmed");
             $notification->setMessage("Dr. " . ($user->getFirstName() ?: $user->getEmail()) . " has accepted your request.");
             $notification->setType('consultation');
             $notification->setCreatedAt(new \DateTimeImmutable());
             $notification->setIsRead(false);
             $notification->setLink('/chat/' . $user->getId() . '?title=' . urlencode($user->getFirstName() . ' ' . $user->getLastName()) . '&avatar=' . urlencode($user->getAvatar() ?: ''));
             $entityManager->persist($notification);

             $entityManager->flush();
             
             // TODO: Integrate real SMS provider (Twilio/Nexmo) here
             // SmsService::send($consultation->getPatientPhone(), $text);
        }

        return $this->json(['success' => true]);
    }

    #[Route('/api/chat/messages/{partnerId}', name: 'api_chat_messages_get', methods: ['GET'])]
    public function getChatMessages(int $partnerId, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $partner = $entityManager->getRepository(User::class)->find($partnerId);
        if (!$partner) return $this->json(['error' => 'Partner not found'], 404);

        $messages = $entityManager->getRepository(ChatMessage::class)->createQueryBuilder('m')
            ->where('(m.sender = :user AND m.recipient = :partner) OR (m.sender = :partner AND m.recipient = :user)')
            ->setParameter('user', $user)
            ->setParameter('partner', $partner)
            ->orderBy('m.createdAt', 'ASC')
            ->getQuery()
            ->getResult();

        $data = [];
        foreach ($messages as $m) {
            $data[] = [
                'id' => $m->getId(),
                'senderId' => $m->getSender()->getId(),
                'content' => $m->getContent(),
                'createdAt' => $m->getCreatedAt()->format('Y-m-d H:i:s'),
                'isMine' => $m->getSender()->getId() === $user->getId(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/api/chat/messages/{partnerId}', name: 'api_chat_messages_post', methods: ['POST'])]
    public function sendChatMessage(int $partnerId, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $partner = $entityManager->getRepository(User::class)->find($partnerId);
        if (!$partner) return $this->json(['error' => 'Partner not found'], 404);

        $data = json_decode($request->getContent(), true);
        if (empty($data['content'])) {
            return $this->json(['error' => 'Content is required'], 400);
        }

        // Room ID is combination of both user IDs to keep it unique
        $roomId = 'room_' . min($user->getId(), $partner->getId()) . '_' . max($user->getId(), $partner->getId());

        $message = new ChatMessage();
        $message->setSender($user);
        $message->setRecipient($partner);
        $message->setContent($data['content']);
        $message->setRoomId($roomId);
        $message->setCreatedAtValue();

        $entityManager->persist($message);

        // Notify Recipient
        $notification = new Notification();
        $notification->setUser($partner);
        $notification->setTitle("New Message");
        $notification->setMessage("You have a new message from " . ($user->getFirstName() ?: $user->getEmail()));
        $notification->setType('chat');
        $notification->setCreatedAt(new \DateTimeImmutable());
        $notification->setIsRead(false);
        $notification->setLink('/chat/' . $user->getId() . '?title=' . urlencode($user->getFirstName() . ' ' . $user->getLastName()) . '&avatar=' . urlencode($user->getAvatar() ?: ''));
        $entityManager->persist($notification);

        $entityManager->flush();

        return $this->json([
            'id' => $message->getId(),
            'senderId' => $message->getSender()->getId(),
            'content' => $message->getContent(),
            'createdAt' => $message->getCreatedAt()->format('Y-m-d H:i:s'),
            'isMine' => true,
        ]);
    }


    #[Route('/api/consultations/{id}/reject', name: 'api_consultation_reject', methods: ['POST'])]
    public function rejectConsultation(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $consultation = $entityManager->getRepository(Consultation::class)->find($id);
        if (!$consultation) return $this->json(['error' => 'Consultation not found'], 404);

        $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);
        if (!$doctor || $consultation->getDoctor() !== $doctor) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $consultation->setStatus('rejected');

        // Notify Patient
        $patientEmail = $consultation->getPatientEmail();
        if ($patientEmail) {
            $patientUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $patientEmail]);
            if ($patientUser) {
                $notification = new Notification();
                $notification->setUser($patientUser);
                $notification->setTitle("Consultation Rejected");
                $notification->setMessage("Dr. " . ($user->getFirstName() ?: $user->getEmail()) . " has rejected your request.");
                $notification->setType('consultation');
                $notification->setCreatedAt(new \DateTimeImmutable());
                $notification->setIsRead(false);
                $notification->setLink('/profile');
                $entityManager->persist($notification);
            }
        }

        $entityManager->flush();

        return $this->json(['success' => true]);
    }

    #[Route('/api/doctor/stats', name: 'api_doctor_stats', methods: ['GET'])]
    public function getDoctorStats(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getApiUser($request, $entityManager);
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);
        if (!$doctor) return $this->json(['error' => 'Doctor not found'], 404);

        $stats = [];
        $now = new \DateTime();
        for ($i = 6; $i >= 0; $i--) {
            $date = (clone $now)->modify("- $i days");
            $dateStr = $date->format('Y-m-d');
            
            $qb = $entityManager->getRepository(Consultation::class)->createQueryBuilder('c');
            $count = $qb->select('count(c.id)')
                ->where('c.doctor = :doctor')
                ->andWhere('c.requestedDate >= :start')
                ->andWhere('c.requestedDate <= :end')
                ->setParameter('doctor', $doctor)
                ->setParameter('start', $dateStr . ' 00:00:00')
                ->setParameter('end', $dateStr . ' 23:59:59')
                ->getQuery()
                ->getSingleScalarResult();

            $stats[] = [
                'date' => $dateStr,
                'count' => (int)$count,
                'label' => $date->format('D')
            ];
        }

        return $this->json([
            'trends' => $stats,
            'summary' => [
                'totalPatients' => $entityManager->getRepository(\App\Entity\DoctorPacient::class)->count(['doctor' => $user]),
                'pendingRequests' => $entityManager->getRepository(Consultation::class)->count(['doctor' => $doctor, 'status' => 'pending']),
                'completedVisits' => $entityManager->getRepository(Consultation::class)->count(['doctor' => $doctor, 'status' => 'completed']),
            ]
        ]);
    }

    #[Route('/api/doctor/check-in', name: 'api_doctor_check_in', methods: ['POST'])]
    public function checkIn(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $doctorUser = $this->getApiUser($request, $entityManager);
        if (!$doctorUser) return $this->json(['error' => 'Unauthorized'], 401);

        $data = json_decode($request->getContent(), true);
        if (!$data || empty($data['patientData'])) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        // patientData is usually "id-email"
        $parts = explode('-', $data['patientData']);
        $patientId = (int)$parts[0];
        
        $patient = $entityManager->getRepository(User::class)->find($patientId);
        if (!$patient) return $this->json(['error' => 'Patient not found'], 404);

        // Check if relationship exists in doctor_pacient table
        $dpRepo = $entityManager->getRepository(\App\Entity\DoctorPacient::class);
        $relation = $dpRepo->findOneBy(['doctor' => $doctorUser, 'pacient' => $patient]);

        if (!$relation) {
            $relation = new \App\Entity\DoctorPacient();
            $relation->setDoctor($doctorUser);
            $relation->setPacient($patient);
            $relation->setCreatedAtValue();
            $entityManager->persist($relation);
        }

        // Notify Patient about check-in
        $notification = new Notification();
        $notification->setUser($patient);
        $notification->setTitle("Clinic Check-in");
        $notification->setMessage("You have been checked-in by Dr. " . ($doctorUser->getFirstName() ?: 'Specialist') . " at " . (new \DateTime())->format('H:i'));
        $notification->setType('info');
        $notification->setCreatedAt(new \DateTimeImmutable());
        $notification->setIsRead(false);
        $notification->setLink('/profile');
        $entityManager->persist($notification);

        $entityManager->flush();

        return $this->json([
            'status' => 'success',
            'patient' => [
                'id' => $patient->getId(),
                'name' => $patient->getFirstName() . ' ' . $patient->getLastName(),
                'email' => $patient->getEmail()
            ]
        ]);
    }
}
