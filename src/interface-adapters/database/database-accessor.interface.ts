import { User } from '../../domain/models/user';
import { UserRow } from './user-row';

export interface DatabaseAccessor {
  buildUser(userRow: UserRow): User;
}
