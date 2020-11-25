import { User } from '../models/user';

// TODO: this should be implemented by an interface adapter and not by infra layer.
export interface UserRepository {
  getUserByUUID(uuid: string): Promise<User>;
}
