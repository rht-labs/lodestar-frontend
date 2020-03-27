import React, { useContext, useState } from 'react';
import { SessionContext } from '../context/session_context';
import { Dropdown, DropdownToggle, DropdownItem } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
export interface UserDropdown {}
export function UserDropdown(props: UserDropdown) {
  const sessionContext = useContext(SessionContext);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownItems = [
    <DropdownItem value="logOut" key="logout">
      <Link to="/logout">Log Out</Link>
    </DropdownItem>,
  ];

  const onSelect = (_: React.SyntheticEvent<HTMLDivElement>) => {
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
            Hello, {sessionContext.profile?.displayName}
          </DropdownToggle>
        }
        isOpen={isOpen}
        onSelect={onSelect}
      ></Dropdown>
    </div>
  );
}
