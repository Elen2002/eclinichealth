<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251205130103 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE doctor (id SERIAL NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE doctor_pacient (id SERIAL NOT NULL, doctor_id INT DEFAULT NULL, pacient_id INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_5BB7FFD487F4FB17 ON doctor_pacient (doctor_id)');
        $this->addSql('CREATE INDEX IDX_5BB7FFD41DF7AA4B ON doctor_pacient (pacient_id)');
        $this->addSql('ALTER TABLE doctor_pacient ADD CONSTRAINT FK_5BB7FFD487F4FB17 FOREIGN KEY (doctor_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE doctor_pacient ADD CONSTRAINT FK_5BB7FFD41DF7AA4B FOREIGN KEY (pacient_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE hospital_department ADD doctor_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE hospital_department ADD CONSTRAINT FK_BDBAE89E87F4FB17 FOREIGN KEY (doctor_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_BDBAE89E87F4FB17 ON hospital_department (doctor_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE doctor_pacient DROP CONSTRAINT FK_5BB7FFD487F4FB17');
        $this->addSql('ALTER TABLE doctor_pacient DROP CONSTRAINT FK_5BB7FFD41DF7AA4B');
        $this->addSql('DROP TABLE doctor');
        $this->addSql('DROP TABLE doctor_pacient');
        $this->addSql('ALTER TABLE hospital_department DROP CONSTRAINT FK_BDBAE89E87F4FB17');
        $this->addSql('DROP INDEX IDX_BDBAE89E87F4FB17');
        $this->addSql('ALTER TABLE hospital_department DROP doctor_id');
    }
}
