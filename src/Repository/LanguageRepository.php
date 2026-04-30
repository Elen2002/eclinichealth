<?php

namespace App\Repository;

use App\Entity\Language;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Language>
 */
class LanguageRepository extends ServiceEntityRepository
{
    private EntityManagerInterface $em;

    public function __construct(ManagerRegistry $registry, EntityManagerInterface $em)
    {
        parent::__construct($registry, Language::class);
        $this->em = $em;
    }

    public function save(){
        $params = [
            [
                'name' => 'Armenian',
                'icon' => '<span class="fi fi-am"></span>',
                'local' => 'hy',
            ],
            [
                'name' => 'Russian',
                'icon' => '<span class="fi fi-ru"></span>',
                'local' => 'ru',
            ],
            [
                'name' => 'English',
                'icon' => '<span class="fi fi-us"></span>',
                'local' => 'en',
            ],
        ];

        foreach ($params as $param) {
            $language= new Language();
            $language->setName($param['name']);
            $language->setIcon($param['icon']);
            $language->setLocal($param['local']);
            $this->em->persist($language);
            $this->em->flush();
        }
    }

    //    /**
    //     * @return Language[] Returns an array of Language objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('l.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Language
    //    {
    //        return $this->createQueryBuilder('l')
    //            ->andWhere('l.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}
