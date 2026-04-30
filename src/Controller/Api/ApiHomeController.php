<?php

namespace App\Controller\Api;

use App\Repository\DepartmentRepository;
use App\Repository\DoctorRepository;
use App\Repository\HospitalRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api', name: 'api_')]
class ApiHomeController extends AbstractController
{
    #[Route('/home', name: 'home', methods: ['GET'])]
    public function index(
        HospitalRepository $hospitalRepository,
        DepartmentRepository $departmentRepository,
        DoctorRepository $doctorRepository
    ): JsonResponse
    {
        // Fetch same data as web home page
        $hospitals = $hospitalRepository->findBy([], ['id' => 'DESC'], 3);
        $departments = $departmentRepository->findAll();
        $doctors = $doctorRepository->findBy([], ['id' => 'DESC'], 6);

        // Chart Data logic
        $chartLabels = [];
        $chartData = [];
        foreach ($departments as $dept) {
             $chartLabels[] = $dept->getName();
             // Just simulation for chart visual if DB count is 0, or reuse logic
             $chartData[] = rand(5, 20); 
        }

        // Transform entities to JSON array
        return $this->json([
            'hospitals' => array_map(fn($h) => [
                'id' => $h->getId(),
                'name' => $h->getName(),
                'address' => $h->getAddress(),
                'image' => 'https://via.placeholder.com/150', // Placeholder or real image URL
            ], $hospitals),
            'departments' => array_map(fn($d) => [
                'id' => $d->getId(),
                'name' => $d->getName(),
                'description' => $d->getDescription(),
            ], $departments),
            'chart' => [
                'labels' => $chartLabels,
                'data' => $chartData
            ]
        ]);
    }
}
