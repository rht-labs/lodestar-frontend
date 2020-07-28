import React from 'react';
export interface CustomGlobalBannerProps {
  message: string;
  color: string;
}
export default function CustomGlobalBanner(props: CustomGlobalBannerProps) {
  console.log(props.color);
  return (
    <div
      style={{
        backgroundColor: props.color ?? 'white',
        height: '50px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '0 1.5rem',
      }}
    >
      {props.message} This is a warning message
    </div>
  );
}
