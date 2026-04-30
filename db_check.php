<?php

require __DIR__ . '/vendor/autoload.php';

use App\Kernel;
use Symfony\Component\Dotenv\Dotenv;

$dotenv = new Dotenv();
$dotenv->load(__DIR__ . '/.env');

echo "Connecting to DB...\n";
$url = $_ENV['DATABASE_URL'];
echo "URL: $url\n";

try {
    $conn = @pg_connect(str_replace(['postgresql://', ':'], ['host=localhost port=', ' user='], explode('@', $url)[0]));
    // Wait, parsing the URL is complex. I'll just try to boot the kernel.
    
    $kernel = new Kernel($_ENV['APP_ENV'], (bool) $_ENV['APP_DEBUG']);
    $kernel->boot();
    $container = $kernel->getContainer();
    $em = $container->get('doctrine')->getManager();
    
    echo "DB connected!\n";
    
    $hospitals = $em->getRepository(\App\Entity\Hospital::class)->findAll();
    echo "Found " . count($hospitals) . " hospitals.\n";
    
    foreach ($hospitals as $h) {
        echo "ID: " . $h->getId() . " Name: " . $h->getName() . "\n";
    }
    
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
