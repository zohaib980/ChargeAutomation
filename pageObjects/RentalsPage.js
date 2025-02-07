export class RentalsPage {

    addRental() {
        cy.get('.loading-label').should('exist')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.left-sidebar .active').should('be.visible').and('contain.text', 'Rental Info') //Rental Info tab
        cy.get('.rental-body > .btn-sm').should('be.visible').and('contain.text', '+ Add New Rental').click().wait(1000) //+ Add New Rental button
        cy.get('.card:last-child [placeholder="Rental name"]').invoke('val').then(rentalName => {
            cy.get('button.cac-button--primary').eq(0).should('contain.text', 'Save').click() //Save rental top one
            cy.verifyToast('Rental has been saved successfully')
            cy.get('.loading-label').should('not.exist') //loader should be disappear
            cy.log(rentalName + " is added")
        })
        cy.wait(5000)
    }
    removeRental() {
        cy.get('.loading-label').should('exist')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.left-sidebar .active').should('be.visible').and('contain.text', 'Rental Info') //Rental Info tab
        cy.get('.card:last-child [data-target*="#collapse-rental-heading"]').invoke('val').then(rentalName => {
            cy.get('.card:last-child .rental-option [data-toggle="dropdown"] i').should('exist').click() //3 dot icon on last rental
            cy.get('[class="dropdown-menu dropdown-menu-right show"] button:nth-child(2)').click() //delete
            cy.get('.view-edit-title').should('be.visible').and('contain.text', 'You are about to delete a rental') //confirmation modal
            cy.get('.view-edit-desc').should('contain.text', 'This will delete your rental from rental list. Are you sure you want to delete?')
            cy.get('.swal2-confirm').should('contain.text', 'Delete').and('be.visible').click().wait(1000) //delete on modal
            cy.verifyToast('Rental deleted successfully')
            cy.get('.loading-label').should('not.exist') //loader should be disappear
            cy.log(rentalName + " is deleted!")
        })
        cy.get('button.cac-button--primary').eq(0).should('contain.text', 'Save').click() //Save rental top one
        cy.verifyToast('Rental has been saved successfully')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
    }
}