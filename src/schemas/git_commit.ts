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
  static fromFake() {
    return {
      added: [],
      author_email: fakerStatic.internet.email(),
      author_name: fakerStatic.name.firstName(),
      authored_date: fakerStatic.date.recent(),
      committed_date: fakerStatic.date.recent(),
      committer_email: fakerStatic.internet.email(),
      committer_name: fakerStatic.name.firstName(),
      id: fakerStatic.random.uuid(),
      message: fakerStatic.lorem.sentence(),
      modified: [],
      removed: [],
      short_id: fakerStatic.random.uuid(),
      title: fakerStatic.company.catchPhrase(),
      web_url: fakerStatic.internet.url(),
    };
  }
  static staticFaked(): GitCommit {
    return {
      added: [],
      author_email: 'random-user@example.com',
      author_name: 'random-user@example.com',
      authored_date: new Date(2020, 1, 1),
      committed_date: new Date(2020, 1, 1),
      committer_email: 'random-user+gitlabbot@example.com',
      committer_name: 'Innovation Labs Bot',
      id: 'e169e7c04a9c180a7a75af124f0cbfc657fc47ae',
      message: '💓 engagement update by git-api 📂 ',
      modified: [],
      removed: [],
      short_id: 'e169e7c0',
      title: '💓 engagement update by git-api 📂 ',
      web_url:
        'https://gitlab.example.com/my-org/engagements/company/project/iac/-/commit/e169e7c04a9c180a7a75af124f0cbfc657fc47ae',
    };
  }
}
