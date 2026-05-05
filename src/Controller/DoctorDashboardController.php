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
        
        
        $doctor = $entityManager->getRepository(Doctor::class)->findOneBy(['user' => $user]);

        if (!$doctor) {
            
            $this->addFlash('error', 'Doctor profile not found.');
            return $this->redirectToRoute('app_home');
        }

        
        
        $doctorPatients = $entityManager->getRepository(DoctorPacient::class)->findBy(['doctor' => $user]);
        $totalPatients = count($doctorPatients);

        
        $consultations = $entityManager->getRepository(Consultation::class)->findBy(['doctor' => $doctor], ['requestedDate' => 'DESC']);
        
        $pendingConsultations = 0;
        $appointmentsPerMonth = []; 
        
        foreach ($consultations as $consultation) {
            if ($consultation->getStatus() === 'pending') {
                $pendingConsultations++;
            }
            
            
            $monthKey = $consultation->getCreatedAt()->format('Y-m');
            if (!isset($appointmentsPerMonth[$monthKey])) {
                $appointmentsPerMonth[$monthKey] = 0;
            }
            $appointmentsPerMonth[$monthKey]++;
        }
        
        
        ksort($appointmentsPerMonth);
        $chartLabels = array_keys($appointmentsPerMonth);
        $chartData = array_values($appointmentsPerMonth);

        
        $recentMessages = $entityManager->createQuery(
            'SELECT m FROM App\Entity\ChatMessage m
             WHERE m.sender = :user OR m.recipient = :user
             ORDER BY m.createdAt DESC'
        )
        ->setParameter('user', $user)
        ->setMaxResults(50) 
        ->getResult();

        $allData = [];
        
        foreach ($recentMessages as $msg) {
            $partner = ($msg->getSender()->getId() === $user->getId()) ? $msg->getRecipient() : $msg->getSender();
            $partnerId = $partner->getId();
            
            if ($partnerId === $user->getId()) continue;

            $partnerName = $partner->getFirstName() ? $partner->getFirstName() . ' ' . $partner->getLastName() : $partner->getEmail();
            
            $allData[] = [
                'id' => $msg->getId(),
                'title' => $partnerName,
                'message' => $msg->getContent(),
                'time' => $msg->getCreatedAt()->format('H:i'),
                'link' => '/' . ($request->getLocale() ?: 'hy') . '/profile/chat/' . $doctor->getId() . '/' . $partnerId,
                'timestamp' => $msg->getCreatedAt()->getTimestamp()
            ];
        }

        
        $notifications = $entityManager->getRepository(\App\Entity\Notification::class)->findBy(
            ['user' => $user],
            ['createdAt' => 'DESC'],
            10
        );

        foreach ($notifications as $notif) {
            $allData[] = [
                'id' => $notif->getId(),
                'title' => $notif->getTitle(),
                'message' => $notif->getMessage(),
                'time' => $notif->getCreatedAt()->format('H:i'),
                'link' => $notif->getLink(),
                'timestamp' => $notif->getCreatedAt()->getTimestamp()
            ];
        }

        
        usort($allData, fn($a, $b) => $b['timestamp'] <=> $a['timestamp']);
        
        $communications = [];
        $seenTitles = [];
        foreach ($allData as $item) {
            if (!isset($seenTitles[$item['title']])) {
                $seenTitles[$item['title']] = true;
                $communications[] = $item;
            }
            if (count($communications) >= 5) break;
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
