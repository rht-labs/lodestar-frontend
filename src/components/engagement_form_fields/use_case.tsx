import React from 'react';
import { EngagementUseCase } from '../../schemas/engagement';
import {
  FormGroup,
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
  TextArea,
} from '@patternfly/react-core';
import { TrashAltIcon } from '@patternfly/react-icons';
import { uuid } from 'uuidv4';

export function EngagementUseCaseField({
  useCases = [],
  setUseCases,
}: {
  useCases: EngagementUseCase[];
  setUseCases: (useCases: EngagementUseCase[]) => void;
}) {
  const addUseCase = () => {
    setUseCases([...useCases, { uuid: uuid(), engagement_uuid: null }]);
  };

  const onDelete = (useCase: EngagementUseCase) => {
    const deleteIndex = useCases.findIndex(
      currentCase => useCase === currentCase
    );
    const mutableCases = [...useCases];
    if (deleteIndex > -1) {
      mutableCases.splice(deleteIndex, 1);
    }
    setUseCases(mutableCases);
  };

  const onChange = (useCase: EngagementUseCase) => {
    const index = useCases.findIndex(
      currentCase => currentCase.uuid === useCase.uuid
    );
    const mutableCases = [...useCases];
    mutableCases.splice(index, 1, useCase);
    setUseCases(mutableCases);
  };

  return (
    <FormGroup fieldId="Engagement Use Cases" label="Engagement Use Cases">
      {useCases?.map(useCase => (
        <UseCaseField
          key={useCase.uuid ?? useCase.description}
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
          <TextArea autoResize
            aria-label='Use Case'
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
