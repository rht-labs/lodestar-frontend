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

Cypress.Commands.add(
  'login',
  ({
    url = Cypress.env('SSO_URL'),
    email = Cypress.env('SSO_USER'),
    password = Cypress.env('SSO_PASSWORD'),
    client_id = Cypress.env('SSO_CLIENT_ID'),
  } = {}) => {
    cy.request({
      form: true,
      method: 'POST',
      url: url,
      failOnStatusCode: false,
      body: {
        username: email,
        password: password,
        grant_type: 'password',
        client_id: client_id,
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
  }
);

Cypress.Commands.add('toggleNav', () => {
  try {
    cy.get('#nav-toggle').click();
  } catch (e) {
    console.warn('the nav toggle was not found');
  }
});

Cypress.Commands.add('waitForLoadingBackdropToDisappear', () => {
  return new Promise(async (resolve, reject) => {
    let timeout;
    let interval;
    try {
      const loaderChecker = await new Promise((resolve, reject) => {
        interval = setInterval(() => {
          try {
            cy.get('#omp-loader-backdrop');
          } catch (e) {
            clearInterval(loaderChecker);
            resolve();
          }
        }, 500);
      });
      timeout = setTimeout(() => {
        clearInterval(interval);
        resolve();
      }, 5000);
    } finally {
      clearTimeout(timeout);
      clearInterval(interval);
      resolve();
    }
  });
});
