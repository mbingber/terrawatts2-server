import {MigrationInterface, QueryRunner} from "typeorm";
import { City } from "../entity/City";

export class mapleLeaf1590355155515 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const mapleLeaf = await queryRunner.manager.getRepository(City).findOne({
            where: {
                name: "Maple Leaf"
            }
        });

        mapleLeaf.lng = -122.3176;

        await queryRunner.manager.save(mapleLeaf);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
