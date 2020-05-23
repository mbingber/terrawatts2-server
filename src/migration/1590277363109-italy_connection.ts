import {MigrationInterface, QueryRunner} from "typeorm";
import { Connection } from "../entity/Connection";
import { City } from "../entity/City";

export class italyConnection1590277363109 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const cities = await queryRunner.manager.getRepository(City).find();
        const connections = await queryRunner.manager.getRepository(Connection).find({ relations: ['cities'] });

        const catania = cities.find(c => c.name === 'Catania');
        const siracusa = cities.find(c => c.name === 'Siracusa');

        const cataninaSiracusa = connections.find((c) => c.cities.some(c => c.id === catania.id) && c.cities.some(c => c.id === siracusa.id));

        cataninaSiracusa.cost = 3;
        await queryRunner.manager.save(cataninaSiracusa);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
