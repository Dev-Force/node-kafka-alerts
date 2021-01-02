import { ICommandHandler } from '../../domain/port-interfaces/command-handler.interface';
import { CommandHandler } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { SaveUserPayload } from '../../use-cases/save-user/save-user-payload';
import { SaveUserCommand } from '../../domain/commands/save-user-command';
import { inject, injectable } from 'inversify';
import { Types } from '../../types';

@injectable()
@CommandHandler(SaveUserCommand)
export class SaveUserCommandHandler
  implements ICommandHandler<SaveUserCommand> {
  constructor(
    @inject(Types.SaveUserUseCase)
    private saveUserUsecase: UseCaseExecutor<SaveUserPayload, Promise<void>>
  ) {}

  async handle(cmd: SaveUserCommand): Promise<void> {
    await this.saveUserUsecase.execute(cmd as SaveUserPayload);
  }
}
