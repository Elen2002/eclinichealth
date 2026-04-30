<?php

namespace App\Entity;

use App\Repository\ConsultationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ConsultationRepository::class)]
class Consultation
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['consultation:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['consultation:read'])]
    private ?string $patientName = null;

    #[ORM\Column(length: 255)]
    private ?string $patientEmail = null;

    #[ORM\Column(length: 20)]
    private ?string $patientPhone = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Doctor $doctor = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Hospital $hospital = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Department $department = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['consultation:read'])]
    private ?\DateTimeInterface $requestedDate = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $message = null;

    #[ORM\Column(length: 20)]
    #[Groups(['consultation:read'])]
    private ?string $status = 'pending'; // pending, confirmed, cancelled

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $prescription = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $medicalTests = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $doctorProposedDate = null;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $isPatientApproved = false;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPatientName(): ?string
    {
        return $this->patientName;
    }

    public function setPatientName(string $patientName): static
    {
        $this->patientName = $patientName;

        return $this;
    }

    public function getPatientEmail(): ?string
    {
        return $this->patientEmail;
    }

    public function setPatientEmail(string $patientEmail): static
    {
        $this->patientEmail = $patientEmail;

        return $this;
    }

    public function getPatientPhone(): ?string
    {
        return $this->patientPhone;
    }

    public function setPatientPhone(string $patientPhone): static
    {
        $this->patientPhone = $patientPhone;

        return $this;
    }

    public function getDoctor(): ?Doctor
    {
        return $this->doctor;
    }

    public function setDoctor(?Doctor $doctor): static
    {
        $this->doctor = $doctor;

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

    public function getDepartment(): ?Department
    {
        return $this->department;
    }

    public function setDepartment(?Department $department): static
    {
        $this->department = $department;

        return $this;
    }

    public function getRequestedDate(): ?\DateTimeInterface
    {
        return $this->requestedDate;
    }

    public function setRequestedDate(\DateTimeInterface $requestedDate): static
    {
        $this->requestedDate = $requestedDate;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
    public function getPrescription(): ?string
    {
        return $this->prescription;
    }

    public function setPrescription(?string $prescription): static
    {
        $this->prescription = $prescription;

        return $this;
    }

    public function getMedicalTests(): ?string
    {
        return $this->medicalTests;
    }

    public function setMedicalTests(?string $medicalTests): static
    {
        $this->medicalTests = $medicalTests;

        return $this;
    }

    public function getDoctorProposedDate(): ?\DateTimeInterface
    {
        return $this->doctorProposedDate;
    }

    public function setDoctorProposedDate(?\DateTimeInterface $doctorProposedDate): static
    {
        $this->doctorProposedDate = $doctorProposedDate;

        return $this;
    }

    public function isPatientApproved(): bool
    {
        return $this->isPatientApproved;
    }

    public function setIsPatientApproved(bool $isPatientApproved): static
    {
        $this->isPatientApproved = $isPatientApproved;

        return $this;
    }
}
