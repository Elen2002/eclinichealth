<?php

namespace App\Controller;

use App\Entity\Doctor;
use App\Entity\DoctorPacient;
use App\Entity\Consultation;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_DOCTOR')]
class DoctorDashboardController extends AbstractController
{
    #[Route('/{_locale}/doctor/dashboard', name: 'app_doctor_dashboard', locale: 'hy')]
    public function index(Request $request, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        
        // Fetch the Doctor entity associated with this User
        $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);

        if (!$doctor) {
            // Fallback if the user has ROLE_DOCTOR but no Doctor entity is linked (should not happen in normal flow)
            $this->addFlash('error', 'Doctor profile not found.');
            return $this->redirectToRoute('app_home');
        }

        // Fetch Stats
        // 1. Patients (DoctorPacient table links User (doctor) to User (patient))
        $doctorPatients = $entityManager->getRepository(DoctorPacient::class)->findBy(['doctor' => $user]);
        $totalPatients = count($doctorPatients);

        // 2. Consultations (Consultation table links to Doctor entity)
        $consultations = $entityManager->getRepository(Consultation::class)->findBy(['doctor' => $doctor], ['requestedDate' => 'DESC']);
        
        $pendingConsultations = 0;
        $appointmentsPerMonth = []; // For the graph
        
        foreach ($consultations as $consultation) {
            if ($consultation->getStatus() === 'pending') {
                $pendingConsultations++;
            }
            
            // Group by month for chart: "Y-m"
            $monthKey = $consultation->getCreatedAt()->format('Y-m');
            if (!isset($appointmentsPerMonth[$monthKey])) {
                $appointmentsPerMonth[$monthKey] = 0;
            }
            $appointmentsPerMonth[$monthKey]++;
        }
        
        // Sort chart data
        ksort($appointmentsPerMonth);
        $chartLabels = array_keys($appointmentsPerMonth);
        $chartData = array_values($appointmentsPerMonth);

        // Fetch last unique chat partners from ChatMessage entity
        $recentMessages = $entityManager->createQuery(
            'SELECT m FROM App\Entity\ChatMessage m
             WHERE m.sender = :user OR m.recipient = :user
             ORDER BY m.createdAt DESC'
        )
        ->setParameter('user', $user)
        ->setMaxResults(50) // Fetch more to filter unique partners
        ->getResult();

        $communications = [];
        $uniquePartners = [];
        
        foreach ($recentMessages as $msg) {
            $partner = ($msg->getSender()->getId() === $user->getId()) ? $msg->getRecipient() : $msg->getSender();
            $partnerId = $partner->getId();
            
            if (!isset($uniquePartners[$partnerId]) && count($communications) < 5) {
                $uniquePartners[$partnerId] = true;
                
                $communications[] = [
                    'id' => $msg->getId(),
                    'title' => $partner->getFirstName() ? $partner->getFirstName() . ' ' . $partner->getLastName() : $partner->getEmail(),
                    'message' => $msg->getContent(),
                    'time' => $msg->getCreatedAt()->format('H:i'),
                    'link' => '/' . ($request->getLocale() ?: 'hy') . '/profile/chat/' . $doctor->getId() . '/' . $partnerId
                ];
            }
        }

        // If no messages, fall back to notifications or empty
        if (empty($communications)) {
            $notifications = $entityManager->getRepository(\App\Entity\Notification::class)->findBy(
                ['user' => $user, 'type' => 'chat'],
                ['createdAt' => 'DESC'],
                5
            );
            foreach ($notifications as $notif) {
                $communications[] = [
                    'id' => $notif->getId(),
                    'title' => $notif->getTitle(),
                    'message' => $notif->getMessage(),
                    'time' => $notif->getCreatedAt()->format('H:i'),
                    'link' => $notif->getLink()
                ];
            }
        }

        return $this->render('dashboard/doctor.html.twig', [
            'doctor' => $doctor,
            'hospital' => $doctor->getHospital(),
            'department' => $doctor->getDepartment(),
            'doctor_patients' => $doctorPatients,
            'recent_consultations' => array_slice($consultations, 0, 5),
            'total_patients' => $totalPatients,
            'pending_consultations' => $pendingConsultations,
            'total_appointments' => count($consultations),
            'chart_labels' => json_encode($chartLabels),
            'chart_data' => json_encode($chartData),
            'communications' => json_encode($communications),
        ]);
    }
}
