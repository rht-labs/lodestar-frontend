// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (url, email, password) => {
  cy.request({
    form: true,
    method: 'POST',
    url: url,
    body: {
      username: email,
      password: password,
      grant_type: 'password',
      client_id: 'open-management-portal',
    },
  }).then(resp => {
    const jwt = resp.body;
    const currentTime = new Date();
    const accessTokenExpiry = new Date(
      currentTime.getTime() + jwt.expires_in * 100000
    ).toISOString();
    const refreshTokenExpiry = new Date(
      currentTime.getTime() + jwt.refresh_expires_in * 100000
    ).toISOString();

    var elToken = {
      accessToken: jwt.access_token,
      accessTokenExpiry: accessTokenExpiry,
      refreshToken: jwt.refresh_token,
      refreshTokenExpiry: refreshTokenExpiry,
    };

    window.localStorage.setItem('token', JSON.stringify(elToken));
  });
});
