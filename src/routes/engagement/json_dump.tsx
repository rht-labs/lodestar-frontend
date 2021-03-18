import React, { useEffect, useState } from 'react';
import { DataCard } from '../../components/engagement_data_cards/data_card';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import {
  Alert,
  AlertVariant,
  Button,
  Flex,
  FlexItem,
  PageSection,
  PageSectionVariants,
} from '@patternfly/react-core';
import 'ace-builds/src-noconflict/theme-github';
import { Link, useRouteMatch } from 'react-router-dom';
import { Feature } from '../../components/feature/feature';

export interface EngagementJsonDumpProps {
  json: string;
  onSave(json: string): void;
}
export function EngagementJsonDump(props: EngagementJsonDumpProps) {
  const [currentValue, setCurrentValue] = useState<string>(props.json);
  useEffect(() => setCurrentValue(props.json), [props.json]);
  const handleChange = (value: string) => setCurrentValue(value);
  const handleSave = () => props.onSave(currentValue);

  const { url } = useRouteMatch();

  return (
    <DataCard title="Engagement JSON">
      <Alert
        isInline
        title={
          <span>
            Only use this tool if you know what you are doing. If you came here
            by mistake,{' '}
            <Link to={`${url.replace('/json', '')}`}>click here</Link> to return
            to the engagement page.
          </span>
        }
        variant={AlertVariant.danger}
      ></Alert>
      <CodeEditor onChange={handleChange} value={currentValue} />
      <PageSection variant={PageSectionVariants.light}>
        <Flex justifyContent={{ default: 'justifyContentFlexEnd' }}>
          <FlexItem>
            <Feature name="admin">
              <Button onClick={handleSave}>Save</Button>
            </Feature>
          </FlexItem>
        </Flex>
      </PageSection>
    </DataCard>
  );
}

interface CodeEditorProps {
  value: string;
  onChange(value: string): void;
}
const CodeEditor = (props: CodeEditorProps) => {
  return (
    <AceEditor
      width={'100%'}
      mode={'json'}
      value={props.value}
      onChange={props.onChange}
      theme="github"
    />
  );
};
