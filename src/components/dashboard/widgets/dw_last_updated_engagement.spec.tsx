import { fireEvent, render } from '@testing-library/react';

import { DwLastUpdated } from './dw_last_updated_engagements';
import { Engagement } from '../../../schemas/engagement';
import React from 'react';

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
      expect(component.getAllByText(engagement.project_name)).toBeDefined();
    }
  });
  test('clicking the engagement link should call onClick', () => {
    const engagement = Engagement.fromFake();
    const spy = jest.fn();
    const component = render(
      <DwLastUpdated engagements={[engagement]} onClick={spy} />
    );
    fireEvent.click(component.getByText(engagement.project_name));
    expect(spy).toHaveBeenCalledWith(
      engagement.uuid
    );
  });
});
