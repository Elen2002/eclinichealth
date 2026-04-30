<?php

namespace App\Controller;

use App\Entity\Doctor;
use App\Entity\Review;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/{_locale}/review')]
class ReviewController extends AbstractController
{
    #[Route('/new/{doctor}', name: 'app_review_new', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function new(Request $request, Doctor $doctor, EntityManagerInterface $entityManager): Response
    {
        $rating = $request->request->getInt('rating');
        $comment = $request->request->get('comment');

        if ($rating < 1 || $rating > 5) {
            $this->addFlash('error', 'Please provide a valid rating (1-5 stars).');
            return $this->redirectToRoute('app_profile');
        }

        $review = new Review();
        $review->setRating($rating);
        $review->setComment($comment);
        $review->setDoctor($doctor);
        $review->setPatient($this->getUser());
        $review->setCreatedAt(new \DateTimeImmutable());

        $entityManager->persist($review);
        $entityManager->flush();

        $this->addFlash('success', 'Thank you for your feedback!');
        
        // Redirect back to profile or wherever they came from
        return $this->redirectToRoute('app_profile');
    }
}
