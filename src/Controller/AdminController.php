<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AdminController extends AbstractController
{
    #[Route('/{_locale}/admin', name: 'app_admin')]
    public function index(): Response
    {
        return $this->render('admin/index.html.twig', [
            'controller_name' => 'AdminController',
        ]);
    }

    #[Route('/{_locale}/admin/support', name: 'app_admin_support')]
    public function support(): Response
    {
        return $this->render('admin/support_chat.html.twig');
    }

    #[Route('/api/admin/chat/sessions', name: 'api_admin_chat_sessions', methods: ['GET'])]
    public function chatSessions(\App\Repository\ChatMessageRepository $chatMessageRepository): \Symfony\Component\HttpFoundation\JsonResponse
    {
        if (!$this->isGranted('ROLE_ADMIN')) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        $rooms = $chatMessageRepository->createQueryBuilder('c')
            ->select('c.roomId, MAX(c.createdAt) as lastDate')
            ->where('LOWER(c.roomId) NOT LIKE :pair')
            ->setParameter('pair', 'pair_%')
            ->groupBy('c.roomId')
            ->orderBy('lastDate', 'DESC')
            ->getQuery()
            ->getResult();

        $data = [];
        foreach ($rooms as $room) {
            $lastMsg = $chatMessageRepository->findOneBy(
                ['roomId' => $room['roomId']],
                ['createdAt' => 'DESC']
            );
            
            $data[] = [
                'roomId' => $room['roomId'],
                'lastMessage' => $lastMsg ? $lastMsg->getContent() : ''
            ];
        }

        return $this->json($data);
    }
}
