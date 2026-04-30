<?php

namespace App\Form;

use App\Entity\Department;
use App\Entity\Hospital;
use App\Repository\HospitalDepartmentRepository;
use App\Repository\HospitalRepository;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\FormEvent;
use Symfony\Component\Form\FormEvents;
use Symfony\Component\OptionsResolver\OptionsResolver;

class HospitalType extends AbstractType
{

    private HospitalDepartmentRepository $hospitalDepartmentRepository;

    public function __construct(HospitalDepartmentRepository $hospitalDepartmentRepository)
    {
        $this->hospitalDepartmentRepository = $hospitalDepartmentRepository;
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('about')
            ->add('image', fileType::class, [
                'mapped' => false,
                'required' => false,
            ])
            ->add('address')
            ->add('phone')
            ->add('email')
            ->add('workingHours')
            ->add('bedsCount')
            ->add('staffCount')
            ->add('hasAmbulance', \Symfony\Component\Form\Extension\Core\Type\CheckboxType::class, [
                'required' => false,
                'label' => 'Ambulance Available',
            ])
            ->add('department', EntityType::class, [
                'class' => Department::class,
                'choice_label' => 'name',
                'mapped' => false,
                'multiple' => true,
            ])
        ;

        $builder->addEventListener(FormEvents::POST_SET_DATA, function (FormEvent $event) {
            /** @var Hospital $hospital */
            $hospital = $event->getData();
            $form = $event->getForm();

            if ($hospital) {
                $departments = $this->hospitalDepartmentRepository->findBy(['hospital' => $hospital->getId()]);
                $dep = [];
                foreach ($departments as $department) {
                    $dep[]= $department->getDepartment();
                }
            }
            if (!empty($dep)) {
                $form->get('department')->setData($dep);
            }
        });
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Hospital::class,
        ]);
    }
}
