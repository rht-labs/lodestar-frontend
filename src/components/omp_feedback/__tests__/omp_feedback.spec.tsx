import React from 'react';
import {
  FeedbackContext,
  IFeedbackContext,
} from '../../../context/feedback_context/feedback_context';
import { Feedback } from '../omp_feedback';
import { render, fireEvent } from '@testing-library/react';

describe('Lodestar Feedback Component', () => {
  test('Feedback modal shows', async () => {
    const { getByText } = render(
      <FeedbackContext.Provider
        value={
          ({ alertMsg: 'This is an alert' } as unknown) as IFeedbackContext
        }
      >
        <Feedback />
      </FeedbackContext.Provider>
    );
    expect(getByText('This is an alert')).toBeDefined();
  });
  test('Can click action', async () => {
    const testAction = jest.fn();
    const hideAlert = jest.fn();
    const { getByText } = render(
      <FeedbackContext.Provider
        value={
          ({
            alertMsg: 'This is an alert',
            alertActions: [{ action: testAction, title: 'Click Me' }],
            hideAlert,
          } as unknown) as IFeedbackContext
        }
      >
        <Feedback />
      </FeedbackContext.Provider>
    );
    await fireEvent.click(getByText('Click Me'));
    expect(testAction).toHaveBeenCalled();
    expect(hideAlert).toHaveBeenCalled();
  });
});
