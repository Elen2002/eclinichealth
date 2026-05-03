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
        ], $hospitals);

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
    public function getDepartments(DepartmentRepository $departmentRepository): JsonResponse
    {
        $departments = $departmentRepository->findAll();
        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'name' => $d->getName(),
            'description' => $d->getDescription(),
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
            'image' => $uploadFileService->getImage(\App\Entity\Department::class, $department->getId(), '800x600') ?: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
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
            $consultation->setPatientEmail($data['email'] ?? 'mobile@eclinic.int');
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

    #[Route('/api/notifications/mark-all-read', name: 'api_notifications_mark_all_read', methods: ['POST'])]
    public function markAllNotificationsRead(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
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
                    'avatar' => $user->getAvatar() ? $user->getAvatar() : null
                ]
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/chat/recent-communications', name: 'api_recent_communications', methods: ['GET'])]
    public function getRecentCommunications(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json([], 200);
        }

        $locale = $request->getLocale() ?: 'hy';

        // Fetch recent ChatMessages to identify unique chat partners
        $allMessages = $entityManager->getRepository(ChatMessage::class)->createQueryBuilder('m')
            ->where('m.sender = :user OR m.recipient = :user')
            ->setParameter('user', $user)
            ->orderBy('m.createdAt', 'DESC')
            ->getQuery()
            ->getResult();

        $data = [];
        $currentUserId = $user->getId();
        
        // Fetch Doctor entity to get the correct ID for links
        $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);
        $ownerIdForLink = $doctor ? $doctor->getId() : $currentUserId;

        // Process chat messages
        foreach ($allMessages as $m) {
            $sender = $m->getSender();
            $recipient = $m->getRecipient();
            
            if (!$sender || !$recipient) continue;

            $partner = ($sender->getId() === $currentUserId) ? $recipient : $sender;
            $partnerId = $partner->getId();

            if ($partnerId === $currentUserId) continue;

            $partnerName = $partner->getFirstName() ? ($partner->getFirstName() . ' ' . $partner->getLastName()) : $partner->getEmail();
            
            $data[] = [
                'id' => 'chat_' . $partnerId,
                'title' => $partnerName,
                'message' => $m->getContent(),
                'time' => $m->getCreatedAt()->format('Y-m-d H:i'),
                'link' => '/' . $locale . '/profile/chat/' . $ownerIdForLink . '/' . $partnerId,
                'type' => 'chat',
                'timestamp' => $m->getCreatedAt()->getTimestamp()
            ];
        }

        // Fetch recent Notifications
        $notifications = $entityManager->getRepository(Notification::class)->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC'],
            10 // Fetch more to allow for deduplication
        );

        foreach ($notifications as $n) {
            $data[] = [
                'id' => 'notif_' . $n->getId(),
                'title' => $n->getTitle(),
                'message' => $n->getMessage(),
                'time' => $n->getCreatedAt()->format('Y-m-d H:i'),
                'link' => $n->getLink(),
                'type' => 'notification',
                'timestamp' => $n->getCreatedAt()->getTimestamp()
            ];
        }

        // Sort combined list by timestamp
        usort($data, fn($a, $b) => $b['timestamp'] <=> $a['timestamp']);

        // Final deduplication by title (user)
        $finalData = [];
        $seenTitles = [];
        foreach ($data as $item) {
            if (!isset($seenTitles[$item['title']])) {
                $seenTitles[$item['title']] = true;
                $finalData[] = $item;
            }
            if (count($finalData) >= 5) break;
        }

        return $this->json($finalData);
    }

    #[Route('/api/user/profile', name: 'api_user_profile', methods: ['GET'])]
    public function getProfile(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $data = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'avatar' => $user->getAvatar(),
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
    public function getDoctorConsultations(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);
        if (!$doctor) return $this->json(['error' => 'Doctor profile not found'], 404);

        $consultations = $entityManager->getRepository(Consultation::class)->findBy(
            ['doctor' => $doctor],
            ['requestedDate' => 'DESC']
        );

        $data = array_map(fn($c) => [
            'id' => $c->getId(),
            'patientName' => $c->getPatientName(),
            'patientPhone' => $c->getPatientPhone(),
            'patientEmail' => $c->getPatientEmail(),
            'requestedDate' => $c->getRequestedDate()->format('Y-m-d H:i'),
            'status' => $c->getStatus(),
            'message' => $c->getMessage(),
        ], $consultations);

        return $this->json($data);
    }

    #[Route('/api/doctor/patients', name: 'api_doctor_patients', methods: ['GET'])]
    public function getDoctorPatients(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);
        if (!$doctor) return $this->json(['error' => 'Doctor profile not found'], 404);

        $relations = $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findBy(['doctor' => $user]);
        
        $data = array_map(fn($r) => [
            'id' => $r->getPacient()->getId(),
            'name' => $r->getPacient()->getFirstName() . ' ' . $r->getPacient()->getLastName(),
            'email' => $r->getPacient()->getEmail(),
            'avatar' => $r->getPacient()->getAvatar(),
            'lastVisit' => '2024-05-01', // Placeholder or fetch from history
        ], $relations);

        return $this->json($data);
    }

    #[Route('/api/user/consultations', name: 'api_user_consultations', methods: ['GET'])]
    public function getUserConsultations(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $email = $user->getEmail();
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
    public function getUserDoctors(EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) return $this->json(['error' => 'Unauthorized'], 401);

        $relations = $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findBy(['pacient' => $user]);
        
        $data = array_map(function($r) use ($entityManager) {
            $doctorUser = $r->getDoctor();
            $doctorProfile = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $doctorUser]);
            return [
                'id' => $doctorProfile ? $doctorProfile->getId() : 0,
                'name' => $doctorUser->getFirstName() . ' ' . $doctorUser->getLastName(),
                'specialty' => $doctorProfile ? $doctorProfile->getSpecialty() : 'Specialist',
                'hospital_name' => ($doctorProfile && $doctorProfile->getHospital()) ? $doctorProfile->getHospital()->getName() : 'Hospital',
                'image' => $doctorUser->getAvatar(),
            ];
        }, $relations);

        return $this->json($data);
    }
}
