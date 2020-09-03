import React, {useEffect, useState} from 'react';
import {
  Chip,
  ChipGroup,
  Label,
} from '@patternfly/react-core';
import {Engagement} from "../../schemas/engagement";
import {PencilAltIcon} from "@patternfly/react-icons";
import {AddNewCategory} from "./add_new_category_bar";

export function EngagementCategories ({
  engagement,
}: {
  engagement: Engagement;
}) {

  const [chips, setChips] = useState <string[]>([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setChips(['Chip one', 'Long long long Chip two', 'Chip1 three', 'Chip 2three', 'Chip2 three', 'Chip 3three']);
  }, []);

  const CategoriesReadOnly = () => {
    return (
      <>
        {chips.map(currentChip => (
          <Label key={currentChip}
                 style={{marginRight: '0.5rem'}}
                 color="blue">
            {currentChip}
          </Label>
        ))}
        <PencilAltIcon onClick={e => setEditMode(!editMode)}
                       style={{
                         fontSize: 'small',
                         margin: '-0.1rem 0.5rem',
                         cursor: 'pointer',
                         color: '#0066CC'}}/>
      </>
    )};

  const CategoriesEditMode = () => {
    return (
      <ChipGroup categoryName=" "
                 defaultIsOpen
                 numChips={20}
                 isClosable
                 key={'test'}
                 onClick={e => setEditMode(!editMode)}
      >
        {chips.map(currentChip => (
          <Label key={currentChip}
                 onClick={() => deleteCategory(currentChip)}
                 style={{marginRight: '0.5rem'}}
                 variant={"outline"}
                 onClose={Function.prototype}
                 color="blue">
           {currentChip}
          </Label>
        ))}
        <Chip key="addNew"
              style={{borderRadius: '25px', borderColor:'red'}}
              isOverflowChip
        >
          <AddNewCategory addCategory={addCategory} />
        </Chip>
      </ChipGroup>
  )};

  function addCategory(newCategory: string) {
    const copyOfChips = [...chips];
    copyOfChips.push(newCategory);
    setChips(copyOfChips);
  }

  function deleteCategory(category: string) {
    const copyOfChips = [...chips];
    const index = copyOfChips.indexOf(category);
    if (index !== -1) {
      copyOfChips.splice(chips.indexOf(category), 1);
      setChips(copyOfChips);
   }
  };

  return (
    <>
      {
        editMode
        ? <CategoriesEditMode />
        : <CategoriesReadOnly />
      }
    </>
  )
}