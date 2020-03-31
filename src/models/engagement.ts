export interface Engagement {
  name: string;
}
export class Engagement {
  constructor({ name }: Engagement) {
    this.name = name;
  }
  name: string;
}
