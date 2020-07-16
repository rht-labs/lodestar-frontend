describe('Login', () => {
  it('sso login', () => {
    cy.login(
        Cypress.env('SSO_URL'),
        Cypress.env('SSO_USER'),
        Cypress.env('SSO_PASSWORD')
    );
  });
});

describe('new engagement', () => {

  it('creates a new engagement', () => {

    cy.server();
    cy.route({method: 'POST', url: 'engagements'}).as('createCheck');

    cy.visit('http://localhost:3000');
    cy.request('/app');

    cy.get('[data-cy=get_started_button]')
        .click();

    cy.request('/app/dashboard');

    cy.get('#nav-toggle')
        .click();

    cy.contains('Engagements');
    cy.contains('Create New').click();

    cy.get('#customer_dropdown')
        .click()
        .get('[data-testid=NASA]')
        .click();

    cy.get('[data-cy=new_engagement_name]')
        .type('cypressio 3')
        .get('[data-cy=createNewEngagement]')
        .click();

    // cy.wait('@createCheck').should('have.property', 'status', 201);
    //
    // cy.get('li > .pf-c-alert')
    //     .contains('Your engagement has been successfully created');

    cy.get('.pf-c-alert__action > .pf-c-button')
        .click();

    //
    // cy.contains('Users').click();
    //
    // cy.contains('Add User').click();
    //
    // cy.get('input[name=last-name]')
    //   .type('Lowry')
    //   .get('input[name=first-name]')
    //   .type('Kyle')
    //   .get('input[name=email]')
    //   .type('lowry@redhat.com')
    //   .get('[aria-label="User Role"]')
    //   .select('Admin')
    //   .should('have.value', 'admin');
    //
    // cy.get('[data-cy=engagement-save]').click();
    //
    // cy.wait('@saveCheck').should('have.property', 'status', 200);
    //
    // cy.contains('Basic Information').click();
    // cy.get('[data-cy=launch]').click();
    // cy.wait('@launchCheck').should('have.property', 'status', 200);
    //
    // cy.get('[data-cy=launch]').should('be.disabled');
  });

  it.skip('Edit engagement summary', () => {
    cy.get('button[data-cy=edit_summary_card]')
        .click();

    cy.get('textarea[data-cy=description_field]')
        .clear()
        .type('Herp derpsum derp herpy le nerpy terp jerpy derpy.')
        .get('input[data-cy=location_field]')
        .clear()
        .type('Katmandu, Nepal')
        .get('input[data-cy=start_date_input]')
        .type('2020-10-25')
        .get('input[data-cy=end_date_input]')
        .type('2020-12-25');

    cy.get('button[data-cy=save_summary_card]')
        .click();

    cy.get('.pf-c-alert__action > .pf-c-button')
        .click();
  });

  it.skip('Edit points of contact', () => {

    cy.get('[data-cy="points_of_contact"]')
        .click();

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

    cy.get('[data-cy=save_point_of_contact]')
        .click();

    cy.get('.pf-c-alert__action > .pf-c-button')
        .click();
  });


  it.skip('Edit hosting environment', () => {

    cy.get('[data-cy="hosting_env_button"]')
        .click();

    cy.get('#cloud_provider_dropdown')
        .select('AWS',{ force: true })
        .should('have.value', 'ec2')
        .get('#cloud_provider_region_dropdown')
        .select('eu-west-3',{ force: true })
        .should('have.value', 'eu-west-3')
        .get('#oc_version_dropdown')
        .select('v4.1',{ force: true })
        .should('have.value', '4.1.41')
        .get('[data-cy=desired_subdomain_input]')
        .clear()
        .type('cypress_test')
        .get('#persistent_storage_dropdown')
        .select('50G',{ force: true })
        .should('have.value', '50G')
        .get('#cluster_size_dropdown')
        .select('Small', { force: true })
        .should('have.value', 'small');

    cy.get('[data-cy=hosting_env_save]')
        .click();

    cy.get('.pf-c-alert__action > .pf-c-button')
        .click();

  });

  it('Edit engagement users', () => {
    cy.get('button[data-cy=edit_user_button]')
        .click();
    cy.get('button[data-cy=add_new_user]')
        .click();

    cy.get('[data-cy=input_user_firstname]')
        .clear()
        .type('Sara')
        .get('input[data-cy=input_user_lastname]')
        .clear()
        .type('Kim')
        .get('input[data-cy=input_user_email]')
        .type('sara.kim@test.net')
        .get('#user_role_dropdown')
        .select('developer', { force: true })
        .should('have.value', 'developer');

    cy.get('button[data-cy=save_users]')
        .click();

    cy.get('.pf-c-alert__action > .pf-c-button')
        .click();
  });
});
