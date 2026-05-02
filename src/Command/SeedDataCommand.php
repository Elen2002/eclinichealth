<?php

namespace App\Command;

use App\Entity\Department;
use App\Entity\Doctor;
use App\Entity\Hospital;
use App\Entity\HospitalDepartment;
use App\Entity\User;
use App\Entity\Review;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:seed-data',
    description: 'Seed the database with realistic healthcare data.',
)]
class SeedDataCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Seeding EClinic Data');

        // 1. Admin User
        $adminEmail = 'admin@mail.ru';
        $admin = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $adminEmail]);
        if (!$admin) {
            $admin = new User();
            $admin->setEmail($adminEmail);
            $admin->setRoles(['ROLE_ADMIN']);
            $admin->setPassword($this->passwordHasher->hashPassword($admin, 'qwerty'));
            $admin->setFirstName('System');
            $admin->setLastName('Administrator');
            $admin->setIsVerified(true);
            $this->entityManager->persist($admin);
            $io->text('Created admin user: ' . $adminEmail);
        }

        // 2. Departments
        $deptNames = [
            'emergency' => 'Emergency Care',
            'Kardio' => 'Cardiology',
            'Surgery' => 'General Surgery',
            'Pediatrics' => 'Pediatrics',
            'Neurology' => 'Neurology',
            'Nerses' => 'Nursing Services'
        ];
        $departments = [];
        foreach ($deptNames as $key => $name) {
            $dept = $this->entityManager->getRepository(Department::class)->findOneBy(['name' => $key]);
            if (!$dept) {
                $dept = new Department();
                $dept->setName($key);
                $dept->setDescription("Advanced specialized care in $name.");
                $this->entityManager->persist($dept);
            }
            $departments[$key] = $dept;
        }
        $this->entityManager->flush();
        $io->text('Departments seeded.');

        // 3. Hospitals
        $hospitalsData = [
            [
                'name' => 'Central Medical Plaza',
                'address' => '123 Health Ave, Yerevan',
                'phone' => '+374 10 000001',
                'email' => 'central@eclinic.am',
                'about' => 'The leading medical facility in the capital, equipped with latest diagnostic tools.',
                'beds' => 250,
                'staff' => 120,
                'depts' => ['emergency', 'Kardio', 'Surgery']
            ],
            [
                'name' => 'Elite Health Center',
                'address' => '45 Victory Square, Gyumri',
                'phone' => '+374 31 000002',
                'email' => 'elite@eclinic.am',
                'about' => 'Premium healthcare services focusing on cardiology and patient rehabilitation.',
                'beds' => 150,
                'staff' => 80,
                'depts' => ['Kardio', 'Neurology', 'Nerses']
            ],
            [
                'name' => 'Modern Care Clinic',
                'address' => '12 Tigran Mets Ave, Vanadzor',
                'phone' => '+374 32 000003',
                'email' => 'modern@eclinic.am',
                'about' => 'Innovative clinic providing 24/7 emergency and pediatric care.',
                'beds' => 100,
                'staff' => 60,
                'depts' => ['emergency', 'Pediatrics']
            ]
        ];

        foreach ($hospitalsData as $data) {
            $hospital = $this->entityManager->getRepository(Hospital::class)->findOneBy(['name' => $data['name']]);
            if (!$hospital) {
                $hospital = new Hospital();
                $hospital->setName($data['name']);
                $hospital->setAddress($data['address']);
                $hospital->setPhone($data['phone']);
                $hospital->setEmail($data['email']);
                $hospital->setAbout($data['about']);
                $hospital->setBedsCount($data['beds']);
                $hospital->setStaffCount($data['staff']);
                $hospital->setHasAmbulance(true);
                $this->entityManager->persist($hospital);
            }

            // Link departments
            foreach ($data['depts'] as $dKey) {
                $exists = $this->entityManager->getRepository(HospitalDepartment::class)->findOneBy([
                    'hospital' => $hospital,
                    'department' => $departments[$dKey]
                ]);
                if (!$exists) {
                    $hd = new HospitalDepartment();
                    $hd->setHospital($hospital);
                    $hd->setDepartment($departments[$dKey]);
                    $this->entityManager->persist($hd);
                }
            }
        }
        $this->entityManager->flush();
        $io->text('Hospitals seeded.');

        // 4. Doctors
        $doctorsData = [
            [
                'email' => 'dr.smith@mail.ru',
                'first' => 'John',
                'last' => 'Smith',
                'specialty' => 'Chief Cardiologist',
                'role' => 'Cardiologist',
                'hospital' => 'Central Medical Plaza',
                'dept' => 'Kardio'
            ],
            [
                'email' => 'dr.doe@mail.ru',
                'first' => 'Jane',
                'last' => 'Doe',
                'specialty' => 'Pediatric Surgeon',
                'role' => 'Surgeon',
                'hospital' => 'Modern Care Clinic',
                'dept' => 'Pediatrics'
            ],
            [
                'email' => 'dr.brown@mail.ru',
                'first' => 'Michael',
                'last' => 'Brown',
                'specialty' => 'Emergency Specialist',
                'role' => 'Therapist',
                'hospital' => 'Central Medical Plaza',
                'dept' => 'emergency'
            ]
        ];

        foreach ($doctorsData as $data) {
            $u = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if (!$u) {
                $u = new User();
                $u->setEmail($data['email']);
                $u->setRoles(['ROLE_DOCTOR']);
                $u->setPassword($this->passwordHasher->hashPassword($u, 'qwerty'));
                $u->setFirstName($data['first']);
                $u->setLastName($data['last']);
                $u->setIsVerified(true);
                $this->entityManager->persist($u);
            }

            $dr = $this->entityManager->getRepository(Doctor::class)->findOneBy(['user' => $u]);
            if (!$dr) {
                $dr = new Doctor();
                $dr->setUser($u);
                $dr->setSpecialty($data['specialty']);
                $dr->setRoleType($data['role']);
                $dr->setPhone('+374 99 111222');
                $dr->setIsActive(true);
                
                $h = $this->entityManager->getRepository(Hospital::class)->findOneBy(['name' => $data['hospital']]);
                $d = $this->entityManager->getRepository(Department::class)->findOneBy(['name' => $data['dept']]);
                
                $dr->setHospital($h);
                $dr->setDepartment($d);
                
                $this->entityManager->persist($dr);
            }

            // Create some fake reviews
            if ($dr->getReviews()->isEmpty()) {
                for ($i = 0; $i < 3; $i++) {
                    $review = new Review();
                    $review->setDoctor($dr);
                    $review->setRating(rand(4, 5));
                    $review->setContent("Great experience with Dr. " . $data['last'] . ". Very professional!");
                    $review->setCreatedAt(new \DateTimeImmutable("-" . rand(1, 30) . " days"));
                    $this->entityManager->persist($review);
                }
            }
        }
        $this->entityManager->flush();
        $io->text('Doctors and Reviews seeded.');

        $io->success('Database successfully seeded with realistic content!');

        return Command::SUCCESS;
    }
}
