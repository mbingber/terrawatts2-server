import {MigrationInterface, QueryRunner} from "typeorm";
import { Connection } from "../entity/Connection";
import { City } from "../entity/City";

export class fixNeConnections1596322488116 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const cities = await queryRunner.manager.getRepository(City).find();
        const connections = await queryRunner.manager.getRepository(Connection).find({ relations: ['cities'] });

        const jonkoping = cities.find(c => c.name === 'Jonkoping');
        const kobenhavn = cities.find(c => c.name === 'Kobenhavn');

        const cataninaSiracusa = connections.find((c) => c.cities.some(c => c.id === jonkoping.id) && c.cities.some(c => c.id === kobenhavn.id));

        cataninaSiracusa.cost = 12;
        await queryRunner.manager.save(cataninaSiracusa);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
