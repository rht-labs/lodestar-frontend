import React from 'react';

export function DisplayCreatedByName({userFromServer, lastUpdatedBy}: {userFromServer?: string, lastUpdatedBy?: string }) {
  return (
    <>
      { !!userFromServer
        ? userFromServer
        : lastUpdatedBy }
    </>
  )
}