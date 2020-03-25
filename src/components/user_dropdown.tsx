import React, { useContext } from 'react';
import { SessionContext } from '../context/session_context';
export interface UserDropdown {}
export function UserDropdown(props: UserDropdown) {
  const sessionContext = useContext(SessionContext);
  return (
    <div style={{ width: 'auto', height: 50, backgroundColor: 'red' }}>
      {sessionContext.profile?.email}
    </div>
  );
}
