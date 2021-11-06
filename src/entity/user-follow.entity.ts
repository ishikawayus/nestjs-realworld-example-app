import { Entity, ManyToOne } from 'typeorm';
import { EntityBase } from './base/entity-base';
import { User } from './user.entity';

@Entity()
export class UserFollow extends EntityBase {
  @ManyToOne(() => User, { primary: true })
  follower: User;

  @ManyToOne(() => User, { primary: true })
  followee: User;

  static forNew(property: {
    follower: Pick<User, 'id'>;
    followee: Pick<User, 'id'>;
  }): UserFollow {
    const userFollow = new UserFollow();
    userFollow.follower = User.forId(property.follower);
    userFollow.followee = User.forId(property.followee);
    return userFollow;
  }
}
