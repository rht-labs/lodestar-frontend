import { Serializer } from '../serializer';
import {
  ClusterStatus,
  HealthStatus,
  ClusterState,
} from '../../schemas/cluster_status';
import { SystemMessage, Severity } from '../../schemas/system_message';
import { Subsystem } from '../../schemas/subsystem';
import parseISO from 'date-fns/parseISO';

export class ClusterStatusJsonSerializer
  implements Serializer<ClusterStatus, object> {
  serialize(clusterStatus: ClusterStatus): object {
    return clusterStatus;
  }
  deserialize(data: object): ClusterStatus {
    if (!data) {
      return undefined;
    }
    return {
      ...(data as ClusterStatus),
      overall_status: data['overall_status']
        ? HealthStatus[HealthStatus[data['overall_status']]]
        : undefined,
      messages: (data['messages'] ?? []).map(message =>
        this.parseSystemMessage(message)
      ),
      subsystems: (data['subsystems'] ?? []).map(subsystem =>
        this.parseSubsystem(subsystem)
      ),
    };
  }
  private parseSystemMessage(data): SystemMessage {
    if (!data) {
      return undefined;
    }
    return {
      ...(data as SystemMessage),
      severity: Severity.info,
      updated: parseISO(data['updated']),
    } as SystemMessage;
  }
  private parseSubsystem(data): Subsystem {
    if (!data) {
      return undefined;
    }
    return {
      ...(data as Subsystem),
      status: HealthStatus[HealthStatus[data['status']]],
      state: ClusterState[ClusterState[data['state']]],
      updated: parseISO(data['updated']),
      messages: (data['messages'] ?? []).map(message =>
        this.parseSystemMessage(message)
      ),
    };
  }
}
