import { User } from '../models/user';

export interface UserSaver {
  saveUser(user: User): Promise<void>;
}
