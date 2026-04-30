<?php

namespace App\Entity;

use App\Repository\DoctorPacientRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: DoctorPacientRepository::class)]
class DoctorPacient
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['patient:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    private ?User $doctor = null;

    #[ORM\ManyToOne]
    #[Groups(['patient:read'])]
    private ?User $pacient = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getPacient(): ?User
    {
        return $this->pacient;
    }

    public function setPacient(?User $pacient): static
    {
        $this->pacient = $pacient;

        return $this;
    }
}
