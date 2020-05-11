import {MigrationInterface, QueryRunner} from "typeorm";
import { Game } from "../entity/Game";

export class fixGame05101589167043837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const game = await queryRunner.manager.getRepository(Game).findOne(76);
        const jon = game.playerOrder.find(player => player.id == 198);

        if (!game || !jon) {
            console.log("GAME NOT FOUND OR JON NOT FOUND");
            return;
        }

        game.plantPhaseEvents = [];
        game.activePlayer = jon;

        await queryRunner.manager.save(game);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
