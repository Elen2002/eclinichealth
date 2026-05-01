<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260428145025 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE hospital ADD working_hours VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE hospital ADD beds_count INT DEFAULT NULL');
        $this->addSql('ALTER TABLE hospital ADD has_ambulance BOOLEAN DEFAULT NULL');
        $this->addSql('ALTER TABLE hospital DROP brand_color');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE hospital ADD brand_color VARCHAR(7) DEFAULT NULL');
        $this->addSql('ALTER TABLE hospital DROP working_hours');
        $this->addSql('ALTER TABLE hospital DROP beds_count');
        $this->addSql('ALTER TABLE hospital DROP has_ambulance');
    }
}
