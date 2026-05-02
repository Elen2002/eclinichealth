<?php
require_once __DIR__ . '/vendor/autoload_runtime.php';

use App\Kernel;
use App\Entity\ChatMessage;

return function (array $context) {
    $kernel = new Kernel($context['APP_ENV'], (bool) $context['APP_DEBUG']);
    $kernel->boot();
    $container = $kernel->getContainer();
    $em = $container->get('doctrine.orm.entity_manager');
    
    $messages = $em->getRepository(ChatMessage::class)->findBy([], ['id' => 'DESC'], 10);
    
    echo "Last 10 messages:\n";
    foreach ($messages as $msg) {
        echo sprintf("ID: %d | Room: %s | Sender: %s | Text: %s\n", 
            $msg->getId(), 
            $msg->getRoomId(), 
            $msg->getSender() ? $msg->getSender()->getEmail() : 'Guest',
            $msg->getContent()
        );
    }
};
