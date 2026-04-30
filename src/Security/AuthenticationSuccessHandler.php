<?php

namespace App\Security;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;

class AuthenticationSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private RouterInterface $router;

    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        $roles = $token->getRoleNames();

        if (in_array('ROLE_DOCTOR', $roles, true)) {
            return new RedirectResponse($this->router->generate('app_doctor_dashboard'));
        }

        if (in_array('ROLE_ADMIN', $roles, true)) {
            return new RedirectResponse($this->router->generate('admin'));
        }

        // Default to Home for regular users
        // Check if there is a target path in session (e.g. they tried to access a protected page)
        // For simplicity, we redirect to home now, but we could improve this.
        return new RedirectResponse($this->router->generate('app_home'));
    }
}
