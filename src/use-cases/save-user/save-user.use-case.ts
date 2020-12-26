import { UseCaseExecutor } from '../use-case-executor.interface';
import { User } from '../../domain/models/user';
import { SaveUserPayload } from './save-user-payload';
import { UserSaver } from '../../domain/port-interfaces/user-saver.interface';

export class SaveUserUseCase
  implements UseCaseExecutor<SaveUserPayload, Promise<void>> {
  constructor(private userSaver: UserSaver) {}

  async execute(saveUserPayload: SaveUserPayload): Promise<void> {
    const { uuid, email, phone } = saveUserPayload;

    await this.userSaver.saveUser(new User(uuid, email, phone));
  }
}