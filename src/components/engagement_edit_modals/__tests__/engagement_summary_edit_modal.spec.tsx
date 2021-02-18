import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  screen,
  RenderResult,
} from '@testing-library/react';
import { EngagementSummaryEditModal } from '../engagement_summary_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import MockDate from 'mockdate';
import { MemoryRouter } from 'react-router';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { act } from 'react-dom/test-utils';
import { validatorsWithDateValidators } from '../../../routes/engagement_details/engagement_details';
import {
  ValidationContext,
  ValidationProvider,
} from '../../../context/validation_context/validation_context';
import { EngagementContext } from '../../../context/engagement_context/engagement_context';
import { EngagementFormConfig } from '../../../schemas/engagement_config';

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
describe('Engagement Dates', () => {
  let engagement: Partial<Engagement> = {};
  let view: RenderResult;
  const Component = ({
    currentChanges = engagement,
    currentEngagement = {},
    updateEngagementFormField = (f, v) => (engagement[f] = v),
  }: {
    currentChanges?: Partial<Engagement>;
    isLaunched?: boolean;
    currentEngagement?: Partial<Engagement>;
    updateEngagementFormField?: (f, v) => void;
  }) => {
    return (
      <MemoryRouter>
        <EngagementContext.Provider
          value={{
            currentEngagement,
            updateEngagementFormField,
            currentChanges,
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
  beforeEach(() => {
    engagement = {};
  });
  test.each(dates)(
    'If the engagement is not launched, %p can be cleared',
    async currentDate => {
      const currentEngagement = {};
      dates.forEach(d => (currentEngagement[d] = new Date(2020, 0, 1)));
      view = render(<Component currentEngagement={currentEngagement} />);
      const inputId = `${currentDate}_input`;
      const input = await view.findByTestId(inputId);
      fireEvent.change(input, { target: { value: '' } });
      view.rerender(<Component currentEngagement={currentEngagement} />);
      expect(await view.findByTestId(inputId)).toHaveValue('');
      expect(engagement[currentDate]).toBe(undefined);
    }
  );
});

describe('Engagement Summary Edit Modal > Archive Date', () => {
  let engagement: Partial<Engagement> = {};
  let updateEngagement = (f, v) => (engagement[f] = v);
  beforeEach(() => {
    engagement = {};
  });
  const Component = ({
    engagementFormConfig = EngagementFormConfig.fromFake(),
    currentEngagement,
    currentEngagementChanges = engagement,
  }: {
    engagementFormConfig: EngagementFormConfig;
    currentEngagement: Partial<Engagement>;
    currentEngagementChanges: Partial<Engagement>;
  }) => {
    return (
      <MemoryRouter>
        <EngagementContext.Provider
          value={{
            engagementFormConfig,
            updateEngagementFormField: updateEngagement,
            currentChanges: currentEngagementChanges,
            currentEngagement,
          }}
        >
          <ValidationProvider
            validators={validatorsWithDateValidators(
              {},
              currentEngagementChanges
            )}
          >
            <EngagementSummaryEditModal isOpen={true} />
          </ValidationProvider>
        </EngagementContext.Provider>
      </MemoryRouter>
    );
  };
  test('if the archive date is undefined, and the end date is set, the archive date should be set to the end date plus the default grace period', async () => {
    const fakedConfig = {
      ...EngagementFormConfig.fromFake(),
      logistics_options: { env_default_grace_period: 90 },
    };
    const view = render(<Component engagementFormConfig={fakedConfig} />);

    await fireEvent.change(await view.findByTestId('end_date_input'), {
      target: { value: '2020-01-01' },
    });
    view.rerender(
      <Component engagementFormConfig={fakedConfig} engagement={engagement} />
    );

    expect(await view.findByTestId('archive_date_input')).toHaveValue(
      '2020-03-30'
    );
  });
  test('if the archive date is defined, but not committed to the backend, and the end date is set, the archive date should be set to the delta of the previous end date and archive date', async () => {
    engagement = {
      archive_date: new Date(2020, 0, 14),
      end_date: new Date(2020, 0, 1),
    };
    await act(async () => {
      const fakedConfig = {
        ...EngagementFormConfig.fromFake(),
        logistics_options: { env_default_grace_period: 90 },
      };
      const view = render(<Component engagementFormConfig={fakedConfig} />);

      await fireEvent.change(await view.findByTestId('end_date_input'), {
        target: { value: '2020-02-01' },
      });
      view.rerender(<Component engagementFormConfig={fakedConfig} />);

      expect(await view.findByTestId('archive_date_input')).toHaveValue(
        '2020-02-14'
      );
    });
  });
  const INVALID_CONFIGURATIONS: Array<[
    string,
    Pick<Engagement, 'start_date' | 'archive_date' | 'end_date'>
  ]> = [
    [
      'End date must be after the start date',
      {
        /// The end date before the start date
        start_date: new Date(2021, 1, 1),
        end_date: new Date(2020, 1, 1),
        archive_date: new Date(2020, 1, 1),
      },
    ],
    [
      'Archive date must be after the end date',
      {
        /// The archive date before the end date
        start_date: new Date(2021, 0, 1),
        end_date: new Date(2021, 0, 3),
        archive_date: new Date(2021, 0, 2),
      },
    ],
  ];
  test('save button should be disabled when the engagement is launched and the dates are in an invalid configuration', async () => {
    const view = render(<Component currentEngagement={{ launch: {} }} />);
    for (const invalidConfig of INVALID_CONFIGURATIONS) {
      engagement = invalidConfig[1];
      view.rerender(<Component currentEngagement={{ launch: {} }} />);

      expect(
        await view.findByTestId('engagement-summary-save')
      ).toHaveAttribute('disabled');
    }
  });
  test('validation messages should be shown when the dates are in an invalid configuration', async () => {
    const view = render(<Component />);
    for (const invalidConfig of INVALID_CONFIGURATIONS) {
      engagement = invalidConfig[1];
      view.rerender(<Component />);
      await waitFor(() =>
        expect(screen.getByText(invalidConfig[0])).toBeDefined()
      );
    }
  });
});
