export class Message {
  constructor(
    public id: number,
    public sender: string,
    public subject: string,
    public msgText: string
  ) {}
}
