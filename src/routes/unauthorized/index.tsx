import React from 'react';

export function UnauthorizedPage() {
  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh',
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <>
      <div style={contentPane}>
        <p>Sorry, your account has not yet been given access to OMP. Please contact the SRE team to resolve this.</p>
      </div>
    </>
  );
}
