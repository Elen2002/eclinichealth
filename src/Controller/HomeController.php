<?php

namespace App\Controller;

use App\Entity\Review;
use App\Repository\DepartmentRepository;
use App\Repository\DoctorRepository;
use App\Repository\HospitalRepository;
use App\Service\PAbstractController;
use App\Interfaces\AddressInterface;
use App\Interfaces\UploadFileInterface;
use App\Entity\Hospital;
use App\Entity\Department;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends PAbstractController
{
    #[Route('/{_locale}', name: 'app_home', locale: 'hy')]
    public function index(
        AddressInterface $addressService,
        UploadFileInterface $uploadFileService,
        HospitalRepository $hospitalRepository,
        DepartmentRepository $departmentRepository,
        DoctorRepository $doctorRepository,
        EntityManagerInterface $entityManager,
        Request $request
    ): Response {
        if ($this->getUser()) {
             // Optional: Redirect logged in users or let them see home
             // return $this->redirectToRoute('app_dashboard');
        }

        $hospitals = $hospitalRepository->findAll();

        foreach ($hospitals as $hospital) {
            $hospital->images = $uploadFileService->getImagesArr(Hospital::class, $hospital->getId(), '970x440');
        }

        $departments = $departmentRepository->findAll();

        // Build department image map: {id: imageUrl}
        $departmentImages = [];
        foreach ($departments as $dept) {
            $imgs = $uploadFileService->getImagesArr(Department::class, $dept->getId(), '970x440');
            $departmentImages[$dept->getId()] = $imgs[0] ?? null;
        }

        $doctors = $doctorRepository->findBy([], ['id' => 'DESC'], 6);

        $stats = [
            'doctors_count' => $doctorRepository->count([]),
            'hospitals_count' => $hospitalRepository->count([]),
            'departments_count' => $departmentRepository->count([]),
            'awards_count' => 12,
        ];

        $chartLabels = [];
        $chartData = [];
        foreach ($departments as $dept) {
             $chartLabels[] = $dept->getName();
             $chartData[] = rand(5, 20);
        }

        $reviews = $entityManager->getRepository(Review::class)->findAll();
        $reviewAgg = [];
        foreach ($reviews as $review) {
            $date = $review->getCreatedAt()->format('Y-m-d'); // Daily trend
            if (!isset($reviewAgg[$date])) {
                $reviewAgg[$date] = ['total' => 0, 'count' => 0];
            }
            $reviewAgg[$date]['total'] += $review->getRating();
            $reviewAgg[$date]['count']++;
        }

        $reviewChartData = [];
        foreach ($reviewAgg as $date => $data) {
            $reviewChartData[] = [
                'date' => strtotime($date) * 1000,
                'value' => round($data['total'] / $data['count'], 2)
            ];
        }
        usort($reviewChartData, fn($a, $b) => $a['date'] <=> $b['date']);

        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
            'addresses' => $addressService->getEntityAllAddresses(Hospital::class),
            'hospitals' => $hospitals,
            'departments' => $departments,
            'department_images' => $departmentImages,
            'doctors' => $doctors,
            'stats' => $stats,
            'chart_labels' => json_encode($chartLabels),
            'chart_data' => json_encode($chartData),
            'review_chart_data' => json_encode($reviewChartData),
        ]);
    }

    #[Route('/{_locale}/how-it-works', name: 'app_how_it_works', locale: 'hy')]
    public function howItWorks(): Response
    {
        return $this->render('home/how_it_works.html.twig');
    }

    #[Route('/{_locale}/departments', name: 'app_departments', locale: 'hy')]
    public function departments(DepartmentRepository $departmentRepository, UploadFileInterface $uploadFileService): Response
    {
        $departments = $departmentRepository->findAll();

        // Attach image URL to each department using the UploadFile service
        $departmentImages = [];
        foreach ($departments as $dept) {
            $images = $uploadFileService->getImagesArr(Department::class, $dept->getId(), '970x440');
            $departmentImages[$dept->getId()] = $images[0] ?? null;
        }

        return $this->render('home/departments.html.twig', [
            'departments' => $departments,
            'department_images' => $departmentImages,
        ]);
    }

    #[Route('/{_locale}/department/{id}', name: 'app_department_public_show', locale: 'hy')]
    public function departmentShow(Department $department, UploadFileInterface $uploadFileService): Response
    {
        $images = $uploadFileService->getImagesArr(Department::class, $department->getId(), '970x440');
        
        return $this->render('home/department_show.html.twig', [
            'department' => $department,
            'department_image' => $images[0] ?? null,
        ]);
    }
}
