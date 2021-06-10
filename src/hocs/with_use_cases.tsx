import React, { useEffect } from 'react';
import { useServiceProviders } from '../context/service_provider_context/service_provider_context';
import { useUseCases } from '../hooks/use_use_cases';
import { EngagementUseCase } from '../schemas/engagement';

type UseCaseComponent<P> = React.FunctionComponent<
  P & {
    useCases: EngagementUseCase[];
  }
>;

export function withUseCases<P>(
  WrappedComponent: UseCaseComponent<P>,
  fetcher: () => Promise<EngagementUseCase[]>
) {
  return <UseCaseFetcher fetcher={fetcher} component={WrappedComponent} />;
}

interface UseCaseFetcherProps<P> {
  component: UseCaseComponent<P>;
  fetcher: () => Promise<EngagementUseCase[]>;
}

const UseCaseFetcher = (props: UseCaseFetcherProps<any>) => {
  const { component: WrappedComponent } = props;
  const { useCaseService } = useServiceProviders();
  const [useCases, fetchUseCases] = useUseCases(props.fetcher);
  useEffect(() => {
    fetchUseCases();
  }, [useCaseService, fetchUseCases]);
  return <WrappedComponent {...props} useCases={useCases} />;
};
