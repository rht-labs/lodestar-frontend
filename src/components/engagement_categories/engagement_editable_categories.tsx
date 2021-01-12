import React, { useEffect, useState } from 'react';
import { Flex, Label } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import { EngagementCategory } from '../../schemas/engagement_category';
import { Engagement } from '../../schemas/engagement';
import { CategoryTypehead } from './category_typehead';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { APP_FEATURES } from '../../common/app_features';
import { Feature } from '../feature/feature';

export function EngagementEditableCategories({
  engagementCategories,
  engagement,
}: {
  engagementCategories?: EngagementCategory[];
  onSave: (engagement: Engagement) => void;
  engagement: Engagement;
}) {
  const { saveEngagement } = useEngagements();
  const [chips, setChips] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const { categories, fetchCategories } = useEngagements();

  useEffect(() => {
    if (!hasFetched && categories === undefined) {
      setHasFetched(true);
      fetchCategories();
    }
  }, [categories, hasFetched, setHasFetched, fetchCategories]);

  useEffect(() => {
    const formatedItem = engagementCategories?.map(item => item.name);

    setChips(formatedItem ? formatedItem : []);
  }, [engagementCategories]);

  const CategoriesReadOnly = () => {
    return (
      <>
        {chips.length > 0 ? (
          chips.map(currentChip => (
            <Label
              key={currentChip}
              style={{ marginRight: '0.5rem' }}
              color="blue"
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
        <Feature name={APP_FEATURES.writer}>
          <PencilAltIcon
            onClick={e => setEditMode(!editMode)}
            style={{
              fontSize: 'small',
              margin: '-0.1rem 0.5rem',
              cursor: 'pointer',
              color: '#0066CC',
            }}
          />
        </Feature>
      </>
    );
  };

  const SaveAndCloseEditMode = (selectedChips: string[]) => {
    setEditMode(!editMode);
    saveEngagement({
      ...engagement,
      engagement_categories: selectedChips.map(chip => ({ name: chip })),
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
            engagementCategories={chips}
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
