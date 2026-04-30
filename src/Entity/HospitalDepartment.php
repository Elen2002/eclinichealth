<?php

namespace App\Entity;

use App\Repository\HospitalDepartmentRepository;
use Doctrine\ORM\Mapping as ORM;

use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HospitalDepartmentRepository::class)]
class HospitalDepartment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['hospital:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    private ?Hospital $hospital = null;

    #[ORM\ManyToOne(inversedBy: 'hospitalDepartments')]
    #[Groups(['hospital:read'])]
    private ?Department $department = null;

    #[ORM\ManyToOne]
    private ?User $doctor = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getHospital(): ?Hospital
    {
        return $this->hospital;
    }

    public function setHospital(?Hospital $hospital): static
    {
        $this->hospital = $hospital;

        return $this;
    }

    public function getDepartment(): ?Department
    {
        return $this->department;
    }

    public function setDepartment(?Department $department): static
    {
        $this->department = $department;

        return $this;
    }

    public function getDoctor(): ?User
    {
        return $this->doctor;
    }

    public function setDoctor(?User $doctor): static
    {
        $this->doctor = $doctor;

        return $this;
    }
}
