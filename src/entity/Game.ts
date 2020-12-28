import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne, RelationId, ManyToMany, JoinTable } from 'typeorm';
import { Map } from './Map';
import { User } from './User';
import { Move } from './Move';

@Entity()
export class Game {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: "" })
  name: string;

  // this is saved as a string[], but is converted to a number[] in findGameById
  @Column('simple-array')
  regions: number[];

  @ManyToOne(() => Map)
  map: Map;

  @Column()
  randomSeed: string;

  @ManyToMany(() => User)
  @JoinTable()
  users: User[];

  @Column({ default: "" })
  codeVersion: string;

  @OneToMany(() => Move, move => move.game)
  moves: Move[];
}
