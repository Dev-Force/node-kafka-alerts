import { ICommand } from "./command.interface";

export class RegisterVehicleCommand implements ICommand {
  constructor(public vin: string, public color: string) {
    this.vin = vin;
    this.color = color;
  }
}
