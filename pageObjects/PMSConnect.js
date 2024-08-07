export class PMSConnect {
    
    gotoPMSConnect() {
        cy.get('.dropdown-item[href*="/client/v2/pms-connect"]').should('contain.text', 'PMS').click({ force: true })
        cy.get('h1.page-title').should('be.visible').and('contain.text', 'Account Setup').and('contain.text', 'Setup your account')
        cy.get('h4.setup-page-title').should('be.visible').and('contain.text', 'Connect your Property Management System')
        cy.get('.loading-label').should('not.exist') //loader should be disappear

    }
    selectPMS(pmsName){
        cy.get('#pms-selector').should('be.visible').click()
        cy.get('[placeholder="Type a pms"]').should('be.visible').type(pmsName)
        cy.get('.custom-dropdown-selector-list .option__desc').should('be.visible').and('contain.text', pmsName).click()
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.setup-footer .btn-success').should('be.visible').and('contain.text', 'Continue').click()
        cy.get('.view-edit-title').should('be.visible').and('contain.text', 'Are you sure?') //toast
        cy.get('.view-edit-desc > p').should('be.visible').and('contain.text', 'Once you select "No PMS", you cannot change afterwards.')
        cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Yes, Connect').click()
        cy.get('.toast-text').should('contain.text', 'PMS Settings Updated')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('[href="/client/v2/payment-rules"]').should('contain.text', 'Auto Payments').and('be.visible')
        cy.get('.got-it-btn').click() // Got it button on toast 
    }
    getAPIKey(){
        // First, make a GET request to the page to get the CSRF token
       return cy.request('GET', 'https://master.chargeautomation.com/client/v2/payment-gateway-connect').then((response) => {

            const html = response.body;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const csrfToken = doc.querySelector('meta[name="csrf-token"]').getAttribute('content');

            expect(csrfToken).to.exist;

            // Use the CSRF token in the POST request
           return cy.request({
                method: 'POST',
                url: 'https://master.chargeautomation.com/client/v2/api-generate-key',
                headers: {
                    'x-csrf-token': csrfToken,  // Use the retrieved CSRF token here 
                },
                referrer: 'https://master.chargeautomation.com/client/v2/api',
                referrerPolicy: 'strict-origin-when-cross-origin',
                body: {}
            }).then((response) => {
                expect(response.status).to.eq(200)
                cy.log(response.body)

                expect(response.body).to.have.property('status', true)
                expect(response.body).to.have.property('status_code', 200)
                expect(response.body).to.have.property('message', 'API Key generated')
                expect(response.body).to.have.property('data').and.to.be.a('string')
                const apiKey = response.body.data
                return cy.wrap(apiKey)
            })
        })
    }
    endUserTrial(apiKey){
        cy.request({
            method: 'GET',
            url: 'https://master.chargeautomation.com/api/end-user-subscription-trial',
            headers: {
                'Authorization': 'Bearer ' + apiKey
            },
        }).then((response) => {
            cy.log(response)
            expect(response.status).to.eq(200)
            expect(response.body).to.have.property('message', 'Trial will end in 5-10 seconds')
            expect(response.body).to.have.property('status_code', 200)
        })
    }
}