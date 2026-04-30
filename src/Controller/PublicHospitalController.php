<?php

namespace App\Controller;

use App\Entity\Hospital;
use App\Repository\HospitalRepository;
use App\Repository\DepartmentRepository;
use App\Interfaces\UploadFileInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/{_locale}/hospital', requirements: ['_locale' => 'en|hy|ru'])]
class PublicHospitalController extends AbstractController
{
    #[Route('s', name: 'app_hospital_public_list', methods: ['GET'])]
    public function index(HospitalRepository $hospitalRepository, DepartmentRepository $departmentRepository, UploadFileInterface $uploadFile): Response
    {
        $hospitals = $hospitalRepository->findAll();
        foreach ($hospitals as $hospital) {
            $hospital->images = $uploadFile->getImagesArr(Hospital::class, $hospital->getId(), '970x440');
            $hospital->image = $hospital->images[0] ?? null;
            // Ensure departments are loaded for front-end filtering
            $depts = [];
            foreach ($hospital->getHospitalDepartments() as $hd) {
                $depts[] = $hd->getDepartment()->getName();
            }
            $hospital->deptList = $depts;
        }

        return $this->render('hospital/public_list.html.twig', [
            'hospitals' => $hospitals,
            'departments' => $departmentRepository->findAll(),
        ]);
    }

    #[Route('/{id}', name: 'app_hospital_public_show', methods: ['GET'])]
    public function show(Hospital $hospital, UploadFileInterface $uploadFile): Response
    {
        $doctors = $hospital->getDoctors();

        $images = $uploadFile->getImagesArr(Hospital::class, $hospital->getId(), '970x440');
        $hospital = ['hospital' => $hospital, 'images' => $images];

        return $this->render('hospital/public_show.html.twig', [
            'hospital' => $hospital,
        ]);
    }
}
