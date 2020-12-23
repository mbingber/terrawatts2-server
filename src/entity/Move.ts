import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Game } from "./Game";

export enum ActionType {
  PUT_UP_PLANT = 'PUT_UP_PLANT',
  DISCARD_PLANT = 'DISCARD_PLANT',
  BID_ON_PLANT = 'BID_ON_PLANT',
  BUY_RESOURCES = 'BUY_RESOURCES',
  BUY_CITIES = 'BUY_CITIES',
  POWER_UP = 'POWER_UP'
}

export type Resources = {
  coal: number;
  oil: number;
  trash: number;
  uranium: number;
}

@Entity()
export class Move {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  actionType: ActionType;

  @Column({ nullable: true })
  plantId: string;

  @Column({ nullable: true, type: 'simple-array' })
  plantIds: string[];

  @Column({ nullable: true, type: 'simple-array' })
  cityIds: string[];

  @Column({ nullable: true })
  bid: number;

  @Column({ nullable: true, type: 'simple-json' })
  hybridChoice: { coal: number, oil: number };

  @Column({ nullable: true, type: 'simple-json' })
  resources: Resources;

  @Column({ nullable: true })
  cost: number;

  @ManyToOne(() => Game, game => game.moves)
  game: Game;

  @Column({ default: false })
  isDeleted: boolean;

  constructor(m: Partial<Move> = {}) {
    this.actionType = m.actionType;
    this.plantId = m.plantId;
    this.plantIds = m.plantIds;
    this.cityIds = m.cityIds;
    this.bid = m.bid;
    this.hybridChoice = m.hybridChoice;
    this.resources = m.resources;
    this.cost = m.cost;
  }
}
