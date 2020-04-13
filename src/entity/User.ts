import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

export enum Color {
  BLUE = 'BLUE',
  RED = 'RED',
  YELLOW = 'YELLOW',
  GREEN = 'GREEN',
  PURPLE = 'PURPLE',
  BLACK = 'BLACK'
}

@Entity({ name: 'grid_users' })
@Unique(['username'])
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ default: "" })
  password: string;

  @Column({ nullable: true })
  preferredColor: Color;

  @Column({ default: true })
  we: boolean;

}
