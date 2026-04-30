<?php

namespace App\Controller;

use App\Entity\Department;
use App\Repository\DepartmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SeedController extends AbstractController
{
    #[Route('/seed/departments', name: 'app_seed_departments')]
    public function index(DepartmentRepository $departmentRepository, EntityManagerInterface $entityManager): Response
    {
        $departments = [
            'Neurology' => 'Specialized care for disorders of the nervous system, including the brain, spinal cord, and nerves.',
            'Pediatrics' => 'Comprehensive medical care for infants, children, and adolescents, focusing on physical, mental, and emotional well-being.',
            'Ophthalmology' => 'Diagnosis and treatment of eye disorders, offering vision correction and surgical interventions.',
            'Dermatology' => 'Expert skin care services, treating conditions ranging from acne to skin cancer with advanced therapies.',
            'Orthopedics' => 'Treatment of musculoskeletal system issues, including bones, joints, ligaments, tendons, and muscles.',
            'Cardiology' => 'Advanced cardiac care, diagnosing and treating heart conditions and circulatory system disorders.',
            'Oncology' => 'Multidisciplinary cancer care, providing chemotherapy, radiation, and surgical oncology services.',
            'Dental' => 'Complete oral health services, including preventive care, cosmetic dentistry, and oral surgery.'
        ];

        $created = [];

        foreach ($departments as $name => $desc) {
            $exists = $departmentRepository->findOneBy(['name' => $name]);
            if (!$exists) {
                $dept = new Department();
                $dept->setName($name);
                $dept->setDescription($desc);
                $entityManager->persist($dept);
                $created[] = $name;
            } else {
                 // Update description if it exists but is empty
                 if (!$exists->getDescription()) {
                     $exists->setDescription($desc);
                     $created[] = $name . " (updated)";
                 }
            }
        }

        $entityManager->flush();

        return new Response(sprintf(
            'Created %d new departments: %s. <br><a href="/">Go Home</a>',
            count($created),
            implode(', ', $created)
        ));
    }
}
