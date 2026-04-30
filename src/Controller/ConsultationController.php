<?php

namespace App\Controller;

use App\Entity\DoctorPacient;
use App\Entity\User;
use App\Entity\Consultation;
use App\Entity\Hospital;
use App\Repository\ConsultationRepository;
use App\Repository\DepartmentRepository;
use App\Repository\DoctorRepository;
use App\Repository\HospitalRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('IS_AUTHENTICATED_FULLY')]
class ConsultationController extends AbstractController
{
    #[Route('/{_locale}/consultation/new', name: 'app_consultation_new', locale: 'hy')]
    public function new(
        Request $request,
        HospitalRepository $hospitalRepository,
        DepartmentRepository $departmentRepository,
        DoctorRepository $doctorRepository,
        \App\Repository\HospitalDepartmentRepository $hospitalDepartmentRepository,
        EntityManagerInterface $entityManager
    ): Response {
        $user = $this->getUser();
        
        if ($request->isMethod('POST')) {
            $consultation = new Consultation();
            // Auto-fill from logged in user
            $consultation->setPatientName($request->request->get('name'));
            $consultation->setPatientEmail($user->getUserIdentifier()); // Enforce email from account
            $consultation->setPatientPhone($request->request->get('phone'));
            
            $dateStr = $request->request->get('date');
            try {
                $consultation->setRequestedDate(new \DateTime($dateStr));
            } catch (\Exception $e) {
                // Fallback or error
                $this->addFlash('error', 'Invalid date format.');
                return $this->redirectToRoute('app_consultation_new');
            }

            $consultation->setMessage($request->request->get('message'));

            // Relationships
            $hospitalId = $request->request->get('hospital');
            $departmentId = $request->request->get('department');
            $doctorId = $request->request->get('doctor');

            if ($hospitalId) {
                $consultation->setHospital($hospitalRepository->find($hospitalId));
            }
            if ($departmentId) {
                $consultation->setDepartment($departmentRepository->find($departmentId));
            }
            if ($doctorId) {
                $consultation->setDoctor($doctorRepository->find($doctorId));
            }

            if ($consultation->getHospital() && $consultation->getDoctor() && $consultation->getDepartment()) {
                $entityManager->persist($consultation);
                
                $entityManager->flush();
                $this->addFlash('success', 'Your appointment request has been sent successfully!');
                return $this->redirectToRoute('app_profile'); // Redirect to profile to see the new request
            } else {
                $this->addFlash('error', 'Please select a valid Hospital, Department, and Doctor.');
            }
        }

        return $this->render('consultation/new.html.twig', [
            'hospitals' => $hospitalRepository->findAll(),
            'departments' => $departmentRepository->findAll(),
            'doctors' => $doctorRepository->findAll(),
            'hospitalDepartments' => $hospitalDepartmentRepository->findAll(),
            'selectedDoctorId' => $request->query->get('doctor'),
        ]);
    }
    #[Route('/{_locale}/doctor/consultations', name: 'app_doctor_consultations', locale: 'hy')]
    #[IsGranted('ROLE_DOCTOR')]
    public function doctorConsultations(EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $doctor = $entityManager->getRepository(\App\Entity\Doctor::class)->findOneBy(['user' => $user]);

        if (!$doctor) {
            throw $this->createAccessDeniedException('User is not a doctor.');
        }

        $consultations = $entityManager->getRepository(Consultation::class)->findBy(['doctor' => $doctor], ['requestedDate' => 'DESC']);

        return $this->render('consultation/index.html.twig', [
            'consultations' => $consultations,
        ]);
    }

    #[Route('/{_locale}/consultation/{id}/process', name: 'app_consultation_process', locale: 'hy')]
    #[IsGranted('ROLE_DOCTOR')]
    public function process(Request $request, Consultation $consultation, EntityManagerInterface $entityManager): Response
    {
        $user = $this->getUser();
        $doctor = $entityManager->getRepository(\App\Entity\Doctor::class)->findOneBy(['user' => $user]);

        if ($consultation->getDoctor() !== $doctor) {
            throw $this->createAccessDeniedException('You can only process your own consultations.');
        }

        if ($request->isMethod('POST')) {
            $proposedDate = $request->request->get('proposed_date');
            $prescription = $request->request->get('prescription');
            $tests = $request->request->get('tests');

            if (!$proposedDate) {
                $this->addFlash('error', 'Please propose a date for the appointment.');
            } elseif (!$prescription && !$tests) {
                 $this->addFlash('error', 'Please provide either a prescription or a list of required tests.');
            } else {
                 try {
                     $consultation->setDoctorProposedDate(new \DateTime($proposedDate));
                 } catch (\Exception $e) {
                     $this->addFlash('error', 'Invalid date format.');
                     return $this->render('consultation/process.html.twig', ['consultation' => $consultation]);
                 }
                 
                 $consultation->setPrescription($prescription);
                 $consultation->setMedicalTests($tests);
                 $consultation->setStatus('confirmed');
                 
                 // Automatically add to doctor's patient list if not already there
                 $patientUser = $entityManager->getRepository(User::class)->findOneBy(['email' => $consultation->getPatientEmail()]);
                 if ($patientUser) {
                     $existingRelation = $entityManager->getRepository(DoctorPacient::class)->findOneBy([
                         'doctor' => $user,
                         'pacient' => $patientUser
                     ]);
                     
                     if (!$existingRelation) {
                         $doctorPacient = new DoctorPacient();
                         $doctorPacient->setDoctor($user);
                         $doctorPacient->setPacient($patientUser);
                         $entityManager->persist($doctorPacient);
                     }
                 }
                 
                 $entityManager->flush();
                 
                 // Notify patient
                 if ($patientUser) {
                     $notif = new \App\Entity\Notification();
                     $notif->setUser($patientUser);
                     $notif->setTitle('Consultation Updated');
                     $notif->setMessage('Your consultation status has been updated to confirmed.');
                     $notif->setType('consultation');
                     $notif->setLink($this->generateUrl('app_profile_consultation_detail', ['id' => $consultation->getId()]));
                     $entityManager->persist($notif);
                     $entityManager->flush();
                 }

                 $this->addFlash('success', 'Consultation confirmed with details sent to patient.');
                 return $this->redirectToRoute('app_doctor_dashboard');
            }
        }

        return $this->render('consultation/process.html.twig', [
            'consultation' => $consultation,
        ]);
    }

    #[Route('/{_locale}/consultation/{id}/details', name: 'app_consultation_details', locale: 'hy')]
    #[IsGranted('ROLE_DOCTOR')]
    public function details(Consultation $consultation, EntityManagerInterface $entityManager): Response
    {
         $user = $this->getUser();
         $doctor = $entityManager->getRepository(\App\Entity\Doctor::class)->findOneBy(['user' => $user]);
 
         if ($consultation->getDoctor() !== $doctor) {
             throw $this->createAccessDeniedException('Access denied.');
         }

         return $this->render('consultation/details.html.twig', [
             'consultation' => $consultation,
         ]);
    }

    #[Route('/{_locale}/profile/consultation/{id}', name: 'app_profile_consultation_detail', locale: 'hy')]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function patientDetails(Consultation $consultation): Response
    {
         $user = $this->getUser();
         
         // Verify the user is the patient for this consultation
         // Using email as the link per existing logic in ProfileController
         if ($consultation->getPatientEmail() !== $user->getUserIdentifier()) {
             throw $this->createAccessDeniedException('You can only view your own consultations.');
         }

         return $this->render('consultation/patient_details.html.twig', [
             'consultation' => $consultation,
         ]);
    }

    #[Route('/{_locale}/profile/consultation/{id}/approve', name: 'app_consultation_approve_patient', locale: 'hy')]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function patientApprove(Consultation $consultation, EntityManagerInterface $entityManager): Response
    {
         $user = $this->getUser();
         
         if ($consultation->getPatientEmail() !== $user->getUserIdentifier()) {
             throw $this->createAccessDeniedException('Access denied.');
         }

         $consultation->setIsPatientApproved(true);
         $entityManager->flush();

         // Notify doctor
         $doctorUser = $consultation->getDoctor() ? $consultation->getDoctor()->getUser() : null;
         if ($doctorUser) {
             $notif = new \App\Entity\Notification();
             $notif->setUser($doctorUser);
             $notif->setTitle('Plan Approved');
             $notif->setMessage('Patient has approved your proposed plan for consultation #' . $consultation->getId());
             $notif->setType('consultation');
             $notif->setLink($this->generateUrl('app_doctor_dashboard'));
             $entityManager->persist($notif);
             $entityManager->flush();
         }

         $this->addFlash('success', 'You have successfully approved the doctor\'s plan.');
         
         return $this->redirectToRoute('app_profile_consultation_detail', ['id' => $consultation->getId()]);
    }
}
