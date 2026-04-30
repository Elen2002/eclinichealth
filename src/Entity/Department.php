<?php

namespace App\Entity;

use App\Repository\DepartmentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: DepartmentRepository::class)]
class Department
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['department:read', 'doctor:read', 'hospital:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['department:read', 'doctor:read', 'hospital:read'])]
    private ?string $name = null;

    #[ORM\OneToMany(mappedBy: 'department', targetEntity: HospitalDepartment::class)]
    protected Collection $hospitalDepartments;

    #[ORM\OneToMany(mappedBy: 'department', targetEntity: Doctor::class)]
    #[Groups(['department:read'])]
    protected Collection $doctors;


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

    /**
     * @return \Doctrine\Common\Collections\Collection<int, HospitalDepartment>
     */
    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['department:read', 'doctor:read', 'hospital:read'])]
    private ?string $description = null;

    /**
     * @return \Doctrine\Common\Collections\Collection<int, HospitalDepartment>
     */
    public function getHospitalDepartments(): \Doctrine\Common\Collections\Collection
    {
        return $this->hospitalDepartments;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return Collection<int, Doctor>
     */
    public function getDoctors(): Collection
    {
        return $this->doctors;
    }

    public function addDoctor(Doctor $doctor): static
    {
        if (!$this->doctors->contains($doctor)) {
            $this->doctors->add($doctor);
            $doctor->setDepartment($this);
        }

        return $this;
    }

    public function removeDoctor(Doctor $doctor): static
    {
        if ($this->doctors->removeElement($doctor)) {
            // set the owning side to null (unless already changed)
            if ($doctor->getDepartment() === $this) {
                $doctor->setDepartment(null);
            }
        }

        return $this;
    }
}
