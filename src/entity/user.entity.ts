import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from './base/entity-base';

@Entity()
export class User extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column()
  username: string;

  @Column()
  bio: string;

  @Column()
  image: string;
}
