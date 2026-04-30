<?php

namespace App\Twig;

use App\Repository\HospitalRepository;
use App\Repository\DepartmentRepository;
use App\Repository\DoctorRepository;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class HospitalExtension extends AbstractExtension
{
    private HospitalRepository $hospitalRepository;
    private DepartmentRepository $departmentRepository;
    private DoctorRepository $doctorRepository;

    public function __construct(HospitalRepository $hospitalRepository, DepartmentRepository $departmentRepository, DoctorRepository $doctorRepository)
    {
        $this->hospitalRepository = $hospitalRepository;
        $this->departmentRepository = $departmentRepository;
        $this->doctorRepository = $doctorRepository;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('get_all_hospitals', [$this, 'getAllHospitals']),
            new TwigFunction('get_all_departments', [$this, 'getAllDepartments']),
            new TwigFunction('get_all_doctors', [$this, 'getAllDoctors']),
        ];
    }

    public function getAllHospitals(): array
    {
        return $this->hospitalRepository->findAll();
    }

    public function getAllDepartments(): array
    {
        return $this->departmentRepository->findAll();
    }

    public function getAllDoctors(): array
    {
        return $this->doctorRepository->findAll();
    }
}
