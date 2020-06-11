import React, {useState} from 'react';
import {Alert, Dropdown, DropdownItem, DropdownToggle, NotificationBadge} from '@patternfly/react-core';
import {BellIcon} from '@patternfly/react-icons';

export interface NotificationProps {
}

export function Notification(props: NotificationProps) {

  const [isRead, setRead] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setRead(true);
  };

  const dropdownItems = [
    <DropdownItem value="notification" key="notification">
      <Alert
        aria-live="assertive"
        aria-relevant="additions text"
        aria-atomic="true"
        variant="info"
        title="Test Notification">
        Test Notification
      </Alert>
    </DropdownItem>,
  ];

  const onSelect = (_?: React.SyntheticEvent<HTMLDivElement>) => {
    setIsOpen(false);
  };

  return (
    <>
      <Dropdown
        isPlain
        dropdownItems={dropdownItems}
        toggle={
          <DropdownToggle onToggle={() => setIsOpen(!isOpen)} toggleIndicator={null}>
            <NotificationBadge isRead={isRead} onClick={onClick} aria-label="Notifications">
              <BellIcon/>
            </NotificationBadge>
          </DropdownToggle>
        }
        isOpen={isOpen}
        onSelect={onSelect}
      />
    </>
  );
}
