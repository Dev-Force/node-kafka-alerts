import { UserRow } from './user-row';

export interface UserDAO {
  getUserByUUID(uuid: string): Promise<UserRow>;
  saveUser(userRow: UserRow): Promise<void>;
}
