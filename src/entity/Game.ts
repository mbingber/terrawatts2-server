import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { Player } from './Player';
import { PlantInstance } from './PlantInstance';
import { CityInstance } from './CityInstance';
import { Resources } from './Resources';
import { PlantPhaseEvent } from './PlantPhaseEvent';
import { Auction } from './Auction';
import { Map } from './Map';

export enum Phase {
  PLANT = 'PLANT',
  RESOURCE = 'RESOURCE',
  CITY = 'CITY',
  POWER = 'POWER'
}

export enum ActionType {
  PUT_UP_PLANT = 'PUT_UP_PLANT',
  DISCARD_PLANT = 'DISCARD_PLANT',
  BID_ON_PLANT = 'BID_ON_PLANT',
  BUY_RESOURCES = 'BUY_RESOURCES',
  BUY_CITIES = 'BUY_CITIES',
  POWER_UP = 'POWER_UP'
}

@Entity()
export class Game {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "" })
  name: string;

  @Column('simple-array')
  regions: number[];

  @Column()
  turn: number;

  @Column()
  era: number;

  @Column()
  phase: Phase;

  @Column({ default: ActionType.PUT_UP_PLANT })
  actionType: ActionType;

  @Column(() => Resources)
  resourceMarket: Resources;

  @ManyToOne(() => Map)
  map: Map; // mapName

  @OneToMany(() => Player, player => player.game, { cascade: true })
  playerOrder: Player[]; // TODO

  @OneToOne(() => Player, { cascade: true })
  @JoinColumn()
  activePlayer: Player; // N/A

  @RelationId((game: Game) => game.activePlayer)
  activePlayerId: number;

  @OneToMany(() => PlantInstance, plantInstance => plantInstance.game, { cascade: true })
  plants: PlantInstance[];

  @OneToMany(() => CityInstance, cityInstance => cityInstance.game, { cascade: true })
  cities: CityInstance[];

  @OneToMany(() => PlantPhaseEvent, event => event.game, { cascade: true })
  plantPhaseEvents: PlantPhaseEvent[];

  @Column({ default: 0 })
  plantRankBought: number;

  @OneToOne(() => Auction, { cascade: true })
  @JoinColumn()
  auction: Auction;

  @Column({ default: 1 })
  version: number;

}
