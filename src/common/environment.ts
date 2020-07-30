export class Environment {
  public getValue(key: string) {
    return process.env[key];
  }
}
