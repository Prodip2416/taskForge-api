import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMembersProjectJoin1774709761417 implements MigrationInterface {
    name = 'CreateMembersProjectJoin1774709761417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`project_members_user\` (\`projectId\` int NOT NULL, \`userId\` int NOT NULL, INDEX \`IDX_c79bdce48cf47ff04f1ec3a8ca\` (\`projectId\`), INDEX \`IDX_66c5703c0321bafc7c9352098b\` (\`userId\`), PRIMARY KEY (\`projectId\`, \`userId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`project_members_user\` ADD CONSTRAINT \`FK_c79bdce48cf47ff04f1ec3a8ca5\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`project_members_user\` ADD CONSTRAINT \`FK_66c5703c0321bafc7c9352098b5\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project_members_user\` DROP FOREIGN KEY \`FK_66c5703c0321bafc7c9352098b5\``);
        await queryRunner.query(`ALTER TABLE \`project_members_user\` DROP FOREIGN KEY \`FK_c79bdce48cf47ff04f1ec3a8ca5\``);
        await queryRunner.query(`DROP INDEX \`IDX_66c5703c0321bafc7c9352098b\` ON \`project_members_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_c79bdce48cf47ff04f1ec3a8ca\` ON \`project_members_user\``);
        await queryRunner.query(`DROP TABLE \`project_members_user\``);
    }

}
