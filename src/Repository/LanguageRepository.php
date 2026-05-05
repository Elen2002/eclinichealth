<?php

namespace App\Repository;

use App\Entity\Language;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\Persistence\ManagerRegistry;


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

    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
}
