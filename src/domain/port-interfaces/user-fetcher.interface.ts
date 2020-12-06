import { User } from '../models/user';

export interface UserFetcher {
  getUserByUUID(uuid: string): Promise<User>;
}
