import faker from 'faker';
export interface GitCommit {
  added: any[];
  author_email: string;
  author_name: string;
  authored_date: Date;
  committed_date: Date;
  committer_email: string;
  committer_name: string;
  id: string;
  message: string;
  modified: any[];
  removed: any[];
  short_id: string;
  title: string;
  web_url: string;
}

export abstract class GitCommit {
  static fromFake(useStatic = false) {
    return {
      added: [],
      author_email: useStatic
        ? 'random-user@example.com'
        : faker.internet.email(),
      author_name: useStatic
        ? 'random-user@example.com'
        : faker.name.firstName(),
      authored_date: useStatic ? new Date(2020, 1, 1) : faker.date.recent(),
      committed_date: useStatic ? new Date(2020, 1, 1) : faker.date.recent(),
      committer_email: useStatic
        ? 'random-user@example.com'
        : faker.internet.email(),
      committer_name: useStatic
        ? 'random-user@example.com'
        : faker.name.firstName(),
      id: useStatic ? '1' : faker.random.uuid(),
      message: useStatic ? 'A commit message' : faker.lorem.sentence(),
      modified: [],
      removed: [],
      short_id: useStatic ? '2' : faker.random.uuid(),
      title: useStatic
        ? '💓 engagement update by git-api 📂 '
        : faker.company.catchPhrase(),
      web_url: useStatic
        ? 'https://gitlab.example.com/my-org/engagements/company/project/iac/-/commit/e169e7c04a9c180a7a75af124f0cbfc657fc47ae'
        : faker.internet.url(),
    };
  }
}
