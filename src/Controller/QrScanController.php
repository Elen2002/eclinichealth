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
    #[Route('/patient/profile/{id}', name: 'app_patient_profile_view')]
    #[IsGranted('ROLE_DOCTOR')] // Only doctors/staff should see this
    public function viewPatient(User $patient, ConsultationRepository $consultationRepository): Response
    {
        $consultations = $consultationRepository->findBy(['patient' => $patient], ['requestedDate' => 'DESC']);

        return $this->render('qr_scan/patient_view.html.twig', [
            'patient' => $patient,
            'consultations' => $consultations,
        ]);
    }
}
