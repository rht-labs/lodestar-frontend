import { Serializer } from '../serializer';
import { parseISO } from 'date-fns';
import { GitCommit } from '../../schemas/git_commit';

export class GitCommitJsonSerializer implements Serializer<GitCommit, object> {
  serialize(gitCommit: GitCommit): object {
    return gitCommit;
  }
  deserialize(data: object): GitCommit {
    return {
      ...(data as GitCommit),
      authored_date: parseISO(data['authored_date']),
      committed_date: parseISO(data['committed_date']),
    };
  }
}
