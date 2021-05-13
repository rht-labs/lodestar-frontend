/* eslint-disable no-undef */
/// <reference types="cypress" />

describe('navigation', () => {
  beforeEach('Login', () => {
    cy.login();
  });

  it('navigates to the about page and toggle notification', () => {
    cy.visit('/app/dashboard');
    cy.contains('Dashboard');

    cy.get('[data-cy=about_link]')
      .click()
      .contains('About');

    cy.get('#notification_drawer').should('not.have.class', 'pf-m-expanded');

    cy.get('[data-cy=notification_badge]')
      .click()
      .get('#notification_drawer')
      .should('have.class', 'pf-m-expanded');

    cy.get('[data-cy=notification_badge]')
      .click()
      .get('#notification_drawer')
      .should('not.have.class', 'pf-m-expanded');
  });

  it('uses Navbar to navigate to ACTIVE engagements', () => {
    cy.visit('/app/dashboard');
    cy.contains('Dashboard');

    cy.toggleNav();

    cy.contains('Engagements');
    cy.contains('Active').click();

    cy.get('[data-cy=engagement_cards_section]')
      .find('[data-cy=active]')
      .its('length')
      .should('be.gte', 1);

    cy.get('[data-cy=upcoming]').should('not.exist');

    cy.get('[data-cy=past]').should('not.exist');
  });

  it('uses Navbar to navigate to UPCOMING engagements', () => {
    cy.contains('Upcoming').click();
    cy.get('[data-cy=active]').should('not.exist');
    cy.get('[data-cy=past]').should('not.exist');
  });

  it('uses Navbar to navigate to PAST engagements', () => {
    cy.contains('Past').click();
    cy.get('[data-cy=active]').should('not.exist');
    cy.get('[data-cy=upcoming]').should('not.exist');
  });

  it('toggles menu drawer', () => {
    cy.get('#nav-toggle')
      .click()
      .get('#page-sidebar')
      .should('have.class', 'pf-m-collapsed');
  });
});
