import React, { useState } from 'react';
import { useSession } from '../../context/auth_context/auth_context';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { Link } from 'react-router-dom';

export interface UserDropdown {}

export function UserDropdown(props: UserDropdown) {
  const authContext = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownItems = [
    <DropdownItem value="logOut" key="logout" component={Link} to="/Logout">
      Log Out
    </DropdownItem>,
  ];

  const onSelect = (_?: React.SyntheticEvent<HTMLDivElement>) => {
    setIsOpen(false);
  };

  return (
    <div
      style={{
        width: 'auto',
        height: 50,
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Dropdown
        isPlain={true}
        dropdownItems={dropdownItems}
        toggle={
          <DropdownToggle onToggle={() => setIsOpen(!isOpen)}>
            {authContext?.sessionData?.profile?.displayName}
          </DropdownToggle>
        }
        isOpen={isOpen}
        onSelect={onSelect}
      />
    </div>
  );
}
