import { EntityRepository, Repository } from 'typeorm';
import { UserFollow } from '../entity/user-follow.entity';

@EntityRepository(UserFollow)
export class UserFollowRepository extends Repository<UserFollow> {}
