import { injectable } from 'inversify';
import { User } from '../../domain/models/user';
import { UserRow } from '../gateways/user-row';
import { DALMapper } from './dal-mapper.interface';

@injectable()
export class UserMapper implements DALMapper<User, UserRow> {
  public fromDomainToDALEntity(user: User): UserRow {
    const { uuid, email, phone } = user;

    const userRow = new UserRow();
    userRow.uuid = uuid;
    userRow.email = email;
    userRow.phone = phone;

    return userRow;
  }

  public fromDALEntityToDomain(userRow: UserRow): User {
    const { uuid, email, phone } = userRow;
    return new User(uuid, email, phone);
  }
}
