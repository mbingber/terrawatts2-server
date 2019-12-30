import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum PlantResourceType {
  COAL = 'COAL',
  OIL = 'OIL',
  HYBRID = 'HYBRID',
  TRASH = 'TRASH',
  URANIUM = 'URANIUM',
  WIND = 'WIND'
}

@Entity()
export class Plant {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  rank: number;
  
  @Column()
  resourceType: PlantResourceType;
  
  @Column()
  resourceBurn: number;
  
  @Column()
  numCities: number;
  
}