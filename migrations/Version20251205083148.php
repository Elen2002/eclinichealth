<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251205083148 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE department (id SERIAL NOT NULL, name VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE hospital_department (id SERIAL NOT NULL, hospital_id INT DEFAULT NULL, department_id INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_BDBAE89E63DBB69 ON hospital_department (hospital_id)');
        $this->addSql('CREATE INDEX IDX_BDBAE89EAE80F5DF ON hospital_department (department_id)');
        $this->addSql('ALTER TABLE hospital_department ADD CONSTRAINT FK_BDBAE89E63DBB69 FOREIGN KEY (hospital_id) REFERENCES hospital (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE hospital_department ADD CONSTRAINT FK_BDBAE89EAE80F5DF FOREIGN KEY (department_id) REFERENCES department (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE hospital_department DROP CONSTRAINT FK_BDBAE89E63DBB69');
        $this->addSql('ALTER TABLE hospital_department DROP CONSTRAINT FK_BDBAE89EAE80F5DF');
        $this->addSql('DROP TABLE department');
        $this->addSql('DROP TABLE hospital_department');
    }
}
