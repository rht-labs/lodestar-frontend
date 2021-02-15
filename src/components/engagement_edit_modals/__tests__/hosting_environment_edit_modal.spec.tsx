import React from 'react';
import {
  render,
  fireEvent,
  act,
  waitFor,
  screen,
  RenderResult,
} from '@testing-library/react';
import { OpenShiftClusterEditModal } from '../hosting_environment_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import { HostingEnvironment } from '../../../schemas/hosting_environment';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { ServiceProviderContext } from '../../../context/service_provider_context/service_provider_context';

describe('Hosting Environment edit modal', () => {
  test('matches snapshot', async () => {
    await act(async () => {
      const rendered = render(
        <TestStateWrapper>
          <OpenShiftClusterEditModal
            onSave={() => {}}
            isOpen={true}
            hostingEnvironment={HostingEnvironment.fromFake(true)}
            isEngagementLaunched={false}
            onClose={() => {}}
          />
        </TestStateWrapper>
      );
      await waitFor(() =>
        expect(screen.getByTestId('he_edit_modal')).toBeDefined()
      );

      expect(rendered).toMatchSnapshot();
    });
  });

  test('When clicking the save button, the onSave method is called', async () => {
    await act(async () => {
      const onSave = jest.fn();
      const { findByTestId } = render(
        <TestStateWrapper>
          <OpenShiftClusterEditModal
            onSave={onSave}
            hostingEnvironment={
              Engagement.fromFake(true).hosting_environments[0]
            }
            isOpen={true}
            isEngagementLaunched={false}
            onClose={() => {}}
          />
        </TestStateWrapper>
      );

      await fireEvent.click(await findByTestId('oc-edit-save'));
      expect(onSave).toHaveBeenCalled();
    });
  });

  test('When an engagement has not been launched, the hosting environment edit modal allows saves even if the information is incomplete', async () => {
    let view: RenderResult;
    const onSave = jest.fn();
    const setHostingEnv = jest.fn();
    await act(async () => {
      view = render(
        <TestStateWrapper>
          <ServiceProviderContext.Consumer>
            {serviceProviders => (
              <ServiceProviderContext.Provider
                value={{
                  ...serviceProviders,
                  engagementService: {
                    ...serviceProviders.engagementService,
                    checkSubdomainUniqueness: async () => false,
                  },
                }}
              >
                <OpenShiftClusterEditModal
                  setHostingEnvironment={setHostingEnv}
                  onSave={onSave}
                  hostingEnvironment={{} as HostingEnvironment}
                  isOpen={true}
                  isEngagementLaunched={false}
                  onClose={() => {}}
                />
              </ServiceProviderContext.Provider>
            )}
          </ServiceProviderContext.Consumer>
        </TestStateWrapper>
      );
    });
    expect(view).toBeDefined();
    const findButton = () => view.findByTestId('oc-edit-save');
    await act(async () => {
      const button = await findButton();
      expect(button).not.toHaveAttribute('disabled');
      expect(await view.findByTestId('oc-edit-save'));
      const subdomainInput = await view.findByTestId('desired_subdomain_input');
      expect(subdomainInput).toBeDefined();
      await fireEvent.change(subdomainInput, { target: { value: 'asdf' } });
      expect(setHostingEnv).toHaveBeenCalledWith({ ocp_sub_domain: 'asdf' });
    });
    expect(await findButton()).not.toHaveAttribute('disabled');
  });
  test('Once an engagement has launched, a hosting environment may not be saved if that environment is not complete and valid', async () => {
    let he: Partial<HostingEnvironment> = {};
    const Component = ({ env }) => (
      <TestStateWrapper>
        <OpenShiftClusterEditModal
          setHostingEnvironment={() => {}}
          onSave={() => {}}
          hostingEnvironment={env}
          isOpen={true}
          isEngagementLaunched={true}
          onClose={() => {}}
        />
      </TestStateWrapper>
    );
    const requiredHeFields: Array<keyof HostingEnvironment> = [
      'ocp_cloud_provider_name',
      'ocp_cloud_provider_region',
      'ocp_cluster_size',
      'ocp_persistent_storage_size',
      'ocp_sub_domain',
      'ocp_version',
    ];

    const view = render(<Component env={{}} />);
    for (let field of requiredHeFields) {
      he = HostingEnvironment.fromFake(true);
      delete he[field];
      view.rerender(<Component env={he} />);
      expect(await view.findByTestId('oc-edit-save')).toHaveAttribute(
        'disabled'
      );
    }
  });
});
