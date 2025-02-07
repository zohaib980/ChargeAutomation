export class BillingPage {
    gotoBilling() {
        cy.get('#dropdownMenuButton').should('be.visible').click()
        cy.get('.dropdown-menu a[href="/client/v2/billing"]').should('be.visible').and('contain.text', 'Billing').click() //Billing
        cy.get('.page-title').should('be.visible').and('contain.text', 'Billing and Subscription')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
    }
    gotoSubscriptionPlans() {
        cy.get('#myTab .nav-item:nth-child(2) a').should('contain.text', 'Subscription Plans').and('be.visible').click()
        cy.get('.loading-label').should('not.exist') //loader should be disappear
    }
    gotoBillingDetail() {
        cy.get('#myTab .nav-item:nth-child(1) a').should('contain.text', 'Billing Details').click()
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.contains('Your Subscription').should('be.visible') //Your Subscription
    }
    getCurrentPlan() {
        cy.get('.col-md-3 .btn-rounded').should('be.visible'); // subscriptions cards should be loaded correctly

        return cy.get('body').then(($body) => {
            if ($body.find('.current').length > 0) {
                // If .current element exists
                return cy.get('.current')
                    .parents('.price-plan-card')
                    .find('.plan-name')
                    .should('exist')
                    .invoke('text')
            } else {
                // If .current element does not exist
                return null
            }
        })
    }
    getActiveSubscription() {
        cy.get('.loading-label').should('not.exist').wait(1000) //loader should be disappear
        return cy.get('[class="bg-card mb-3"] h3').should('be.visible').invoke('text') //Current Plan
    }
    selectBillMonthly() {
        cy.get('input[id="billedTimeSelect"]').should('exist').uncheck({ force: true }) //select monthly
        cy.get('[class="select-type active"]').should('contain.text', 'Billed Monthly').wait(1000)
        cy.get('.loading-label').should('not.exist') //loader should be disappear
    }
    selectBillAnnually() {
        cy.get('input[id="billedTimeSelect"]').should('exist').check({ force: true }) //select yearly
        cy.get('[class="select-type active"]').should('contain.text', 'Billed Annually').wait(1000)
        cy.get('.loading-label').should('not.exist') //loader should be disappear
    }
    getPlanPrice(plan) {
        if (plan === 'basic') {
            return cy.get('.col-md-3:nth-child(1) .plan-price').should('exist').invoke('text')
        }
        if (plan === 'essentials') {
            return cy.get('.col-md-3:nth-child(2) .plan-price').should('exist').invoke('text')
        }
        if (plan === 'professional') {
            return cy.get('.col-md-3:nth-child(3) .plan-price').should('exist').invoke('text')
        }
        if (plan === 'enterprise') {
            cy.log('For Enterprise plan please contact our sales')
        } else {
            cy.log('Select a valid plan to get plan price!')
        }
    }
    getPerRentalPrice(plan) {
        if (plan === 'basic') {
            return cy.get('.col-md-3:nth-child(1) .plan-per').should('exist').invoke('text')
        }
        if (plan === 'essentials') {
            return cy.get('.col-md-3:nth-child(2) .plan-per').should('exist').invoke('text')
        }
        if (plan === 'professional') {
            return cy.get('.col-md-3:nth-child(3) .plan-per').should('exist').invoke('text')
        }
        if (plan === 'enterprise') {
            cy.log('For Enterprise plan please contact our sales')
        } else {
            cy.log('Select a valid plan to get plan price!')
        }
    }
    switchToBasic() {
        cy.get('#update-billing-plan-button-basic').should('exist').click()
        cy.get('.swal2-confirm').should('exist').click() //Yes
        //Handling intercom survey modal
        this.proceedIntercomSurvey()
        /*
        cy.get('.toast-message').should('contain.text', 'Subscription plan updated successfully')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.toast-message').should('not.exist')
        cy.log('You are switched to Basic Plan')
        */
    }
    proceedIntercomSurvey() {
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('.intercom-block-paragraph').should('be.visible').and('contain.text', 'Why are you downgrading your subscription?')
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('[name="select-response"]').select('I have found another solution') //select reason
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('[data-testid="survey-next-button"]').should('be.visible').click() //Submit
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('textarea[name="message"]').should('be.visible').type('Testing Automation')
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('[data-testid="survey-next-button"]').should('be.visible').click() //Submit
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('[data-testid="scale-emoji-item"][aria-label="1"]').should('be.visible').click() //emoji No thanks
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('[data-testid="survey-next-button"]').should('be.visible').click() //Submit
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('.intercom-block-paragraph').should('be.visible').and('contain.text', 'Describe reason for downgrading your subscription')
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('textarea[name="message"]').should('be.visible').type('Testing Automation')
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('[data-testid="survey-next-button"]').should('be.visible').click() //Submit
        cy.getIframeBody('iframe[name="intercom-modal-frame"]').find('[href*="/downgrade-user-billing-to-basic-plan"]')
            .should('be.visible').invoke('attr', 'href').then(href => { //Click here
                cy.visit(href)  // on itercom page
                cy.get('h3').should('be.visible').and('contain.text', 'Subscription plan updated successfully')
                cy.visit('/client/v2/billing')  //revisit CA
                //cy.get('.toast-message').should('contain.text', 'Subscription plan updated successfully')
                //cy.get('.loading-label').should('not.exist') //loader should be disappear
                //cy.get('.toast-message').should('not.exist')
                cy.log('You are switched to Basic Plan')
                cy.wait(5000)
            })
    }
    selectMonthlyPlan(desiredPlan) {
        const formatteddesiredPlan = this.toStartCase(desiredPlan)
        this.getCurrentPlan().then(currentPlan => {
            if (formatteddesiredPlan === currentPlan) {
                cy.log(desiredPlan + ' is already subscribed as your current plan')
                //Switching to Basic plan
                cy.get('.loading-label').should('not.exist') //loader should be disappear
                cy.get('#update-billing-plan-button-basic').should('be.visible').click()
                cy.get('[class="view-edit-title"]').should('be.visible').and('contain.text', 'Click here to update your plan')//modal
                cy.get('.swal2-confirm').should('be.visible').click() //Yes
                //Handling intercom survey modal
                this.proceedIntercomSurvey()
                this.gotoSubscriptionPlans()
                this.selectBillMonthly()
                this.selectMonthlyPlan(desiredPlan, currentPlan)
            } else {
                //cy.get('.loading-label').should('not.exist') //loader should be disappear
                cy.get('[id="update-billing-plan-button-' + desiredPlan + '_monthly"]').should('contain.text', 'Start ' + formatteddesiredPlan).click().wait(1000) //Start ....
                cy.get('.loading-label').should('not.exist') //loader should be disappear
                cy.get('.modal.show > .modal-dialog > .modal-content > .modal-body > .rental_inner_body > #closeBillingRentalModal').if().click() //Close
                cy.get('[id="update-billing-plan-button-' + desiredPlan + '_monthly"]').should('contain.text', 'Start ' + formatteddesiredPlan).click().wait(1000) //Start ....
                cy.get('.loading-label').should('not.exist') //loader should be disappear
                cy.get('.add_rental h3').should('be.visible').and('contain.text', 'Update to ' + formatteddesiredPlan + ' Monthly') //heading
                cy.get('[class="rental_desc_info"]').should('contain.text', 'An estimated prorated charge of')
            }
        })

    }
    selectAnnualPlan(desiredPlan) {
        const formatteddesiredPlan = this.toStartCase(desiredPlan)
        this.getCurrentPlan().then(currentPlan => {
            if (formatteddesiredPlan === currentPlan) {
                cy.log(desiredPlan + ' is already subscribed as your current plan')
                //Switching to Basic plan
                cy.get('.loading-label').should('not.exist') //loader should be disappear
                cy.get('#update-billing-plan-button-basic').should('exist').click()
                cy.get('[class="view-edit-title"]').should('be.visible').and('contain.text', 'Click here to update your plan')//modal
                cy.get('.swal2-confirm').should('exist').click() //Yes
                //Handling intercom survey modal
                this.proceedIntercomSurvey()
                this.gotoSubscriptionPlans()
                cy.wait(5000)
                this.selectBillAnnually()
                this.selectAnnualPlan(desiredPlan, currentPlan)
            } else {
                this.selectBillAnnually()
                cy.get('[id="update-billing-plan-button-' + desiredPlan + '_yearly"]').should('contain.text', 'Start ' + formatteddesiredPlan).click().wait(1000) //Start ....
                cy.get('.loading-label').should('not.exist') //loader should be disappear
                cy.get('.modal.show > .modal-dialog > .modal-content > .modal-body > .rental_inner_body > #closeBillingRentalModal').if().click() //Close
                cy.get('[id="update-billing-plan-button-' + desiredPlan + '_yearly"]').should('contain.text', 'Start ' + formatteddesiredPlan).click().wait(1000) //Start ....
                cy.get('.loading-label').should('not.exist') //loader should be disappear
                cy.get('.add_rental h3').should('be.visible').and('contain.text', 'Update to ' + formatteddesiredPlan + ' Yearly') //heading
                cy.get('[class="rental_desc_info"]').should('contain.text', 'An estimated prorated charge of').and('contain.text', 'to your Visa ending in')
            }
        })

    }
    selectMonthlyPlanForNewUser(desiredPlan, paymentCard) {
        const formatteddesiredPlan = this.toStartCase(desiredPlan)
        cy.get('[id="update-billing-plan-button-' + desiredPlan + '_monthly"]').should('contain.text', 'Start ' + formatteddesiredPlan).click().wait(1000) //Start ....
        //cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.modal.show > .modal-dialog > .modal-content > .modal-body > .rental_inner_body > #closeBillingRentalModal').if().click() //Close
        cy.get('[id="update-billing-plan-button-' + desiredPlan + '_monthly"]').should('contain.text', 'Start ' + formatteddesiredPlan).click().wait(1000) //Start ....
        cy.get('.loading-label').should('not.exist') //loader should be disappear       
        //Rental popup shows to add rental count for new user
        cy.get('.rental_inner_body').then(() => {
            cy.get('.add_rental > div > input').should('be.visible').type('1') //add 1
            cy.get('.loading-label').should('not.exist') //loader should be disappear
            cy.get('.show [id*=update-plan-button]').should('contain.text', 'Add Rentals').should('be.visible').click() //Add Rentals
            cy.get('[class="toast-message"]').should('contain.text', 'Please add your card to upgrade your plan') //Success toast
            cy.get('[class="toast-message"]').should('not.exist')
            cy.get('.loading-label').should('not.exist') //loader should be disappear
            //Get estimated Charge Amount
            this.getEstimatedChargeAmount().then(estimatedCharge => {
                cy.wrap(estimatedCharge).as('estimatedCharge')
            })
            //Add a credit card on subsc modal
            this.addCConSubscModal(paymentCard)
            cy.get('.show [id*=update-plan-button]').should('contain.text', 'Add Rentals').should('be.visible').click() //Add Rentals

        })
    }
    getRentalCount() {
        return cy.get('.add_rental input').should('exist').invoke('val')
    }
    getRentalCountonPlan() {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        return cy.get('[class="bg-card mb-3"] p.mb-0').should('be.visible').invoke('text').then(text => {
            const trimmedText = text.trim()
            let count = trimmedText.split(" ")
            let rentalCount = count[0].trim()
            cy.log(rentalCount)
            return cy.wrap(rentalCount)
        })
    }
    validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, period) {
        cy.get('[class="rental_desc_info"] p strong:nth-child(1)').invoke('text').then(amount => {
            // Extract the numeric value from the text content
            const charge = amount.match(/\d+\.\d+/)[0];
            let estimatedCharge = parseFloat(charge)
            cy.log(estimatedCharge)
            if (period === 'monthly') {
                //Estimated Charged Amount = SubscPrice + (RoomPrice * RentalCount)
                let totalCharge = parseFloat(planPrice) + (parseFloat(perRentalPrice) * parseFloat(rentalCount))
                expect(totalCharge).to.be.closeTo(estimatedCharge, 0.0001)
            }
            if (period === 'yearly') {
                //Estimated Charged Amount = (SubscPrice + (RoomPrice * RentalCount))*12
                let totalCharge = (parseFloat(planPrice) + (parseFloat(perRentalPrice) * parseFloat(rentalCount))) * 12
                expect(totalCharge).to.be.closeTo(estimatedCharge, 0.0001)
            }

        })
    }
    getEstimatedChargeAmount() {
        return cy.get('[class="rental_desc_info"] p strong:nth-child(1)').invoke('text').then(amount => {
            // Extract the numeric value from the text content
            const charge = amount.match(/\d+\.\d+/)[0];
            let estimatedCharge = parseFloat(charge)
            return cy.wrap(estimatedCharge)
        })
    }
    clickStartPlan(plan, duration) {
        const formatedPlan = this.toStartCase(plan)
        const formatedDuration = this.toStartCase(duration)
        cy.get('.modal-content [id="update-plan-button' + plan + '_' + duration + '"]').should('be.visible').should('contain.text', 'Start ' + formatedPlan + ' ' + formatedDuration).click()
    }
    closeSubscModal() {
        cy.get('.show #closeBillingRentalModal').should('be.visible').click() //Close on modal
    }
    validateAppliedPlan(plan) {
        const formatedPlan = this.toStartCase(plan)
        cy.contains('Current Plan').parents('.price-plan-card').find('.plan-name').should('contain.text', formatedPlan)
    }
    // Define the toStartCase function
    toStartCase(str) {
        if (str === null) {
            return null;
        }
        return str
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    selectdefaultPaymentMethod(creditCard) {
        // Extract the last four digits from the creditCard number
        const lastFourDigits = creditCard.slice(-4);
        cy.get('h2[class="sub-heading text-uppercase mt-5"]').eq(0).should('contain.text', 'Billing Information') //heading
        cy.get('.b-info-list').should('contain.text', 'Payment Details').and('contain.text', 'Name:').and('contain.text', 'Expires On:')
        cy.get('.b-info-list li:nth-child(2)').should('exist').invoke('text').then(card => {
            if (!card.includes('**** **** **** ' + lastFourDigits)) {
                cy.get('.row:nth-child(3) .btn-primary').should('contain.text', 'Update Information') //Update Info

                cy.request({
                    method: 'GET',
                    url: '/client/v2/customer-portal', // The URL to request
                    headers: {
                        'Authorization': 'Bearer 2af663f0-f267-11ee-940d-3b7428678c26'
                    },
                }).then((response) => {
                    // Check the response status
                    expect(response.status).to.eq(200);

                    // Extract the 'data' URL from the response body
                    const dataUrl = response.body.data;
                    cy.log(dataUrl)
                    // Visit the extracted URL
                    cy.visit(dataUrl);
                })

                cy.get('[class="Box-root Box-hideIfEmpty Margin-top--24 Margin-left--24"]').contains('•••• ' + lastFourDigits).should('exist')
                    .parents('[class="Box-root Box-hideIfEmpty Margin-top--24 Margin-left--24"]').find('.Box-root .Button-element').click()// 3dot icon
                cy.get('button[role="menuitem"]').eq(0).should('contain.text', 'Make default').click().wait(2000)

                // Navigate back to CA
                cy.go('back')
                cy.get('.page-title').should('be.visible').and('contain.text', 'Billing and Subscription')
                cy.get('.loading-label').should('not.exist') //loader should be disappear
                cy.get('.b-info-list li:nth-child(2)').should('exist').should('contain.text', '**** **** **** ' + lastFourDigits)
            } else {
                cy.log('Your desired payment method ' + creditCard + ' is already selected as default!')
            }
        })
    }
    validateDefaultPaymentMethod(creditCard) {
        // Extract the last four digits from the creditCard number
        const lastFourDigits = creditCard.slice(-4);
        cy.get('.b-info-list li:nth-child(2)').should('exist').should('contain.text', '**** **** **** ' + lastFourDigits)
    }
    deletePaymentMethodOnStripe(creditCard) {
        // Extract the last four digits from the creditCard number
        const lastFourDigits = creditCard.slice(-4);

        cy.request({
            method: 'GET',
            url: '/client/v2/customer-portal', // The URL to request
            headers: {
                'Authorization': 'Bearer 2af663f0-f267-11ee-940d-3b7428678c26'
            },
        }).then((response) => {
            // Check the response status
            expect(response.status).to.eq(200);

            // Extract the 'data' URL from the response body
            const dataUrl = response.body.data;
            cy.log(dataUrl)
            // Visit the extracted URL
            cy.visit(dataUrl);
        })
        cy.get('.Badge--variant--status.Box-background--gray100')
            .parents('[class="Box-root Box-hideIfEmpty Margin-top--24 Margin-left--24"]')
            .invoke('text')
            .then((text) => {
                if (text.includes('•••• ' + lastFourDigits)) {
                    //Switching default to another card
                    cy.get('[class="Box-root Box-hideIfEmpty Margin-top--24 Margin-left--24"]').contains('•••• 4242').should('exist')
                        .parents('[class="Box-root Box-hideIfEmpty Margin-top--24 Margin-left--24"]').find('.Box-root .Button-element').click()// 3dot icon
                    cy.get('button[role="menuitem"]').eq(0).should('contain.text', 'Make default').click().wait(2000)
                    //Now delete the desired card
                    cy.get('[class="Box-root Box-hideIfEmpty Margin-top--24 Margin-left--24"]').contains('•••• ' + lastFourDigits).should('exist')
                        .parents('[class="Box-root Box-hideIfEmpty Margin-top--24 Margin-left--24"]').find('.Box-root .Button-element').click()// 3dot icon
                    cy.get('button[role="menuitem"]').eq(1).should('contain.text', 'Delete').click()
                    cy.get('[data-test="PaymentInstrumentActionsDetatchModalConfirmButton"]').should('contain.text', 'Delete payment method').and('be.visible').click().wait(2000) //Confirm
                } else {
                    // delete the desired card
                    cy.get('[class="Box-root Box-hideIfEmpty Margin-top--24 Margin-left--24"]').contains('•••• ' + lastFourDigits).should('exist')
                        .parents('[class="Box-root Box-hideIfEmpty Margin-top--24 Margin-left--24"]').find('.Box-root .Button-element').click()// 3dot icon
                    cy.get('button[role="menuitem"]').eq(1).should('contain.text', 'Delete').click()
                    cy.get('[data-test="PaymentInstrumentActionsDetatchModalConfirmButton"]').should('contain.text', 'Delete payment method').and('be.visible').click().wait(2000) //Confirm
                }
            })
        // Navigate back to CA
        cy.go('back')
        cy.get('.page-title').should('be.visible').and('contain.text', 'Billing and Subscription')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.b-info-list li:nth-child(2)').should('exist').should('not.contain.text', '**** **** **** ' + lastFourDigits)

    }
    addCConSubscModal(cardNumber) {
        cy.get('#full_name').if().then(() => {
            cy.get('#full_name').should('exist').and('not.be.disabled').type('Waqas')
            cy.get('#card-element').within(() => {
                cy.fillElementsInput('cardNumber', cardNumber);
                cy.fillElementsInput('cardExpiry', '1026'); // MMYY
                cy.fillElementsInput('cardCvc', '123');
                cy.fillElementsInput('postalCode', '90210');
            })

            /*
            cy.getIframeBody('#card-number-element iframe[name*="__privateStripeFrame"]')
                .find('input[name="cardnumber"]').should('be.visible').type(cardNumber) //card number
            cy.getIframeBody('#card-expiry-element iframe[name*="__privateStripeFrame"]')
                .find('input[name="exp-date"]').should('be.visible').and('be.enabled').type('1229', { force: true })  // expiry
            cy.getIframeBody('#card-cvc-element iframe[name*="__privateStripeFrame"]')
                .find('input[name="cvc"]').should('be.visible').and('be.enabled').type('123', { force: true }) //cvc
            cy.get('#postal-code').should('be.visible').type('45000') //Postal Code
            */
        }).else().then(() => {
            cy.get('[href="#cardInputToggle"]').click() //pencil icon
            cy.wait(2000)
            this.addCConSubscModal(cardNumber)
        })
    }
    approve3DS() {
        cy.get('iframe[name*="__privateStripeFrame"]')
            .its('0.contentDocument')
            .its('body')
            .find('iframe[id="challengeFrame"]')
            .its('0.contentDocument')
            .its('body')
            .find('#test-source-authorize-3ds').should('be.visible').click()
    }
    fail3DS() {
        cy.get('iframe[name*="__privateStripeFrame"]')
            .its('0.contentDocument')
            .its('body')
            .find('iframe[id="challengeFrame"]')
            .its('0.contentDocument')
            .its('body')
            .find('#test-source-fail-3ds').should('be.visible').click()
    }
    approve3DSOnStripe() {
        cy.get('.SubmitButton-IconContainer').should('be.visible').click() //Confirm Payment
        cy.wait(7000)
        cy.get('iframe[name*="__privateStripeFrame"]').should('exist')
            .its('0.contentDocument')
            .its('body')
            .find('iframe[id="challengeFrame"]')
            .its('0.contentDocument')
            .its('body')
            .find('#test-source-authorize-3ds').should('be.visible').click().wait(4000)
        //cy.reload()
        cy.get('.ViewInvoiceDetailsLink').should('be.visible').and('contain.text', 'View invoice and payment details') //View invoice and payment details link
        cy.get('[data-testid="download-invoice-receipt-pdf-button"]').if().should('be.visible').and('contain.text', 'Download receipt')
    }
    addRentalsOnPlan(count, rentalPrice, planName) {
        //Get old rental count
        cy.get('[class="bg-card mb-3"] p.mb-0').should('exist').invoke('text').then(text => {
            const number = text.trim().match(/\d+/)[0];
            // Convert to number if needed
            let oldRentalCount = parseInt(number, 10);
            cy.wrap(oldRentalCount)
            //Add rental
            cy.get('#addRentalModal').should('contain.text', 'Add Rental').and('be.visible').click() //Add Rental
            cy.get('[class="add_rental"] h3').should('be.visible').should('contain.text', 'Add Rentals') //modal heading
            cy.get('[class="rental_desc"]').should('contain.text', 'Price will be calculated when you enter a number').and('be.visible')
            cy.get('[class="add_rental"] input').should('exist').and('be.visible')
                .type(parseInt(count), { force: true }).should('have.value', parseInt(count).toString()) //rental count
            //Validate Rental Price
            if (planName.includes('Monthly')) {
                cy.get('[class="rental_desc_info"] strong').eq(1).invoke('text').then(text => { //Validate Rental Price
                    let totalAmount = parseFloat(text.replace('$', ''));
                    let perRentalPrice = (parseFloat(totalAmount) / parseFloat(count))
                    expect(perRentalPrice).to.be.eq(rentalPrice)
                })
                cy.get('[class="rental_desc_info"] strong').eq(4).invoke('text').then(text => { //Validate Rental Price
                    let totalAmount = parseFloat(text.replace('$', ''));
                    let perRentalPrice = (parseFloat(totalAmount) / parseFloat(count))
                    expect(perRentalPrice).to.be.eq(rentalPrice)
                })
            }
            if (planName.includes('Yearly')) {
                cy.get('[class="rental_desc_info"] strong').eq(1).invoke('text').then(text => { //Validate Rental Price
                    let totalAmount = parseFloat(text.replace('$', ''));
                    let perRentalPrice = (parseFloat(totalAmount) / parseFloat(count) / 12)
                    expect(perRentalPrice).to.be.eq(rentalPrice)
                })
                cy.get('[class="rental_desc_info"] strong').eq(4).invoke('text').then(text => { //Validate Rental Price
                    let totalAmount = parseFloat(text.replace('$', ''));
                    let perRentalPrice = (parseFloat(totalAmount) / parseFloat(count) / 12)
                    expect(perRentalPrice).to.be.eq(rentalPrice)
                })
            }

            cy.get('[class="rental_desc_info"] strong').eq(2).should('contain.text', planName) //Validate plan name
            cy.get('[class="rental_desc_info"]').should('contain.text', 'Charge Automation will charge you for these rentals even if')
                .and('contain.text', 'they are not active.')
                .and('contain.text', 'An estimated prorated charge of')

            cy.get('[id*="update-plan-button"]').should('be.visible').and('contain.text', 'Add Rentals').click() //Add Rentals button
            cy.verifyToast('Subscription plan updated successfully')

            //Validate updated rental count
            cy.get('.loading-label').should('not.exist') //loader should be disappear
            cy.get('[class="bg-card mb-3"] p.mb-0').should('exist').invoke('text').then(text => {
                const number = text.trim().match(/\d+/)[0];
                // Convert to number if needed
                let newRentalCount = (parseInt(number, 10));
                expect(oldRentalCount + parseFloat(count)).to.be.eq(newRentalCount)
            })
        })
    }
    removeRentalOnPlan(count) {
        cy.get('[data-target="#rentalModal"]').eq(1).should('be.visible').and('contain.text', 'Remove Rental').click() //Remove Rental
        cy.get('[class="rental_inner_body"] h3').should('be.visible').and('contain.text', 'Remove Rentals') //heading on modal
        cy.get('[class="rental_desc text-danger"]').should('contain.text', "If you’d like to remove  rentals, you’ll need to turn off  rentals from your properties first")
        cy.get('.add_rental input').should('be.visible').type(parseInt(count), { force: true }).should('have.value', parseInt(count).toString()) //rental count
        cy.get('.rental_desc').should('contain.text', 'If you’d like to remove ' + count + ' rentals, you’ll need to turn off ' + count + ' rentals from your properties first')
        cy.get('[id*="update-plan-button"]').should('contain.text', 'Remove Rentals').and('be.visible').click() //Remove Rentals
        cy.verifyToast('Subscription plan updated successfully')
    }
    getCurrentAddOn() {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.bg-card:nth-child(3) .b-card-heading').should('contain.text', 'Add On Subscription') //Heading
        return cy.get('.addon-list').should('exist').invoke('text')
    }
    smsPlanSubscription(currentPlan, desiredPlan, toastMessage) {
        cy.get('#billing-addon-plan-wrap > h2').should('contain.text', 'Add-Ons Plan') //heading
        cy.get('.view-all-wrap > a').if().should('contain.text', 'View All Plans').click() //Expand
        cy.get('.price-el-text').should('be.visible').and('contain.text', 'SMS Plans')
        if (!currentPlan.includes('(' + desiredPlan + ')')) { //$9 === $9
            cy.get('.listbox-open li:nth-child(1)').contains(desiredPlan).parents('ul').find('[class="btn btn-rounded"]').click()
            cy.get('.view-edit-title').should('be.visible').and('contain.text', 'Click continue below to subscribe to the SMS plan')
            cy.get('.swal2-cancel').should('be.visible').and('contain.text', 'Cancel')
            cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Continue').click()//Continue button on popup
            cy.get('.toast-message').should('contain.text', toastMessage)
        } else {
            cy.log('SMS plan ' + desiredPlan + ' Monthly is already active!')
            return 'alreadyActive'
        }
    }
    smsPlanSubscriptionAPI(priceId) {
        cy.request('GET', '/client/v2/billing')
            .then((response) => {

                const html = response.body;
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const csrfToken = doc.querySelector('meta[name="csrf-token"]').getAttribute('content');

                expect(csrfToken).to.exist;

                cy.request({
                    method: 'POST',
                    url: '/client/v2/subscribe-sms-plan', // The URL to request
                    headers: {
                        'content-type': 'application/json',
                        'x-csrf-token': csrfToken,  // Use the retrieved CSRF token here
                        'x-requested-with': 'XMLHttpRequest',
                        'x-xsrf-token': csrfToken  // Use the retrieved CSRF token here
                    },
                    body: {
                        "sms_plan_price_id": priceId //"price_1KGS6pKh4TiALV2ubtJkL6yN" $99
                    }
                }).then((response) => {
                    // Check the response status
                    expect(response.status).to.eq(200);
                    cy.log(response.body)
                    // Check the top-level response properties
                    if (response.body.status === false) {
                        expect(response.body).to.have.property('status_code', 422);
                        expect(response.body).to.have.property('message', 'Please approve the transaction')
                        // Extract the Stripe URL from the response body
                        const stripeLink = response.body.data.link;
                        cy.log(stripeLink)
                        // Visit the extracted URL
                        cy.visit(stripeLink)
                        this.approve3DSOnStripe()
                    }
                    if (response.body.status === true) {
                        expect(response.body).to.have.property('status_code', 200);
                        expect(response.body).to.have.property('message', 'SMS plan subscribed successfully.');
                    }

                })
            })
        cy.wait(10000)
    }
    ValidateSubscribedSMSPlan(currentPlan) {
        cy.get('[class="plan-listbox-top"] .toggle-arrow').if().click({ force: true }).wait(1000)
        if (currentPlan === 'No add-on added') {
            cy.get('.btn-rounded.activated').should('not.exist') //Current plan button should not exist
        } else {
            const match = currentPlan.match(/\(\$(\d+)\)/);
            if (match) {
                const valueWithDollarSign = `$${match[1]}`;
                cy.log(`Extracted value: ${valueWithDollarSign}`) //get the $29 value from
                cy.get('[class="plan-listbox-top"] .btn-rounded.activated').parents('[class="plan-listbox-body"] ul')
                    .find('li:nth-child(1) h4').should('contain.text', valueWithDollarSign)
            }
        }
    }
    verifyActivatedSMSAddons(desiredPlan) {
        cy.get('.loading-label').should('not.exist') // loader should disappear
        cy.get('.bg-card:nth-child(3) h3').should('contain.text', 'Add On Subscription')
        cy.get('.bg-card:nth-child(3) ul li').should('contain.text', 'SMS Plan (' + desiredPlan + ')')
        cy.get('.plan-badge').should('be.visible').and('contain.text', 'Monthly')

        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0')
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            const month = monthNames[date.getMonth()]
            const year = date.getFullYear()
            return `${day} ${month} ${year}`
        }

        const todayDate = formatDate(new Date())
        cy.get('li > .mb-0').should('contain.text', `Purchased on ${todayDate}`)
    }

    verifyCardModal(desiredPlan) {
        cy.get('.price-modal-content').should('be.visible').and('contain.text', desiredPlan).and('contain.text', 'text messages')
        cy.get('[for="full_name"]').should('contain.text', 'Name On Card')
        cy.get('#full_name').should('exist')
        cy.get('[for="card-element"]').should('contain.text', 'Credit/Debit Card')
        cy.get('#card-element').should('exist')
        cy.get('[class="btn btn-primary"]').should('contain.text', 'Add Card') //Add Card button
        cy.get('#closePlanSubscriptionModal').should('contain.text', 'Close').click() //Close button
    }
    //Transaction Table
    validateColumnOnTransactionHistory() {
        cy.get('#billingSubscription .row:nth-child(4) .sub-heading').should('be.visible').and('contain.text', 'Transaction History')
        cy.get('#billingSubscription .row:nth-child(4) .tran-his-header').should('be.visible').and('contain.text', 'Due Date')
            .and('contain.text', 'Amount Paid').and('contain.text', 'Amount Remaining').and('contain.text', 'Payment Status')
            .and('contain.text', 'View Invoice').and('contain.text', 'Pay Now')
    }
    getAmountDue(index) {
        return cy.get('#billingSubscription .tran-his-body ul li:nth-child(2)').eq(index).invoke('text').then(text => {
            let array = text.split("$")
            let amountDue = array[1] //"Amount Due"
            return amountDue
        })
    }
    getAmountPaid(index) {
        return cy.get('#billingSubscription .tran-his-body ul li:nth-child(3)').eq(index).invoke('text').then(text1 => {
            let array1 = text1.split("$")
            let amountPaid = array1[1] //"Amount Paid"
            return amountPaid
        })
    }
    getAmountRemaining(index) {
        return cy.get('#billingSubscription .tran-his-body ul li:nth-child(4)').eq(index).invoke('text').then(text2 => {
            let array2 = text2.split("$")
            let amountRemaining = array2[1] //"Amount Remaining"
            return amountRemaining
        })
    }
    validatePayNowStatus(index, status) {
        if (status.includes('Paid')) {
            cy.get('#billingSubscription .tran-his-body ul li:nth-child(7) a').eq(index)
                .should('contain.text', 'Pay Now').and('have.class', 'c-btn-disabled') //pay now should be disabled
        }
        if (status.includes('Void')) {
            cy.get('#billingSubscription .tran-his-body ul li:nth-child(7) a').eq(index)
                .should('contain.text', 'Pay Now').and('have.class', 'c-btn-disabled') //pay now should be disabled
        }
        if (status.includes('Open')) {
            cy.get('#billingSubscription .tran-his-body ul li:nth-child(7) a').eq(index)
                .should('contain.text', 'Pay Now').and('not.have.class', 'c-btn-disabled') //pay now should be enabled
        }
    }
    getPaymentStatus(index) {
        return cy.get('#billingSubscription .tran-his-body ul li:nth-child(5) span').eq(index).invoke('text').then(text => {
            let paymentStatus = text.trim();
            return paymentStatus
        })
    }

    //Account Trial 
    validateTrialEndDate() {

        cy.request('GET', '/client/v2/trial-end-date').then((response) => {
            expect(response.status).to.eq(200)
            cy.log(response.body)
            expect(response.body.status_code).to.eq(200)
            expect(response.body.status).to.eq(true)
            let trialEndingDate = response.body.data.trial_ending_date

            cy.log('Actual Trial Ending Date:', trialEndingDate)

            // Calculate the date 7 days from now
            const now = new Date()
            const sevenDaysFromNow = new Date(now)
            sevenDaysFromNow.setDate(now.getDate() + 7)

            // Manually create the formatted date string
            const day = sevenDaysFromNow.getDate().toString().padStart(2, '0')
            const month = sevenDaysFromNow.toLocaleString('default', { month: 'short' })
            const year = sevenDaysFromNow.getFullYear()

            const formattedSevenDaysFromNow = `${day} ${month},${year}`

            // Log the calculated date for debugging
            cy.log('Calculated Date:', formattedSevenDaysFromNow)

            // Validate that the trial ending date is 7 days from now
            expect(trialEndingDate).to.eq(formattedSevenDaysFromNow)
        })
    }
    validateOutstandingInvoiceMsg(maxAttempts, count = 1) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        if (count > maxAttempts) {
            throw new Error('Pending Invoice Info message is not shown!')
            return
        }
        cy.reload()

        cy.get('body').then(($body) => {
            if ($body.find('#overdue-invoice-alert .text-md').length > 0) {
                cy.log('Pending Invoice Info message is shown!')
                cy.get('#overdue-invoice-alert .text-md').should('be.visible').and('contain.text', "To ensure uninterrupted access to ChargeAutomation, kindly settle your outstanding invoices by going to the");
                this.gotoBilling()
                cy.get('#billingSubscription div:nth-child(4) h2.sub-heading').should('be.visible').and('contain.text', 'Transaction History'); // Transaction History heading
                cy.get('li a[href*="https://invoice.stripe.com/"]').should('exist').then(() => { // Pending Invoice exists
                    cy.log('Open Invoice is created!')
                })
            } else {
                cy.wait(10000) //10 sec
                cy.log('Try Count: ' + count)
                this.validateOutstandingInvoiceMsg(maxAttempts, count + 1)
            }
        })
    }
    validatePendingInvoiceAmount(estimatedCharge, retries = 10) {
        cy.get('body').then($body => {
            if ($body.find('li a[href*="https://invoice.stripe.com/"]').length) {
                cy.get('li a[href*="https://invoice.stripe.com/"]').parents('ul').find('li:nth-child(4)').invoke('text').then(amount => {
                    // Extract the numeric value from the text content
                    const charge = amount.match(/\d+\.\d+/)[0]
                    let invoiceAmount = parseFloat(charge)
                    expect(invoiceAmount).to.be.closeTo(estimatedCharge, 0.09)
                })
            } else {
                // If the element doesn't exist, wait for 10 seconds and retry
                if (retries > 0) {
                    cy.wait(10000).then(() => {
                        cy.get('.b-invoce-view span').should('be.visible').and('contain.text', 'Load more').click() //Load more
                        cy.get('.loading-label').should('not.exist') //loader should be disappear
                        this.validatePendingInvoiceAmount(estimatedCharge, retries - 1)
                    })
                }
            }
        })
    }
    payPendingInvoice(index) {
        cy.get('li a[href*="https://invoice.stripe.com/"]').if().eq(index).should('exist')
            .invoke('attr', 'href').then((href) => {
                if (href) {
                    cy.visit(href)
                    this.approve3DSOnStripe()
                } else {
                    cy.log('No pending invoice found on index: ' + index)
                    console.log('No pending invoice found on index: ' + index)
                }
            })
    }

}

