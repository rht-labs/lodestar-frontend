/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('existing engagement engagement', () => {
  beforeEach('Login', () => {
    cy.login();
  });

  it('searches for an engagement', () => {
    cy.visit('/app/engagements/all');
    cy.get('[data-cy=search_input]').should('exist').type('cypress');

    cy.get('[data-cy=engagement_cards_section]')
      .find('[data-cy=view_engagement_button]')
      .its('length')
      .should('be.gte', 1);
  });

  it('filters engagements', () => {
    cy.get('#status_dropdown')
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
      .get('[data-testid="startDate-asc"]')
      .click();

    cy.get('[data-cy=engagement_cards_section]')
      .find('[data-cy=view_engagement_button]')
      .its('length')
      .should('be.gte', 1);
  });

  it('reset search criteria', () => {
    cy.get(`[aria-label="Open advanced search"]`)
      .click();

    cy.get('[data-cy=reset_button]').click();
    cy.get('[aria-label="Search input"]').should('exist').should('have.value', '');
    
    cy.get('[data-cy=category]').type('Category');
    cy.get('[data-cy=engagement-customer]').type('cypress hill')

    cy.get(`[aria-label="Open advanced search"]`)
      .click();
    
    cy.get('[aria-label="Search input"]').should('exist').should('have.value', "cypress hill category='Category'");

    cy.get('[aria-label="Reset"]').click();

    cy.get('[aria-label="Search input"]').should('exist').should('have.value', '');

    cy.get('[data-cy=engagement_cards_section]')
      .find('[data-cy=view_engagement_button]')
      .its('length')
      .should('be.gte', 1);
  });
});
