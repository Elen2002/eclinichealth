<?php

namespace App\Command;

use App\Entity\Hospital;
use App\Interfaces\UploadFileInterface;
use App\Repository\HospitalRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:test-images',
    description: 'Test hospital image retrieval',
)]
class TestImagesCommand extends Command
{
    private HospitalRepository $hospitalRepository;
    private UploadFileInterface $uploadFile;

    public function __construct(HospitalRepository $hospitalRepository, UploadFileInterface $uploadFile)
    {
        parent::__construct();
        $this->hospitalRepository = $hospitalRepository;
        $this->uploadFile = $uploadFile;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hospitals = $this->hospitalRepository->findAll();

        if (empty($hospitals)) {
            $io->warning('No hospitals found in the database.');
            return Command::SUCCESS;
        }

        foreach ($hospitals as $hospital) {
            $image = $this->uploadFile->getImage(Hospital::class, $hospital->getId(), '970x440');
            $io->info(sprintf('Hospital ID: %d, Name: %s, Image: %s', $hospital->getId(), $hospital->getName(), $image ?? 'NULL'));
        }

        return Command::SUCCESS;
    }
}
