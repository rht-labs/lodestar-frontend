import React, { useEffect, useState } from 'react';
import { Flex, Label } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { CategoryTypeahead } from './category_typeahead';
import { useEngagement } from '../../context/engagement_context/engagement_hook';
import { Feature } from '../feature/feature';
import {
  EngagementGroupings,
  useEngagementFormField,
} from '../../context/engagement_context/engagement_context';
import { useCategories } from '../../context/category_context/category_context';

export function EngagementEditableCategories() {
  const { saveEngagement, currentEngagement: engagement } = useEngagement();
  const [editMode, setEditMode] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { categories, fetchCategories } = useCategories();

  const [updatedCategories, setUpdatedCategories] = useEngagementFormField(
    'engagement_categories',
    EngagementGroupings.categories
  );

  useEffect(() => {
    if (!hasFetched && categories?.length === 0) {
      setHasFetched(true);
      fetchCategories();
    }
  }, [categories, hasFetched, setHasFetched, fetchCategories]);

  const formattedCategories = engagement?.engagement_categories?.map?.(
    item => item.name
  );

  const CategoriesReadOnly = () => {
    return (
      <>
        {formattedCategories?.length > 0 ? (
          formattedCategories?.map?.(currentChip => (
            <Label
              key={currentChip}
              style={{ marginRight: '0.5rem' }}
              color="blue"
              data-testid="category-chip"
            >
              {currentChip}
            </Label>
          ))
        ) : (
          <Label
            key={'addNew'}
            style={{ marginRight: '0.5rem' }}
            variant="outline"
            onClick={cancelEdit}
            color="blue"
          >
            Add new tag
          </Label>
        )}
        <Feature name={'engagementWriter'}>
          <span data-testid="edit-icon" onClick={e => setEditMode(!editMode)}>
            <PencilAltIcon
              style={{
                fontSize: 'small',
                margin: '-0.1rem 0.5rem',
                cursor: 'pointer',
                color: '#0066CC',
              }}
            />
          </span>
        </Feature>
      </>
    );
  };

  const SaveAndCloseEditMode = async () => {
    setEditMode(!editMode);
    await saveEngagement({
      ...engagement,
      engagement_categories: updatedCategories,
    });
  };

  const cancelEdit = () => {
    setEditMode(!editMode);
  };

  return (
    <>
      {editMode ? (
        <Flex>
          <CategoryTypeahead
            selected={updatedCategories?.map?.(c => c?.name) ?? []}
            onChange={c =>
              setUpdatedCategories(
                c.map(c => ({
                  name: c,
                }))
              )
            }
            allCategories={categories}
            cancelEdit={cancelEdit}
            saveAndCloseEditMode={SaveAndCloseEditMode}
          />
        </Flex>
      ) : (
        <CategoriesReadOnly />
      )}
    </>
  );
}
