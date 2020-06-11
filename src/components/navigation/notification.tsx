import React, {useState} from 'react';
import {Dropdown, DropdownItem, NotificationBadge, DropdownToggle, DropdownGroup, DropdownSeparator} from '@patternfly/react-core';
import {BellIcon} from '@patternfly/react-icons';

export interface NotificationProps {
}

export function Notification(props: NotificationProps) {

  const [isRead, setRead] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setRead(true);
  };
  const onToggle = () => {
    setIsOpen(!isOpen);
  };

  const dropdownItems = [
    <DropdownItem key="link">Unread notification </DropdownItem>,
    <DropdownItem key="action" component="button">
      Unread notification 2
    </DropdownItem>,
    <DropdownSeparator key="separator" />,
    <DropdownItem key="disabled link" isDisabled>
      Read notification
    </DropdownItem>,
    <DropdownItem key="disabled action" isDisabled component="button">
      Read notification
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
          <DropdownToggle onToggle={onToggle} toggleIndicator={() => <div></div>}>
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
