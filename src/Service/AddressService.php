<?php

namespace App\Service;


use App\Entity\Address;
use App\Entity\AddressArea;
use App\Interfaces\AddressInterface;
use App\Repository\AddressAreaRepository;
use App\Repository\AddressRepository;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Helper\Helper;

class AddressService implements AddressInterface
{
    private EntityManagerInterface $em;
    private AddressRepository $addressRepository;
    private AddressAreaRepository $addressAreaRepository;
    private Connection $connection;

    public function __construct(EntityManagerInterface $em,
                                AddressRepository      $addressRepository, AddressAreaRepository $addressAreaRepository, Connection $connection)
    {

        $this->em = $em;
        $this->addressRepository = $addressRepository;
        $this->addressAreaRepository = $addressAreaRepository;
        $this->connection = $connection;
    }

    public function addAddress(string $parentClass, int $entityId, array $params = []): void
    {
        if (empty($params['coordinates'])){
            return;
        }
        $address = $this->addressRepository->findOneBy(['className' => $parentClass, 'entityId' => $entityId]);
        if (empty($address)) {
            $address = new Address();
        }

        if(!empty($params['locations'])){
            $address->setTitle($params['locations']);
        }

        $address->setClassName($parentClass);
        $address->setEntityId($entityId);

        $part = explode('LatLng', $params['coordinates']);
        if (count($part) < 3){
            $part = str_replace('(', '', $part);
            $part = str_replace(')', '', $part);
            $part = explode(', ', $part[1]);
            unset($part[2]);
            $address->setLat($part[0]);
            $address->setLng($part[1]);
            $this->em->persist($address);
            $this->em->flush();
        }else{
            $this->em->persist($address);
            $this->em->flush();
            $this->addPolygon($address, $params['coordinates']);
        }
    }

    public function getAddress(int $entityId, string $className): Address|null{
        /** @var Address $address */
        $address = $this->addressRepository->findOneBy(['entityId' => $entityId, 'className'=> $className]);
        if(!empty($address)){
            $addressArea = $this->addressAreaRepository->findBy(['address' => $address]);

            $areaCoordinates = [];
            /** @var AddressArea $area */
            foreach ($addressArea as $area){
                $item = [
                    (float)$area->getLat(),
                    (float)$area->getLong()
                ];
                $areaCoordinates[] = $item;
            }

            $address->areas = $areaCoordinates;

        }

        return $address;
    }


    private function addPolygon(Address $address, string $points = '')
    {

        $addressArea = $this->addressAreaRepository->findBy(['address' => $address->getId()]);
        if (!empty($addressArea)) {
            foreach ($addressArea as $addresses) {
                $this->em->remove($addresses);
                $this->em->flush();
            }
        }
        $points= explode('Center', $points);
        $center = $points[1];
        $points = $points[0];
        $pointsArr = explode('LatLng', $points);
        unset($pointsArr[0]);
        foreach ($pointsArr as &$part) {
            $part = str_replace('(', '', $part);
            $part = str_replace(')', '', $part);
            $part = explode(',', $part);
            unset($part[2]);
            $addressArea = new AddressArea();
            $addressArea->setAddress($address);
            $addressArea->setLat($part[0]);
            $addressArea->setLong($part[1]);
            $this->em->persist($addressArea);
            $this->em->flush();
        }
        $center = str_replace('(LatLng(', '', $center);
        $center = str_replace(')', '', $center);
        $center = explode(',', $center);
        $address->setLat($center[0]);
        $address->setLng($center[1]);
        $this->em->persist($address);
        $this->em->flush();
    }

    public function getEntityAllAddresses(string $className): array
    {
        $addresses =  $this->addressRepository->findBy(['className' => $className]);
        $coordinates = [];
        /** @var Address $address */
        foreach ($addresses as $address){

            $areas = $this->addressAreaRepository->findBy(['address' => $address->getId()]);
            /** @var AddressArea $area */
            foreach ($areas as $area){
                $item = [$area->getLat(), $area->getLong()];
                $coordinates[] = $item;
            }
        }

        return $coordinates;
    }

    public function getCenterCoordinates(string $className, int $parentId, string $parentClassName): array|string
    {

        $sqlEntityName = Helper::camelCaseToUnderline($className);
        $sqlParentName = Helper::camelCaseToUnderline($parentClassName);

        $alias = "t";
        if($sqlParentName == "garden_block"){
            $sqlParentName = "block";
        }
        $parentClassId = $alias.'.'.$sqlParentName.'_id';

        $coordinates = [];
        if(!empty($className)){
            $sql = 'SELECT AVG(CAST(lat AS float)) AS lat, AVG(CAST(lng AS float)) AS lng FROM address
inner join '.$sqlEntityName.' as '.$alias.' on '.$alias.'.id = entity_id
where class_name= :className and '.$parentClassId.' = :parentId';
            $coordinates = $this->connection->fetchAssociative($sql, ['className' => $className, 'parentId' => $parentId]);

        }

        return $coordinates;

    }

}
