import React, { useEffect } from 'react';

import { EnabledUsers } from '../schemas/engagement';
import { useEnabledUsers } from '../hooks/use_enabled_users';
import { useServiceProviders } from '../context/service_provider_context/service_provider_context';

type EnabledUsersComponent<P> = React.FunctionComponent<
  P & {
    enabledUsers: EnabledUsers[];
  }
>;

export function withEnabledUsers<P>(
  WrappedComponent: EnabledUsersComponent<P>,
  fetcher: () => Promise<EnabledUsers[]>
) {
  return <EnabledUsersFetcher fetcher={fetcher} component={WrappedComponent} />;
}

interface EnabledUsersFetcherProps<P> {
  component: EnabledUsersComponent<P>;
  fetcher: () => Promise<EnabledUsers[]>;
}

const EnabledUsersFetcher = (props: EnabledUsersFetcherProps<any>) => {
  const { component: WrappedComponent } = props;
  const { enabledUsersService } = useServiceProviders();
  const [enabledUsers, fetchEnabledUsers] = useEnabledUsers(props.fetcher);
  useEffect(() => {
    fetchEnabledUsers();
  }, [enabledUsersService, fetchEnabledUsers]);
  return <WrappedComponent {...props} enabledUsers={enabledUsers} />;
};

