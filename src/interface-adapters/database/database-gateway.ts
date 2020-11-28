import { User } from '../../domain/models/user';
import { DatabaseAccessor } from './database-accessor.interface';
import { UserRow } from './user-row';

export class DatabaseGateway implements DatabaseAccessor {
  public buildUser(userRow: UserRow): User {
    const { uuid, email, phone } = userRow;
    return new User(uuid, email, phone);
  }
}
