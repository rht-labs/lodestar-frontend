import React, {useEffect, useState} from 'react';
import {
  Card, CardActions, CardBody, CardHeader, CardHeaderMain,
} from '@patternfly/react-core';
import { TableBody, TableHeader, TableVariant, Table } from "@patternfly/react-table";
import { Pagination } from "@patternfly/react-core";
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Table/table';
import { EngagementFormConfig } from "../../../schemas/engagement_config";
import { UserRolesTooltip } from "./user_roles_tooltip";

interface UserListProps{
  defaultRows: string[][];
  engagementFormConfig: EngagementFormConfig;
  title: any;
}

export function UserList(props: UserListProps) {

  const defaultPerPage = 5;
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(props.defaultRows.slice(0, defaultPerPage));
  }, [props.defaultRows]);

  function handleSetPage(_evt, newPage, perPage, startIdx, endIdx) {
    setPage(newPage);
    setRows(props.defaultRows.slice(startIdx, endIdx));
  }

  function handlePerPageSelect(_evt, newPerPage, newPage, startIdx, endIdx) {
    setPerPage(newPerPage);
    setPage(newPage);
    setRows(props.defaultRows.slice(startIdx, endIdx));
  }

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

  const columns = [
    { title: 'Full name'},
    { title: 'Email' },
    { title:
        <>
          Role
          <UserRolesTooltip engagementFormConfig={props.engagementFormConfig}/>
        </>
    },
  ];

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

