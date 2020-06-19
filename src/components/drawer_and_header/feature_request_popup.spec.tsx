import React from 'react';
import { render, act } from '@testing-library/react';
import { FeatureRequestPopup } from './feature_request_popup';

describe('Feature Request Popup', () => {
  test('renders properly', () => {
    // this code fixes an error setting up the test that is related to PopperJS
    // @see https://stackoverflow.com/questions/60333156/how-to-fix-typeerror-document-createrange-is-not-a-function-error-while-testi
    (global as any).document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    });
    //
    
    jest.useFakeTimers();
    act(() => {
      jest.runAllTimers();
    });
    expect(
      render(
        <div>
          <FeatureRequestPopup>
            <div />
          </FeatureRequestPopup>
        </div>
      )
    ).toMatchSnapshot();
  });
});
