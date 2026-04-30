<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('ROLE_USER')]
class DashboardController extends AbstractController
{
    private \App\Repository\HospitalRepository $hospitalRepository;
    private \App\Repository\DepartmentRepository $departmentRepository;
    private \App\Repository\DoctorRepository $doctorRepository;
    private \App\Repository\DoctorPacientRepository $doctorPacientRepository;
    private \App\Repository\ConsultationRepository $consultationRepository;

    public function __construct(
        \App\Repository\HospitalRepository $hospitalRepository,
        \App\Repository\DepartmentRepository $departmentRepository,
        \App\Repository\DoctorRepository $doctorRepository,
        \App\Repository\DoctorPacientRepository $doctorPacientRepository,
        \App\Repository\ConsultationRepository $consultationRepository
    ) {
        $this->hospitalRepository = $hospitalRepository;
        $this->departmentRepository = $departmentRepository;
        $this->doctorRepository = $doctorRepository;
        $this->doctorPacientRepository = $doctorPacientRepository;
        $this->consultationRepository = $consultationRepository;
    }

    #[Route('/dashboard', name: 'app_dashboard')]
    public function index(): Response
    {
        if ($this->isGranted('ROLE_SUPER_ADMIN')) {
            return $this->redirectToRoute('app_super_admin_dashboard');
        } elseif ($this->isGranted('ROLE_ADMIN')) {
            return $this->redirectToRoute('app_admin_dashboard');
        } elseif ($this->isGranted('ROLE_DOCTOR')) {
            return $this->redirectToRoute('app_doctor_dashboard');
        }

        // Default redirect for generic users
        return $this->redirectToRoute('app_home');
    }

    #[Route('/dashboard/super-admin', name: 'app_super_admin_dashboard')]
    #[IsGranted('ROLE_SUPER_ADMIN')]
    public function superAdminDashboard(): Response
    {
        $hospital = new \App\Entity\Hospital();
        $form = $this->createForm(\App\Form\HospitalType::class, $hospital, [
            'action' => $this->generateUrl('app_hospital_new'),
        ]);

        return $this->render('dashboard/super_admin.html.twig', [
            'hospitals' => $this->hospitalRepository->list(),
            'hospital_form' => $form->createView(),
        ]);
    }


    #[Route('/dashboard/doctors', name: 'app_doctor_index')]
    #[IsGranted('ROLE_ADMIN')]
    public function doctorIndex(): Response
    {
        return $this->render('doctor/index.html.twig', [
            'doctors' => $this->doctorRepository->findAll(),
            'hospitals' => $this->hospitalRepository->findAll(),
        ]);
    }

    #[Route('/dashboard/doctor', name: 'app_doctor_dashboard')]
    #[IsGranted('ROLE_DOCTOR')]
    public function doctorDashboard(): Response
    {
        $user = $this->getUser();
        $doctor = $this->doctorRepository->findOneBy(['user' => $user]);

        if (!$doctor) {
            throw $this->createAccessDeniedException('You are not registered as a doctor.');
        }

        $hospital = $doctor->getHospital();
        $department = $doctor->getDepartment();

        $doctorPatients = $this->doctorPacientRepository->findBy(['doctor' => $user]);
        $totalPatients = count($doctorPatients);

        $pendingConsultations = $this->consultationRepository->count([
            'doctor' => $doctor,
            'status' => 'pending'
        ]);

        $recentConsultations = $this->consultationRepository->findBy(
            ['doctor' => $doctor],
            ['createdAt' => 'DESC'],
            5
        );

        // Simple chart data (last 6 months)
        $chartLabels = [];
        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = (new \DateTime())->modify("-$i months");
            $chartLabels[] = $month->format('M Y');
            $chartData[] = rand(5, 20); // Placeholder for actual trend data
        }

        return $this->render('dashboard/doctor.html.twig', [
            'doctor' => $doctor,
            'hospital' => $hospital,
            'department' => $department,
            'total_patients' => $totalPatients,
            'pending_consultations' => $pendingConsultations,
            'doctor_patients' => $doctorPatients,
            'recent_consultations' => $recentConsultations,
            'chart_labels' => json_encode($chartLabels),
            'chart_data' => json_encode($chartData),
        ]);
    }

    #[Route('/dashboard/admin', name: 'app_admin_dashboard')]
    #[IsGranted('ROLE_ADMIN')]
    public function adminDashboard(): Response
    {
        $doctor = new \App\Entity\Doctor();
        $form = $this->createForm(\App\Form\DoctorType::class, $doctor);

        return $this->render('dashboard/admin.html.twig', [
            'doctors' => $this->doctorRepository->findAll(),
            'departments' => $this->departmentRepository->findAll(),
            'doctor_form' => $form->createView(),
        ]);
    }
}
