import {MigrationInterface, QueryRunner} from "typeorm";
import { City } from "../entity/City";

export class changePhoenixLocation1585504915668 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    const phoenix = await queryRunner
      .manager
      .getRepository(City)
      .findOne({
          where: { name: "Phoenix" }
      });

    phoenix.lat = 33.4;
    phoenix.lng = -112;

    return queryRunner.manager.save(phoenix);
    
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
  }

}
