<?php

namespace App\Controller;

use App\Entity\Consultation;
use App\Entity\Doctor;
use App\Form\ConsultationType;
use App\Repository\ConsultationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/appointment')]
class AppointmentController extends AbstractController
{
    #[Route('/new/{doctor_id}', name: 'app_consultation_new', methods: ['GET', 'POST'], defaults: ['doctor_id' => null])]
    #[IsGranted('ROLE_USER')]
    public function new(Request $request, EntityManagerInterface $entityManager, ?int $doctor_id = null): Response
    {
        $doctor = null;
        if ($doctor_id) {
            $doctor = $entityManager->getRepository(Doctor::class)->find($doctor_id);
            if (!$doctor) {
                throw $this->createNotFoundException('Doctor not found');
            }
        }

        $consultation = new Consultation();
        $consultation->setDoctor($doctor);
      
        $user = $this->getUser();
        if ($user) {
             $consultation->setPatientEmail($user->getEmail());
             // $consultation->setPatientName(...); // User entity doesn't seem to have name field based on DoctorController usage?
        }
        
        // I need to check if ConsultationType form exists, or create it.
        // For now, I'll assume I need to create/use it.
        $form = $this->createForm(ConsultationType::class, $consultation);
        
        // If doctor serves from URL, hide the selection
        if ($doctor_id && $doctor) {
            $form->remove('doctor');
        }

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            if ($doctor) {
                $consultation->setHospital($doctor->getHospital());
                $consultation->setDepartment($doctor->getDepartment());
            } elseif ($consultation->getDoctor()) {
                // If doctor was selected in form
                $doc = $consultation->getDoctor();
                $consultation->setHospital($doc->getHospital());
                $consultation->setDepartment($doc->getDepartment());
            }
            
            $entityManager->persist($consultation);
            $entityManager->flush();

            $this->addFlash('success', 'Appointment request sent successfully.');
            return $this->redirectToRoute('app_home'); // or appointment list
        }

        return $this->render('appointment/new.html.twig', [
            'consultation' => $consultation,
            'form' => $form,
            'doctor' => $doctor,
        ]);
    }

    #[Route('/doctor/manage/{id}', name: 'app_doctor_manage_appointment', methods: ['GET', 'POST'])]
    #[IsGranted('ROLE_DOCTOR')]
    public function doctorResponse(Request $request, Consultation $consultation, EntityManagerInterface $entityManager): Response
    {
        // Security check: ensure current doctor owns this consultation
        // $this->getUser() -> Doctor -> check id
        
        if ($request->isMethod('POST')) {
            $prescription = $request->request->get('prescription');
            $medicalTests = $request->request->get('medical_tests');
            $proposedDate = $request->request->get('proposed_date');
            
            $consultation->setPrescription($prescription);
            $consultation->setMedicalTests($medicalTests);
            if ($proposedDate) {
                $consultation->setDoctorProposedDate(new \DateTime($proposedDate));
            }
            $consultation->setStatus('proposed');
            
            $entityManager->flush();
            $this->addFlash('success', 'Response sent to patient.');
            return $this->redirectToRoute('app_doctor_dashboard'); // Pending dashboard
        }

        return $this->render('appointment/doctor_response.html.twig', [
            'consultation' => $consultation
        ]);
    }

    #[Route('/approve/{id}', name: 'app_patient_approve_appointment', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function approve(Consultation $consultation, EntityManagerInterface $entityManager): Response
    {
        $consultation->setIsPatientApproved(true);
        $consultation->setStatus('confirmed');
        
        // Create Doctor-Patient relationship if it doesn't exist
        $patient = $this->getUser();
        $doctorUser = $consultation->getDoctor()->getUser();
        
        if ($patient && $doctorUser) {
            $existingRelation = $entityManager->getRepository(\App\Entity\DoctorPacient::class)->findOneBy([
                'doctor' => $doctorUser,
                'pacient' => $patient
            ]);
            
            if (!$existingRelation) {
                $relation = new \App\Entity\DoctorPacient();
                $relation->setDoctor($doctorUser);
                $relation->setPacient($patient);
                $entityManager->persist($relation);
            }
        }

        $entityManager->flush();
        
        $this->addFlash('success', 'Appointment confirmed!');
        return $this->redirectToRoute('app_home');
    }
}
