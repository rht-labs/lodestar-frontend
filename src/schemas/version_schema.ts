export interface Version {
  versions: object,
}

export class Version {
  constructor({ versions, }: Version) {
    this.versions = versions
  }

  versions: object;

  static fromMap(map: { [key: string]: unknown }) {
    return new Version({
      versions: map as object,
    });
  }
}