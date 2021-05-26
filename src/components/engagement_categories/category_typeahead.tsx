import React, { useState } from 'react';
import {
  Button,
  Flex,
  FlexItem,
  Select,
  SelectOption,
  SelectVariant,
} from '@patternfly/react-core';
import { EngagementCategory } from '../../schemas/engagement_category';

export interface CategoryTypeheadProps {
  allCategories?: EngagementCategory[];
  saveAndCloseEditMode: (selectedChips: string[]) => void;
  cancelEdit: () => void;
  onChange: (categories: string[]) => void;
  selected: string[];
}

export function CategoryTypeahead({
  cancelEdit,
  saveAndCloseEditMode,
  allCategories,
  onChange,
  selected = [],
}: CategoryTypeheadProps) {
  const [isOpen, setIsOpen] = useState(false);

  const onToggle = isOpen => {
    setIsOpen(isOpen);
  };

  const onSelect = (_, selection) => {
    if (selected.includes(selection)) {
      onChange([...selected.filter(item => item !== selection)]);
    } else {
      onChange([...selected, selection]);
    }
  };
  const options = allCategories?.map((category, index) => (
    <SelectOption
      data-testid="category-option"
      key={index}
      value={category.name}
    />
  ));

  return (
    <Flex>
      <FlexItem>
        <div data-testid="category-select-wrapper">
          <Select
            data-testid="category-select"
            variant={SelectVariant.typeaheadMulti}
            typeAheadAriaLabel="Add new tag"
            onToggle={onToggle}
            onSelect={onSelect}
            onClear={cancelEdit}
            clearSelectionsAriaLabel={'Clear all'}
            selections={selected}
            isOpen={isOpen}
            isPlain={true}
            aria-labelledby={'titleId'}
            placeholderText="Add new tag"
            isCreatable={true}
          >
            {options}
          </Select>
        </div>
      </FlexItem>
      <FlexItem>
        <Button
          variant="secondary"
          isInline
          data-testid="save_categories"
          key={'saveCategories'}
          style={{ minWidth: '2rem' }}
          onClick={() => saveAndCloseEditMode(selected)}
        >
          Save
        </Button>
      </FlexItem>
    </Flex>
  );
}
