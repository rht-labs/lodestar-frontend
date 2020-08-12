import React, { useState } from 'react';
import {
  Card, CardActions, CardBody, CardHeader, CardHeaderMain, TooltipPosition,
} from '@patternfly/react-core';
import { TableBody, TableHeader, TableVariant, Table } from "@patternfly/react-table";
import { Pagination } from "@patternfly/react-core";
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Table/table';
import { InfoCircleIcon } from "@patternfly/react-icons";
import { Tooltip } from '@patternfly/react-core';
import {EngagementFormConfig} from "../../schemas/engagement_config";

interface UserListProps{
  defaultRows: string[][];
  formOptions: EngagementFormConfig;
  title: any;
}

export function UserList(props: UserListProps) {

  const columns = [
    { title: 'First name'},
    { title: 'Last name' },
    { title: 'Email' },
    { title:
        <>
          Role
          <Tooltip
            content=
              {
                <>
                  <b style={{color: '#73BCF7'}}>Developer:</b>
                    <br/> Role used for someone that is part of the engagement team as a technical resource, e.g.: developer, and need access to perform most tasks that do not require elevated privileges.
                  <br/><br/>
                  <b style={{color: '#73BCF7'}}>Observer:</b>
                    <br/> Role used as a view-only mode for anybody interested in following the engagement by having access to systems but without any permissions to make changes.
                  <br/><br/>
                  <b style={{color: '#73BCF7'}}>Admin:</b>
                    <br/> Role with the highest level of access rights (e.g.: elevated privileges), that allows for full control over most systems that are part of the engagement. Careful: this role allows for the user to potential apply breaking changes within the environment! Please use selectively.
                </>
              }
            entryDelay={0}
            exitDelay={10}
            maxWidth={'45rem'}
            isContentLeftAligned={true}
            position={TooltipPosition.top}>
            <InfoCircleIcon style={{fontSize: 'small', marginLeft: '1rem'}}/>
          </Tooltip>
        </>
    },
  ];

  function renderPagination() {
    return (
      <Pagination
        isCompact
        itemCount={props.defaultRows.length}
        page={page}
        perPage={perPage}
        defaultToFullPage
        perPageOptions={[
          { title: "5", value: 5 },
          { title: "10", value: 10},
          { title: "20", value: 20}
        ]}
        onSetPage={handleSetPage}
        onPerPageSelect={handlePerPageSelect}
      />
    );
  }

  const defaultPerPage = 5;
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(props.defaultRows.slice(0, defaultPerPage));

  function handleSetPage(_evt, newPage, perPage, startIdx, endIdx) {
    setPage(newPage);
    setRows(props.defaultRows.slice(startIdx, endIdx));
  }

  function handlePerPageSelect(_evt, newPerPage, newPage, startIdx, endIdx) {
    setPerPage(newPerPage);
    setPage(newPage);
    setRows(props.defaultRows.slice(startIdx, endIdx));
  }

  const customRowWrapper = ({
                              trRef,
                              className,
                              rowProps,
                              row: { isExpanded, isHeightAuto },
                              ...props
                            }) => {
    const isOddRow = (rowProps.rowIndex + 1) % 2;
    const customStyle = {
      background: '#F5F5F5'
    };
    return (
      <tr
        {...props}
        ref={trRef}
        className={css(
          className,
          (isOddRow ? 'odd-row-class' : 'even-row-class'),
          'custom-static-class',
          isExpanded !== undefined && styles.tableExpandableRow,
          isExpanded && styles.modifiers.expanded,
          isHeightAuto && styles.modifiers.heightAuto
        )}
        hidden={isExpanded !== undefined && !isExpanded}
        style={isOddRow ? customStyle : {}}
      />
    );
  };

  return (
    <Card isFlat style={{borderWidth: 0}}>
      <CardHeader>
        <CardHeaderMain>
          <b>
            { props.title }
          </b>
        </CardHeaderMain>
        <CardActions>
          { renderPagination() }
        </CardActions>
      </CardHeader>
      <CardBody>
        {
          props.defaultRows.length > 0
          ?
            <Table
              aria-label="Engagement users table"
              variant={TableVariant.compact}
              borders={true}
              cells={columns}
              rows={rows}
              rowWrapper={ customRowWrapper }
            >
            <TableHeader />
            <TableBody />
            </Table>

          :
            <p style={{fontStyle: 'italic'}}> No users have been added </p>
        }

      </CardBody>
    </Card>
  );
}

