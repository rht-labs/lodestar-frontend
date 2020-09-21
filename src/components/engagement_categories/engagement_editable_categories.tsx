import React, {useEffect, useState} from 'react';
import {
  Chip,
  ChipGroup,
  Label,
} from '@patternfly/react-core';
import { PencilAltIcon } from "@patternfly/react-icons";
import { AddNewCategory } from "./add_new_category_bar";
import { EngagementCategory } from "../../schemas/engagement_category";
import {Engagement} from "../../schemas/engagement";

export function EngagementEditableCategories ({
  categories,
  onChange,
  onSave
}: {
  categories: EngagementCategory[];
  onChange: (fieldName: string, value: any) => void;
  onSave: (engagement: Engagement) => void;
}) {

  const [chips, setChips] = useState <string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const formattedItems: string[] = [];

  useEffect(() => {
    categories?.map( (item) => {
      formattedItems.push(item.name);
      }
    );
    setChips(formattedItems);
  }, []);

  const CategoriesReadOnly = () => {
    return (
      <>
        {
          chips.length > 0
          ? chips.map(currentChip => (
            <Label key={currentChip}
                   style={{marginRight: '0.5rem'}}
                   color="blue">
              {currentChip}
            </Label>
          ))
          : <Label key={'addNew'}
                    style={{marginRight: '0.5rem'}}
                    color="blue">
            Add new tag
          </Label>
        }
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
    onChange('categories', copyOfChips);
  }

  function deleteCategory(category: string) {
    const copyOfChips = [...chips];
    const index = copyOfChips.indexOf(category);
    if (index !== -1) {
      copyOfChips.splice(chips.indexOf(category), 1);
      setChips(copyOfChips);
   }
    onChange('categories', copyOfChips);
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