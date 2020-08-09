import * as express from "express";
import { IDispatcher } from "../buses/dispatcher.interface";
import { ICommand } from "../../domain/commands/command.interface";
import { RegisterVehicleCommand } from "../../domain/commands/register-vehicle-command";
import * as bodyParser from "body-parser";

export class ExpressServer {
  private app: express.Application = express();

  constructor(private commandBus: IDispatcher<ICommand>) {
    this.commandBus = commandBus;
  }

  public configure(): void {
    this.app.use("/", express.static("/"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.post("/", (req, res) => {
      const { vin, color } = req.body;
      const registerVehicleCommand = new RegisterVehicleCommand(vin, color);

      try {
        this.commandBus.dispatch(registerVehicleCommand);
        res.send("command succeded!");
      } catch (err) {
        res.send(err.message);
      }
    });
  }

  public listen(): void {
    this.app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  }
}
