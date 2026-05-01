<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[IsGranted('IS_AUTHENTICATED_FULLY')]
class NotificationController extends AbstractController
{
    #[Route('/api/notifications/create', name: 'app_api_notification_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_encode($request->getContent());
        $params = json_decode($request->getContent(), true);

        if (!$params || !isset($params['targetIdentifier'])) {
            return new JsonResponse(['error' => 'Invalid data'], 400);
        }

        // Find target user by identifier (email prefix or email)
        $targetIdentifier = $params['targetIdentifier'];
        
        // Find user where email starts with targetIdentifier or matches exactly
        $userRepo = $entityManager->getRepository(User::class);
        $targetUser = $userRepo->findOneBy(['email' => $targetIdentifier]);
        
        if (!$targetUser) {
            // Try to match by email prefix (as we use in identifier)
            $users = $userRepo->findAll();
            foreach ($users as $u) {
                $uId = ucfirst(explode('@', $u->getEmail())[0]);
                if ($uId === $targetIdentifier) {
                    $targetUser = $u;
                    break;
                }
            }
        }

        if (!$targetUser) {
            return new JsonResponse(['error' => 'Target user not found'], 404);
        }

        $notification = new Notification();
        $notification->setUser($targetUser);
        $notification->setTitle($params['title'] ?? 'New Message');
        $notification->setMessage($params['message'] ?? '');
        $notification->setType($params['type'] ?? 'chat');
        $notification->setLink($params['link'] ?? null);

        $entityManager->persist($notification);
        $entityManager->flush();

        return new JsonResponse(['success' => true, 'id' => $notification->getId()]);
    }

    #[Route('/api/notifications/mark-read/{id}', name: 'app_api_notification_mark_read', methods: ['POST'])]
    public function markRead(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $notification = $entityManager->getRepository(Notification::class)->find($id);
        if (!$notification || $notification->getUser() !== $this->getUser()) {
            return new JsonResponse(['error' => 'Notification not found'], 404);
        }

        $notification->setIsRead(true);
        $entityManager->flush();

        return new JsonResponse(['success' => true]);
    }
}
