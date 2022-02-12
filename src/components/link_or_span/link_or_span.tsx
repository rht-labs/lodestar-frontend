import React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

export interface LinkOrSpanProps {
  href?: string;
  children: any;
}
export const LinkOrSpan = ({ href, children }: LinkOrSpanProps) => {
  if (!!href) {
    return <a href={href} target="_blank" rel="noreferrer">{children} &nbsp; <ExternalLinkAltIcon /></a>;
  } else {
    return <span>{children}</span>;
  }
};
