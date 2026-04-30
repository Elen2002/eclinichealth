<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class FilesController extends AbstractController
{
    #[Route('/files/{class_name}/{class_id}/{file_type}/{file_name}/{size_name}', name: 'app_files', defaults: ['size_name' => null])]
    public function index(string $class_name, int $class_id, string $file_type, string $file_name, ?string $size_name, ParameterBagInterface $bag): Response
    {
        $baseDir = $bag->get('kernel.project_dir');
        
        // Construct path based on type
        // upload/{entity}/{id}/{type}/{size}/{filename}
        // e.g. upload/hospital/1/images/original/file.jpg
        
        $path = $baseDir . '/upload/' . $class_name . '/' . $class_id . '/' . $file_type;
        
        if ($file_type === 'images' && $size_name) {
            $path .= '/' . $size_name;
        }
        
        $path .= '/' . $file_name;

        if (!file_exists($path)) {
            throw $this->createNotFoundException('File not found: ' . $path);
        }

        $response = new BinaryFileResponse($path);
        
        // Set appropriate content disposition
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_INLINE,
            $file_name
        );

        return $response;
    }
}
