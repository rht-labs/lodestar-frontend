import React, { useContext } from 'react';
import { FeedbackContext } from '../../context/feedback_context';

export function Dashboard() {
  const feedbackContext = useContext(FeedbackContext);
  
  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh',
    padding: 15
  };

  feedbackContext.hideLoader();


  return (
    <>
      <div style={contentPane}>
        <h1>Dashboard</h1>
        <p>This is a super fancy dashboard where people mine data about all of the amazing engagements taking place in the Labs Universe.</p>
        <p><b>If you squint really hard, you can see it!!!</b></p>
        <p>Please make a selection from the nav menu (top of screen - house/list/cog - hold over to see tooltip)</p>
        <p>Select the raised hand to be taken to the feedback form to report any issues, share thoughts or provide suggestions.</p>
      </div>
    </>
  );
}
