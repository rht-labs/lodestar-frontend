import React from 'react';

export interface LinkOrSpanProps {
  href?: string;
  children: any;
}
export const LinkOrSpan = ({ href, children }: LinkOrSpanProps) => {
  if (!!href) {
    return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
  } else {
    return <span>{children}</span>;
  }
};
