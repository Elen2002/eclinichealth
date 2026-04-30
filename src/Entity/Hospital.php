<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Repository\HospitalRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: HospitalRepository::class)]
class Hospital
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['hospital:read', 'doctor:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['hospital:read', 'doctor:read'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['hospital:read', 'doctor:read'])]
    private ?string $about = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['hospital:read', 'doctor:read'])]
    private ?string $address = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['hospital:read', 'doctor:read'])]
    private ?string $phone = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['hospital:read', 'doctor:read'])]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['hospital:read'])]
    private ?string $workingHours = '24/7';

    #[ORM\Column(nullable: true)]
    #[Groups(['hospital:read'])]
    private ?int $bedsCount = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['hospital:read'])]
    private ?bool $hasAmbulance = true;

    #[ORM\Column(nullable: true)]
    #[Groups(['hospital:read'])]
    private ?int $staffCount = null;

    #[ORM\OneToMany(mappedBy: 'hospital', targetEntity: HospitalDepartment::class)]
    #[Groups(['hospital:read'])]
    private Collection $hospitalDepartments;

    #[ORM\OneToMany(mappedBy: 'hospital', targetEntity: Doctor::class)]
    private Collection $doctors;

    #[Groups(['hospital:read'])]
    public array $images = [];

    public ?string $image = null;

    public array $deptList = [];

    public function __construct()
    {
        $this->hospitalDepartments = new ArrayCollection();
        $this->doctors = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getAbout(): ?string
    {
        return $this->about;
    }

    public function setAbout(?string $about): static
    {
        $this->about = $about;

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(?string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getWorkingHours(): ?string
    {
        return $this->workingHours;
    }

    public function setWorkingHours(?string $workingHours): static
    {
        $this->workingHours = $workingHours;
        return $this;
    }

    public function getBedsCount(): ?int
    {
        return $this->bedsCount;
    }

    public function setBedsCount(?int $bedsCount): static
    {
        $this->bedsCount = $bedsCount;
        return $this;
    }

    public function isHasAmbulance(): ?bool
    {
        return $this->hasAmbulance;
    }

    public function setHasAmbulance(?bool $hasAmbulance): static
    {
        $this->hasAmbulance = $hasAmbulance;
        return $this;
    }

    public function getStaffCount(): ?int
    {
        return $this->staffCount;
    }

    public function setStaffCount(?int $staffCount): static
    {
        $this->staffCount = $staffCount;
        return $this;
    }

    /**
     * @return Collection<int, HospitalDepartment>
     */
    public function getHospitalDepartments(): Collection
    {
        return $this->hospitalDepartments;
    }

    /**
     * @return Collection<int, Doctor>
     */
    public function getDoctors(): Collection
    {
        return $this->doctors;
    }
}
