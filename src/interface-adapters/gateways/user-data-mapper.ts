import { User } from '../../domain/models/user';
import { UserFetcher } from '../../domain/port-interfaces/user-fetcher.interface';
import { UserDAO } from './user-dao.interface';
import { UserRow } from './user-row';

export class UserDataMapper implements UserFetcher {
  constructor(private userDAO: UserDAO) {
    this.userDAO = userDAO;
  }

  public async getUserByUUID(uuid: string): Promise<User> {
    return this.toDomainUser(await this.userDAO.getUserByUUID(uuid));
  }

  private toDomainUser(userRow: UserRow): User {
    const { uuid, email, phone } = userRow;
    return new User(uuid, email, phone);
  }
}
