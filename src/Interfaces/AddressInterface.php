<?php

namespace App\Interfaces;



use App\Entity\Address;

interface AddressInterface
{

    public function addAddress(string $parentClass, int $entityId, array $params): void;

    public function getAddress(int $entityId, string $className): Address|null;

    public function getEntityAllAddresses(string $className): array;

    public function getCenterCoordinates(string $className, int $parentId, string $parentClassName): array|string;

    /**
     * @param int $entityId
     * @param string $className
     * @param string $childClassName
     * @return Address
     */
}
