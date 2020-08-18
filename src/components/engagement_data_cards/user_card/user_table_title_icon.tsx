import React from 'react';
import { Level, LevelItem } from '@patternfly/react-core';

interface UserTableTitleIconProps {
  text: string;
  icon: any;
}

export function UserTableTitleIcon({text, icon}: UserTableTitleIconProps) {

  return (
    <Level>
      <LevelItem>
        { text }
      </LevelItem>
      <LevelItem>
        { icon }
      </LevelItem>
    </Level>
  );
}
