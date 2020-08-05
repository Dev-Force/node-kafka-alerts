interface Handler {
    handle: (cmd: object) => void
}

class RegisterVehicleCommand {

    public name: string;

}

class RegisterVehicleCommandHandler implements Handler {

    handle(cmd: RegisterVehicleCommand) {
        console.log(cmd.name);
    }

}

class Bus {

    private registryMap = {};

    register(commandClassName: string, commandHandler: Handler) {
        this.registryMap[commandClassName] = commandHandler;
    }

    dispatch(command): void {
        const commandHandler = this.registryMap[command.constructor.name];
        if (commandHandler == null) {
            throw new Error('no handler available');
        }

        commandHandler.handle(command);
    }

}

// INIT BUS
const commandBus = new Bus();
commandBus.register(RegisterVehicleCommand['name'], new RegisterVehicleCommandHandler());

// EXECUTE COMMAND
const cmd = new RegisterVehicleCommand();
cmd.name = 'this should be printed';
commandBus.dispatch(cmd);
