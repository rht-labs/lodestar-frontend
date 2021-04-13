import React from 'react';
import { render } from '@testing-library/react';
import { DwLastUpdated } from './dw_last_updated_engagements';
import { Engagement } from '../../../schemas/engagement';

describe('Dashboard Last Updated Engagements Widget', () => {
  test('is defined', () => {
    const component = render(<DwLastUpdated engagements={[]} />);
    expect(component).toBeDefined();
  });
  test('title is displayed', () => {
    const component = render(<DwLastUpdated engagements={[]} />);
    expect(component.getByText('Recently Updated Engagements')).toBeDefined();
  });
  test("shows the 5 most recent engagements's names", () => {
    const engagements = new Array(5)
      .fill(null)
      .map(() => Engagement.fromFake());
    const component = render(<DwLastUpdated engagements={engagements} />);
    for (let engagement of engagements) {
      expect(component.getByText(engagement.project_name)).toBeDefined();
    }
  });
});
