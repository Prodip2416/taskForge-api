import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1773897431776 implements MigrationInterface {
    name = 'CreateProductTable1773897431776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`project\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(500) NOT NULL, \`slug\` varchar(500) NOT NULL, \`description\` varchar(1000) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`isDelete\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_6fce32ddd71197807027be6ad3\` (\`slug\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_6fce32ddd71197807027be6ad3\` ON \`project\``);
        await queryRunner.query(`DROP TABLE \`project\``);
    }

}
