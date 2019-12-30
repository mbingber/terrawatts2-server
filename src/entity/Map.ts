import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { City } from './City';
import { Connection } from './Connection';

@Entity()
export class Map {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => City, city => city.map)
  cities: City[];

  @OneToMany(() => Connection, connection => connection.map)
  connections: Connection[];

}