import { Entity, ManyToOne } from 'typeorm';
import { EntityBase } from './base/entity-base';
import { User } from './user.entity';

@Entity()
export class UserFollow extends EntityBase {
  @ManyToOne(() => User, { primary: true })
  follower: User;

  @ManyToOne(() => User, { primary: true })
  followee: User;
}
