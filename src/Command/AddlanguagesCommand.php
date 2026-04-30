<?php

namespace App\Command;

use App\Entity\Language;
use App\Repository\LanguageRepository;
use Exception;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Intl\Languages;

#[AsCommand(
    name: 'add:langs',
    description: 'Add a short description for your command',
)]
class AddlanguagesCommand extends Command
{
    private LanguageRepository $languageRepository;

    public function __construct(LanguageRepository $languageRepository)
    {
        parent::__construct();
        $this->languageRepository = $languageRepository;
    }

    protected function configure(): void
    {
        $this
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $arg1 = $input->getArgument('arg1');

        try {
            $this->languageRepository->save();
            $io->success('You have successfully generated a new lang.');
            return Command::SUCCESS;
        } catch (Exception $e){
            $io->success($e->getMessage());
            return Command::FAILURE;
        }
    }
}
