import React from 'react';
// import { initialState } from './initial_state';

export function Dashboard() {
  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh',
    padding: 15
  };

  return (
    <>
      <div style={contentPane}>
        <h1>Dashboard</h1>
        <p>This is a super fancy dashboard where people mine data about all of the amazing engagements taking place in the Labs Universe.</p>
        <p><b>If you squint really hard, you can see it!!!</b></p>
        <p>Please make a selection from the nav menu (top of screen - house/list/lightning/cog - hold over to see tooltip)</p>
      </div>
    </>
  );
}
