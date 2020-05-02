import {MigrationInterface, QueryRunner} from "typeorm";
import { City } from "../entity/City";

export class changeMagdeburgLocation1588438454606 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const magdeburg = await queryRunner
        .manager
        .getRepository(City)
        .findOne({
            where: { name: "Magdeberg" }
        });
  
        magdeburg.name = "Magdeburg";
        magdeburg.lat = 52.1;
        magdeburg.lng = 11.6;
  
        return queryRunner.manager.save(magdeburg);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
