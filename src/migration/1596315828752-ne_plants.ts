import {MigrationInterface, QueryRunner} from "typeorm";
import { Plant, PlantResourceType } from "../entity/Plant";

const mapName = 'Northern Europe';

const plantsRaw: Partial<Plant>[] = [{
    rank: 7,
    resourceType: PlantResourceType.WIND,
    numCities: 1,
    resourceBurn: 0,
    region: 2,
}, {
    rank: 10,
    resourceType: PlantResourceType.URANIUM,
    numCities: 3,
    resourceBurn: 2,
    region: 3,
}, {
    rank: 18,
    resourceType: PlantResourceType.OIL,
    numCities: 3,
    resourceBurn: 1,
    region: 6,
}, {
    rank: 19,
    resourceType: PlantResourceType.OIL,
    numCities: 4,
    resourceBurn: 2,
    region: 1,
}, {
    rank: 21,
    resourceType: PlantResourceType.WIND,
    numCities: 2,
    resourceBurn: 0,
    region: 4,
}, {
    rank: 22,
    resourceType: PlantResourceType.WIND,
    numCities: 3,
    resourceBurn: 0,
    region: 6,
}, {
    rank: 25,
    resourceType: PlantResourceType.URANIUM,
    numCities: 4,
    resourceBurn: 1,
    region: 4,
}, {
    rank: 26,
    resourceType: PlantResourceType.OIL,
    numCities: 5,
    resourceBurn: 3,
    region: 1,
}, {
    rank: 32,
    resourceType: PlantResourceType.TRASH,
    numCities: 6,
    resourceBurn: 2,
    region: 5,
}, {
    rank: 39,
    resourceType: PlantResourceType.WIND,
    numCities: 5,
    resourceBurn: 0,
    region: 3,
}, {
    rank: 44,
    resourceType: PlantResourceType.URANIUM,
    numCities: 7,
    resourceBurn: 1,
    region: 5,
}, {
    rank: 46,
    resourceType: PlantResourceType.WIND,
    numCities: 6,
    resourceBurn: 0,
    region: 2,
}];

export class nePlants1596315828752 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const plants: Plant[] = plantsRaw.map(p => {
            const plant = new Plant();
            plant.rank = p.rank;
            plant.resourceType = p.resourceType;
            plant.numCities = p.numCities;
            plant.resourceBurn = p.resourceBurn;
            plant.region = p.region;
            plant.mapName = mapName;
            return plant;
        });

        return queryRunner.manager.save(plants);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
