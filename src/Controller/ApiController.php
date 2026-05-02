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
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $userPasswordHasher): JsonResponse
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

        return $this->json([
            'status' => 'success',
            'token' => $user->getApiToken(),
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'roles' => $user->getRoles()
            ]
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
    public function getDoctors(DoctorRepository $doctorRepository): JsonResponse
    {
        $doctors = $doctorRepository->findAll();

        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'email' => $d->getUser() ? $d->getUser()->getEmail() : 'Unknown', // Using email as name proxy if needed
            'specialty' => $d->getSpecialty(),
            'roleType' => $d->getRoleType(),
            'hospital' => $d->getHospital() ? $d->getHospital()->getName() : null,
            'department' => $d->getDepartment() ? $d->getDepartment()->getName() : null,
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

    #[Route('/api/hospitals/{id}/doctors', name: 'api_hospital_doctors', methods: ['GET'])]
    public function getHospitalDoctors(int $id, HospitalRepository $hospitalRepository): JsonResponse
    {
        $hospital = $hospitalRepository->find($id);
        if (!$hospital) return $this->json(['error' => 'Hospital not found'], 404);

        $data = array_map(fn($d) => [
            'id' => $d->getId(),
            'name' => $d->getUser() ? $d->getUser()->getEmail() : 'Unknown',
            'specialty' => $d->getSpecialty(),
            'departmentId' => $d->getDepartment() ? $d->getDepartment()->getId() : null,
        ], $hospital->getDoctors()->toArray());

        return $this->json($data);
    }

    #[Route('/api/consultation', name: 'api_consultation_create', methods: ['POST'])]
    public function createConsultation(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
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
        $consultation->setRequestedDate(new \DateTime($data['date']));
        $consultation->setMessage($data['message'] ?? '');
        $consultation->setStatus('pending');

        $entityManager->persist($consultation);
        $entityManager->flush();

        return $this->json([
            'status' => 'success',
            'message' => 'Consultation requested successfully',
            'id' => $consultation->getId()
        ]);
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
        foreach ($notifications as $n) $n->setRead(true);
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
}
