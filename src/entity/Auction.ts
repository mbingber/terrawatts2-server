import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { PlantInstance } from './PlantInstance';
import { Player } from './Player';
import { Game } from './Game';

@Entity()
export class Auction {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Game)
  game: Game;

  @ManyToOne(() => PlantInstance)
  plant: PlantInstance;

  @Column()
  bid: number;

  @ManyToOne(() => Player)
  leadingPlayer: Player;

  @ManyToOne(() => Player)
  activePlayer: Player;

  @ManyToMany(() => Player)
  @JoinTable()
  passedPlayers: Player[];

}
