<?php

namespace App\Serializer;

class CircularReferenceHandler
{
    public function __invoke(object $object, string $format, array $context): mixed
    {
        if (method_exists($object, 'getId')) {
            return $object->getId();
        }

        return null;
    }
}
