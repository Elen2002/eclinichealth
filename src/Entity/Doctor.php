<?php

namespace App\Entity;

use App\Repository\DoctorRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: DoctorRepository::class)]
class Doctor
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['doctor:read', 'department:read'])]
    private ?int $id = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[Groups(['doctor:read', 'department:read'])]
    private ?User $user = null;

    #[ORM\OneToMany(mappedBy: 'doctor', targetEntity: Review::class, cascade: ['persist', 'remove'])]
    private Collection $reviews;

    public function __construct()
    {
        $this->reviews = new ArrayCollection();
    }

    /**
     * @return Collection<int, Review>
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): static
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setDoctor($this);
        }

        return $this;
    }

    public function removeReview(Review $review): static
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getDoctor() === $this) {
                $review->setDoctor(null);
            }
        }

        return $this;
    }

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['doctor:read', 'department:read'])]
    private ?string $specialty = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['doctor:read', 'department:read'])]
    private ?string $roleType = null; // surgeon, therapist, etc.

    #[ORM\Column(length: 20, nullable: true)]
    #[Groups(['doctor:read'])]
    private ?string $phone = null;

    #[ORM\Column]
    #[Groups(['doctor:read'])]
    private bool $isActive = true;

    #[ORM\ManyToOne]
    #[Groups(['doctor:read'])]
    private ?Department $department = null;

    #[ORM\ManyToOne]
    #[Groups(['doctor:read'])]
    private ?Hospital $hospital = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getSpecialty(): ?string
    {
        return $this->specialty;
    }

    public function setSpecialty(?string $specialty): static
    {
        $this->specialty = $specialty;

        return $this;
    }

    public function getRoleType(): ?string
    {
        return $this->roleType;
    }

    public function setRoleType(?string $roleType): static
    {
        $this->roleType = $roleType;

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

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;

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

    public function getHospital(): ?Hospital
    {
        return $this->hospital;
    }

    public function setHospital(?Hospital $hospital): static
    {
        $this->hospital = $hospital;

        return $this;
    }
}
