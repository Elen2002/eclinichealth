<?php

namespace App\Command;

use App\Entity\Hospital;
use App\Entity\Doctor;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:seed-hospital-doctors',
    description: 'Seeds doctors for a specific hospital ID if it has none.',
)]
class SeedHospitalDoctorsCommand extends Command
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    protected function configure(): void
    {
        $this->addArgument('id', InputArgument::OPTIONAL, 'Hospital ID (optional, seeds all if omitted)');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hospitalId = $input->getArgument('id');

        if ($hospitalId) {
            $hospital = $this->entityManager->getRepository(Hospital::class)->find($hospitalId);
            if (!$hospital) {
                $io->error(sprintf('Hospital with ID %s not found.', $hospitalId));
                return Command::FAILURE;
            }
            $this->seedForHospital($hospital, $io);
        } else {
            $hospitals = $this->entityManager->getRepository(Hospital::class)->findAll();
            $io->info(sprintf('Checking %d hospitals for missing doctors...', count($hospitals)));
            foreach ($hospitals as $hospital) {
                if ($hospital->getDoctors()->count() === 0) {
                    $this->seedForHospital($hospital, $io);
                } else {
                    $io->text(sprintf('Skipping %s (already has %d doctors)', $hospital->getName(), $hospital->getDoctors()->count()));
                }
            }
        }

        $this->entityManager->flush();
        $io->success('Seeding process completed!');

        return Command::SUCCESS;
    }

    private function seedForHospital(Hospital $hospital, SymfonyStyle $io): void
    {
        $io->info(sprintf('Seeding 4 doctors for hospital: %s', $hospital->getName()));

        $depts = $hospital->getHospitalDepartments();
        if ($depts->count() === 0) {
            $io->warning(sprintf('Hospital %s has no departments. Doctors will be assigned to a general pool.', $hospital->getName()));
        }

        $doctorData = [
            ['Armen', 'Sargsyan', 'Cardiologist'],
            ['Ani', 'Hovhannisyan', 'Neurologist'],
            ['Karen', 'Grigoryan', 'Surgeon'],
            ['Mariam', 'Abrahamyan', 'Therapist']
        ];

        foreach ($doctorData as $index => [$first, $last, $spec]) {
            $user = new User();
            // Use random suffix to avoid unique constraint violations if running multiple times
            $user->setEmail(strtolower($first . '.' . $last . '.' . $hospital->getId() . '.' . bin2hex(random_bytes(2)) . '@eclinic.health'));
            $user->setFirstName($first);
            $user->setLastName($last);
            $user->setRoles(['ROLE_DOCTOR']);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'password123'));
            $user->setIsVerified(true);
            $this->entityManager->persist($user);

            $doctor = new Doctor();
            $doctor->setUser($user);
            $doctor->setHospital($hospital);
            if ($depts->count() > 0) {
                // Distribute doctors across available departments
                $deptIndex = $index % $depts->count();
                $doctor->setDepartment($depts->get($deptIndex)->getDepartment());
            }
            $doctor->setSpecialty($spec);
            $doctor->setIsActive(true);
            $this->entityManager->persist($doctor);
        }
    }
}
