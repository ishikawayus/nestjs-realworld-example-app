import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1636203285753 implements MigrationInterface {
  name = 'migration1636203285753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`token\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`token\` varchar(255) NOT NULL`,
    );
  }
}
