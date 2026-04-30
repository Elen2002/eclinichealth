<?php

namespace App\Controller;

use App\Entity\Doctor;
use App\Entity\User;
use App\Form\DoctorType;
use App\Repository\DoctorRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

#[Route('{_locale}/admin/doctor')]
class DoctorController extends AbstractController
{
    #[Route('/new', name: 'app_doctor_new', methods: ['POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher): Response
    {
        $doctor = new Doctor();
        $form = $this->createForm(DoctorType::class, $doctor);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = new User();
            $user->setEmail($form->get('email')->getData());
            $user->setRoles(['ROLE_DOCTOR']);
            $user->setPassword($passwordHasher->hashPassword($user, 'temporary_password'));
            
            $doctor->setUser($user);
            $entityManager->persist($user);
            $entityManager->persist($doctor);
            $entityManager->flush();

            $this->addFlash('success', 'Doctor successfully onboarded.');
        }

        return $this->redirectToRoute('app_admin_dashboard');
    }

    #[Route('/export/{type}', name: 'app_doctor_export', methods: ['GET'])]
    public function export(string $type, DoctorRepository $repository): Response
    {
        $doctors = $repository->findAll();

        if ($type === 'doc') {
             $html = '<html><body><h1>Doctor List</h1><table border="1"><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Specialty</th><th>Hospital</th></tr></thead><tbody>';
             foreach ($doctors as $d) {
                 $html .= '<tr><td>'.$d->getId().'</td><td>'.htmlspecialchars($d->getUser()?->getEmail() ?? '').'</td><td>'.htmlspecialchars($d->getUser()?->getEmail() ?? '').'</td><td>'.$d->getPhone().'</td><td>'.$d->getSpecialty().'</td><td>'.($d->getHospital()?->getName() ?? '').'</td></tr>';
             }
             $html .= '</tbody></table></body></html>';
             
             $response = new Response($html);
             $response->headers->set('Content-Type', 'application/msword');
             $response->headers->set('Content-Disposition', 'attachment; filename="doctors_export.doc"');
             return $response;
        }

        $headers = ['ID', 'Email', 'Phone', 'Specialty', 'Hospital', 'Department', 'Role', 'Status'];
        $rows = [];
        $rows[] = implode(',', $headers);

        foreach ($doctors as $doctor) {
            $data = [
                $doctor->getId(),
                $doctor->getUser()?->getEmail(),
                $doctor->getPhone(),
                $doctor->getSpecialty(),
                $doctor->getHospital()?->getName(),
                $doctor->getDepartment()?->getName(),
                $doctor->getRoleType(),
                $doctor->isActive() ? 'Active' : 'Inactive'
            ];
            $rows[] = implode(',', $data);
        }

        $content = implode("\n", $rows);
        $response = new Response($content);
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="doctors_export.csv"');

        return $response;
    }

    #[Route('/import', name: 'app_doctor_import', methods: ['POST'])]
    public function import(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): Response {
        /** @var \Symfony\Component\HttpFoundation\File\UploadedFile $file */
        $file = $request->files->get('import_file');

        if (!$file) {
            $this->addFlash('error', 'Please upload a CSV file.');
            return $this->redirectToRoute('app_admin_dashboard');
        }

        $ext = strtolower($file->getClientOriginalExtension());
        if (!in_array($ext, ['csv', 'txt'])) {
            $this->addFlash('error', 'Invalid file type. Please upload a CSV file.');
            return $this->redirectToRoute('app_admin_dashboard');
        }

        $count = 0;
        if (($handle = fopen($file->getRealPath(), 'r')) !== false) {
            // Handle optional BOM
            $bom = fread($handle, 3);
            if ($bom !== chr(0xEF) . chr(0xBB) . chr(0xBF)) {
                rewind($handle);
            }

            $header = fgetcsv($handle); // skip header row

            while (($row = fgetcsv($handle)) !== false) {
                if (empty(array_filter($row))) continue;

                // Expected CSV columns: Email, Phone, Specialty, Hospital (optional), Department (optional)
                $email     = trim($row[0] ?? '');
                $phone     = trim($row[1] ?? '');
                $specialty = trim($row[2] ?? 'General');
                $hospitalName   = trim($row[3] ?? '');
                $departmentName = trim($row[4] ?? '');

                if (!$email || !filter_var($email, FILTER_VALIDATE_EMAIL)) continue;

                // Skip if user with same email already exists
                $existing = $entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
                if ($existing) continue;

                $user = new User();
                $user->setEmail($email);
                $user->setRoles(['ROLE_DOCTOR']);
                $user->setPassword($passwordHasher->hashPassword($user, 'TempPass123!'));

                $doctor = new Doctor();
                $doctor->setUser($user);
                $doctor->setPhone($phone);
                $doctor->setSpecialty($specialty);
                $doctor->setActive(true);

                if ($hospitalName) {
                    $hospital = $entityManager->getRepository(\App\Entity\Hospital::class)->findOneBy(['name' => $hospitalName]);
                    if ($hospital) {
                        $doctor->setHospital($hospital);
                    }
                }

                if ($departmentName) {
                    $department = $entityManager->getRepository(\App\Entity\Department::class)->findOneBy(['name' => $departmentName]);
                    if ($department) {
                        $doctor->setDepartment($department);
                    }
                }

                $entityManager->persist($user);
                $entityManager->persist($doctor);
                $count++;
            }

            fclose($handle);
            $entityManager->flush();
            $this->addFlash('success', sprintf('%d doctor(s) imported successfully. Default password: TempPass123!', $count));
        } else {
            $this->addFlash('error', 'Could not read the uploaded file.');
        }

        return $this->redirectToRoute('app_admin_dashboard');
    }
}
