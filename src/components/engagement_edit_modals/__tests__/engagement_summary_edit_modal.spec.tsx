import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { EngagementSummaryEditModal } from '../engagement_summary_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import MockDate from 'mockdate';
import { MemoryRouter } from 'react-router';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { act } from 'react-dom/test-utils';
import { EngagementContext } from '../../../context/engagement_context/engagement_context';

describe('Engagement Summary edit modal', () => {
  test('matches snapshot', async () => {
    await act(async () => {
      MockDate.set(new Date(2020, 8, 3));
      const rendered = render(
        <TestStateWrapper>
          <EngagementSummaryEditModal
            onClose={() => {}}
            onSave={() => {}}
            isOpen={true}
            engagement={Engagement.fromFake(true)}
          />
        </TestStateWrapper>
      );
      await waitFor(() =>
        expect(
          screen.getByTestId('engagement_summary_edit_modal')
        ).toBeDefined()
      );
      expect(rendered).toMatchSnapshot();
      MockDate.reset();
    });
  });

  test('When clicking the save button, the onSave method is called', async () => {
    await act(async () => {
      const onSave = jest.fn();
      const { findByTestId } = render(
        <MemoryRouter>
          <TestStateWrapper>
            <EngagementSummaryEditModal
              onClose={() => {}}
              onSave={onSave}
              engagement={Engagement.fromFake(true)}
              isOpen={true}
            />
          </TestStateWrapper>
        </MemoryRouter>
      );
      await fireEvent.click(await findByTestId('engagement-summary-save'));
      expect(onSave).toHaveBeenCalled();
    });
  });
});

const Component = ({
  spy = jest.fn(),
  engagement = Engagement.fromFake(true),
}) => (
  <TestStateWrapper>
    <EngagementContext.Provider value={{ updateEngagementFormField: spy }}>
      <EngagementSummaryEditModal
        engagement={engagement}
        isOpen={true}
        onClose={() => {}}
        onSave={() => {}}
      />
    </EngagementContext.Provider>
  </TestStateWrapper>
);
describe('timezone select', () => {
  test('exists in the edit modal', async () => {
    await act(async () => {
      const view = render(<Component />);
      const { findByTestId } = view;
      expect(await findByTestId('timezone-select')).toBeDefined();
    });
  });
  test('can toggle timezone dropdown', async () => {
    await act(async () => {
      const spy = jest.fn();
      const view = render(<Component spy={spy} />);
      const dropdown = await view.findByTestId('timezone-select');
      const buttons = dropdown.getElementsByTagName('button');

      await fireEvent.click(buttons[0]);
      const denver = await view.findByTestId('America/Denver');
      expect(denver).toBeDefined();
      await fireEvent.click(denver);
      expect(spy).toHaveBeenCalledWith(
        'timezone',
        'America/Denver',
        'Engagement Summary'
      );
      expect(await view.queryByTestId('America/Denver')).toBeNull();
    });
  });
});
describe('engagement dates', () => {
  test('engagement dates can each be set and cleared', async () => {
    await act(async () => {
      let view = render(
        <TestStateWrapper>
          <EngagementContext.Consumer>
            {engagementContext => {
              return (
                <EngagementSummaryEditModal
                  isOpen={true}
                  onClose={() => {}}
                  onSave={() => {}}
                  engagement={engagementContext.currentChanges}
                ></EngagementSummaryEditModal>
              );
            }}
          </EngagementContext.Consumer>
        </TestStateWrapper>
      );

      async function testDateInput(inputId: string) {
        await fireEvent.change(await view.findByTestId('start_date_input'), {
          target: { value: '2023-03-21' },
        });

        let node = await view.findByDisplayValue('2023-03-21');
        expect(node).toHaveValue('2023-03-21');
        await fireEvent.change(await view.findByTestId('start_date_input'), {
          target: { value: '' },
        });
        node = await view.findByTestId('start_date_input');
        expect(node).toHaveValue('');
      }

      const dateInputs = [
        'archive_date_input',
        'start_date_input',
        'end_date_input',
      ];
      for (let input of dateInputs) {
        await testDateInput(input);
      }
    });
  });
});
