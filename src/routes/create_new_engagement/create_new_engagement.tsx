import React from 'react';
import { CreateEngagementModal } from './create_engagement_modal';
import { useHistory } from 'react-router';
import { EngagementDetailView } from '../engagement_details';

export function CreateNewEngagement(props) {
  const history = useHistory();
  const handleModalClose = (customerName, projectName) => {
    if (customerName && projectName) {
      history.push(`/app/engagements/${customerName}/${projectName}`);
    } else {
      history.push('/app/engagements');
    }
  };
  return (
    <div>
      <CreateEngagementModal onRequestClose={handleModalClose} isOpen={true} />
      <EngagementDetailView />
    </div>
  );
}
