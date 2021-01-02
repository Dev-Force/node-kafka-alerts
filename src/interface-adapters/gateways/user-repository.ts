import { inject, injectable } from 'inversify';
import { User } from '../../domain/models/user';
import { UserFetcher } from '../../domain/port-interfaces/user-fetcher.interface';
import { UserSaver } from '../../domain/port-interfaces/user-saver.interface';
import { Types } from '../../types';
import { DALMapper } from '../mappers/dal-mapper.interface';
import { UserDAO } from './user-dao.interface';
import { UserRow } from './user-row';

@injectable()
export class UserRepository implements UserSaver, UserFetcher {
  constructor(
    @inject(Types.UserDAO) private userDAO: UserDAO,
    @inject(Types.DALUserMapper) private userMapper: DALMapper<User, UserRow>
  ) {}

  public async getUserByUUID(uuid: string): Promise<User> {
    return this.userMapper.fromDALEntityToDomain(
      await this.userDAO.getUserByUUID(uuid)
    );
  }

  public async saveUser(user: User): Promise<void> {
    await this.userDAO.saveUser(this.userMapper.fromDomainToDALEntity(user));
  }
}
