import React, { useContext, useState, useEffect } from 'react';
import {
  Nav,
  NavItem,
  NavList,
  Modal,
  Button,
  Form,
  FormGroup,
  TextInput,
} from '@patternfly/react-core';

import { EngagementContext } from '../context/engagement_context';

function _EngagementNav() {
  const columnHeaderStyle: React.CSSProperties = {
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottom: '1px solid #AFBAC4',
    backgroundColor: '#EDEDED',
    fontWeight: 'bold',
  };

  // set style .pf-c-nav__link:active::after to width 75%

  const navSub: React.CSSProperties = {
    fontSize: 12,
  };

  const navColumnStyle: React.CSSProperties = {
    overflow: 'scroll',
    height: '100%',
  };

  const navDisplay: React.CSSProperties = {
    display: 'block',
  };

  const newInstruct: React.CSSProperties = {
    marginBottom: 30,
  };

  const newEngagementButton: React.CSSProperties = {
    position: 'absolute',
    top: 8,
    right: 5,
    backgroundColor: '#0066cc',
    width: 25,
    height: 25,
    paddingLeft: 7,
    paddingTop: 1,
    color: '#ffffff',
    borderRadius: 4,
  };

  const engagementContext = useContext(EngagementContext);

  const [hasFetchedEngagements, setHasFetchedEngagements] = useState<boolean>(
    false
  );

  const [customer_name, setCustomerName] = useState<string>('');
  const [project_name, setProjectName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const onNavSelect = result => {
    engagementContext.setActiveEngagement(
      engagementContext.engagements[result.itemId]
    );
  };

  const isSameEngagement = (engagementA, engagementB) => {
    return (
      engagementA &&
      engagementB &&
      engagementA.project_name === engagementB.project_name &&
      engagementA.customer_name === engagementB.customer_name
    );
  };

  useEffect(() => {
    if (!hasFetchedEngagements) {
      setHasFetchedEngagements(true);
      engagementContext.getEngagements();
    }
  }, [engagementContext, hasFetchedEngagements]);

  const navItems = engagementContext.engagements
    .sort(function(a, b) {
      var textA = a.customer_name.toUpperCase();
      var textB = b.customer_name.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    })
    .map((engagement, index) => {
      return (
        <NavItem
          style={navDisplay}
          key={index}
          itemId={index}
          isActive={isSameEngagement(
            engagement,
            engagementContext.activeEngagement
          )}
        >
          <div>{engagement.project_name}</div>
          <span style={navSub}>{engagement.customer_name}</span>
        </NavItem>
      );
    });

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const createNewEngagement = () => {
    engagementContext.createEngagement({ customer_name, project_name });
    handleModalToggle();
  };

  return (
    <Nav style={navColumnStyle} onSelect={onNavSelect}>
      <div style={columnHeaderStyle}>ENGAGEMENTS</div>
      <button onClick={handleModalToggle} style={newEngagementButton}>
        +
      </button>
      <Modal
        width={'50%'}
        title="Create New Engagement"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="primary" onClick={createNewEngagement}>
            Submit
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>,
        ]}
        isFooterLeftAligned
      >
        <div style={newInstruct}>
          To create a new Engagement, please enter a client and product name
          then click submit.
        </div>
        <Form isHorizontal>
          <FormGroup
            label="Customer Name"
            fieldId="customer-name"
            helperText="What client is this for?"
            isRequired
          >
            <TextInput
              type="text"
              id="customer_name"
              name="customer_name"
              placeholder="e.g. NASA"
              value={customer_name || ''}
              onChange={setCustomerName}
            />
          </FormGroup>
          <FormGroup
            label="Project Name"
            fieldId="project-name"
            helperText="The name of the solution being worked on."
            isRequired
          >
            <TextInput
              type="text"
              id="project_name"
              name="project_name"
              placeholder="e.g. Mars Probe"
              value={project_name || ''}
              onChange={setProjectName}
            />
          </FormGroup>
        </Form>
      </Modal>
      <NavList>{navItems}</NavList>
    </Nav>
  );
}

export const EngagementNav = React.memo(_EngagementNav);
