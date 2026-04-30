<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class LegacyRedirectController extends AbstractController
{
    #[Route('/hospital/public/{id}', name: 'app_hospital_public_legacy_redirect', methods: ['GET'])]
    public function hospitalRedirect(int $id): Response
    {
        return $this->redirectToRoute('app_hospital_public_show', ['_locale' => 'en', 'id' => $id]);
    }

    #[Route('/consultation/new', name: 'app_consultation_new_legacy', methods: ['GET', 'POST'])]
    public function consultationRedirect(Request $request): Response
    {
        return $this->redirectToRoute('app_consultation_new', array_merge(
            ['_locale' => 'en'],
            $request->query->all()
        ));
    }

    #[Route('/consultation/new/{id}', name: 'app_consultation_new_with_id_legacy', methods: ['GET'])]
    public function consultationWithIdRedirect(int $id): Response
    {
        return $this->redirectToRoute('app_consultation_new', ['_locale' => 'en', 'hospital' => $id]);
    }
}
