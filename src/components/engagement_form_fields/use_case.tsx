import React from 'react';
import { Engagement, EngagementUseCase } from '../../schemas/engagement';
import {
  FormGroup,
  TextInput,
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { TrashAltIcon } from '@patternfly/react-icons';
import { uuid } from 'uuidv4';

export interface EngagementUseCaseFieldProps {
  engagement: Engagement;
  onChange: (useCases: EngagementUseCase[]) => void;
}

export function EngagementUseCaseField(props: EngagementUseCaseFieldProps) {
  const { use_cases } = props.engagement;
  const addUseCase = () => {
    props.onChange([...use_cases, { id: uuid() }]);
  };

  const onDelete = (useCase: EngagementUseCase) => {
    const deleteIndex = use_cases.findIndex(
      currentCase => useCase === currentCase
    );
    const mutableCases = [...use_cases];
    if (deleteIndex > -1) {
      mutableCases.splice(deleteIndex, 1);
    }
    props.onChange(mutableCases);
  };

  const onChange = (useCase: EngagementUseCase) => {
    const index = use_cases.findIndex(
      currentCase => currentCase.id === useCase.id
    );
    const mutableCases = [...use_cases];
    mutableCases.splice(index, 1, useCase);
    props.onChange(mutableCases);
  };

  return (
    <FormGroup fieldId="Engagement Use Cases" label="Engagement Use Cases">
      {use_cases.map(useCase => (
        <UseCaseField
          useCase={useCase}
          onDelete={onDelete}
          onChange={onChange}
        />
      ))}
      <Button onClick={addUseCase} variant={ButtonVariant.secondary}>
        Add Use Case
      </Button>
    </FormGroup>
  );
}

interface UseCaseFieldProps {
  useCase: EngagementUseCase;
  onDelete: (useCase: EngagementUseCase) => void;
  onChange: (useCase: EngagementUseCase) => void;
}

function UseCaseField({ useCase, ...props }: UseCaseFieldProps) {
  return (
    <div style={{ margin: '0.5em 0' }}>
      <Flex direction={{ default: 'row' }}>
        <FlexItem flex={{ default: 'flex_1' }}>
          <TextInput
            onChange={e => props.onChange({ ...useCase, description: e })}
            value={useCase.description ?? ''}
          />
        </FlexItem>
        <FlexItem>
          <Button
            variant={ButtonVariant.plain}
            onClick={() => props.onDelete(useCase)}
          >
            <TrashAltIcon />
          </Button>
        </FlexItem>
      </Flex>
    </div>
  );
}
