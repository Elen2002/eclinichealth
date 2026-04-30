<?php

namespace App\Interfaces;

use Symfony\Component\HttpFoundation\File\UploadedFile;

interface UploadFileInterface
{

    const TYPE_DOCUMENT = 'documents';

    const TYPE_IMAGE = 'images';

    const TYPE_AVATAR = 'avatar';
    const TYPE_ICON = 'icon';
    const TYPE_PDF = 'pdf';

    const IMAGE_SIZES = [
        [
            "name" => "100x100",
            "w" => 100,
            "h" => 100
        ],
        [
            "name" => "223x200",
            "w" => 223,
            "h" => 200
        ],
        [
            "name" => "x200",
            "w" => 0,
            "h" => 200
        ],
        [
            "name" => "650x450",
            "w" => 650,
            "h" => 450
        ],
        [
            "name" => "970x440",
            "w" => 970,
            "h" => 440
        ],
    ];

    public function uploadFiles(array $files, string $documentType, string $className, int $id, bool $remove = false): void;

    public function uploadDocuments(UploadedFile $file, string $className, int $id): void;

    public function uploadAvatar($file, int $id);

    public function getImagesArr(string $className, int $id, string $size): array;

    public function getDocuments(string $className, int $id): array;
    public function getDocumentsArr(string $className, int $id): array;

    public function getDocument(string $className, int $id);

    public function uploadPdf(string $pdfHTML, string $className, int $id): string;

    public function getImages(string $className, int $id, string $size): array;
    public function getImage(string $className, int $id, string $size = ''): ?string;
}
