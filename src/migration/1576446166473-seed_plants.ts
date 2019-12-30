import { MigrationInterface, QueryRunner } from 'typeorm';
import { Plant, PlantResourceType } from '../entity/Plant';

export class seedPlants1576446166473 implements MigrationInterface {

  public createPlant(
    rank: number,
    numCities: number,
    resourceType: PlantResourceType,
    resourceBurn: number = 0
  ): Plant {
    const plant = new Plant();
    
    plant.rank = rank;
    plant.numCities = numCities;
    plant.resourceType = resourceType;
    plant.resourceBurn = resourceBurn;

    return plant;
  }

  public async up(queryRunner: QueryRunner): Promise<any> {
    const plants: Plant[] = [
      this.createPlant(3, 1, PlantResourceType.OIL, 2),
      this.createPlant(4, 1, PlantResourceType.COAL, 2),
      this.createPlant(5, 1, PlantResourceType.HYBRID, 2),
      this.createPlant(6, 1, PlantResourceType.TRASH, 1),
      this.createPlant(7, 2, PlantResourceType.OIL, 3),
      this.createPlant(8, 2, PlantResourceType.COAL, 3),
      this.createPlant(9, 1, PlantResourceType.OIL, 1),
      this.createPlant(10, 2, PlantResourceType.COAL, 2),
      this.createPlant(11, 2, PlantResourceType.URANIUM, 1),
      this.createPlant(12, 2, PlantResourceType.HYBRID, 2),
      this.createPlant(13, 1, PlantResourceType.WIND),
      this.createPlant(14, 2, PlantResourceType.TRASH, 2),
      this.createPlant(15, 3, PlantResourceType.COAL, 2),
      this.createPlant(16, 3, PlantResourceType.OIL, 2),
      this.createPlant(17, 2, PlantResourceType.URANIUM, 1),
      this.createPlant(18, 2, PlantResourceType.WIND),
      this.createPlant(19, 3, PlantResourceType.TRASH, 2),
      this.createPlant(20, 5, PlantResourceType.COAL, 3),
      this.createPlant(21, 4, PlantResourceType.HYBRID, 2),
      this.createPlant(22, 2, PlantResourceType.WIND),
      this.createPlant(23, 3, PlantResourceType.URANIUM, 1),
      this.createPlant(24, 4, PlantResourceType.TRASH, 2),
      this.createPlant(25, 5, PlantResourceType.COAL, 2),
      this.createPlant(26, 5, PlantResourceType.OIL, 2),
      this.createPlant(27, 3, PlantResourceType.WIND),
      this.createPlant(28, 4, PlantResourceType.URANIUM, 1),
      this.createPlant(29, 4, PlantResourceType.HYBRID, 1),
      this.createPlant(30, 6, PlantResourceType.TRASH, 3),
      this.createPlant(31, 6, PlantResourceType.COAL, 3),
      this.createPlant(32, 6, PlantResourceType.OIL, 3),
      this.createPlant(33, 4, PlantResourceType.WIND),
      this.createPlant(34, 5, PlantResourceType.URANIUM, 1),
      this.createPlant(35, 5, PlantResourceType.OIL, 1),
      this.createPlant(36, 7, PlantResourceType.COAL, 3),
      this.createPlant(37, 4, PlantResourceType.WIND),
      this.createPlant(38, 7, PlantResourceType.TRASH, 3),
      this.createPlant(39, 6, PlantResourceType.URANIUM, 1),
      this.createPlant(40, 6, PlantResourceType.OIL, 2),
      this.createPlant(42, 6, PlantResourceType.COAL, 2),
      this.createPlant(44, 5, PlantResourceType.WIND),
      this.createPlant(46, 7, PlantResourceType.HYBRID, 3),
      this.createPlant(50, 6, PlantResourceType.WIND)
    ];
  
    return queryRunner.manager.save(plants);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
