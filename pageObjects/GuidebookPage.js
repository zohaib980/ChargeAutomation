export class GuidebookPage {
    goToGuidebook() {
        cy.get('.navbar-nav-left [href*="/client/v2/guide-books"]').should('contain.text', 'Guidebook').click() //Guidebook menu option
        cy.get('.page-title').should('contain.text', 'Guides') //Heading

    }
    enableGuideBook(guidebook) {
        cy.get('.property-disconnected [title*="' + guidebook + '"]').if().should('exist').parents('.property-card')
            .find('[class*="col-2 col-xs-6 col-style text-center px-1"] [type="checkbox"]').click({ force: true }) //Enable the Test Property1 Guide
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('button[class="swal2-confirm swal2-styled"]').if().should('contain.text', 'Got it').click() //Got it on modal
    }
    disableGuideBook(guidebook) {
        cy.get('.property-connected [title*="' + guidebook + '"]').if().should('exist').parents('.property-card')
            .find('[class*="col-2 col-xs-6 col-style text-center px-1"] [type="checkbox"]').click({ force: true }) //Disable the Test Property1 Guide
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('button[class="swal2-confirm swal2-styled"]').if().should('contain.text', 'Yes').click() //Got it on modal
    }
    disableGuideBookForProperty(guidebook, propName) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('[title*="' + guidebook + '"]').if().should('be.visible').parents('.property-card')
            .find('.mobile-dropdown a[data-target="#m_modal_edit"]').click() //Edit icon
        cy.get('.loading-label').should('not.exist') //loader should be disappear 

        cy.get('#m_modal_edit h5.modal-title').should('be.visible').and('contain.text', 'Edit Guide').wait(1000) //heading on modal
        cy.get('#propertiesList').scrollIntoView().should('be.visible').click()
        cy.get('#propertiesList .cursor-pointer.collapsed').if().click() //expand it if not expanded
        //disable the property
        cy.get('.property-name').contains(propName).parents('.row.align-items-center')
            .find('.checkbox-toggle input[checked="checked"]').scrollIntoView().uncheck({ force: true }) //disable the toggle
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('[class="btn btn-success btn-sm px-3"]').should('exist').and('contain.text', 'Save').click({ force: true }) //Save
        cy.get('.view-edit-title')
            .should('be.visible')
            .then(($el) => {
                const text = $el.text();
                expect(text).to.satisfy((t) =>
                    t.includes('The guide is now published and available for guests.') ||
                    t.includes('The guide updated successfully')
                );
            })
        cy.get('button[class="swal2-confirm swal2-styled"]').should('contain.text', 'OK').click() //OK on modal
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
    }
    enableGuideBookForProperty(guidebook, propName) {
        this.enableGuideBook(guidebook)
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.property-connected [title*="' + guidebook + '"]').should('be.visible').parents('.property-card')
            .find('.mobile-dropdown a[data-target="#m_modal_edit"]').click() //Edit icon
        cy.get('.loading-label').should('not.exist') //loader should be disappear

        cy.get('#m_modal_edit h5.modal-title').should('be.visible').and('contain.text', 'Edit Guide').wait(1000) //heading on modal
        cy.get('#propertiesList').scrollIntoView().should('be.visible').click()
        cy.get('#propertiesList .cursor-pointer.collapsed').if().click() //expand it if not expanded
        //Enable the property
        cy.get('.property-name').contains(propName).parents('.row.align-items-center')
            .find('.checkbox-toggle input[checked="checked"]').scrollIntoView().check({ force: true }) //Enable the toggle

        cy.get('[class="btn btn-success btn-sm px-3"]').should('exist').and('contain.text', 'Save').click({ force: true }) //Save
        cy.get('.view-edit-title')
            .should('be.visible')
            .then(($el) => {
                const text = $el.text();
                expect(text).to.satisfy((t) =>
                    t.includes('The guide is now published and available for guests.') ||
                    t.includes('The guide updated successfully')
                );
            })
        cy.get('button[class="swal2-confirm swal2-styled"]').should('contain.text', 'OK').click() //OK on modal
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
    }
}