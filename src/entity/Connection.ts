import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Map } from './Map';
import { City } from './City';

@Entity()
export class Connection {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cost: number;

  @ManyToOne(() => Map, map => map.connections)
  map: Map;

  @ManyToMany(() => City)
  @JoinTable()
  cities: City[];
  
}
