import * as express from 'express';
import { CommandDispatcher } from '../../domain/port-interfaces/command-dispatcher.interface';
import { CommandMarker } from '../../interface-adapters/commands/command-marker.interface';
import * as bodyParser from 'body-parser';

export class ExpressServer {
  private app: express.Application;

  constructor(private commandBus: CommandDispatcher<CommandMarker>) {
    this.commandBus = commandBus;
    this.app = express();
  }

  public init(): void {
    this.configure();
    this.registerRoutes();
    this.listen();
  }

  public registerRoutes(): void {
    // this.app.post('/send-email', async (req, res) => {
    //   const { from, to, subject, isHTML, template, payload } = req.body;
    //   const sendInstantEmailCommand = new SendInstantNotificationCommand(
    //     from,
    //     to,
    //     subject,
    //     isHTML,
    //     template,
    //     payload
    //   );
    //   try {
    //     await this.commandBus.dispatch(sendInstantEmailCommand).then(() => {
    //       res.send('command succeded!');
    //     });
    //   } catch (err) {
    //     res.send(err.message);
    //   }
    // });
  }

  public configure(): void {
    this.app.use('/', express.static('/'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
  }

  public listen(): void {
    this.app.listen(3000, () => {
      // console.log('Server listening on port 3000');
    });
  }
}
