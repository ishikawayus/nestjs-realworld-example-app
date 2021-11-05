import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1636071504121 implements MigrationInterface {
  name = 'migration1636071504121';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`bio\` varchar(255) NOT NULL, \`image\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`article\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`body\` varchar(255) NOT NULL, \`author_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`article_favorite\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`article_id\` int NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`article_id\`, \`user_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tag\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`value\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`article_tag\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`article_id\` int NOT NULL, \`tag_id\` int NOT NULL, PRIMARY KEY (\`article_id\`, \`tag_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`comment\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`body\` varchar(255) NOT NULL, \`article_id\` int NULL, \`author_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_follow\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`version\` int NOT NULL, \`follower_id\` int NOT NULL, \`followee_id\` int NOT NULL, PRIMARY KEY (\`follower_id\`, \`followee_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`article\` ADD CONSTRAINT \`FK_16d4ce4c84bd9b8562c6f396262\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_favorite\` ADD CONSTRAINT \`FK_4809fdb9d2d458ccd2b330a3fac\` FOREIGN KEY (\`article_id\`) REFERENCES \`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_favorite\` ADD CONSTRAINT \`FK_08fe823b4c2c5305bf308ba72d0\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_tag\` ADD CONSTRAINT \`FK_26455b396109a0b535ddb614832\` FOREIGN KEY (\`article_id\`) REFERENCES \`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_tag\` ADD CONSTRAINT \`FK_cdc3f155737b763c298ab080f84\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_03a590c26b0910b0bb49682b1e3\` FOREIGN KEY (\`article_id\`) REFERENCES \`article\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_3ce66469b26697baa097f8da923\` FOREIGN KEY (\`author_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_follow\` ADD CONSTRAINT \`FK_afe3fdfb98cd47cd28108fa4846\` FOREIGN KEY (\`follower_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_follow\` ADD CONSTRAINT \`FK_30bd098ba59638f5a01082fe1a7\` FOREIGN KEY (\`followee_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_follow\` DROP FOREIGN KEY \`FK_30bd098ba59638f5a01082fe1a7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_follow\` DROP FOREIGN KEY \`FK_afe3fdfb98cd47cd28108fa4846\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_3ce66469b26697baa097f8da923\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_03a590c26b0910b0bb49682b1e3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_tag\` DROP FOREIGN KEY \`FK_cdc3f155737b763c298ab080f84\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_tag\` DROP FOREIGN KEY \`FK_26455b396109a0b535ddb614832\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_favorite\` DROP FOREIGN KEY \`FK_08fe823b4c2c5305bf308ba72d0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`article_favorite\` DROP FOREIGN KEY \`FK_4809fdb9d2d458ccd2b330a3fac\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`article\` DROP FOREIGN KEY \`FK_16d4ce4c84bd9b8562c6f396262\``,
    );
    await queryRunner.query(`DROP TABLE \`user_follow\``);
    await queryRunner.query(`DROP TABLE \`comment\``);
    await queryRunner.query(`DROP TABLE \`article_tag\``);
    await queryRunner.query(`DROP TABLE \`tag\``);
    await queryRunner.query(`DROP TABLE \`article_favorite\``);
    await queryRunner.query(`DROP TABLE \`article\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
