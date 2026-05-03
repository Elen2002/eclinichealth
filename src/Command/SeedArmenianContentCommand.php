<?php

namespace App\Command;

use App\Entity\Hospital;
use App\Entity\Department;
use App\Entity\Doctor;
use App\Entity\User;
use App\Entity\HospitalDepartment;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:seed-armenian',
    description: 'Seeds the database with realistic Armenian content and demo images.',
)]
class SeedArmenianContentCommand extends Command
{
    private EntityManagerInterface $entityManager;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Seeding Armenian Medical Content');

        // 1. Seed Departments
        $departments = $this->seedDepartments($io);

        // 2. Seed Hospitals
        $hospitals = $this->seedHospitals($io, $departments);

        // 3. Seed Doctors
        $this->seedDoctors($io, $hospitals, $departments);

        $io->success('All Armenian content seeded successfully!');
        $io->note('Demo images are located in public/uploads/demo/');

        return Command::SUCCESS;
    }

    private function seedDepartments(SymfonyStyle $io): array
    {
        $io->section('Seeding Departments');
        
        $deptData = [
            ['Կարդիոլոգիա', 'Սրտանոթային համակարգի հիվանդությունների ախտորոշում և բուժում:'],
            ['Նյարդաբանություն', 'Կենտրոնական և ծայրամասային նյարդային համակարգի խանգարումների բուժում:'],
            ['Օրթոպեդիա', 'Հենաշարժողական համակարգի վնասվածքների և հիվանդությունների բուժում:'],
            ['Մանկաբարձություն', 'Հղիության ընթացքի հսկողություն և ծննդաբերության կազմակերպում:'],
            ['Թերապիա', 'Ընդհանուր հիվանդությունների ախտորոշում և թերապևտիկ բուժում:'],
            ['Ատամնաբուժություն', 'Բերանի խոռոչի հիվանդությունների կանխարգելում և բուժում:'],
            ['Դիագնոստիկա', 'Բարձր ճշգրտության լաբորատոր և գործիքային հետազոտություններ:'],
        ];

        $entities = [];
        foreach ($deptData as [$name, $desc]) {
            // Check if exists
            $existing = $this->entityManager->getRepository(Department::class)->findOneBy(['name' => $name]);
            if ($existing) {
                $entities[] = $existing;
                continue;
            }

            $dept = new Department();
            $dept->setName($name);
            $dept->setDescription($desc);
            $this->entityManager->persist($dept);
            $entities[] = $dept;
        }

        $this->entityManager->flush();
        $io->text(sprintf('Processed %d departments.', count($entities)));

        return $entities;
    }

    private function seedHospitals(SymfonyStyle $io, array $departments): array
    {
        $io->section('Seeding Hospitals');

        $hospitalsData = [
            ['Նաիրի Բժշկական Կենտրոն', 'Ժամանակակից բժշկական կենտրոն Երևանի սրտում, որն ապահովում է միջազգային չափանիշներին համապատասխան բժշկական օգնություն:', 'Պարոնյան փող., 21, Երևան', '+374 10 537500'],
            ['Աստղիկ Բժշկական Կենտրոն', 'Բազմապրոֆիլ բժշկական հաստատություն բարձրակարգ սարքավորումներով և պրոֆեսիոնալ անձնակազմով:', 'Դանիել Վարուժան փող., 28ա, Երևան', '+374 10 779292'],
            ['Էրեբունի Բժշկական Կենտրոն', 'Հայաստանի խոշորագույն բժշկական հաստատություններից մեկը, որն իրականացնում է բարդագույն վիրահատություններ:', 'Տիտոգրադյան փող., 14, Երևան', '+374 10 471100'],
            ['Շենգավիթ Բժշկական Կենտրոն', 'Մասնագիտացված կենտրոն մանկաբարձության և գինեկոլոգիայի ոլորտում:', 'Մանանդյան փող., 9, Երևան', '+374 10 443311'],
        ];

        $entities = [];
        foreach ($hospitalsData as [$name, $about, $address, $phone]) {
            $existing = $this->entityManager->getRepository(Hospital::class)->findOneBy(['name' => $name]);
            if ($existing) {
                $entities[] = $existing;
                continue;
            }

            $hospital = new Hospital();
            $hospital->setName($name);
            $hospital->setAbout($about);
            $hospital->setAddress($address);
            $hospital->setPhone($phone);
            $hospital->setEmail(strtolower(str_replace(' ', '', 'info')) . '@' . bin2hex(random_bytes(2)) . '.am');
            $hospital->setWorkingHours('24/7');
            $hospital->setBedsCount(rand(100, 500));
            $hospital->setHasAmbulance(true);
            $hospital->setStaffCount(rand(50, 200));
            
            // Assign some departments
            $randomDepts = (array) array_rand($departments, rand(3, 5));
            foreach ($randomDepts as $idx) {
                $hd = new HospitalDepartment();
                $hd->setHospital($hospital);
                $hd->setDepartment($departments[$idx]);
                $this->entityManager->persist($hd);
            }

            $this->entityManager->persist($hospital);
            $entities[] = $hospital;
        }

        $this->entityManager->flush();
        $io->text(sprintf('Processed %d hospitals.', count($entities)));

        return $entities;
    }

    private function seedDoctors(SymfonyStyle $io, array $hospitals, array $departments): void
    {
        $io->section('Seeding Doctors');

        $doctorNames = [
            ['Արմեն', 'Սարգսյան', 'doctor_male.png', 'Սրտաբան'],
            ['Անի', 'Հովհաննիսյան', 'doctor_female.png', 'Նյարդաբան'],
            ['Կարեն', 'Գրիգորյան', 'doctor_male.png', 'Վիրաբույժ'],
            ['Մարիամ', 'Աբրահամյան', 'doctor_female.png', 'Թերապևտ'],
            ['Դավիթ', 'Պետրոսյան', 'doctor_male.png', 'Օրթոպեդ'],
            ['Լուսինե', 'Մկրտչյան', 'doctor_female.png', 'Մանկաբարձ'],
            ['Տիգրան', 'Բաղդասարյան', 'doctor_male.png', 'Ատամնաբույժ'],
        ];

        // To ensure every Hospital+Department has at least one doctor,
        // let's fetch all HospitalDepartment relations and assign doctors to them first.
        $hdRelations = $this->entityManager->getRepository(HospitalDepartment::class)->findAll();
        
        $docIndex = 0;
        foreach ($hdRelations as $hd) {
            $first = $doctorNames[$docIndex % count($doctorNames)][0];
            $last = $doctorNames[$docIndex % count($doctorNames)][1];
            $avatar = $doctorNames[$docIndex % count($doctorNames)][2];
            $specialty = $doctorNames[$docIndex % count($doctorNames)][3];
            
            $email = strtolower($first . '.' . $last . '.' . $hd->getHospital()->getId() . '.' . $hd->getDepartment()->getId() . '@' . bin2hex(random_bytes(1)) . '.am');
            
            $user = new User();
            $user->setEmail($email);
            $user->setFirstName($first);
            $user->setLastName($last);
            $user->setRoles(['ROLE_DOCTOR']);
            $user->setAvatar('demo/' . $avatar);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'password123'));
            $user->setIsVerified(true);
            $this->entityManager->persist($user);

            $doctor = new Doctor();
            $doctor->setUser($user);
            $doctor->setHospital($hd->getHospital());
            $doctor->setDepartment($hd->getDepartment());
            $doctor->setSpecialty($specialty);
            $doctor->setRoleType('Մասնագետ');
            $doctor->setPhone('+374 9' . rand(1, 9) . ' ' . rand(100, 999) . ' ' . rand(100, 999));
            $doctor->setIsActive(true);
            $this->entityManager->persist($doctor);
            
            $docIndex++;
        }

        $this->entityManager->flush();
        $io->text(sprintf('Created %d doctors across all hospital departments.', $docIndex));
    }
}
