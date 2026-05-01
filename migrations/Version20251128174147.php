<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251128174147 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE address (id SERIAL NOT NULL, title VARCHAR(255) DEFAULT NULL, lat VARCHAR(255) DEFAULT NULL, lng VARCHAR(255) DEFAULT NULL, class_name VARCHAR(255) DEFAULT NULL, entity_id INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE address_area (id SERIAL NOT NULL, address_id INT DEFAULT NULL, lat VARCHAR(255) DEFAULT NULL, long VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_AAD8ED83F5B7AF75 ON address_area (address_id)');
        $this->addSql('CREATE TABLE documents (id SERIAL NOT NULL, title VARCHAR(255) DEFAULT NULL, parent_class VARCHAR(255) DEFAULT NULL, entity_id INT DEFAULT NULL, creation_date TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE images (id SERIAL NOT NULL, title VARCHAR(255) DEFAULT NULL, creation_date DATE DEFAULT NULL, size VARCHAR(255) DEFAULT NULL, parent_class VARCHAR(255) DEFAULT NULL, entity_id INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE address_area ADD CONSTRAINT FK_AAD8ED83F5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE address_area DROP CONSTRAINT FK_AAD8ED83F5B7AF75');
        $this->addSql('DROP TABLE address');
        $this->addSql('DROP TABLE address_area');
        $this->addSql('DROP TABLE documents');
        $this->addSql('DROP TABLE images');
    }
}
