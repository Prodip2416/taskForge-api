import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteDeafultValueUpdated1774194017963 implements MigrationInterface {
    name = 'DeleteDeafultValueUpdated1774194017963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` CHANGE \`isDelete\` \`isDelete\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`project\` CHANGE \`isDelete\` \`isDelete\` tinyint NOT NULL DEFAULT '1'`);
    }

}
