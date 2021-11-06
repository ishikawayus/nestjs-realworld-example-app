import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1636162910683 implements MigrationInterface {
  name = 'migration1636162910683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
  }
}
