import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToOne, RelationId } from 'typeorm';
import { PlantInstance } from './PlantInstance';
import { Player } from './Player';
import { Game } from './Game';

@Entity()
export class Auction {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Game)
  game: Game;

  @ManyToOne(() => PlantInstance, { cascade: true })
  plant: PlantInstance;

  @RelationId((auction: Auction) => auction.plant)
  plantInstanceId: number;

  @Column()
  bid: number;

  @ManyToOne(() => Player)
  leadingPlayer: Player;

  @RelationId((auction: Auction) => auction.leadingPlayer)
  leadingPlayerId: number;

  @ManyToOne(() => Player)
  activePlayer: Player;

  @RelationId((auction: Auction) => auction.activePlayer)
  activePlayerId: number;

  @ManyToMany(() => Player)
  @JoinTable()
  passedPlayers: Player[];

  @RelationId((auction: Auction) => auction.passedPlayers)
  passedPlayerIds: number[];

}
