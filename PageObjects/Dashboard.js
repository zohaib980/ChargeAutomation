
export class Dashboard {
    goToDashboard()
    {
        cy.get('.navbar-nav [href*="/dashboard-new"]').click()
        cy.get('[class="page-title n-dashboard-title"]').should('contain.text','Welcome')
    }
    addNewCCinUpcomingBooking(index)
    {
        cy.get('[id*="add_credit_card_button"]').eq(index).should('exist').click().wait(3000) //The index of the booking from top
        cy.get('[id*="btn_add_new_guest_card"]').if().should('exist').click().wait(3000) //Add new credit card
        cy.get('#card-element').within(() => {
            cy.fillElementsInput('cardNumber', '4242424242424242');
            cy.fillElementsInput('cardExpiry', '1025'); // MMYY
            cy.fillElementsInput('cardCvc', '123');
            cy.fillElementsInput('postalCode', '10006');
          })
          cy.wait(2000)
        cy.get('.guest-card-footer [class="btn btn-sm btn-primary px-3"]').if().click() //Save button
        cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]').if().click() //Save & Use
        cy.get('[class="toast toast-success"]').should('contain.text','Card') //Success toast
    }
    uploadDocInUpcomingBooking(index)
    {
        cy.get('.booking-card-info [class="btn btn-xs translate"]:nth-child(2)').eq(index).should('exist').click() //The index of the booking from top
        cy.wait(2000)
        cy.get('[class*="upload-document-wrap"]').eq(0).should('exist').attachFile('Images/idCardFront.png').wait(1000)
        cy.get('[class*="upload-document-wrap"]').eq(1).should('exist').attachFile('Images/idCardBack.png').wait(1000)
        cy.get('[class*="upload-document-wrap"]').eq(2).should('exist').attachFile('Images/visaCard.png').wait(1000)
        cy.get('.modal-footer [class="btn btn-sm btn-primary px-3"]').eq(0).should('contain.text','Save').click({force: true}) //Save changes
        cy.wait(3000)
        cy.get('[class="toast-message"]').if().should('contain.text','Image uploaded successfully.') //Success toast
    }
}