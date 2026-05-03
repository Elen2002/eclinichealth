<?php

namespace App\Command;

use App\Entity\Hospital;
use App\Entity\Images;
use App\Repository\HospitalRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use App\Interfaces\UploadFileInterface;

#[AsCommand(
    name: 'app:seed-hospital-images',
    description: 'Seed images for hospitals that are missing them.',
)]
class SeedHospitalImagesCommand extends Command
{
    private array $hospitalImages = [
        'https://images.unsplash.com/photo-1586773860418-d3b978b8c647?q=80&w=970&h=440&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=970&h=440&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=970&h=440&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=970&h=440&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=970&h=440&auto=format&fit=crop',
    ];

    public function __construct(
        private EntityManagerInterface $entityManager,
        private HospitalRepository $hospitalRepository,
        private ParameterBagInterface $bag,
        private Filesystem $filesystem
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $hospitals = $this->hospitalRepository->findAll();

        $io->title('Seeding Hospital Images');

        $baseDir = $this->bag->get('kernel.project_dir');
        $count = 0;

        foreach ($hospitals as $hospital) {
            // Check if hospital already has images
            $existingImages = $this->entityManager->getRepository(Images::class)->findBy([
                'parentClass' => Hospital::class,
                'entityId' => $hospital->getId()
            ]);

            if (empty($existingImages)) {
                $io->text('Seeding images for: ' . $hospital->getName());
                
                $imageUrl = $this->hospitalImages[array_rand($this->hospitalImages)];
                $imageContent = @file_get_contents($imageUrl);
                
                if ($imageContent) {
                    $uniqName = uniqid();
                    $extension = 'jpg';
                    $uploadedNameBase = 'hospital-' . $hospital->getId() . '-' . $uniqName;

                    foreach (UploadFileInterface::IMAGE_SIZES as $size) {
                        $sizeName = $size['name'];
                        $width = $size['w'];
                        $height = $size['h'];

                        $imageDirectory = $baseDir . '/upload/hospital/' . $hospital->getId() . '/images/' . $sizeName;
                        if (!$this->filesystem->exists($imageDirectory)) {
                            $this->filesystem->mkdir($imageDirectory);
                        }

                        $newFilename = $uploadedNameBase . '.' . $extension;
                        $targetPath = $imageDirectory . '/' . $newFilename;

                        // Use GD to resize and save
                        $src = @imagecreatefromstring($imageContent);
                        if ($src) {
                            $w = imagesx($src);
                            $h = imagesy($src);
                            
                            $dstWidth = $width ?: ($width == 0 ? round($w * ($height / $h)) : $w);
                            $dstHeight = $height ?: ($height == 0 ? round($h * ($width / $w)) : $h);
                            
                            $dst = imagecreatetruecolor($dstWidth, $dstHeight);
                            imagecopyresampled($dst, $src, 0, 0, 0, 0, $dstWidth, $dstHeight, $w, $h);
                            imagejpeg($dst, $targetPath, 85);
                            
                            $imageEntity = new Images();
                            $imageEntity->setEntityId($hospital->getId());
                            $imageEntity->setTitle($newFilename);
                            $imageEntity->setParentClass(Hospital::class);
                            $imageEntity->setSize($sizeName);
                            $this->entityManager->persist($imageEntity);
                            
                            imagedestroy($src);
                            imagedestroy($dst);
                        }
                    }
                    $this->entityManager->flush();
                    $count++;
                } else {
                    $io->error('Could not download image for ' . $hospital->getName());
                }
            }
        }

        $io->success(sprintf('Seeded images for %d hospitals.', $count));

        return Command::SUCCESS;
    }
}
