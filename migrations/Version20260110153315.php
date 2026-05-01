<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260110153315 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE doctor ADD user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE doctor ADD department_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE doctor ADD hospital_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE doctor ADD specialty VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE doctor ADD role_type VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE doctor ADD phone VARCHAR(20) DEFAULT NULL');
        $this->addSql('ALTER TABLE doctor ADD is_active BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE doctor ADD CONSTRAINT FK_1FC0F36AA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE doctor ADD CONSTRAINT FK_1FC0F36AAE80F5DF FOREIGN KEY (department_id) REFERENCES department (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE doctor ADD CONSTRAINT FK_1FC0F36A63DBB69 FOREIGN KEY (hospital_id) REFERENCES hospital (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1FC0F36AA76ED395 ON doctor (user_id)');
        $this->addSql('CREATE INDEX IDX_1FC0F36AAE80F5DF ON doctor (department_id)');
        $this->addSql('CREATE INDEX IDX_1FC0F36A63DBB69 ON doctor (hospital_id)');
        $this->addSql('ALTER TABLE hospital ADD address VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE hospital ADD phone VARCHAR(20) DEFAULT NULL');
        $this->addSql('ALTER TABLE hospital ADD email VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE hospital ADD brand_color VARCHAR(7) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE hospital DROP address');
        $this->addSql('ALTER TABLE hospital DROP phone');
        $this->addSql('ALTER TABLE hospital DROP email');
        $this->addSql('ALTER TABLE hospital DROP brand_color');
        $this->addSql('ALTER TABLE doctor DROP CONSTRAINT FK_1FC0F36AA76ED395');
        $this->addSql('ALTER TABLE doctor DROP CONSTRAINT FK_1FC0F36AAE80F5DF');
        $this->addSql('ALTER TABLE doctor DROP CONSTRAINT FK_1FC0F36A63DBB69');
        $this->addSql('DROP INDEX UNIQ_1FC0F36AA76ED395');
        $this->addSql('DROP INDEX IDX_1FC0F36AAE80F5DF');
        $this->addSql('DROP INDEX IDX_1FC0F36A63DBB69');
        $this->addSql('ALTER TABLE doctor DROP user_id');
        $this->addSql('ALTER TABLE doctor DROP department_id');
        $this->addSql('ALTER TABLE doctor DROP hospital_id');
        $this->addSql('ALTER TABLE doctor DROP specialty');
        $this->addSql('ALTER TABLE doctor DROP role_type');
        $this->addSql('ALTER TABLE doctor DROP phone');
        $this->addSql('ALTER TABLE doctor DROP is_active');
    }
}
