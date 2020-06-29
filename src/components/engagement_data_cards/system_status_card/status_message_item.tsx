import React from 'react';
import {Severity} from "../../../schemas/system_message";
import {
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow
} from "@patternfly/react-core";
import { formatISO, isValid } from 'date-fns';

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

  return (
    <>
      <DataList aria-label="system status message" isCompact>
        <DataListItem aria-labelledby="system-status-messages">
          <DataListItemRow>
            <DataListItemCells
                dataListCells={[
                  <DataListCell key="severity" >
                    <b> Severity: </b>
                    {Severity[severity]}
                  </DataListCell>,
                  <DataListCell key="message" width={4}>
                    <b> Message: </b>
                    <span> {message ? message : 'No message'} </span>
                  </DataListCell>,
                  <DataListCell key="updated" width={2}>
                    <b> Updated: </b>
                    <span>
                    {!!updated && isValid(updated) ? formatISO(updated) : ' - '}
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
