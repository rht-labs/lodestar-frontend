import React, {useState} from 'react';
import {Button, InputGroup, TextInput} from "@patternfly/react-core";

export interface AddNewCategoryProps {
  addCategory: (newCategory:string) => void
}

export function AddNewCategory({addCategory}: AddNewCategoryProps) {
  const [input, setInput] = useState('');

  function handleInputTextChange(value: string){
    setInput(value);
  }

  return (
    <InputGroup style={{ maxHeight: '1rem'}} >
      <TextInput name="input"
                 aria-label="input categories"
                 value={input}
                 type="text"
                 key={'addNewCategory'}
                 onChange={handleInputTextChange}
                 style={{ fontSize: 'small', maxHeight: '1rem'}}
      />
      <Button variant="link"
              isInline
              key={'btnAddNewCat'}
              style={{ minWidth: '2rem'}}
              onClick={() => addCategory(input)}
      >
        Add
      </Button>
    </InputGroup>
  );
};