import React, { useState } from 'react';
import { useSession } from '../../context/auth_context/auth_context';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { UserProfile } from '../../schemas/user_profile';
import {
  useAnalytics,
  AnalyticsCategory,
} from '../../context/analytics_context/analytics_context';

export interface UserDropdownProps {}

export function UserDropdown(props: UserDropdownProps) {
  const authContext = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { logEvent } = useAnalytics();
  const dropdownItems = [
    <DropdownItem
      value="token"
      key="token"
      component={Link}
      onClick={() =>
        logEvent({
          action: 'See user token',
          category: AnalyticsCategory.profile,
        })
      }
      to="/app/whatsmytoken"
    >
      See User Token
    </DropdownItem>,
    <DropdownItem value="logOut" key="logout" component={Link} to="/logout">
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
            {UserProfile.getDisplayName(authContext?.sessionData?.profile)}
          </DropdownToggle>
        }
        isOpen={isOpen}
        onSelect={onSelect}
      />
    </div>
  );
}
