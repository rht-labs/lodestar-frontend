import React, { useState } from 'react';
import {Button, Flex, FlexItem, Select, SelectOption, SelectVariant} from '@patternfly/react-core';
import {EngagementCategory} from "../../schemas/engagement_category";

export interface CategoryTypeheadProps {
  engagementCategories: string[];
  allCategories: EngagementCategory[];
  SaveAndCloseEditMode: ( selectedChips: string[]) => void;
}

export function CategoryTypehead({engagementCategories, SaveAndCloseEditMode, allCategories} : CategoryTypeheadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(engagementCategories);

  const onToggle = isOpen => { setIsOpen(isOpen) };

  const onSelect = (event, selection) => {
    if (selected.includes(selection)) {
      setSelected([...selected.filter(item => item !== selection)]);
    }
    else {
      setSelected([...selected, selection]);
    }
  };

  function onClose() {
    SaveAndCloseEditMode(selected);
  }

  return (
    <Flex>
      <FlexItem>
        <Select
          variant={SelectVariant.typeaheadMulti}
          typeAheadAriaLabel="Add new tag"
          onToggle={onToggle}
          onSelect={onSelect}
          onClear={onClose}
          clearSelectionsAriaLabel={'Clear all'}
          selections={selected}
          isOpen={isOpen}
          isPlain={true}
          aria-labelledby={'titleId'}
          placeholderText="Add new tag"
          isCreatable={true}
        >
          {allCategories?.map((category, index) => (
            <SelectOption key={index} value={category.name}/>
          ))}
        </Select>
      </FlexItem>
      <FlexItem>
        <Button variant="secondary"
                isInline
                key={'saveCategories'}
                style={{ minWidth: '2rem'}}
                onClick={() => SaveAndCloseEditMode(selected)}
        >
          Save
        </Button>
      </FlexItem>
    </Flex>
  );
};