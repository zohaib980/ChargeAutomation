export class GuidebookPage {
    goToGuidebook() {
        cy.get('.navbar-nav-left [href*="/client/v2/guide-books"]').should('contain.text', 'Guidebook').click() //Guidebook menu option
        cy.get('.page-title').should('contain.text', 'Guides') //Heading

    }
    enableGuideBook(guidebook) {
        cy.get('.property-disconnected [title*="' + guidebook + '"]').if().should('exist').parents('.property-card')
            .find('[class*="col-2 col-xs-6 col-style text-center px-1"] [type="checkbox"]').click({ force: true }) //Enable the Test Property1 Guide
        cy.get('button[class="swal2-confirm swal2-styled"]').if().should('contain.text', 'Got it').click() //Got it on modal

    }
    disableGuideBook(guidebook) {
        cy.get('.property-connected [title*="' + guidebook + '"]').if().should('exist').parents('.property-card')
            .find('[class*="col-2 col-xs-6 col-style text-center px-1"] [type="checkbox"]').click({ force: true }) //Disable the Test Property1 Guide
        cy.get('button[class="swal2-confirm swal2-styled"]').if().should('contain.text', 'Yes').click() //Got it on modal

    }
}