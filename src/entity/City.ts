import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Map } from './Map';

@Entity()
export class City {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  // originalLat and originalLng are not saved until a change is made
  @Column({ type: 'float', nullable: true })
  originalLat: number;

  @Column({ type: 'float', nullable: true })
  originalLng: number;

  @Column()
  region: number;

  @ManyToOne(() => Map, map => map.cities)
  map: Map;

}
