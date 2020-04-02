import faker from 'faker';

export interface Engagement {
  name: string;
}
export class Engagement {
  constructor({ name }: Engagement) {
    this.name = name;
  }
  name: string;

  static fromFake() {
    return new Engagement({
      name: faker.company.companyName(),
    });
  }
}
