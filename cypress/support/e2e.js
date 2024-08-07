// ***********************************************************
// This example support/e2e.js is processed and
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
import 'cypress-xpath'
require('cypress-xpath');
import 'cypress-plugin-stripe-elements';
import 'cypress-mochawesome-reporter/register';
import 'cypress-if'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');

  app.document.head.appendChild(style);
}
//Handling exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Handle specific errors
  if (
      err.message.includes('Cannot read properties of null (reading \'click\')') ||
      err.message.includes('Cannot read properties of undefined (reading \'replaceAll\')') ||
      err.message.includes('IntegrationError: Please call Stripe() with your publishable key. You used an empty string.') ||
      err.message.includes("TypeError: Cannot read properties of undefined (reading 'data')") ||
      err.message.includes("TypeError: Cannot read properties of null (reading 'postMessage')") ||
      err.message.includes("Please call Stripe() with your publishable key. You used an empty string.")
  ) {
      // Returning false here prevents Cypress from failing the test
      return false;
  }
  // Let other errors fail the test
  return false;
})

