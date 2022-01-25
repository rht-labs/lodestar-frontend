// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
  console.log('LodeStar uncaught exception');
  console.log(err);
  console.log(err.request);
  
  if(err.request == null || err.request.aborted == null) {
    return true;
  }
  return !err.request.aborted;
})

// Alternatively you can use CommonJS syntax:
// require('./commands')
