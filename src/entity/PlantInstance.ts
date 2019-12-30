import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Plant } from './Plant';
import { Game } from './Game';
import { Player } from './Player';

export enum PlantStatus {
  REMOVED_BEFORE_START = 'REMOVED_BEFORE_START',
  DECK = 'DECK',
  MARKET = 'MARKET',
  DISCARDED = 'DISCARDED',
  ERA_THREE = 'ERA_THREE',
  OWNED = 'OWNED'
}

@Entity()
@Unique(['game', 'plant'])
export class PlantInstance {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, game => game.plants)
  game: Game;

  @ManyToOne(() => Player, player => player.plants)
  player: Player;

  @ManyToOne(() => Plant)
  plant: Plant;

  @Column()
  status: PlantStatus;

}
