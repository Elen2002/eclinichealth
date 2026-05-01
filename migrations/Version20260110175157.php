<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260110175157 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE consultation (id SERIAL NOT NULL, doctor_id INT NOT NULL, hospital_id INT NOT NULL, department_id INT NOT NULL, patient_name VARCHAR(255) NOT NULL, patient_email VARCHAR(255) NOT NULL, patient_phone VARCHAR(20) NOT NULL, requested_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, message TEXT DEFAULT NULL, status VARCHAR(20) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_964685A687F4FB17 ON consultation (doctor_id)');
        $this->addSql('CREATE INDEX IDX_964685A663DBB69 ON consultation (hospital_id)');
        $this->addSql('CREATE INDEX IDX_964685A6AE80F5DF ON consultation (department_id)');
        $this->addSql('COMMENT ON COLUMN consultation.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE consultation ADD CONSTRAINT FK_964685A687F4FB17 FOREIGN KEY (doctor_id) REFERENCES doctor (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE consultation ADD CONSTRAINT FK_964685A663DBB69 FOREIGN KEY (hospital_id) REFERENCES hospital (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE consultation ADD CONSTRAINT FK_964685A6AE80F5DF FOREIGN KEY (department_id) REFERENCES department (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE consultation DROP CONSTRAINT FK_964685A687F4FB17');
        $this->addSql('ALTER TABLE consultation DROP CONSTRAINT FK_964685A663DBB69');
        $this->addSql('ALTER TABLE consultation DROP CONSTRAINT FK_964685A6AE80F5DF');
        $this->addSql('DROP TABLE consultation');
    }
}
