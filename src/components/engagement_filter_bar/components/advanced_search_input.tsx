import React, { useState, useRef, useEffect } from 'react';
import {
  ActionGroup,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Popper,
  SearchInput,
  TextInput,
} from '@patternfly/react-core';

export interface AdvancedSearchInputProps {
  searchValue:string,
  categoryValue:string,
  onSearchChange:(value:string) => void,
  onSearch:(value:string, category:string) => void
  onCategoryChange:(value:string) => void
}
export function AdvancedSearchInput({
  searchValue,
  categoryValue,
  onSearchChange,
  onSearch,
  onCategoryChange,
}: AdvancedSearchInputProps) {

  const advancedFormRef = useRef(null);
  const categoryRef = useRef(null);
  const engagementRef = useRef(null);
  const searchInputRef = useRef(null);

  const [ isAdvancedSearchOpen, setIsAdvancedSearchOpen ] = useState<boolean>(false);

  function handleSearch() {
    setIsAdvancedSearchOpen(false);
    //const freeSearch = searchValue.replace(/category='.*?'/, '');
    onSearch(searchValue, categoryValue);
  }

  function handleEngagementBoxChange(searchTerm:string) {
    const engagementSearch = categoryValue?.length === 0 ? searchTerm : `${searchTerm} category='${categoryValue}'`;
    onSearchChange(engagementSearch);
  }

  const isInitialMount = useRef(true);
  // After initial page load, whenever the advanced search menu is opened, the browser focus should be placed on the
  // first advanced search form input. Whenever the advanced search menu is closed, the browser focus should
  // be returned to the search input.
  useEffect(() => {

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (isAdvancedSearchOpen && categoryRef && categoryRef.current) {
        categoryRef.current.focus();
      } else if (!isAdvancedSearchOpen && searchInputRef) {
        searchInputRef.current.focus();
      }
    }
  }, [isAdvancedSearchOpen]);

  useEffect(() => {
    const handleClickOutside = event => {
      if (isAdvancedSearchOpen && advancedFormRef && advancedFormRef.current && !advancedFormRef.current.contains(event.target)) {
        setIsAdvancedSearchOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
  },[advancedFormRef, isAdvancedSearchOpen]);

  const advancedForm = (
    <div ref={advancedFormRef} role="dialog" aria-label="Advanced search form">
      <Card>
        <CardBody>
          <Form>
            <FormGroup label='Category' fieldId='categorySearch' key='categorySearch'>
              <TextInput aria-label='Category' value={categoryValue} ref={categoryRef} onChange={(e) => onCategoryChange(e)}
                placeholder='Exact match. 1 Category per search'/>
            </FormGroup>
            <FormGroup label='Customer / Engagement' fieldId='engagementSearch' key='engagementSearch'>
              <TextInput aria-label='Engagement' value={searchValue.replace(/category='.*?'/, '').trim()} ref={engagementRef}
                onChange={(searchTerm) => handleEngagementBoxChange(searchTerm)}
                placeholder='Partial match. '/>
            </FormGroup>
            <ActionGroup>
              <Button variant="primary" type="button" onClick={handleSearch}>Search</Button>
                <Button variant="link" type="reset" onClick={(e) => onSearchChange('')}>Reset</Button>
            </ActionGroup>
          </Form>
        </CardBody>
      </Card>
    </div>
  );

  const searchInput = (
    <SearchInput
      placeholder='Click triangle for help'
      value={searchValue}
      onChange={(input) => onSearchChange(input)}
      onToggleAdvancedSearch={(e, isOpen) => {
        e.stopPropagation();
        setIsAdvancedSearchOpen(isOpen)
      }}
      isAdvancedSearchOpen={isAdvancedSearchOpen}
      onClear={() => onSearchChange('')}
      onSearch={handleSearch}
      ref={searchInputRef}
      id="custom-advanced-search"
    />
  );

  return (
    <Popper
      trigger={searchInput}
      popper={advancedForm}
      isVisible={isAdvancedSearchOpen}
      enableFlip={false}
      appendTo={() => document.querySelector("#custom-advanced-search")}
    />
  );
}
