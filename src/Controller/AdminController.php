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
        if (!$this->isGranted('ROLE_ADMIN') && !$this->isGranted('ROLE_SUPER_ADMIN')) {
            return $this->json(['error' => 'Access denied'], 403);
        }

        $rooms = $chatMessageRepository->createQueryBuilder('c')
            ->select('c.roomId, MAX(c.createdAt) as lastDate')
            ->groupBy('c.roomId')
            ->orderBy('lastDate', 'DESC')
            ->getQuery()
            ->getResult();

        $data = [];
        
        foreach ($rooms as $room) {
            $roomId = $room['roomId'];
            
            // Filter to show only support chats
            // Support chats use the userId/GuestId directly as roomId
            // Doctor-patient chats use 'room_' or 'pair_' prefixes
            if (str_starts_with($roomId, 'room_') || str_starts_with($roomId, 'pair_')) {
                continue;
            }

            $lastMsg = $chatMessageRepository->findOneBy(
                ['roomId' => $roomId],
                ['createdAt' => 'DESC']
            );
            
            $data[] = [
                'roomId' => $roomId,
                'lastMessage' => $lastMsg ? $lastMsg->getContent() : '',
                'lastDate' => $room['lastDate']
            ];
        }

        return $this->json($data);
    }
}
