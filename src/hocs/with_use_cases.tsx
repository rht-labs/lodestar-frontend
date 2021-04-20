import React, { useEffect } from 'react';
import { useServiceProviders } from '../context/service_provider_context/service_provider_context';
import { useUseCases } from '../hooks/use_use_cases';
import { EngagementUseCase } from '../schemas/engagement';

type UseCaseComponent<P> = React.FunctionComponent<
  P & {
    useCases: EngagementUseCase[];
  }
>;

export function withUseCases<P>(WrappedComponent: UseCaseComponent<P>) {
  return <UseCaseFetcher component={WrappedComponent} />;
}

interface UseCaseFetcherProps<P> {
  component: UseCaseComponent<P>;
}

const UseCaseFetcher = (props: UseCaseFetcherProps<any>) => {
  const { component: WrappedComponent } = props;
  const { useCaseService } = useServiceProviders();
  const [useCases, fetchUseCases] = useUseCases(useCaseService);
  useEffect(() => {
    fetchUseCases();
  }, [useCaseService, fetchUseCases]);
  return <WrappedComponent {...props} useCases={useCases} />;
};
