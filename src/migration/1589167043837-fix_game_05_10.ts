import {MigrationInterface, QueryRunner} from "typeorm";
import { Game } from "../entity/Game";
import { findGameById } from "../queries/findGameById";

export class fixGame05101589167043837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        try {
            const game = await findGameById(76, queryRunner.manager.getRepository);
            const jon = game.playerOrder.find(player => player.user.username === "jon");
    
            game.plantPhaseEvents = [];
            game.activePlayer = jon;
    
            await queryRunner.manager.save(game);
        } catch (e) {
            console.log("MIGRATION FAILURE CAUGHT", e);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}
