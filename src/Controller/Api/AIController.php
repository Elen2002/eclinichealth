<?php

namespace App\Controller\Api;

use App\Service\AIService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/ai')]
class AIController extends AbstractController
{
    private AIService $aiService;

    public function __construct(AIService $aiService)
    {
        $this->aiService = new AIService();
    }

    #[Route('/analyze', name: 'api_ai_analyze', methods: ['POST'])]
    public function analyze(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $symptoms = $data['symptoms'] ?? '';

        if (empty($symptoms)) {
            return new JsonResponse(['error' => 'No symptoms provided'], 400);
        }

        $result = $this->aiService->analyzeSymptoms($symptoms);

        return new JsonResponse($result);
    }
}
