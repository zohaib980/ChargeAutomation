export class PropertiesPage {
    goToProperties() {
        cy.get('.settings_dropdown [id="navbarDropdown"]').should('exist').click() //settings icon
        cy.get('[aria-labelledby="navbarDropdown"] [href*="/properties"]').should('contain.text', 'Properties').click() //Properties
        cy.get('.page-title').should('contain.text', 'Properties') //Validate Heading
        cy.wait(5000)
    }
    enableProperty(propName) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('[class="property-card property-disconnected"] [title="' + propName + '"]').if().parents('[class="for-booking-list-page-only-outer t-b-padding-lg-10"]')
            .find('[class="checkbox-label"]').click({ force: true })
        cy.wait(2000)
        cy.get('.toast-success').if().should('contain.text', 'Property connected successfully') //toast
    }
    disableProperty(propName) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('[class="property-card property-connected"] [title="' + propName + '"]').if().parents('[class="for-booking-list-page-only-outer t-b-padding-lg-10"]')
            .find('[class="checkbox-label"]').click({ force: true })
        cy.wait(2000)
        //Validate popup
        cy.get('[class="view-edit-title"]').if().should('contain.text', 'Are you sure you want to disconnect this property? Disconnecting will mean')
        cy.get('.swal2-confirm').if().should('contain.text', 'Yes, disconnect').click().wait(1000) //Confirm button
        cy.get('.toast-success').if().should('contain.text', 'Property disconnected successfully') //toast
    }
    goToRentals(index) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('[href*="/client/v2/rentals/"]').eq(parseInt(index)-1).should('be.visible').and('contain.text', 'Rental').invoke('removeAttr', 'target').click()
    }

}