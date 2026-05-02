<?php

namespace App\Controller;

use App\Entity\Doctor;
use App\Entity\DoctorPacient;
use App\Entity\User;
use App\Repository\ConsultationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('IS_AUTHENTICATED_FULLY')]
class ProfileController extends AbstractController
{
    #[Route('/{_locale}/profile', name: 'app_profile', locale: 'hy')]
    public function index(ConsultationRepository $consultationRepository, EntityManagerInterface $entityManager): Response
    {
        if ($this->isGranted('ROLE_ADMIN')) {
            return $this->redirectToRoute('app_admin');
        }

        $user = $this->getUser();
        $email = $user->getUserIdentifier();
        $consultations = $consultationRepository->findBy(['patientEmail' => $email], ['requestedDate' => 'DESC']);

        // Fetch doctors linked to this patient via DoctorPacient
        $doctorRelations = $entityManager->getRepository(DoctorPacient::class)->findBy(['pacient' => $user]);
        $myDoctors = [];
        $seenDoctorIds = [];
        foreach ($doctorRelations as $relation) {
            $doctorUser = $relation->getDoctor();
            $doctorProfile = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $doctorUser]);
            if ($doctorProfile && !in_array($doctorProfile->getId(), $seenDoctorIds)) {
                $myDoctors[] = $doctorProfile;
                $seenDoctorIds[] = $doctorProfile->getId();
            }
        }

        return $this->render('profile/index.html.twig', [
            'user' => $user,
            'consultations' => $consultations,
            'my_doctors' => $myDoctors,
        ]);
    }

    #[Route('/{_locale}/profile/doctors', name: 'app_profile_doctors', locale: 'hy')]
    public function myDoctors(EntityManagerInterface $entityManager, ConsultationRepository $consultationRepository): Response
    {
        $user = $this->getUser();
        $email = $user->getUserIdentifier();

        $doctorRelations = $entityManager->getRepository(DoctorPacient::class)->findBy(['pacient' => $user]);
        $myDoctors = [];
        $seenDoctorIds = [];

        foreach ($doctorRelations as $relation) {
            $doctorUser = $relation->getDoctor();
            $doctorProfile = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $doctorUser]);
            if ($doctorProfile && !in_array($doctorProfile->getId(), $seenDoctorIds)) {
                $myDoctors[] = $doctorProfile;
                $seenDoctorIds[] = $doctorProfile->getId();
            }
        }

        return $this->render('profile/my_doctors.html.twig', [
            'my_doctors' => $myDoctors,
        ]);
    }

    #[Route('/{_locale}/profile/chat/{doctorId}/{patientId}', name: 'app_profile_chat', locale: 'hy', defaults: ['patientId' => null])]
    public function chat(int $doctorId, ?int $patientId, EntityManagerInterface $entityManager): Response
    {
        $doctor = $entityManager->getRepository(Doctor::class)->find($doctorId);
        if (!$doctor) {
            throw $this->createNotFoundException('Doctor not found');
        }

        $patient = null;
        if ($patientId) {
            $patient = $entityManager->getRepository(User::class)->find($patientId);
        } else {
            $patient = $this->getUser();
        }

        $user = $this->getUser();
        $isDoctor = in_array('ROLE_DOCTOR', $user->getRoles());
        $contacts = [];

        if ($isDoctor) {
            // For doctor: show their patients
            $patientRelations = $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findBy(['doctor' => $user]);
            foreach ($patientRelations as $relation) {
                $p = $relation->getPacient();
                $contacts[] = [
                    'id' => $p->getId(),
                    'dbId' => $p->getId(),
                    'name' => $p->getFirstName() ? $p->getFirstName() . ' ' . $p->getLastName() : $p->getEmail(),
                    'avatar' => $p->getAvatar(),
                    'specialty' => 'Patient',
                    'identifier' => $p->getEmail() ? explode('@', $p->getEmail())[0] : 'user_' . $p->getId()
                ];
            }
        } else {
            // For patient: show their doctors
            $doctorRelations = $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findBy(['pacient' => $user]);
            $seenDoctorIds = [];
            foreach ($doctorRelations as $relation) {
                $doctorUser = $relation->getDoctor();
                $doctorProfile = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $doctorUser]);
                if ($doctorProfile && !in_array($doctorProfile->getId(), $seenDoctorIds)) {
                    $contacts[] = [
                        'id' => $doctorProfile->getId(),
                        'dbId' => $doctorProfile->getId(),
                        'name' => $doctorUser->getFirstName() . ' ' . $doctorUser->getLastName(),
                        'avatar' => $doctorUser->getAvatar(),
                        'specialty' => $doctorProfile->getSpecialty() ?: ($doctorProfile->getDepartment() ? $doctorProfile->getDepartment()->getName() : 'Specialist'),
                        'identifier' => $doctorUser->getEmail() ? explode('@', $doctorUser->getEmail())[0] : 'doctor_' . $doctorUser->getId()
                    ];
                    $seenDoctorIds[] = $doctorProfile->getId();
                }
            }
        }

        return $this->render('profile/chat.html.twig', [
            'doctor' => $doctor,
            'patient' => $patient,
            'contacts' => $contacts,
        ]);
    }

    #[Route('/{_locale}/profile/notifications', name: 'app_profile_notifications', locale: 'hy')]
    public function notifications(
        \Symfony\Component\HttpFoundation\Request $request,
        EntityManagerInterface $entityManager
    ): Response {
        $user = $this->getUser();
        $page = $request->query->getInt('page', 1);
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $repo = $entityManager->getRepository(\App\Entity\Notification::class);
        
        $notifications = $repo->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC'],
            $limit,
            $offset
        );

        $total = $repo->count(['user' => $user]);
        $totalPages = ceil($total / $limit);

        return $this->render('profile/notifications.html.twig', [
            'notifications' => $notifications,
            'currentPage' => $page,
            'totalPages' => $totalPages,
        ]);
    }

    #[Route('/{_locale}/profile/edit', name: 'app_profile_edit', defaults: ['_locale' => 'hy'])]
    public function edit(
        \Symfony\Component\HttpFoundation\Request $request,
        \Doctrine\ORM\EntityManagerInterface $entityManager,
        \Symfony\Component\String\Slugger\SluggerInterface $slugger,
        ConsultationRepository $consultationRepository
    ): Response {
        /** @var User $user */
        $user = $this->getUser();
        $form = $this->createForm(\App\Form\ProfileType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $avatarFile = $form->get('avatar_file')->getData();

            if ($avatarFile) {
                $originalFilename = pathinfo($avatarFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename.'-'.uniqid().'.'.$avatarFile->guessExtension();

                try {
                    $avatarFile->move(
                        $this->getParameter('kernel.project_dir').'/public/uploads/avatars',
                        $newFilename
                    );
                    $user->setAvatar('/uploads/avatars/'.$newFilename);
                } catch (\Exception $e) {
                    $this->addFlash('error', 'Could not upload avatar.');
                }
            }

            $entityManager->flush();
            $this->addFlash('success', 'Profile updated successfully.');

            if ($this->isGranted('ROLE_DOCTOR')) {
                return $this->redirectToRoute('app_doctor_dashboard');
            }

            return $this->redirectToRoute('app_profile');
        }

        $consultations = $consultationRepository->findBy(['patientEmail' => $user->getUserIdentifier()], ['requestedDate' => 'DESC']);

        return $this->render('profile/edit.html.twig', [
            'form' => $form->createView(),
            'user' => $user,
            'consultations' => $consultations,
        ]);
    }
}
