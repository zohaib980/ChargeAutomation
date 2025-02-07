

export class TemplateMessages {
    goToTemplateMessages() {
        cy.get('.settings_dropdown').should('exist').click() //Setting icon
        cy.get('#manageEmails-submenu').should('exist').and('contain.text', 'Template Messages').click({ force: true }) // Template Messages
    }
    applyEmailSettingsOnTemplate(templateName, duration, whenToApply)
    {
        cy.get('.page-title').should('be.visible').and('contain.text', 'Preferences Settings') //heading
        cy.get('#email-type-selector').should('be.visible').click() // email template selector
        cy.get('[class="col-md-4"] li').contains(templateName).should('be.visible').click().wait(1000) //Template Option
        cy.get('#whenToSendSectionHeadingOne .booking-accordion-title').should('be.visible')
            .and('contain.text', 'When To Send '+ templateName +' email')
        cy.get('[class="booking-accordion-title collapsed d-xs-block"]').eq(0).should('exist').click().wait(2000) //expand
        cy.get('[aria-expanded="false"] [class="booking-accordion-title collapsed d-xs-block"]').if().click() //expand
        cy.get('[class="form-control form-control-sm custom-select-arrow"]').eq(1).select(duration).wait(500) //Email immediately
        cy.get('#p-English tbody td:nth-last-of-type(2) [class="form-control form-control-sm custom-select-arrow"]').select(whenToApply) // Before checkin
        cy.get('#p-English [class="accordion-footer mt-3"] .btn-success').should('contain.text', 'Save').click() //Save Email Changes
        cy.verifyToast('Updated Successfully!')
    }
}