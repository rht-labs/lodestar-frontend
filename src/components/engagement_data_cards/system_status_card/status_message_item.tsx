import React from 'react';
import {Severity} from "../../../schemas/system_message";
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow
} from "@patternfly/react-core";
import { isValid } from 'date-fns';

export interface StatusMessageItemProps{
  severity: Severity,
  message: string;
  updated: Date;
}

export function StatusMessageItem({
  severity,
  message,
  updated
}: StatusMessageItemProps) {

  const severityBox = {
    display: 'block',
    width: '100%',
    padding: '.25rem .5rem',
    color: '#004e8a',
    backgroundColor: '#def3ff',
    border: '1px solid rgba(0,0,0,.1)',
    borderRadius: '4px'
  };

  return (
    <>
      <DataList aria-label="system status message" isCompact>
        <DataListItem aria-labelledby="system-status-messages">
          <DataListItemRow>
            <DataListItemCells
                dataListCells={[
                  <DataListCell key="severity" >
                    <div style={severityBox}>
                      Severity: {Severity[severity]}
                    </div>
                  </DataListCell>,
                  <DataListCell key="message" width={5}>
                    <span> {message ? message : 'No message'} </span>
                  </DataListCell>,
                  <DataListCell key="updated">
                    <span>
                    {!!updated && isValid(updated) ? updated : ' - '}
                    </span>
                  </DataListCell>,
                ]}
            />
          </DataListItemRow>
        </DataListItem>
      </DataList>
    </>
  );
}
