import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';

export interface RegionProps {
  region: string;
}

interface RegionImageProps {
  region: string;
}

function RegionImage(props: RegionImageProps) {
  const getImageUrl = (path: string) => `${process.env.PUBLIC_URL}${path}`;
  const getImageForRegion = (region: string) =>
    getImageUrl(`/images/world${!!region ? '-' + region : ''}.svg`);

  return (
    <div style={{ height: 100 }}>
      <img
        style={{ objectFit: 'contain', height: '100%' }}
        src={getImageForRegion(props.region)}
        alt={`${props.region} region`}
      />
    </div>
  );
}

export function Region(props: RegionProps) {
  return (
    <Flex
      direction={{ default: 'column' }}
      alignItems={{ default: 'alignItemsCenter' }}
      justifyContent={{ default: 'justifyContentCenter' }}
    >
      <FlexItem>
        <RegionImage region={props.region} />
      </FlexItem>
      <FlexItem>
        <span style={{ fontWeight: 'bold' }}>
          {props.region?.toUpperCase?.()}
        </span>
      </FlexItem>
    </Flex>
  );
}
