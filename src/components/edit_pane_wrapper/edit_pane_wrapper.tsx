import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';

export interface EditPaneWrapperProps {
  children: any;
  engagement?: Engagement;
}

export function EditPaneWrapper(props: EditPaneWrapperProps) {
  return <>{props.children}</>;
}
