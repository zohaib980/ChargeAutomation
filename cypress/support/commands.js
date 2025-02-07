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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to handle iframes
Cypress.Commands.add('getIframeBody', (iframeSelector) => {
    return cy
        .get(iframeSelector)
        .its('0.contentDocument.body')
        .then(cy.wrap);
})
//Toast message
Cypress.Commands.add('verifyToast', (message) => {
    cy.get('.toast-message').should('contain.text', message).first().click({force:true}).wait(500)
    //cy.get('.toast-message').should('not.exist')
})
//Formated Date
Cypress.Commands.add('formatedCurrentDate', (type, daysToAdd = 0) => {
    const currentDate = new Date()
    // Add days if needed
    currentDate.setDate(currentDate.getDate() + daysToAdd)
    let formattedDate = null

    if (type === 1) {
        formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) // e.g., '18 September 2024'
    }
    if (type === 2) {
        formattedDate = currentDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) // e.g., '18 Sep'
    }
    if (type === 3) {
        formattedDate = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) // e.g., '18 Sep 2024'
    }
    // Wrap the result to make it chainable in Cypress
    return cy.wrap(formattedDate)
})
//Time: Hours Mins
Cypress.Commands.add('getCurrentHour', () => {
    const date = new Date()
    return date.getHours() // Returns hour in 0-23 format
})

Cypress.Commands.add('getCurrentMinute', () => {
    const date = new Date()
    return date.getMinutes() // Returns minute in 0-59 format
})
//Format Time
Cypress.Commands.add('formatTime', (hour, minute) => {
    const period = hour >= 12 ? 'pm' : 'am';
    const formattedHour = (hour % 12 || 12).toString().padStart(2, '0') // Ensure two digits for hour
    const formattedMinute = minute.toString().padStart(2, '0') // Ensure two digits for minutes
    return `${formattedHour}:${formattedMinute}${period}`
})

import 'cypress-file-upload';
require('@4tw/cypress-drag-drop')
require('cypress-xpath');
import 'cypress-if'
import 'cypress-wait-until';
import 'cypress-xpath'
import 'cypress-iframe'