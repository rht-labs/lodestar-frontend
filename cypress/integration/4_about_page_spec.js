/// <reference types="cypress" />

describe('about page', () => {

  beforeEach('Login', () => {
    cy.login(
        Cypress.env('SSO_URL'),
        Cypress.env('SSO_USER'),
        Cypress.env('SSO_PASSWORD')
    );
  });

  it('shows the right LodeStar version', () => {
    cy.visit('/app/about');
    cy.contains('About');

    cy.contains('Version');

    cy.get('[data-cy=lodestar_version]')
        .should('not.be.empty');
    cy.get('[data-cy=lodestar_version]')
        .should('not.have.value', 'Unknown');
  });

  it('shows the support email address', () => {
    cy.contains('Need Help?');

    cy.get('[data-cy=support_email]')
        .should('not.be.empty');
  });

});