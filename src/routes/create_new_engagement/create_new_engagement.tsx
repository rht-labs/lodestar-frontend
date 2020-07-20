import React from 'react';
import { CreateEngagementModal } from './create_engagement_modal';
import { useHistory } from 'react-router';
import { EngagementDetailViewContainer } from '../engagement_details/engagement_details';
import { ValidationProvider } from '../../context/validation_context/validation_context';
import { getValidatorsFromFormOptions } from '../../common/config_validator_adapter';
import { useEngagements } from '../../context/engagement_context/engagement_hook';

export function CreateNewEngagement(props) {
  const history = useHistory();
  const handleModalClose = (customerName, projectName) => {
    if (customerName && projectName) {
      history.push(`/app/engagements/${customerName}/${projectName}`);
    } else {
      history.push('/app/engagements');
    }
  };

  const { formOptions } = useEngagements();

  return (
    <div>
      <ValidationProvider
        validators={getValidatorsFromFormOptions(formOptions)}
      >
        <CreateEngagementModal
          onRequestClose={handleModalClose}
          isOpen={true}
        />
      </ValidationProvider>
      <EngagementDetailViewContainer />
    </div>
  );
}
