import React from 'react';
import { render } from '@testing-library/react';
import { DwTopTags } from './dw_top_tags';
import {
  CategoryWithCount,
  EngagementCategory,
} from '../../../schemas/engagement_category';

describe('Dw Top Tags', () => {
  test('has a title', () => {
    const component = render(<DwTopTags />);
    expect(component.getByText('Top 5 Tags')).toBeDefined();
  });
  test('Shows the tags provided in props', () => {
    const tags: CategoryWithCount[] = new Array(5)
      .fill(null)
      .map(() => ({ ...EngagementCategory.fromFake(), count: 5 }));
    const component = render(<DwTopTags categories={tags} />);
    for (let tag of tags) {
      expect(component.getByText(tag.name)).toBeDefined();
    }
  });
});
