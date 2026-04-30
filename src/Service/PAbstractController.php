<?php

namespace App\Service;


use App\Entity\Language;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Bundle\BundleInterface;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

abstract class PAbstractController extends AbstractController
{
    protected array $lastRenderParams = [];

    public static function getSubscribedServices(): array
    {
        $services = parent::getSubscribedServices();

        $services['entity_manager'] = '?' . EntityManagerInterface::class;
        $services['token'] = '?' . TokenStorageInterface::class;
        $services['kernel'] = '?' . KernelInterface::class;
        $services['filesystem'] = '?' . Filesystem::class;
        $services['bundle'] = '?' . BundleInterface::class;

        return $services;
    }


    public function render(string $view, array $parameters = [], ?Response $response = null): Response
    {
        $req = $this->container->get('request_stack');
        /** @var Request $request */
        $request = $req->getMainRequest();
        $queryParams = array_merge($request->attributes->all(), $request->query->all());

        $em = $this->container->get('entity_manager');

        $localesModel = $em->getRepository(Language::class)->findAll();
        $locales = [];
        $currentLocale = [];

        /** @var Language $locale */
        foreach ($localesModel as $locale) {
            $localeAssoc = [
                "id" => $locale->getId(),
                "locale" => $locale->getLocale(),
                "name" => $locale->getName(),
                "icon" => $locale->getIcon(),
            ];
            $queryParams['_locale'] = $locale->getLocale();
            $localeAssoc['url'] = $this->generateUrl($request->get('_route'), $queryParams);
            if ($locale->getLocale() == $request->getLocale()) {
                $currentLocale = $locale;
            }

            $locales[] = $localeAssoc;
        }
        $parameters["locales"] = $locales;
        $parameters["locale"] = $currentLocale;

        $route = $request->get("_route");


        $request->query->remove("path");
        $request->attributes->remove("path");

        $req->getCurrentRequest()?->getSession()->remove('_currency');
        $parameters["langs"] = $em->getRepository(Language::class)->findAll();
        $this->lastRenderParams = $parameters;
        return parent::render($view, $parameters, $response);

    }
}
