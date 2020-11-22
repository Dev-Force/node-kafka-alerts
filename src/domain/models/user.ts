export class User {
  constructor(public uuid: string, public email: string, public phone: string) {
    this.uuid = uuid;
    this.email = email;
    this.phone = phone;
  }
}
