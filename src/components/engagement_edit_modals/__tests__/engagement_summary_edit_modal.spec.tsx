import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { EngagementSummaryEditModal } from '../engagement_summary_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import MockDate from 'mockdate';
import { MemoryRouter } from 'react-router';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { act } from 'react-dom/test-utils';
import {
  EngagementContext,
  EngagementProvider,
} from '../../../context/engagement_context/engagement_context';
import { EngagementStartEndDateFormField } from '../../engagement_form_fields/engagement_dates';

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

describe('timezone select', () => {
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
describe('Engagement date start field', () => {
  let isLaunched: boolean;
  let engagement: Engagement;
  let calledChange;
  function resetValues() {
    calledChange = null;
    engagement = {} as Engagement;
    isLaunched = false;
  }
  beforeEach(() => {
    resetValues();
  });
  const Component = () => {
    calledChange = jest.fn();

    return (
      <MemoryRouter>
        <EngagementContext.Provider
          value={{
            currentEngagement: {
              launch: isLaunched ? { launched_by: 'a test' } : null,
            } as Engagement,
            updateEngagementFormField: (f, v) => {
              calledChange();
              engagement[f] = v;
            },
            currentChanges: engagement,
          }}
        >
          <EngagementSummaryEditModal
            isOpen={true}
            onSave={() => {}}
            onClose={() => {}}
          />
        </EngagementContext.Provider>
      </MemoryRouter>
    );
  };
  test('when an engagement has been launched, the start date can be set to any date', async () => {
    await act(async () => {
      engagement = {
        end_date: new Date(),
        archive_date: new Date(),
      } as Engagement;
      isLaunched = true;
      let view = render(<Component />);
      await fireEvent.change(await view.findByTestId('start_date_input'), {
        target: { value: '2000-05-01' },
      });
      expect(calledChange).toHaveBeenCalled();
      view.rerender(<Component />);
      expect(await view.findByTestId('start_date_input')).toHaveValue(
        '2000-05-01'
      );
    });
  });
  test('when an engagement has NOT been launched, the start date can be set to any date', async () => {
    await act(async () => {
      engagement = {
        end_date: new Date(),
        archive_date: new Date(),
      } as Engagement;
      isLaunched = false;
      let view = render(<Component />);
      await fireEvent.change(await view.findByTestId('start_date_input'), {
        target: { value: '2000-05-01' },
      });
      expect(calledChange).toHaveBeenCalled();
      view.rerender(<Component />);
      expect(await view.findByTestId('start_date_input')).toHaveValue(
        '2000-05-01'
      );
    });
  });
});
describe('all dates', () => {
  const Component = () => {
    return (
      <MemoryRouter>
        <EngagementContext.Provider
          value={{
            currentEngagement: {} as Engagement,
            updateEngagementFormField: (f, v) => {
              engagement[f] = v;
            },
            currentChanges: engagement,
          }}
        >
          <EngagementSummaryEditModal
            isOpen={true}
            onSave={() => {}}
            onClose={() => {}}
          />
        </EngagementContext.Provider>
      </MemoryRouter>
    );
  };
  const dates = ['start_date', 'end_date', 'archive_date'];
  let engagement: Partial<Engagement> = {};
  beforeEach(() => {
    engagement = {};
  });
  test.each(dates)(
    'If the engagement is not launched, %p can be cleared',
    async currentDate => {
      await act(async () => {
        dates.forEach(d => (engagement[d] = new Date(2020, 0, 1)));
        const inputId = `${currentDate}_input`;
        const view = render(<Component />);
        const input = await view.findByTestId(inputId);
        fireEvent.change(input, { target: { value: '' } });
        view.rerender(<Component />);
        expect(await view.findByTestId(inputId)).toHaveValue('');
      });
    }
  );
});
describe('End date field', () => {
  test('If the engagement is launched, the end date cannot be set to the past. The end date can be set to today', async () => {
    expect(true).toBe(false);
  });
  test('by default, the archive date is equal to the end date + the default grace period', async () => {
    expect(true).toBe(false);
  });
  test('Archive date can be changed to any date after the end date up to the max grace period', async () => {
    expect(true).toBe(false);
  });
  test('If you change the end date, the archive date is the end date + the previous difference between the archive date and the end date, not to exceed the max grace period', async () => {
    expect(true).toBe(false);
  });
  test('If the engagement is launched, the archive date can be set to today, but not the past (same as above)', async () => {
    expect(true).toBe(false);
  });
  test('If the archive and end date are set, then the end date is cleared, then the end date is set again, the archive date is set to the default suggested value (end date + grace period, not to exceed max grace)', async () => {
    expect(true).toBe(false);
  });
});
