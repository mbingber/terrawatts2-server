import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, Unique, RelationId } from 'typeorm';
import { Game } from './Game';
import { City } from './City';
import { Player } from './Player';

@Entity()
@Unique(['game', 'city'])
export class CityInstance {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, game => game.cities)
  game: Game;

  @ManyToOne(() => City)
  city: City;

  @RelationId((cityInstance: CityInstance) => cityInstance.city)
  cityId: number;

  @ManyToMany(() => Player)
  @JoinTable()
  players: Player[];

  @RelationId((cityInstance: CityInstance) => cityInstance.players)
  playerIds: number[];

}
