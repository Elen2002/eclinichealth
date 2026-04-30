<?php

namespace App\Controller;

use App\Entity\HospitalDepartment;
use App\Entity\Hospital;
use App\Entity\Department;
use App\Entity\Doctor;
use App\Entity\User;
use App\Form\DoctorType;
use App\Repository\DepartmentRepository;
use App\Repository\DoctorRepository;
use App\Form\HospitalType;
use App\Repository\HospitalRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Interfaces\UploadFileInterface;

#[Route('{_locale}/admin/hospital')]
final class HospitalController extends AbstractController
{

    private HospitalRepository $hospitalRepository;
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(HospitalRepository $hospitalRepository, UserPasswordHasherInterface $passwordHasher)
    {
        $this->hospitalRepository = $hospitalRepository;
        $this->passwordHasher = $passwordHasher;
    }

     #[Route('/export/{type}', name: 'app_hospital_export', methods: ['GET'])]
    public function export(string $type, HospitalRepository $repository): Response
    {
        $hospitals = $repository->findBy([], ['id' => 'DESC']);
        $headers = ['HOSPITAL', 'ID', 'LOCATION', 'DEPTS', 'STAFF COUNT', 'STATUS'];

        if ($type === 'doc') {
             $html = '<html><body>';
             $html .= '<h1>Hospital List</h1>';
             $html .= '<table border="1" cellpadding="5" cellspacing="0" width="100%">';
             $html .= '<thead><tr><th>' . implode('</th><th>', $headers) . '</th></tr></thead>';
             $html .= '<tbody>';
             foreach ($hospitals as $h) {
                 $html .= '<tr>';
                 $html .= '<td>' . htmlspecialchars($h->getName() ?? '') . '</td>';
                 $html .= '<td>EC-' . $h->getId() . '</td>';
                 $html .= '<td>' . htmlspecialchars($h->getAddress() ?? '') . '</td>';
                 $html .= '<td>' . ($h->getHospitalDepartments() ? $h->getHospitalDepartments()->count() : 0) . '</td>';
                 $html .= '<td>' . ($h->getDoctors() ? $h->getDoctors()->count() : 0) . '</td>';
                 $html .= '<td>Active</td>';
                 $html .= '</tr>';
             }
             $html .= '</tbody></table></body></html>';

             $response = new Response($html);
             $response->headers->set('Content-Type', 'application/msword');
             $disposition = $response->headers->makeDisposition(
                 ResponseHeaderBag::DISPOSITION_ATTACHMENT,
                 'hospitals_export_' . date('Y-m-d') . '.doc'
             );
             $response->headers->set('Content-Disposition', $disposition);
             return $response;
        }

        $data = [];
        $data[] = $headers;

        foreach ($hospitals as $h) {
            $data[] = [
                $h->getName(),
                'EC-' . $h->getId(),
                $h->getAddress(),
                $h->getHospitalDepartments() ? $h->getHospitalDepartments()->count() : 0,
                $h->getDoctors() ? $h->getDoctors()->count() : 0,
                'Active'
            ];
        }

        $filename = "hospitals_export_" . date('Y-m-d') . ($type === 'excel' ? ".csv" : ".csv");

        $fp = fopen('php://temp', 'r+');
        // Add UTF-8 BOM for Excel compatibility
        fprintf($fp, chr(0xEF).chr(0xBB).chr(0xBF));

        foreach ($data as $row) {
            fputcsv($fp, $row);
        }
        rewind($fp);
        $csv = stream_get_contents($fp);
        fclose($fp);

        $response = new Response($csv);
        $response->headers->set('Content-Type', 'text/csv; charset=UTF-8');
        $disposition = $response->headers->makeDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $filename
        );
        $response->headers->set('Content-Disposition', $disposition);

        return $response;
    }

     #[Route('/import', name: 'app_hospital_import', methods: ['POST'])]
    public function import(Request $request, EntityManagerInterface $entityManager): Response
    {
        /** @var UploadedFile $file */
        $file = $request->files->get('import_file');

        if (!$file) {
            $this->addFlash('error', 'Please upload a CSV file.');
            return $this->redirectToRoute('app_super_admin_dashboard');
        }

        if ($file->getClientOriginalExtension() !== 'csv' && $file->getMimeType() !== 'text/csv') {
            $this->addFlash('error', 'Invalid file type. Please upload a CSV file.');
            return $this->redirectToRoute('app_super_admin_dashboard');
        }

        $count = 0;
        if (($handle = fopen($file->getRealPath(), "r")) !== FALSE) {
            // Handle BOM if present
            $bom = fread($handle, 3);
            if ($bom !== chr(0xEF).chr(0xBB).chr(0xBF)) {
                rewind($handle);
            }

            $header = fgetcsv($handle);

            while (($data = fgetcsv($handle)) !== FALSE) {
                if (count($data) < 2) continue; // Skip empty lines

                $hospital = new Hospital();
                // We assume columns are roughly: [ID (optional/ignored), Name, Address, Phone, Email, ...]
                // Based on our export: [ID, Name, Address, Phone, Email, Departments, Staff Count, About]

                $name = $data[1] ?? ($data[0] ?? null);
                if (!$name || is_numeric($name)) {
                    // If first col is ID, name is second
                    $name = $data[1] ?? 'Unnamed Hospital';
                    $address = $data[2] ?? '';
                    $phone = $data[3] ?? '';
                    $email = $data[4] ?? '';
                    $about = $data[7] ?? '';
                } else {
                    // If first col is Name
                    $address = $data[1] ?? '';
                    $phone = $data[2] ?? '';
                    $email = $data[3] ?? '';
                    $about = $data[6] ?? '';
                }

                $hospital->setName($name);
                $hospital->setAddress($address);
                $hospital->setPhone($phone);
                $hospital->setEmail($email);
                $hospital->setAbout($about);

                $entityManager->persist($hospital);
                $count++;
            }
            fclose($handle);
            $entityManager->flush();
            $this->addFlash('success', sprintf('%d hospitals imported successfully.', $count));
        } else {
            $this->addFlash('error', 'Could not open the uploaded file.');
        }

        return $this->redirectToRoute('app_super_admin_dashboard');
    }

    #[Route(name: 'app_hospital_index', methods: ['GET'])]
    public function index(HospitalRepository $hospitalRepository): Response
    {
        return $this->redirectToRoute('app_super_admin_dashboard');
    }

    #[Route('/new', name: 'app_hospital_new', methods: ['GET', 'POST'])]
    public function new(Request $request, HospitalRepository $hospitalRepository): Response
    {
        $hospital = new Hospital();
        $form = $this->createForm(HospitalType::class, $hospital);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $params = $request->request->all('hospital');
            $params['department'] = $form->get('department')->getData();
            $params['files'] = $request->files->all('hospital');
            $this->hospitalRepository->save($hospital, $params);

            return $this->redirectToRoute('app_hospital_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('hospital/new.html.twig', [
            'hospital' => $hospital,
            'form' => $form,
            'hospital_image' => null,
        ]);
    }

    #[Route('/{id}', name: 'app_hospital_show', methods: ['GET'])]
    public function show(Hospital $hospital): Response
    {
        $doctor = new Doctor();
        $doctorForm = $this->createForm(DoctorType::class, $doctor, [
            'action' => $this->generateUrl('app_hospital_onboard_doctor', ['id' => $hospital->getId()]),
        ]);

        return $this->render('hospital/show.html.twig', [
            'hospital' => $hospital,
            'doctor_form' => $doctorForm->createView(),
        ]);
    }

    #[Route('/{id}/edit', name: 'app_hospital_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Hospital $hospital, HospitalRepository $hospitalRepository, UploadFileInterface $uploadFileService): Response
    {
        $form = $this->createForm(HospitalType::class, $hospital);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $params = $request->request->all('hospital');
            $params['files'] = $request->files->all('hospital');
            $hospitalRepository->save($hospital, $params);

            return $this->redirectToRoute('app_super_admin_dashboard', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('hospital/edit.html.twig', [
            'hospital' => $hospital,
            'form' => $form,
            'hospital_image' => $uploadFileService->getImage(Hospital::class, $hospital->getId(), '223x200'),
        ]);
    }

    #[Route('/{id}/add-department', name: 'app_hospital_add_department', methods: ['POST'])]
    public function addDepartment(Request $request, Hospital $hospital, EntityManagerInterface $entityManager, DepartmentRepository $departmentRepository): Response
    {
        $departmentId = $request->request->get('department_id');
        if (!$departmentId) {
            $this->addFlash('error', 'Please select a department.');
            return $this->redirectToRoute('app_hospital_show', ['id' => $hospital->getId()]);
        }

        $department = $departmentRepository->find($departmentId);
        if (!$department) {
            $this->addFlash('error', 'Department not found.');
            return $this->redirectToRoute('app_hospital_show', ['id' => $hospital->getId()]);
        }

        // Check if already assigned
        $existing = $entityManager->getRepository(HospitalDepartment::class)->findOneBy([
            'hospital' => $hospital,
            'department' => $department
        ]);

        if ($existing) {
            $this->addFlash('warning', 'This department is already assigned to this branch.');
            return $this->redirectToRoute('app_hospital_show', ['id' => $hospital->getId()]);
        }

        $hospitalDepartment = new HospitalDepartment();
        $hospitalDepartment->setHospital($hospital);
        $hospitalDepartment->setDepartment($department);

        $entityManager->persist($hospitalDepartment);
        $entityManager->flush();

        $this->addFlash('success', 'Department assigned successfully.');
        return $this->redirectToRoute('app_hospital_show', ['id' => $hospital->getId()]);
    }

    #[Route('/{id}/assign-doctor', name: 'app_hospital_assign_doctor', methods: ['POST'])]
    public function assignDoctor(Request $request, Hospital $hospital, EntityManagerInterface $entityManager, DoctorRepository $doctorRepository, DepartmentRepository $departmentRepository): Response
    {
        $doctorId = $request->request->get('doctor_id');
        $departmentId = $request->request->get('department_id');

        if (!$doctorId) {
            $this->addFlash('error', 'Please select a doctor.');
            return $this->redirectToRoute('app_hospital_show', ['id' => $hospital->getId()]);
        }

        $doctor = $doctorRepository->find($doctorId);
        if (!$doctor) {
            $this->addFlash('error', 'Doctor not found.');
            return $this->redirectToRoute('app_hospital_show', ['id' => $hospital->getId()]);
        }

        $department = $departmentId ? $departmentRepository->find($departmentId) : null;

        $doctor->setHospital($hospital);
        if ($department) {
            $doctor->setDepartment($department);
        }

        $entityManager->flush();

        $this->addFlash('success', sprintf('Doctor %s assigned to this branch successfully.', $doctor->getUser()->getEmail()));
        return $this->redirectToRoute('app_hospital_show', ['id' => $hospital->getId()]);
    }

    #[Route('/{id}/onboard-doctor', name: 'app_hospital_onboard_doctor', methods: ['POST'])]
    public function onboardDoctor(Request $request, Hospital $hospital, EntityManagerInterface $entityManager, DoctorRepository $doctorRepository, DepartmentRepository $departmentRepository): Response
    {
        $doctor = new Doctor();
        $form = $this->createForm(DoctorType::class, $doctor);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = new User();
            $user->setEmail($form->get('email')->getData());
            $user->setRoles(['ROLE_DOCTOR']);
            $user->setPassword($this->passwordHasher->hashPassword($user, 'temporary_password'));

            $doctor->setUser($user);
            $doctor->setHospital($hospital);

            $entityManager->persist($user);
            $entityManager->persist($doctor);
            $entityManager->flush();

            $this->addFlash('success', sprintf('Doctor %s successfully onboarded to this branch.', $user->getEmail()));
        } else {
            foreach ($form->getErrors(true) as $error) {
                $this->addFlash('error', $error->getMessage());
            }
        }

        return $this->redirectToRoute('app_hospital_show', ['id' => $hospital->getId()]);
    }

    #[Route('/{id}', name: 'app_hospital_delete', methods: ['POST'])]
    public function delete(Request $request, Hospital $hospital, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$hospital->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($hospital);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_hospital_index', [], Response::HTTP_SEE_OTHER);
    }
}
