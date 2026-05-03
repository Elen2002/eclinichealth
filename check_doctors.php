<?php
require 'vendor/autoload.php';
use App\Kernel;
use Symfony\Component\Dotenv\Dotenv;

$dotenv = new Dotenv();
$dotenv->load(__DIR__.'/.env');

$kernel = new Kernel($_SERVER['APP_ENV'] ?? 'dev', (bool) ($_SERVER['APP_DEBUG'] ?? true));
$kernel->boot();
$container = $kernel->getContainer();
$em = $container->get('doctrine')->getManager();

$doctors = $em->getRepository(\App\Entity\Doctor::class)->findAll();
echo "Total Doctors: " . count($doctors) . "\n";
foreach ($doctors as $d) {
    echo "Doctor ID: " . $d->getId() . " | Hospital: " . ($d->getHospital() ? $d->getHospital()->getId() : 'NULL') . " | Dept: " . ($d->getDepartment() ? $d->getDepartment()->getId() : 'NULL') . "\n";
}
