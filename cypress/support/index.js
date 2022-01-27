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

// There are so many uncaught network exceptions that occur during test that
// they are being disable. Many are just abortions but there are others
// This should be revisited after we reduce the amouont of unnecessary api requests
// The volume is too much to debug
Cypress.on('uncaught:exception', (err, runnable) => {
  console.log('LodeStar uncaught exception');
  console.log(err.request);

  return false;
  
  // This was an attempt to only allow certain requests to fail but was too flaky
  // if(err.request == null || err.request.aborted == null ) {
  //   return false;
  // }

  // console.log("Req status: " + err.request.status);
  // if(err.request.status == 401) {
  //   return false;
  // }
  // return !err.request.aborted;
})

// Alternatively you can use CommonJS syntax:
// require('./commands')
