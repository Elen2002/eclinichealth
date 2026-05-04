<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[AsCommand(
    name: 'app:generate-patient-qrs',
    description: 'Generates unique QR codes for all registered patients.',
)]
class GeneratePatientQrCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ParameterBagInterface $params
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $publicDir = $this->params->get('kernel.project_dir') . '/public';
        $qrDir = $publicDir . '/uploads/patient_qrs';

        if (!is_dir($qrDir)) {
            if (!mkdir($qrDir, 0777, true) && !is_dir($qrDir)) {
                $io->error("Could not create directory: $qrDir");
                return Command::FAILURE;
            }
        }

        $users = $this->entityManager->getRepository(User::class)->findAll();
        $count = 0;

        $io->section('Generating Patient QR Codes');

        foreach ($users as $user) {
            if (!in_array('ROLE_DOCTOR', $user->getRoles()) && !in_array('ROLE_ADMIN', $user->getRoles()) && !in_array('ROLE_SUPER_ADMIN', $user->getRoles())) {
                // Generate a URL for the QR code to point to the scan/profile page
                $baseUrl = 'https://eclinichealth.ru';
                $qrData = rtrim($baseUrl, '/') . '/patient/profile/' . $user->getId();

                try {
                    $result = \Endroid\QrCode\Builder\Builder::create()
                        ->writer(new PngWriter())
                        ->writerOptions([])
                        ->data($qrData)
                        ->encoding(new Encoding('UTF-8'))
                        ->errorCorrectionLevel(ErrorCorrectionLevel::High)
                        ->size(300)
                        ->margin(10)
                        ->roundBlockSizeMode(RoundBlockSizeMode::Margin)
                        ->build();

                    $filePath = $qrDir . '/' . $user->getId() . '.png';
                    $result->saveToFile($filePath);

                    // Save relative path to DB
                    $user->setQrPath('/uploads/patient_qrs/' . $user->getId() . '.png');

                    $io->writeln("Generated QR for patient: " . $user->getEmail());
                    $count++;
                } catch (\Exception $e) {
                    $io->error("Failed to generate QR for " . $user->getEmail() . ": " . $e->getMessage());
                }
            }
        }

        $this->entityManager->flush();

        $io->success("Successfully generated $count QR codes in $qrDir");

        return Command::SUCCESS;
    }
}
