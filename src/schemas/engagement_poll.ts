export class EngagementPoll {
  constructor(pollStrategy: EngagementPollStrategy) {
    this.pollStrategy = pollStrategy;
  }
  private pollStrategy: EngagementPollStrategy;
  public cancel() {
    this.pollStrategy.cancel();
  }
}

export interface EngagementPollStrategy {
  cancel: () => void;
}

export class EngagementPollIntervalStrategy implements EngagementPollStrategy {
  constructor(interval: NodeJS.Timer) {
    this.interval = interval;
  }
  private interval: NodeJS.Timer;
  public cancel() {
    clearTimeout(this.interval);
  }
}

export class EngagementPollWebsocketStrategy implements EngagementPollStrategy {
  constructor(socket: any) {
    this.socket = socket;
  }
  private socket;
  public cancel() {}
}
