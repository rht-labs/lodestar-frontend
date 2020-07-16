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

    // Edit Engagement Summary
    cy.get('button[data-cy=edit_summary_card]')
        .click();

    cy.get('textarea[data-cy=description_field]')
        .type('Herp derpsum derp herpy le nerpy terp jerpy derpy.')
        .get('input[data-cy=location_field]')
        .type('Katmandu, Nepal')
        .get('input[data-cy=start_date_input]')
        .type('2020-10-25')
        .get('input[data-cy=end_date_input]')
        .type('2020-12-25');

    cy.get('button[data-cy=save_summary_card]')
        .click();
    cy.get('li > .pf-c-alert')
        .contains('Your updates have been successfully saved.')

    cy.get('.pf-c-alert__action > .pf-c-button')
        .click();

    // Edit points of contact
    cy.get('[data-cy="points_of_contact"]')
        .click();

    cy.get('[data-cy="engagement_lead_name"]')
        .type('Test EL')
        .get('[data-cy=engagement_lead_email]')
        .type('test.el@redhat.com')
        .get('[data-cy=tech_lead_name]')
        .type('Test tech')
        .get('[data-cy=tech_lead_email]')
        .type('test.tech@redhat.com')
        .get('[data-cy=customer_contact_name]')
        .type('Test Customer')
        .get('[data-cy=customer_contact_email]')
        .type('test@customer.com');

    cy.get('[data-cy=save_point_of_contact]')
        .click();

    // Edit points of contact
    cy.get('[data-cy="points_of_contact"]')
        .click();

    cy.get('[data-cy="engagement_lead_name"]')
        .type('Test EL')
        .get('[data-cy=engagement_lead_email]')
        .type('test.el@redhat.com')
        .get('[data-cy=tech_lead_name]')
        .type('Test tech')
        .get('[data-cy=tech_lead_email]')
        .type('test.tech@redhat.com')
        .get('[data-cy=customer_contact_name]')
        .type('Test Customer')
        .get('[data-cy=customer_contact_email]')
        .type('test@customer.com');

    cy.get('[data-cy=save_point_of_contact]')
        .click();

    // cy.contains('OpenShift Cluster').click();
    //
    // cy.get('[aria-label="Cloud provider region"]')
    //   .select('us-east-1')
    //   .should('have.value', 'us-east-1')
    //   .get('[aria-label="OpenShift Version"]')
    //   .select('v4.4')
    //   .should('have.value', '4.4.3')
    //   .get('input[name=ocp_sub_domain]')
    //   .should('have.value', 'cypressi')
    //   .get('[aria-label="Persistent Storage Needs"]')
    //   .select('50GB')
    //   .should('have.value', '50G');
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
});
