<?php

namespace App\Repository;

use App\Entity\Department;
use App\Interfaces\UploadFileInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;


class DepartmentRepository extends ServiceEntityRepository
{
    private EntityManagerInterface $em;
    private UploadFileInterface $uploadFile;

    public function __construct(ManagerRegistry $registry, EntityManagerInterface $em, UploadFileInterface $uploadFile)
    {
        parent::__construct($registry, Department::class);
        $this->em = $em;
        $this->uploadFile = $uploadFile;
    }
    public function save(Department $department, array $params)
    {
        $this->em->persist($department);
        $this->em->flush();

        if (!empty($params['files'])) {
            $this->uploadFile->uploadFiles(
                $params['files'],
                UploadFileInterface::TYPE_IMAGE,
                Department::class,
                $department->getId(),
                true
            );
        }
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    public function findAllActive(): array
    {
        return $this->createQueryBuilder('d')
            ->orderBy('d.name', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
