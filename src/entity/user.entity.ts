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

  static forCreateUser(
    property: Pick<User, 'email' | 'password' | 'username'>,
  ): User {
    const user = new User();
    user.email = property.email;
    user.password = property.password;
    user.username = property.username;
    return user;
  }

  static forId(property: Pick<User, 'id'>): User {
    const user = new User();
    user.id = property.id;
    return user;
  }
}
