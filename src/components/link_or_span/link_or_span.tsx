import React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

export interface LinkOrSpanProps {
  href?: string;
  children: any;
}

const addLinkIconWithWrapCorrection = (children: any) => {
  const childrenArray = String(children).split(' ');
  return <>{childrenArray.slice(0, -1).join(' ')} <span className="nowrap">{childrenArray.slice(-1)}&nbsp;<ExternalLinkAltIcon className="externalAltLinkIcon"/></span></>;
}

export const LinkOrSpan = ({ href, children }: LinkOrSpanProps) => {
  if (!!href) {
    return <a href={href} target="_blank" rel="noreferrer">{addLinkIconWithWrapCorrection(children)}</a>;
  } else {
    return <span>{children}</span>;
  }
};
