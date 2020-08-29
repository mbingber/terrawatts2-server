import {MigrationInterface, QueryRunner} from "typeorm";
import { Plant, PlantResourceType } from "../entity/Plant";

export class seattlePlant1598667575847 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const plant = new Plant();
        plant.rank = 69;
        plant.resourceType = PlantResourceType.WIND;
        plant.numCities = 7;
        plant.resourceBurn = 0;
        plant.mapName = 'Seattle';

        return queryRunner.manager.save(plant);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
