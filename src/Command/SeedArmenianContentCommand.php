<?php

namespace App\Command;

use App\Entity\Hospital;
use App\Entity\Department;
use App\Entity\Doctor;
use App\Entity\User;
use App\Entity\HospitalDepartment;
use App\Entity\Images;
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

        // Clear existing demo images (remote URLs)
        $this->entityManager->createQuery('DELETE FROM App\Entity\Images i WHERE i.title LIKE \'https://images.unsplash.com/%\'')->execute();

        // 1. Seed Departments
        $departments = $this->seedDepartments($io);

        // 2. Seed Hospitals
        $hospitals = $this->seedHospitals($io, $departments);

        // 3. Seed Doctors
        $this->seedDoctors($io, $hospitals, $departments);

        $io->success('All Armenian content seeded successfully!');
        $io->note('Demo images are now stored in the database as remote URLs.');

        return Command::SUCCESS;
    }

    private function addImage(object $entity, string $url): void
    {
        $className = get_class($entity);
        if ($className === 'Proxies\__CG__\App\Entity\Hospital' || $className === 'Proxies\__CG__\App\Entity\Department') {
            $className = str_replace('Proxies\__CG__\\', '', $className);
        }
        
        $image = new Images();
        $image->setParentClass($className);
        $image->setEntityId($entity->getId());
        $image->setTitle($url);
        $image->setSize('original');
        $this->entityManager->persist($image);
    }

    private function seedDepartments(SymfonyStyle $io): array
    {
        $io->section('Seeding Departments');
        
        $deptData = [
            ['Կարդիոլոգիա', 'Սրտանոթային համակարգի հիվանդությունների բարձրակարգ ախտորոշում և բուժում՝ օգտագործելով վերջին սերնդի սարքավորումները:'],
            ['Նյարդաբանություն', 'Կենտրոնական և ծայրամասային նյարդային համակարգի խանգարումների մասնագիտացված բժշկական օգնություն և վերականգնում:'],
            ['Օրթոպեդիա', 'Հենաշարժողական համակարգի վնասվածքների, հոդերի և ողնաշարի հիվանդությունների ժամանակակից վիրաբուժական և թերապևտիկ բուժում:'],
            ['Մանկաբարձություն', 'Ապահով հղիություն և ծննդաբերություն. մենք հոգ ենք տանում Ձեր և Ձեր փոքրիկի առողջության մասին ամենաբարձր մակարդակով:'],
            ['Թերապիա', 'Ընդհանուր հիվանդությունների համապարփակ ախտորոշում, կանխարգելում և անհատականացված բուժման պլանների մշակում:'],
            ['Ատամնաբուժություն', 'Ժամանակակից ստոմատոլոգիական ծառայություններ՝ սկսած պրոֆեսիոնալ մաքրումից մինչև բարդ վիրաբուժական միջամտություններ:'],
            ['Դիագնոստիկա', 'Ճշգրիտ լաբորատոր հետազոտություններ և գործիքային ախտորոշում (KT, MRT, Ռենտգեն) արագ և որակյալ արդյունքներով:'],
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
            $this->entityManager->flush(); // Flush to get ID

            // Add unique image
            $imgUrl = match($name) {
                'Կարդիոլոգիա' => 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=800',
                'Նյարդաբանություն' => 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
                'Ատամնաբուժություն' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
                'Մանկաբարձություն' => 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
                'Օրթոպեդիա' => 'https://images.unsplash.com/photo-1579154235602-3c2c2aa59ace?auto=format&fit=crop&q=80&w=800',
                'Թերապիա' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
                'Դիագնոստիկա' => 'https://images.unsplash.com/photo-1579154236605-e325091726a5?auto=format&fit=crop&q=80&w=800',
                default => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
            };
            $this->addImage($dept, $imgUrl);
            
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
            
            $this->entityManager->persist($hospital);
            $this->entityManager->flush(); // Flush to get ID

            // Add unique image
            $this->addImage($hospital, 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200&sig=' . $hospital->getId());

            // Assign some departments
            $randomDepts = (array) array_rand($departments, rand(3, 5));
            foreach ($randomDepts as $idx) {
                $hd = new HospitalDepartment();
                $hd->setHospital($hospital);
                $hd->setDepartment($departments[$idx]);
                $this->entityManager->persist($hd);
            }

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
