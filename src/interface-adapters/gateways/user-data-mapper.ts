import { User } from '../../domain/models/user';
import { UserFetcher } from '../../domain/port-interfaces/user-fetcher.interface';
import { UserSaver } from '../../domain/port-interfaces/user-saver.interface';
import { UserDAO } from './user-dao.interface';
import { UserRow } from './user-row';

export class UserDataMapper implements UserSaver, UserFetcher {
  constructor(private userDAO: UserDAO) {}

  public async getUserByUUID(uuid: string): Promise<User> {
    return this.toDomainUser(await this.userDAO.getUserByUUID(uuid));
  }

  public async saveUser(userRow: UserRow): Promise<void> {
    await this.userDAO.saveUser(userRow);
  }

  private toDomainUser(userRow: UserRow): User {
    const { uuid, email, phone } = userRow;
    return new User(uuid, email, phone);
  }
}
