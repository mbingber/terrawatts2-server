import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Game } from './Game';
import { Player } from './Player';
import { PlantInstance } from './PlantInstance';

@Entity()
export class PlantPhaseEvent {
  
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, game => game.plantPhaseEvents)
  game: Game;

  @Column()
  turn: number;

  @ManyToOne(() => Player)
  player: Player;

  @ManyToOne(() => PlantInstance)
  plant: PlantInstance;

}