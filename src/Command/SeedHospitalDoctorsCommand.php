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
        $this->addArgument('id', InputArgument::REQUIRED, 'Hospital ID');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hospitalId = $input->getArgument('id');

        $hospital = $this->entityManager->getRepository(Hospital::class)->find($hospitalId);
        if (!$hospital) {
            $io->error(sprintf('Hospital with ID %s not found.', $hospitalId));
            return Command::FAILURE;
        }

        if ($hospital->getDoctors()->count() > 0) {
            $io->note(sprintf('Hospital %s already has %d doctors.', $hospital->getName(), $hospital->getDoctors()->count()));
            return Command::SUCCESS;
        }

        $io->info(sprintf('Seeding 2 doctors for hospital: %s', $hospital->getName()));

        $depts = $hospital->getHospitalDepartments();
        if ($depts->count() === 0) {
            $io->warning('Hospital has no departments. Doctors will be assigned to a general pool.');
        }

        $doctorData = [
            ['Armen', 'Sargsyan', 'Cardiologist'],
            ['Ani', 'Hovhannisyan', 'Neurologist']
        ];

        foreach ($doctorData as $index => [$first, $last, $spec]) {
            $user = new User();
            $user->setEmail(strtolower($first . '.' . $last . '.' . $hospitalId . '.' . $index . '@eclinic.health'));
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
                $doctor->setDepartment($depts->first()->getDepartment());
            }
            $doctor->setSpecialty($spec);
            $doctor->setIsActive(true);
            $this->entityManager->persist($doctor);
        }

        $this->entityManager->flush();
        $io->success('Doctors seeded successfully for hospital ' . $hospital->getName());

        return Command::SUCCESS;
    }
}
