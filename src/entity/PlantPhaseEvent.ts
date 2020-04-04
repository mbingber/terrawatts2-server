import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, RelationId } from 'typeorm';
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

  @RelationId((event: PlantPhaseEvent) => event.player)
  playerId: number;

  @ManyToOne(() => PlantInstance)
  plant: PlantInstance;

  @RelationId((event: PlantPhaseEvent) => event.plant)
  plantInstanceId: number;

}