import React from 'react';
// import { initialState } from './initial_state';

export function Admin() {
  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh',
    padding: 15
  };

  return (
    <>
      <div style={contentPane}>
        <h1>Administration Pane</h1>
        <p>This is where administrators monitor the application and control their minions!</p>
      </div>
    </>
  );
}
