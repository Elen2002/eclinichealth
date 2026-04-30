<?php

namespace App\Twig;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Yaml\Yaml;
use Symfony\Contracts\Translation\TranslatorInterface;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig\Extension\AbstractExtension;
use Twig\Extension\GlobalsInterface;
use Twig\TwigFunction;

class AppExtension extends AbstractExtension
{
    private Environment $twig;
    private RequestStack $requestStack;

    public function __construct(Environment $twig, RequestStack $requestStack)
    {

        $this->twig = $twig;
        $this->requestStack = $requestStack;
    }

    public function getFunctions()
    {
        return [
            new TwigFunction('form_generator', [$this, 'formGenerator'], ['is_safe' => ['html']]),
            new TwigFunction('map', [$this, 'map'], ['is_safe' => ['html']]),
        ];


    }

    /**
     * @throws SyntaxError
     * @throws \ReflectionException
     * @throws RuntimeError
     * @throws LoaderError
     */
    public function formGenerator($form, string $buttonName = '', bool $map = false,
                                  string $mode = '', string $type = 'normal',
                                  bool $polygon = false, bool $marker = false,
                                  array $geoPoints = [], array $geoPolygons = [],
                                  array $geoPolygonsParent = [], array $geoPointsParent = [],
                                  string $size = '', int $minZoom = 15, int $maxZoom = 18, bool $circle = false)
    {
        if (method_exists($form, 'getData')) {
            $entity = $form->getData();
        } elseif (isset($form->vars['data'])) {
            $entity = $form->vars['data'];
        } else {
            $entity = null;
        }

        $className = is_object($entity)
            ? (new \ReflectionClass($entity))->getName()
            : 'GenericForm';

        return $this->twig->render('extension/form.html.twig', [
            'form' => $form,
            'map' => $map,
            'mode' => $mode,
            'type' => $type,
            'polygon' => $polygon,
            'marker' => $marker,
            'geoPoints' => $geoPoints,
            'geoPolygons' => $geoPolygons,
            'geoPolygonsParent' => $geoPolygonsParent,
            'geoPointsParent' => $geoPointsParent,
            'size' => $size,
            'minZoom' => $minZoom,
            'maxZoom' => $maxZoom,
            'circle' => $circle,
            'className' => $className,
            'buttonName' => $buttonName,
        ]);
    }
    public
    function map(string $mode = 'view',
                 string $mapType = 'normal',
                 bool   $enablePolygon = false,
                 bool   $enableMarker = false,
                 array  $geoPoints = [],
                 array  $geoPolygons = [],
                 array  $geoPolygonsParent = [],
                 array  $geoPointsParent = [],
                 string $size = '',
                 int    $minZoom = 15,
                 int    $maxZoom = 18,
                 bool   $circle = false): string
    {
        return $this->twig->render('extension/map.html.twig', [
            'mode' => $mode,
            'mapType' => $mapType,
            'enablePolygon' => $enablePolygon,
            'enableMarker' => $enableMarker,
            'geoPoints' => $geoPoints,
            'geoPolygonsParent' => $geoPolygonsParent,
            'geoPointsParent' => $geoPointsParent,
            'size' => $size,
            'minZoom' => $minZoom,
            'maxZoom' => $maxZoom,
            'circle' => $circle,
            'geoPolygons' => $geoPolygons,
        ]);
    }

}
