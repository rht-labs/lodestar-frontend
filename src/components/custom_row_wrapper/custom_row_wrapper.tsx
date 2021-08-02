import React from 'react';
export interface CustomRowWrapperProps {
  trref: any;
  rowprops: any;
}
export default function CustomRowWrapper(props: CustomRowWrapperProps) {
  const isOddRow = (props.rowprops.rowIndex + 1) % 2;
  const customStyle = {
    backgroundColor: 'rgba(0, 102, 205, 0.03)'
  };
  return (
    <tr
      {...props}
      ref={props.trref}
      style={isOddRow ? customStyle : { }}
    />
  );
}
