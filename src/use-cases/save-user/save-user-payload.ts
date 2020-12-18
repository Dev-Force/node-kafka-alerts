export class SaveUserPayload {
  constructor(
    public uuid: string,
    public email: string,
    public phone: string
  ) {}
}
