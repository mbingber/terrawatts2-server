import { Column } from 'typeorm';

export class Resources {

  @Column()
  coal: number;

  @Column()
  oil: number;

  @Column()
  trash: number;

  @Column()
  uranium: number;

}