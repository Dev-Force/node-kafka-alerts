import { CommandHandler } from './command-handler.interface';
import { CommandHandlerFor } from './command-handler.decorator';
import { UseCaseExecutor } from '../../use-cases/use-case-executor.interface';
import { SaveUserPayload } from '../../use-cases/save-user/save-user-payload';
import { SaveUserCommand } from '../../domain/commands/save-user-command';
import { inject, injectable } from 'inversify';
import { Types } from '../../types';

@injectable()
@CommandHandlerFor(SaveUserCommand)
export class SaveUserCommandHandler implements CommandHandler<SaveUserCommand> {
  constructor(
    @inject(Types.SaveUserUseCase)
    private saveUserUsecase: UseCaseExecutor<SaveUserPayload, Promise<void>>
  ) {}

  async handle(cmd: SaveUserCommand): Promise<void> {
    await this.saveUserUsecase.execute(cmd as SaveUserPayload);
  }
}
