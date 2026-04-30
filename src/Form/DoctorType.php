<?php

namespace App\Form;

use App\Entity\Department;
use App\Entity\Doctor;
use App\Entity\Hospital;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DoctorType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'mapped' => false,
                'label' => 'Full Name'
            ])
            ->add('email', EmailType::class, [
                'mapped' => false,
                'label' => 'Professional Email'
            ])
            ->add('specialty')
            ->add('roleType')
            ->add('phone', TelType::class)
            ->add('department', EntityType::class, [
                'class' => Department::class,
                'choice_label' => 'name',
            ])
            ->add('hospital', EntityType::class, [
                'class' => Hospital::class,
                'choice_label' => 'name',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Doctor::class,
        ]);
    }
}
