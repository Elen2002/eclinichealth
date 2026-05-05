<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\ConsultationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class QrScanController extends AbstractController
{
    #[Route('/{_locale}/patient/profile/{id}', name: 'app_patient_profile_view', locale: 'hy')]
    public function viewPatient(User $patient, ConsultationRepository $consultationRepository, \Doctrine\ORM\EntityManagerInterface $entityManager): Response
    {
        $consultations = $consultationRepository->findBy(['patientEmail' => $patient->getEmail()], ['requestedDate' => 'DESC']);

        $doctor = null;
        if ($this->getUser() && in_array('ROLE_DOCTOR', $this->getUser()->getRoles())) {
            $doctor = $entityManager->getRepository(\App\Entity\Doctor::class)->findOneBy(['user' => $this->getUser()]);
        }

        
        $doctorRelations = $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findBy(['pacient' => $patient]);
        $patientDoctors = [];
        foreach ($doctorRelations as $rel) {
            $dUser = $rel->getDoctor();
            $dProfile = $entityManager->getRepository(\App\Entity\Doctor::class)->findOneBy(['user' => $dUser]);
            if ($dProfile) {
                $patientDoctors[] = $dProfile;
            }
        }

        return $this->render('qr_scan/patient_view.html.twig', [
            'patient' => $patient,
            'consultations' => $consultations,
            'doctor' => $doctor,
            'patient_doctors' => $patientDoctors,
        ]);
    }
}
