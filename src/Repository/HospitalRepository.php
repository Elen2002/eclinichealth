<?php

namespace App\Repository;

use App\Entity\Hospital;
use App\Entity\HospitalDepartment;
use App\Interfaces\AddressInterface;
use App\Interfaces\UploadFileInterface;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Hospital>
 */
class HospitalRepository extends ServiceEntityRepository
{
    private ManagerRegistry $registry;
    private EntityManagerInterface $em;
    private UploadFileInterface $uploadFile;
    private AddressInterface $addressService;
    private HospitalDepartmentRepository $hospitalDepartmentRepository;
    private DepartmentRepository $departmentRepository;

    public function __construct(ManagerRegistry $registry,DepartmentRepository $departmentRepository, HospitalDepartmentRepository $hospitalDepartmentRepository, EntityManagerInterface $em, UploadFileInterface $uploadFile, AddressInterface $addressService)
    {
        parent::__construct($registry, Hospital::class);
        $this->registry = $registry;
        $this->em = $em;
        $this->uploadFile = $uploadFile;
        $this->addressService = $addressService;
        $this->hospitalDepartmentRepository = $hospitalDepartmentRepository;
        $this->departmentRepository = $departmentRepository;
    }

    public function save(Hospital $hospital, array $params): Hospital
    {
        $this->em->persist($hospital);
        $this->em->flush();

        if (!empty($params['department'])) {
            $existingDepts = $this->hospitalDepartmentRepository->findBy(['hospital' => $hospital->getId()]);
            foreach ($existingDepts as $ed) {
                $this->em->remove($ed);
            }
            $this->em->flush();

            foreach ($params['department'] as $deptOrId) {
                $hospitalDepartment = new HospitalDepartment();
                $department = ($deptOrId instanceof \App\Entity\Department) ? $deptOrId : $this->departmentRepository->find($deptOrId);
                if ($department) {
                    $hospitalDepartment->setDepartment($department);
                    $hospitalDepartment->setHospital($hospital);
                    $this->em->persist($hospitalDepartment);
                }
            }
        }
        $this->em->flush();

        if (!empty($params['coordinates'])) {
            $this->addressService->addAddress(Hospital::class, $hospital->getId(), $params);
        }

        if (!empty($params['files'])) {
            $this->uploadFile->uploadFiles(
                $params['files'],
                UploadFileInterface::TYPE_IMAGE,
                Hospital::class,
                $hospital->getId(),
                true
            );
        }
        return $hospital;
    }

    public function list()
    {
        $hospitals = $this->findBy([], ['id' => 'DESC']);
        foreach ($hospitals as $hospital) {
            $hospital->departmentsCount = count($this->hospitalDepartmentRepository->findBy(['hospital' => $hospital->getId()]));
            $address = $this->addressService->getAddress($hospital->getId(), Hospital::class);
            if ($address) {
                $hospital->setAddress($address->getTitle());
            }
            $hospital->images = $this->uploadFile->getImages(Hospital::class, $hospital->getId());
        }
        return $hospitals;
    }

    //    /**
    //     * @return Hospital[] Returns an array of Hospital objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('h')
    //            ->andWhere('h.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('h.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Hospital
    //    {
    //        return $this->createQueryBuilder('h')
    //            ->andWhere('h.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
