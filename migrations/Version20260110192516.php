<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260110192516 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE review (id SERIAL NOT NULL, doctor_id INT NOT NULL, patient_id INT NOT NULL, rating SMALLINT NOT NULL, comment TEXT DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_794381C687F4FB17 ON review (doctor_id)');
        $this->addSql('CREATE INDEX IDX_794381C66B899279 ON review (patient_id)');
        $this->addSql('COMMENT ON COLUMN review.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C687F4FB17 FOREIGN KEY (doctor_id) REFERENCES doctor (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE review ADD CONSTRAINT FK_794381C66B899279 FOREIGN KEY (patient_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE consultation ADD prescription TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE consultation ADD medical_tests TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE consultation ADD doctor_proposed_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE consultation ADD is_patient_approved BOOLEAN NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C687F4FB17');
        $this->addSql('ALTER TABLE review DROP CONSTRAINT FK_794381C66B899279');
        $this->addSql('DROP TABLE review');
        $this->addSql('ALTER TABLE consultation DROP prescription');
        $this->addSql('ALTER TABLE consultation DROP medical_tests');
        $this->addSql('ALTER TABLE consultation DROP doctor_proposed_date');
        $this->addSql('ALTER TABLE consultation DROP is_patient_approved');
    }
}
