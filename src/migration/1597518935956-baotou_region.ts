import {MigrationInterface, QueryRunner} from "typeorm";
import { City } from "../entity/City";

export class baotouRegion1597518935956 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const cities = await queryRunner.manager.getRepository(City).find();
        const baotou = cities.find(c => c.name === 'Baotou');
        baotou.region = 2;
        await queryRunner.manager.save(baotou);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
