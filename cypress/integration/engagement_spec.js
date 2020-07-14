describe('New engagement', () => {
  beforeEach(() => {
    cy.login(
        Cypress.env('SSO_URL'),
        Cypress.env('SSO_USER'),
        Cypress.env('SSO_PASSWORD')
    );
  });

  it('create and save changes to newly created engagement', () => {

    cy.server();
    cy.route({method: 'POST', url: 'engagements'}).as('createCheck');
    cy.route({
      method: 'PUT',
      url: 'engagements/customers/e2e/projects/cypressio',
    }).as('saveCheck');
    cy.route({method: 'PUT', url: 'engagements/launch'}).as('launchCheck');

    cy.visit('/app');

    cy.contains('Engagements');
    cy.contains('Create New').click();

    cy.get('#pf-toggle-id-18')
        .click()
        .get('[data-testid=NASA]')
        .click();

    cy.get('[data-cy=new_engagement_name]')
        .type('cypressio 3')
        .get('[data-cy=createNewEngagement]')
        .click();

    cy.wait('@createCheck').should('have.property', 'status', 201);

    cy.get('li > .pf-c-alert')
        .contains('Your engagement has been successfully created');

    // cy.get('input[name=location]')
    //   .should('have.value', '')
    //   .type('Katmandu, Nepal')
    //   .get('input[name=start_date]')
    //   .type('2020-10-25')
    //   .get('input[name=end_date]')
    //   .type('2020-12-25')
    //   .get('textarea[name=description]')
    //   .type('Herp derpsum derp herpy le nerpy terp jerpy derpy.');
    //
    // cy.contains('Point of Contact').click();
    //
    // cy.get('input[name=engagement-lead-name]').type('Morgan Reilly');
    // cy.get('input[name=engagement-lead-email]').type('morgan@redhat.com');
    // cy.get('input[name=tech-lead-name]').type('Jake Muzzin');
    // cy.get('input[name=tech-lead-email]').type('jake@redhat.com');
    // cy.get('input[name=customer-contact-name]').type('Andreas Johnsson');
    // cy.get('input[name=customer-contact-email]').type('andreas@redhat.com');
    //
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
