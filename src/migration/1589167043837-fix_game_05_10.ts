import {MigrationInterface, QueryRunner} from "typeorm";
import { Game } from "../entity/Game";

export class fixGame05101589167043837 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        try {
            const game = await queryRunner.manager.getRepository(Game).findOne(76);
            const jon = game.playerOrder.find(player => player.id == 198);
    
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
