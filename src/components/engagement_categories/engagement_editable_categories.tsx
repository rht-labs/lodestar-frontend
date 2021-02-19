import React, { useEffect, useState } from 'react';
import { Flex, Label } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { CategoryTypehead } from './category_typehead';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { Feature } from '../feature/feature';
import {
  EngagementGroupings,
  useEngagementFormField,
} from '../../context/engagement_context/engagement_context';

export function EngagementEditableCategories() {
  const { saveEngagement, currentEngagement: engagement } = useEngagements();
  const [editMode, setEditMode] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { availableCategories, fetchAvailableCategories } = useEngagements();

  const [updatedCategories, setUpdatedCategories] = useEngagementFormField(
    'engagement_categories',
    EngagementGroupings.categories
  );

  useEffect(() => {
    if (!hasFetched && availableCategories === undefined) {
      setHasFetched(true);
      fetchAvailableCategories();
    }
  }, [
    availableCategories,
    hasFetched,
    setHasFetched,
    fetchAvailableCategories,
  ]);

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
        <Feature name={'writer'}>
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

  const SaveAndCloseEditMode = async (selectedChips: string[]) => {
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
          <CategoryTypehead
            selected={updatedCategories?.map?.(c => c?.name) ?? []}
            onChange={c =>
              setUpdatedCategories(
                c.map(c => ({
                  name: c,
                }))
              )
            }
            allCategories={availableCategories}
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
