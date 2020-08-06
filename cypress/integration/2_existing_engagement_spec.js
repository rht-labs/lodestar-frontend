/// <reference types="cypress" />

describe('existing engagement engagement', () => {
  beforeEach('Login', () => {
    cy.login();
  });

  it('navigate from dashboard to all engagements', () => {
    cy.visit('/app/dashboard');
    cy.contains('Dashboard');

    cy.get('[data-cy=numbers_of_l]').should('exist');
    cy.get('[data-cy=numbers_of_p]').should('exist');
    cy.get('[data-cy=numbers_of_c]').should('exist');
    cy.get('[data-cy=numbers_of_a]').should('exist');

    cy.get('[data-cy=button_l]').click();
  });

  it('can create new engagement by clicking the button', () => {
    cy.get('#button_create_new_engagement').click({ force: true });

    cy.get('[data-cy=cancel_button]').click();
  });

  it('searches for an engagement', () => {
    cy.get('[data-cy=search_input]').type('cypress');

    cy.get('[data-cy=engagement_cards_section]')
      .find('[data-cy=view_engagement_button]')
      .its('length')
      .should('be.gte', 1);
  });

  it('filters engagements', () => {
    cy.get('#filter_dropdown')
      .click({ force: true })
      .get('[data-testid=active]')
      .click();

    cy.get('[data-cy=engagement_cards_section]')
      .find('[data-cy=view_engagement_button]')
      .its('length')
      .should('be.gte', 1);
  });

  it('sorts engagements', () => {
    cy.get('#sort_dropdown')
      .click({ force: true })
      .get('[data-testid="Start Date Asc"]')
      .click();

    cy.get('[data-cy=engagement_cards_section]')
      .find('[data-cy=view_engagement_button]')
      .its('length')
      .should('be.gte', 1);
  });

  it('reset search criteria', () => {
    cy.get('[data-cy=search_input]').type('cypress');

    cy.get('[data-cy=reset_button]').click();

    cy.get('[data-cy=search_input]').should('have.value', '');

    cy.get('[data-cy=engagement_cards_section]')
      .find('[data-cy=view_engagement_button]')
      .its('length')
      .should('be.gte', 1);
  });
});
