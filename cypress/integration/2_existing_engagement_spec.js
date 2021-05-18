/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('existing engagement engagement', () => {
  beforeEach('Login', () => {
    cy.login();
  });

  it('searches for an engagement', () => {
    cy.visit('/app/engagements/all');
    cy.get('[data-cy=search_input]').should('exist');
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
