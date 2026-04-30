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

    #[Route('/{_locale}/profile/chat/{doctorId}', name: 'app_profile_chat', locale: 'hy')]
    public function chat(int $doctorId, EntityManagerInterface $entityManager): Response
    {
        $doctor = $entityManager->getRepository(Doctor::class)->find($doctorId);
        if (!$doctor) {
            throw $this->createNotFoundException('Doctor not found');
        }

        return $this->render('profile/chat.html.twig', [
            'doctor' => $doctor,
        ]);
    }

    #[Route('/{_locale}/profile/notifications', name: 'app_profile_notifications', locale: 'hy')]
    public function notifications(EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $notifications = $entityManager->getRepository(\App\Entity\Notification::class)->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC']
        );

        // Mark all as read when opening the page
        foreach ($notifications as $notification) {
            if (!$notification->isRead()) {
                $notification->setIsRead(true);
            }
        }
        $entityManager->flush();

        return $this->render('profile/notifications.html.twig', [
            'notifications' => $notifications,
        ]);
    }

    #[Route('/{_locale}/profile/edit', name: 'app_profile_edit')]
    public function edit(
        \Symfony\Component\HttpFoundation\Request $request,
        \Doctrine\ORM\EntityManagerInterface $entityManager,
        \Symfony\Component\String\Slugger\SluggerInterface $slugger
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

        return $this->render('profile/edit.html.twig', [
            'form' => $form->createView(),
            'user' => $user,
        ]);
    }
}
