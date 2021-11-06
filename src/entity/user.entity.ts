import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntityBase } from './base/entity-base';

@Entity()
export class User extends EntityBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  username: string;

  @Column()
  bio: string;

  @Column()
  image: string;

  constructor(user: UserProperty) {
    super();
    Object.assign(this, user);
  }
}

type UserProperty = Pick<User, 'email' | 'password' | 'username'>;
