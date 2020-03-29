import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User, Color } from './User';
import { PlantInstance } from './PlantInstance';
import { Game } from './Game';
import { Resources } from './Resources';

@Entity()
export class Player {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game, game => game.playerOrder)
  game: Game;

  @Column()
  clockwiseOrder: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  color: Color;

  @Column({ default: 50 })
  money: number;

  @OneToMany(() => PlantInstance, plantInstance => plantInstance.player)
  plants: PlantInstance[];

  @Column(() => Resources)
  resources: Resources;

  @Column({ default: 0 })
  turnOrder: number;

  @Column({ default: 0 })
  numPowered: number;

}
