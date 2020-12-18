export const UserAggregateType = 'USER';

export class User {
  constructor(
    public uuid: string,
    public email: string,
    public phone: string
  ) {}
}
