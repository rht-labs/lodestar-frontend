import React from 'react';
import { EngagementViewProps } from '.';
import { Loading } from './Loading';

interface EngagementTabViewProps extends EngagementViewProps {}

export function EngagementTabView({ engagement }: EngagementTabViewProps) {
  if (!engagement) {
    return <Loading />;
  }
  return <div>{engagement?.project_name}</div>;
}
