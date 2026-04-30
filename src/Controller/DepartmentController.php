<?php

namespace App\Controller;

use App\Entity\Department;
use App\Form\DepartmentType;
use App\Repository\DepartmentRepository;
use App\Service\PAbstractController;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use App\Entity\HospitalDepartment;

#[Route('/{_locale}/admin/department')]
final class DepartmentController extends PAbstractController
{
    #[Route(name: 'app_department_index', methods: ['GET'])]
    public function index(DepartmentRepository $departmentRepository, \App\Interfaces\UploadFileInterface $uploadFileService): Response
    {
        $departments = $departmentRepository->findAll();
        $departmentImages = [];
        foreach ($departments as $dept) {
            $images = $uploadFileService->getImagesArr(Department::class, $dept->getId(), '970x440');
            $departmentImages[$dept->getId()] = $images[0] ?? null;
        }

        return $this->render('department/index.html.twig', [
            'departments' => $departments,
            'department_images' => $departmentImages,
        ]);
    }

    #[Route('/new', name: 'app_department_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, DepartmentRepository $departmentRepository): Response
    {
        $department = new Department();
        $form = $this->createForm(DepartmentType::class, $department);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $params = $request->request->all('department');
            $params['files'] = $request->files->all('department');
            $departmentRepository->save($department,$params);

            return $this->redirectToRoute('app_department_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('department/new.html.twig', [
            'department' => $department,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_department_show', methods: ['GET'])]
    public function show(Department $department, \App\Interfaces\UploadFileInterface $uploadFileService): Response
    {
        return $this->render('department/show.html.twig', [
            'department' => $department,
            'department_image' => $uploadFileService->getImage(Department::class, $department->getId(), '970x440'),
        ]);
    }

    #[Route('/{id}/edit', name: 'app_department_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Department $department, DepartmentRepository $departmentRepository): Response
    {
        $form = $this->createForm(DepartmentType::class, $department);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $params = $request->request->all('department');
            $params['files'] = $request->files->all('department');
            $departmentRepository->save($department,$params);

            return $this->redirectToRoute('app_department_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('department/edit.html.twig', [
            'department' => $department,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'app_department_delete', methods: ['POST'])]
    public function delete(Request $request, Department $department, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$department->getId(), $request->getPayload()->getString('_token'))) {
            $entityManager->remove($department);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_department_index', [], Response::HTTP_SEE_OTHER);
    }

    #[Route('/export/{type}', name: 'app_department_export', methods: ['GET'])]
    public function export(string $type, \App\Repository\HospitalDepartmentRepository $repository): Response
    {
        $hds = $repository->findAll();

        if ($type === 'doc') {
             $html = '<html><body><h1>Department List</h1><table border="1"><thead><tr><th>ID</th><th>Department</th><th>Hospital</th><th>Head of Department</th></tr></thead><tbody>';
             foreach ($hds as $hd) {
                 $html .= '<tr><td>'.$hd->getId().'</td><td>'.htmlspecialchars($hd->getDepartment()?->getName() ?? '').'</td><td>'.htmlspecialchars($hd->getHospital()?->getName() ?? '').'</td><td>'.htmlspecialchars($hd->getDoctor()?->getEmail() ?? '').'</td></tr>';
             }
             $html .= '</tbody></table></body></html>';

             $response = new Response($html);
             $response->headers->set('Content-Type', 'application/msword');
             $response->headers->set('Content-Disposition', 'attachment; filename="departments_export.doc"');
             return $response;
        }

        $headers = ['ID', 'Department', 'Hospital', 'Head of Department'];
        $rows = [];
        $rows[] = implode(',', $headers);

        foreach ($hds as $hd) {
            $data = [
                $hd->getId(),
                $hd->getDepartment()?->getName(),
                $hd->getHospital()?->getName(),
                $hd->getDoctor()?->getEmail()
            ];
            $rows[] = implode(',', $data);
        }

        $content = implode("\n", $rows);
        $response = new Response($content);
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', 'attachment; filename="departments_export.csv"');

        return $response;
    }

    #[Route('/import', name: 'app_department_import', methods: ['POST'])]
    public function import(Request $request, EntityManagerInterface $entityManager, DepartmentRepository $departmentRepository): Response
    {
        /** @var \Symfony\Component\HttpFoundation\File\UploadedFile $file */
        $file = $request->files->get('import_file');

        if (!$file) {
            $this->addFlash('error', 'Please upload a CSV file.');
            return $this->redirectToRoute('app_department_index');
        }

        $ext = strtolower($file->getClientOriginalExtension());
        if (!in_array($ext, ['csv', 'txt'])) {
            $this->addFlash('error', 'Invalid file type. Please upload a CSV file.');
            return $this->redirectToRoute('app_department_index');
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

                // Expected columns: Name, Description (minimal import)
                $name = trim($row[0] ?? '');
                $description = trim($row[1] ?? '');

                if (!$name) continue;

                // Skip if department with same name already exists
                $existing = $departmentRepository->findOneBy(['name' => $name]);
                if ($existing) continue;

                $department = new Department();
                $department->setName($name);
                if ($description) {
                    $department->setDescription($description);
                }

                $entityManager->persist($department);
                $count++;
            }

            fclose($handle);
            $entityManager->flush();
            $this->addFlash('success', sprintf('%d department(s) imported successfully.', $count));
        } else {
            $this->addFlash('error', 'Could not read the uploaded file.');
        }

        return $this->redirectToRoute('app_department_index');
    }
}
