import {MigrationInterface, QueryRunner} from "typeorm";
import { City } from "../entity/City";

export class fixGermanyRegions1588469619353 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const frankfurt = await queryRunner
            .manager
            .getRepository(City)
            .findOne({
                where: { name: "Frankfurt" }
            });

        const frankfurtO = await queryRunner
            .manager
            .getRepository(City)
            .findOne({
                where: { name: "Frankfurt an der Oder" }
            });

        frankfurt.region = 5;
        frankfurtO.region = 2;

        await queryRunner.manager.save([frankfurtO, frankfurt]);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
