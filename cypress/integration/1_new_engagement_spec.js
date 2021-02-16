/// <reference types="cypress" />



describe('new engagement', () => {
  const uuid = () => Cypress._.random(0, 1e6);
  const id = uuid();
  const testEngagementName = `cypressio_${id}`;
  const customerName = 'Ldstr E2E';
  const reqUrl = `engagements/customers/${customerName}/projects/${testEngagementName}`;

  beforeEach('Login', () => {
    cy.login();

    cy.fixture('users')
      .then((users) => {
        // "this" is still the test context object
        this.users = users;
      });

      cy.server();
      cy.route({ method: 'PUT', url: reqUrl }).as('saveEngagement');
  });

  it('creates a new engagement', () => {
    cy.server();
    cy.route({ method: 'POST', url: 'engagements' }).as('createEngagement');

    cy.visit('/app/dashboard');

    cy.toggleNav();

    cy.contains('Engagements');
    cy.contains('Create New').click();
    cy.toggleNav();
    cy.wait(2000);

    cy.get('[id=customer_dropdown-select-typeahead]')
      .type(customerName)
    cy.contains(customerName)
      .click();

    cy.get('[data-cy=project-name]').type(testEngagementName);
    cy.get('[data-cy=new_engagement_region]').select('DEV').should('have.value', 'dev-1');
    cy.get('[data-cy=createNewEngagement]').click();

    cy.wait('@createEngagement').should('have.property', 'status', 201);

    cy.get('li > .pf-c-alert').contains(
      'Your engagement has been successfully created'
    );

    cy.get('[data-cy=launch_button]').should('be.disabled');

    cy.get('.pf-c-alert__action > .pf-c-button').click();
  });

  it('Edit engagement summary', () => {
    const format = 'YYYY-MM-DD';
    const start = Cypress.moment().startOf('day').subtract(14, 'days').format(format);
    const end = Cypress.moment().startOf('day').add(14, 'days').format(format);
    const retire = Cypress.moment().startOf('day').add(44, 'days').format(format);
    
    cy.get('[data-cy=edit_summary_card]').click();

    cy.get('input[data-cy=description_field]')
      .clear()
      .type('Test description')
      .get('input[data-cy=location_field]')
      .clear()
      .type('Katmandu, Nepal')
      .get('input[data-cy=start_date_input]')
      .type(start)
      .should('have.value', start)
      .get('input[data-cy=end_date_input]')
      .type(end)
      .should('have.value', end);

    cy.get('input[data-cy=description_field]').click('bottomLeft');

    cy.get('[data-cy=retirement_date_input]').should(
      'have.value',
      retire
    );

    cy.get('button[data-cy=save_summary_card]').click();

    cy.wait('@saveEngagement').should('have.property', 'status', 200);
    cy.get('[data-cy=launch_button]').should('be.disabled');

    // cy.get('li > .pf-c-alert')
    //     .contains('Your updates have been successfully saved.');

    cy.get('.pf-c-alert__action > .pf-c-button').click();
    cy.waitForLoadingBackdropToDisappear();
  });

  it('Edit points of contact', () => {
    cy.get('[data-cy="points_of_contact"]').click();

    cy.get('[data-cy="engagement_lead_name"]')
      .clear()
      .type('Test EL')
      .get('[data-cy=engagement_lead_email]')
      .clear()
      .type('test.el@redhat.com')
      .get('[data-cy=tech_lead_name]')
      .clear()
      .type('Test tech')
      .get('[data-cy=tech_lead_email]')
      .clear()
      .type('test.tech@redhat.com')
      .get('[data-cy=customer_contact_name]')
      .clear()
      .type('Test Customer')
      .get('[data-cy=customer_contact_email]')
      .clear()
      .type('test@customer.com');

    cy.get('[data-cy=save_point_of_contact]').click();

    cy.wait('@saveEngagement').should('have.property', 'status', 200);

    cy.get('[data-cy=launch_button]').contains('Launch').should('be.enabled');

    cy.get('.pf-c-alert__action > .pf-c-button').click();
  });

  it('Edit hosting environment', () => {
    cy.get('[data-cy="hosting_env_button"]').click({waitForAnimations: true, animationDistanceThreshold: 100});

    cy.get('[data-cy=hosting_environment_name]' {timeout: 7000})
      .type('Test Env 1')
      .get('#cloud_provider_dropdown')
      .select('AWS', { force: true })
      .should('have.value', 'ec2')
      .get('[data-cy=provider-region-select]')
      .select('eu-west-3', { force: true })
      .should('have.value', 'eu-west-3')
      .get('[data-cy=oc_version_select]')
      .select('v4.5', { force: true })
      .should('have.value', '4.5.18')
      .get('[data-cy=desired_subdomain_input]')
      .clear()
      .type(testEngagementName)
      .get('#persistent_storage_dropdown')
      .select('50G', { force: true })
      .should('have.value', '50G')
      .get('#cluster_size_dropdown')
      .select('Small', { force: true })
      .should('have.value', 'small');

    cy.get('[data-cy=hosting_env_save]').click();

    cy.wait('@saveEngagement').should('have.property', 'status', 200);

    cy.get('.pf-c-alert__action > .pf-c-button').click();
  });

  it('Edit engagement users', () => {

    cy.get('button[data-cy=edit_user_button]').click();
    cy.get('button[data-cy=add_new_user]').click();

    cy.get('input[data-cy=input_user_email]', {timeout: 2000})
      .each(($el, index, $list) => {
        cy.wrap($el).clear().type((this.users[index].email);
      })
      .get('[data-cy=input_user_firstname]')
      .each(($el, index, $list) => {
        cy.wrap($el).clear().type(this.users[index].first_name);
      })
      .get('input[data-cy=input_user_lastname]')
      .each(($el, index, $list) => {
        cy.wrap($el).clear().type(this.users[index].last_name);
      })
      .get('[data-cy=user_role_dropdown]')
      .each(($el, index, $list) => {
        cy.wrap($el)
          .select(this.users[index].role, { force: true })
          .should('have.value', this.users[index].role_value);
      })

    cy.get('button[data-cy=save_users]').click();

    cy.wait('@saveEngagement').should('have.property', 'status', 200);

    cy.get('.pf-c-alert__action > .pf-c-button').click();
  });

  it('Launch engagement', () => {
    cy.server();
    cy.route({ method: 'PUT', url: 'engagements/launch' }).as(
      'launchEngagement'
    );

    cy.get('[data-cy=launch_button]').click();

    cy.wait('@launchEngagement').should('have.property', 'status', 200);

    cy.get('li > .pf-c-alert > .pf-c-alert__title').contains(
      'You have successfully launched your engagement!'
    );
  });
});
