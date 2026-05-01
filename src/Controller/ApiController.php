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
use App\Repository\ChatMessageRepository;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class ApiController extends AbstractController
{
    #[Route('/chat/history/{roomId}', name: 'app_api_chat_history', methods: ['GET'])]
    // #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function chatHistory(string $roomId, ChatMessageRepository $chatMessageRepository): JsonResponse
    {
        $messages = $chatMessageRepository->findByRoomId($roomId);
        return $this->json($messages, 200, [], ['groups' => 'chat:read']);
    }

    #[Route('/chat/save', name: 'app_api_chat_save', methods: ['POST'])]
    // #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function chatSave(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['text'], $data['roomId'], $data['targetId'])) {
            return $this->json(['error' => 'Invalid data'], 400);
        }

        $sender = $this->getUser();
        $userRepo = $entityManager->getRepository(User::class);
        $recipient = $userRepo->find($data['targetId']);

        if (!$recipient) {
             $users = $userRepo->findAll();
             foreach ($users as $u) {
                 $uId = ucfirst(explode('@', $u->getEmail())[0]);
                 if ($uId === $data['targetId']) {
                     $recipient = $u;
                     break;
                 }
             }
        }

        if (!$recipient) {
            return $this->json(['error' => 'Recipient not found'], 404);
        }

        $chatMessage = new ChatMessage();
        $chatMessage->setSender($sender);
        $chatMessage->setRecipient($recipient);
        $chatMessage->setContent($data['text']);
        $chatMessage->setRoomId($data['roomId']);

        $entityManager->persist($chatMessage);
        $entityManager->flush();

        return $this->json(['success' => true, 'id' => $chatMessage->getId()]);
    }
    #[Route('/register', name: 'api_register', methods: ['POST'])]
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
        $user->setFirstName($data['firstName'] ?? '');
        $user->setLastName($data['lastName'] ?? '');
        $user->setRoles(['ROLE_USER']);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['status' => 'success', 'message' => 'User registered successfully']);
    }

    #[Route('/login', name: 'api_login', methods: ['POST'])]
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

        // Generate a simple token for mobile use
        $token = bin2hex(random_bytes(32));

        return $this->json([
            'status' => 'success',
            'token' => $token,
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'roles' => $user->getRoles()
            ]
        ]);
    }

    #[Route('/hospitals', name: 'api_hospitals', methods: ['GET'])]

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

    #[Route('/doctors', name: 'api_doctors', methods: ['GET'])]
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

    #[Route('/departments', name: 'api_departments', methods: ['GET'])]
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

    #[Route('/hospitals/{id}/doctors', name: 'api_hospital_doctors', methods: ['GET'])]
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

    #[Route('/consultation', name: 'api_consultation_create', methods: ['POST'])]
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

}
