import { CommandMarker } from './command-marker.interface';

export class SaveUserCommand implements CommandMarker {
  constructor(
    public uuid: string,
    public email: string,
    public phone: string
  ) {}
}
