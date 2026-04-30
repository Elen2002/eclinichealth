<?php

namespace App\Form;

use App\Entity\Consultation;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ConsultationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('doctor', \Symfony\Bridge\Doctrine\Form\Type\EntityType::class, [
                'class' => \App\Entity\Doctor::class,
                'choice_label' => function (\App\Entity\Doctor $doctor) {
                    return $doctor->getUser()->getEmail() . ' - ' . $doctor->getSpecialty();
                },
                'label' => 'Select Doctor',
                'attr' => ['class' => 'form-control'],
                'label_attr' => ['class' => 'form-label'],
            ])
            ->add('requestedDate', DateTimeType::class, [
                'widget' => 'single_text',
                'label' => 'Preferred Date & Time',
                'attr' => ['class' => 'form-control'],
                'label_attr' => ['class' => 'form-label'],
            ])
            ->add('message', TextareaType::class, [
                'label' => 'Message / Symptoms',
                'attr' => ['class' => 'form-control', 'rows' => 5],
                'label_attr' => ['class' => 'form-label'],
                'required' => false,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Consultation::class,
        ]);
    }
}
