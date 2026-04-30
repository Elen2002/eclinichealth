<?php

namespace App\Service;


use App\Entity\Documents;
use App\Entity\Images;
use App\Interfaces\UploadFileInterface;
use App\Repository\DocumentsRepository;
use App\Repository\ImagesRepository;
use App\Service\Helper;
use Doctrine\ORM\EntityManagerInterface;
use PhpParser\Comment\Doc;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\String\Slugger\SluggerInterface;

class UploadFileService implements UploadFileInterface
{
    private DocumentsRepository $documentsRepository;
    private ImagesRepository $imagesRepository;
    private Filesystem $filesystem;
    private SluggerInterface $slugger;

    private string $documentDirectory;

    private string $imagesDirectory;
    private ParameterBagInterface $bag;
    private EntityManagerInterface $em;
    private UrlGeneratorInterface $urlGenerator;

    public function __construct(DocumentsRepository   $documentsRepository,
                                ImagesRepository      $imagesRepository,
                                Filesystem            $filesystem,
                                SluggerInterface      $slugger,
                                ParameterBagInterface $bag, EntityManagerInterface $em, UrlGeneratorInterface $urlGenerator)
    {

        $this->documentsRepository = $documentsRepository;
        $this->imagesRepository = $imagesRepository;
        $this->filesystem = $filesystem;
        $this->slugger = $slugger;
        $this->bag = $bag;
        $this->em = $em;
        $this->urlGenerator = $urlGenerator;
    }

    public function uploadFiles(array $files, string $documentType, string $className, int $id, bool $remove = false): void
    {
        /** @var UploadedFile $file */
        foreach ($files as $file) {
            if (!$file instanceof UploadedFile) {
                continue;
            }
            if ($documentType == self::TYPE_DOCUMENT) {
                $this->uploadDocuments($file, $className, $id);
            }
            $uniqName = uniqid();
            if ($documentType == self::TYPE_IMAGE) {
                foreach (self::IMAGE_SIZES as $size) {
                    $this->uploadImages($file, $className, $id, $size["name"], $size["w"], $size["h"], $uniqName, $remove);
                }
            }

        }

    }

    public function uploadDocuments(UploadedFile $file, string $className, int $id): void
    {
        $parts = explode('\\', $className);
        $entityName = end($parts);
        $classDirName = strtolower($entityName);
        $documentDirectory = $this->bag->get('base_dir') . '/upload/' . $classDirName . '/' . $id . '/' . self::TYPE_DOCUMENT;
        if (!$this->filesystem->exists($documentDirectory)) {
            $this->filesystem->mkdir($documentDirectory);
        }
        $document = new Documents();
        $uploadedName = $this->uploadDocument($file, $documentDirectory);

        $document->setEntityId($id);
        $document->setTitle($uploadedName);
        $document->setParentClass($className);
        $document->setCreationDate(new \DateTime());
        $this->em->persist($document);
        $this->em->flush();

    }

    public function uploadAvatar($file, int $id)
    {
        // $classDirName = strtolower(explode('\\', $className)[2]);
        $imageDirectory = $this->bag->get('base_dir') . '/public/avatars/' . $id;
        if (!$this->filesystem->exists($imageDirectory)) {
            $this->filesystem->mkdir($imageDirectory);
        }
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename) . '.' . $file->guessExtension();
        try {
            $file->move($imageDirectory, $safeFilename);
        } catch (FileException $e) {
            // ... handle exception if something happens during file upload
        }
        // $uploadedName = $this->uploadFile($file, $imageDirectory);
        return $safeFilename;
    }

    private function uploadImages(UploadedFile $file, string $className, int $id, string $sizeName, int $width, int $height, string $uniqName, $remove): void
    {
        $parts = explode('\\', $className);
        $entityName = end($parts);
        $classDirName = strtolower($entityName);
        $imageDirectory = $this->bag->get('base_dir') . '/upload/' . $classDirName . '/' . $id . '/' . self::TYPE_IMAGE . '/' . $sizeName;

        if (!$this->filesystem->exists($imageDirectory)) {
            $this->filesystem->mkdir($imageDirectory);
        }
        if ($remove) {
            $images = $this->em->getRepository(Images::class)->findBy(['parentClass' => $className, 'entityId' => $id, 'size' => $sizeName]);
            foreach ($images as $image) {
                $this->em->remove($image);
                $this->em->flush();
            }
        }
        $image = new Images();
        $uploadedName = $this->uploadFile($file, $imageDirectory, $width, $height, $uniqName);

        $image->setEntityId($id);
        $image->setTitle($uploadedName);
        $image->setParentClass($className);
        $image->setSize($sizeName);
        $this->em->persist($image);
        $this->em->flush();
    }

    public function uploadPDF(string $pdfHTML, string $className, int $id): string
    {
        $knpSnappyPdf = new Pdf('/usr/local/bin/wkhtmltopdf');
        $parts = explode('\\', $className);
        $entityName = end($parts);
        $classDirName = strtolower($entityName);
        $newFilename = 'document-' . uniqid() . '.pdf';
        $pdfFilePath = $this->bag->get('base_dir') . '/upload/' . $classDirName . '/' . $id . '/documents/' . '/';

        if (!$this->filesystem->exists($pdfFilePath)) {
            $this->filesystem->mkdir($pdfFilePath);
        }
        $knpSnappyPdf->generateFromHtml($pdfHTML, $pdfFilePath . $newFilename, ['orientation' => 'portrait', 'page-size' => 'A4',], true);
        return $newFilename;
    }

    private function uploadDocument(UploadedFile $file, string $uploadDirectory): string
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();

        // Move the file to the directory where brochures are stored
        try {
            $file->move($uploadDirectory, $newFilename);
        } catch (FileException $e) {
            // ... handle exception if something happens during file upload
        }

        return $newFilename;
    }

    private function uploadFile(UploadedFile $file, string $uploadDirectory, int $width, int $height, string $uniqName): string
    {
        $imageInfo = getimagesize($file);
        $imageType = $imageInfo[2];

        $f = Helper::resizeImage($file, $width, $height);
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

        $safeFilename = $this->slugger->slug($originalFilename);
        $newFilename = $safeFilename . '-' . $uniqName . '.' . $file->guessExtension();

        $targetPath = $uploadDirectory . '/' . $newFilename;

        switch ($imageType) {
            case IMAGETYPE_JPEG:
                imagejpeg($f, $targetPath);
                break;
            case IMAGETYPE_PNG:
                imagepng($f, $targetPath);
                break;
            case IMAGETYPE_GIF:
                imagegif($f, $targetPath);
                break;
        }
        // Move the file to the directory where brochures are stored
//        try {
//            $file->move($uploadDirectory, $newFilename);
//        } catch (FileException $e) {
//            // ... handle exception if something happens during file upload
//        }

        return $newFilename;

    }


    public function getDocuments(string $className, int $id): array
    {
        $parts = explode('\\', $className);
        $entityName = end($parts);
        $entityNameLow = strtolower($entityName);
        $obj = $this->em->getRepository($className)->find($id);
        $documentsUrls = [];
        foreach ($obj->getDocuments() as $document) {
            $documentUrl = $this->urlGenerator->generate('app_files', ['class_name' => $entityNameLow, 'class_id' => $obj->getId(), 'file_type' => 'documents', 'size_name' => "doc", 'file_name' => $document->getTitle()]);
            $documentsUrls[$document->getTitle()] = $documentUrl;
        }
        return $documentsUrls;
    }

    public function getDocument(string $className, int $id)
    {
        $parts = explode('\\', $className);
        $entityName = end($parts);
        $entityNameLow = strtolower($entityName);
        $obj = $this->em->getRepository($className)->find($id);
        return $this->urlGenerator->generate('app_files', ['class_name' => $entityNameLow, 'class_id' => $obj->getId(), 'file_type' => 'documents', 'size_name' => "doc", 'file_name' => $obj->getDocument()]);
    }

    public function getImagesArr(string $className, int $id, string $size): array
    {
        $parts = explode('\\', $className);
        $entityName = end($parts);
        $entityNameLow = strtolower($entityName);
        if (!empty($size)) {
            $objs = $this->em->getRepository(Images::class)->findBy(['parentClass' => $className, 'entityId' => $id, 'size' => $size]);
        } else {
            $objs = $this->em->getRepository(Images::class)->findBy(['parentClass' => $className, 'entityId' => $id]);
        }
        $imgUrls = [];
        foreach ($objs as $obj) {
            if (!empty($obj)) {
                $img = $this->urlGenerator->generate('app_files', ['class_name' => $entityNameLow, 'class_id' => $id, 'size_name' => !empty($size) ? $size : $obj->getSize(), 'file_type' => UploadFileInterface::TYPE_IMAGE, 'file_name' => $obj->getTitle()]);

                $imgUrls[] = $img;
            }
        }
        return $imgUrls;
    }

    public function getImages(string $className, int $id, string $size = ''): array
    {
        $parts = explode('\\', $className);
        $entityName = end($parts);
        $entityNameLow = strtolower($entityName);
        $objs = $this->em->getRepository(Images::class)->findBy(['parentClass' => $className, 'entityId' => $id, 'size' => $size]);
        $img = [];
        foreach ($objs as $obj) {
            $img[] = $this->urlGenerator->generate('app_files', ['class_name' => $entityNameLow, 'class_id' => $id, 'size_name' => !empty($size) ? $size : $obj->getSize(), 'file_type' => UploadFileInterface::TYPE_IMAGE, 'file_name' => $obj->getTitle()]);

        }
        return $img;
    }

    public function getDocumentsArr(string $className, int $id): array
    {
        $parts = explode('\\', $className);
        $entityName = end($parts);
        $entityNameLow = strtolower($entityName);

        $objs = $this->em->getRepository(Documents::class)->findBy(['parentClass' => $className, 'entityId' => $id]);

        $documentUrls = [];
        foreach ($objs as $obj) {
            if (!empty($obj)) {
                $documentUrl = $this->urlGenerator->generate('app_files', ['class_name' => $entityNameLow, 'class_id' => $obj->getId(), 'file_type' => 'documents', 'size_name' => "doc", 'file_name' => $obj->getTitle()]);

                $documentUrls[] = $documentUrl;
            }
        }
        return $documentUrls;
    }

    public function getImage(string $className, int $id, string $size = ''): ?string
    {
        $images = $this->getImagesArr($className, $id, $size);
        return !empty($images) ? $images[0] : null;
    }
}
