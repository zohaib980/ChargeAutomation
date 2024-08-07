
export class AutoPayments {

    gotoAutopayments() {
        cy.get('.settings_dropdown').click() //Nav Setting icon
        cy.get('[href*="/client/v2/payment-rules"]').should('contain.text', 'Auto Payments').click() //Auto Payments
        cy.get('.page-title').should('contain.text','Account Setup')
        cy.get('.sourceBooking-card').should('exist')
    }
    validateWarningPopup() {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.modal-content .popup-modal-description').should('be.visible').should('contain.text', 'Remember to turn off Auto Payment Rules on')
            .and('contain.text', 'to prevent double charging your guests') //Validate modal descp
        cy.get('.donot-show-checkbox').should('contain.text', 'Do not show this again')
        cy.get('[class="btn btn-sm btn-secondary px-3 got-it-btn"]').should('be.visible').should('contain.text', 'Got it').click().wait(1000).should('not.be.visible')
    }
    validateHelpLinks() {
        cy.get('.page-title').should('contain.text', 'Account Setup').and('contain.text', 'Setup your account')
        cy.get('[class="pmsintegration_nav_items setup-step-item active"]').should('contain.text', '3. Auto Payments')
        cy.get('[class*="setup-page-title autopayment-title"]').should('contain.text', 'Create rules to automatically collect payments & security deposit based on the booking source')
        cy.get('[class="help-link m-0"]').click({force:true})//help tooltip
        cy.get('.tooltip-inner').should('contain.text', 'How Does Auto Payment Work?')
        cy.get('[href="https://help.chargeautomation.com/en/articles/5479679-auto-payments-setting"]').should('contain.text', 'Learn More')
        //Video tutorial links
        cy.get('[data-target="#learnMoreAutoPaymentModal"]').should('contain.text', 'Learn More').click()
        cy.get('#learnMoreAutoPaymentModal[class="modal fade show"]').should('exist').wait(2000) //video popup
        cy.get('#learnMoreAutoPaymentModal [class="btn btn-secondary btn-sm"]').should('contain.text', 'Close').click() //Close video popup
    }
    validateAddBookingSource() {
        cy.get('[class*="btn btn-sm btn-primary-pill"]').should('have.length', 2).should('contain.text', 'Add Booking Source').eq(0).click() //button
        cy.get('#bookingSourceAddEditModal .modal-title').should('contain.text', 'Add Booking Source').should('be.visible') //heading
        cy.get('.property-detail-body').should('contain.text', 'Booking Source Logo').should('be.visible')
            .and('contain.text', 'Only image file allowed to upload here.').and('contain.text', 'Upload Logo').and('contain.text', 'Name')
        cy.get('.property-detail-body #name').should('exist') //Name field
        cy.get('button[title="Save data"]').should('contain.text', 'Save').should('exist').click() //Save button
        cy.get('[class="toast toast-error"]').should('contain.text', 'Booking Source is required') //error as fields are empty
        cy.get('[class="modal-footer mt-3"] [class="btn btn-sm btn-secondary px-3"]').should('contain.text', 'Cancel').click().should('not.be.visible') //Cancel Button
    }
    validateSelectedSettingsOnBS(bSource) {
        cy.get('[class*="card sourceBooking-card"] .logo-title').contains(bSource).then(ele => {
            cy.wrap(ele).parents('[class*="card sourceBooking-card"]')
                .find('[id*="headingOne"]').invoke('text').then(text => {
                    cy.log('These AP settings are applied of this BS: ' + text)
                    cy.get('[class*="card sourceBooking-card"] .logo-title').contains(bSource).then(ele => {
                        cy.wrap(ele).parents('[class*="card sourceBooking-card"]').find('[id*="editAutoPayments"]').click()
                    })//Edit BS Icon
                    cy.get('[class="modal-content autopayment-modal"]').should('be.visible') //Modal window
                    if (text.includes('Credit Card')) {
                        cy.get('[id*="cardValidation"] [id*="OnOffForSource"]').should('be.checked')
                        cy.log('Credit Card Validation is enabled for this BS')
                    } else {
                        cy.get('[id*="cardValidation"] [id*="OnOffForSource"]').should('not.be.checked')
                        cy.log('Credit Card Validation is not enabled for this BS')
                    }
                    if (text.includes('Reservation')) {
                        cy.get('[id*="paymentSchedule"] [id*="OnOffForSource"]').should('be.checked')
                        cy.log('Reservation Charges is enabled for this BS')
                    } else {
                        cy.get('[id*="paymentSchedule"] [id*="OnOffForSource"]').should('not.be.checked')
                        cy.log('Reservation Charges is not enabled for this BS')
                    }
                    if (text.includes('Security')) {
                        cy.get('[id*="securityDeposit"] [id*="OnOffForSource"]').should('be.checked')
                        cy.log('Security Deposit Auth is enabled for this BS')
                    } else {
                        cy.get('[id*="securityDeposit"] [id*="OnOffForSource"]').should('not.be.checked')
                        cy.log('Security Deposit Auth is not enabled for this BS')
                    }
                    if (text.includes('Auto Refund')) {
                        cy.get('[id*="cancelationPolicy"] [id*="OnOffForSource"]').should('be.checked')
                        cy.log('Reservation Auto Refund is enabled for this BS')
                    } else {
                        cy.get('[id*="cancelationPolicy"] [id*="OnOffForSource"]').should('not.be.checked')
                        cy.log('Reservation Auto Refund is not enabled for this BS')
                    }
                    cy.get('[id*="closeAPDetailsmodal"]').should('contain.text', 'Cancel').click() //Close modal
                })
        })
    }
    validateSelectedSettingsOnAllBS() {
        cy.get('[class*="card sourceBooking-card"]').each((ele, index) => {
            cy.get('[class*="card sourceBooking-card"] [id*="headingOne"]').eq(index).find('span').invoke('text').then(text => {
                cy.get('[id*="editAutoPayments"]').eq(index).click() //Open modal : edit icon
                cy.get('[class="modal-content autopayment-modal"]').should('be.visible') //Modal window
                if (text.includes('Credit Card')) {
                    cy.get('[id*="cardValidation"] [id*="OnOffForSource"]').should('be.checked')
                    cy.log('Credit Card Validation is enabled for this BS')
                } else {
                    cy.get('[id*="cardValidation"] [id*="OnOffForSource"]').should('not.be.checked')
                    cy.log('Credit Card Validation is not enabled for this BS')
                }
                if (text.includes('Reservation')) {
                    cy.get('[id*="paymentSchedule"] [id*="OnOffForSource"]').should('be.checked')
                    cy.log('Reservation Charges is enabled for this BS')
                } else {
                    cy.get('[id*="paymentSchedule"] [id*="OnOffForSource"]').should('not.be.checked')
                    cy.log('Reservation Charges is not enabled for this BS')
                }
                if (text.includes('Security')) {
                    cy.get('[id*="securityDeposit"] [id*="OnOffForSource"]').should('be.checked')
                    cy.log('Security Deposit Auth is enabled for this BS')
                } else {
                    cy.get('[id*="securityDeposit"] [id*="OnOffForSource"]').should('not.be.checked')
                    cy.log('Security Deposit Auth is not enabled for this BS')
                }
                if (text.includes('Auto Refund')) {
                    cy.get('[id*="cancelationPolicy"] [id*="OnOffForSource"]').should('be.checked')
                    cy.log('Reservation Auto Refund is enabled for this BS')
                } else {
                    cy.get('[id*="cancelationPolicy"] [id*="OnOffForSource"]').should('not.be.checked')
                    cy.log('Reservation Auto Refund is not enabled for this BS')
                }
                cy.get('[id*="closeAPDetailsmodal"]').should('contain.text', 'Cancel').click() //Close modal
            })
        })
        //Booking sources validation
        cy.get('[class*="card sourceBooking-card"]').then(ele => { //BS Records cards
            const count = ele.length
            cy.log('Total Number of Booking Source are: ' + count)
            cy.get('[id*="editAutoPayments"]').should('have.length', count) //Edit icons on BS
            cy.get('.paymentrule-card .checkbox-toggle').should('have.length', count) //Toggle
        })
    }
    getBookingSourceStatus(BSource) {
        cy.get('[class*="card sourceBooking-card"] .logo-title').contains(BSource).then(ele => {
            cy.wrap(ele).parents('[class*="card sourceBooking-card"]')
                .find('[id*="OnOffForSource"]').then(toggle => {
                    if (toggle.prop('checked')) {
                        cy.log(BSource + " booking source is enabled")
                    } else {
                        cy.log(BSource + " booking source is disabled")
                    }
                })
        })
    }
    enableBookingSource(BSource) {
        cy.get('[class*="card sourceBooking-card"] .logo-title').contains(BSource).then(ele => {
            cy.wrap(ele).parents('[class*="card sourceBooking-card"]')
                .find('[id*="OnOffForSource"]').then(toggle => {
                    if (toggle.prop('checked')) {
                        cy.log(BSource + " booking source is already enabled")
                    } else {
                        cy.get('[class*="card sourceBooking-card"] .logo-title').contains(BSource).then(ele => {
                            cy.wrap(ele).parents('[class*="card sourceBooking-card"]')
                                .find('[id*="OnOffForSource"]').click({ force: true }) //toggle 
                            cy.contains('Settings Saved!').should('exist')
                            cy.log(BSource + " booking source is enabled now!")
                        })
                    }
                })
        })
    }
    disableBookingSource(BSource) {
        cy.get('[class*="card sourceBooking-card"] .logo-title').contains(BSource).then(ele => {
            cy.wrap(ele).parents('[class*="card sourceBooking-card"]')
                .find('[id*="OnOffForSource"]').then(toggle => {
                    if (!toggle.prop('checked')) {
                        cy.log(BSource + " booking source is already disabled")
                    } else {
                        cy.get('[class*="card sourceBooking-card"] .logo-title').contains(BSource).then(ele => {
                            cy.wrap(ele).parents('[class*="card sourceBooking-card"]')
                                .find('[id*="OnOffForSource"]').click({ force: true }) //toggle 
                            cy.contains('Settings Saved!').should('exist')
                            cy.log(BSource + " booking source is disabled now!")
                        })
                    }
                })
        })
    }
    clickEditBS(bSource)
    {
      cy.get('[class*="card sourceBooking-card"] .logo-title').contains(bSource).then(ele => { 
        cy.wrap(ele).parents('[class*="card sourceBooking-card"]')
            .find('[id*="editAutoPayments"]').click() //Edit icon
        cy.get('.loading-label').should('not.exist') //loader should be disappear     
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('be.visible').should('contain.text',bSource) //BS Heading on modal
    })
    }
    enableReservationPayment(bSource,amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="paymentSchedule"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            cy.get('[id*="paymentSchedule"] [aria-expanded="false"]').if().click().wait(1000) //If not than expand it
            cy.get('.paymenschedule-body .card-section-title.mb-2').should('contain.text','Collect Booking Amount')
            cy.get('.paymenschedule-body .col-md-3 [id*="amountTypePayment"]').select(amountTypePayment).then(()=>{ //Percentage of booking : 2
                cy.wait(1000)
                cy.get('.paymenschedule-body [id*="amountTypePaymentSelect"]').if().select(amountTypePaymentSelect) //100%
            }) 
            cy.get('.paymenschedule-body [id*="timeAfterBookingPayment"]').select(reservation_authTime) //Collect When: Immediately 0
            cy.get('.paymenschedule-body [id*="whenToCharge"]').select(reservation_chargeOption) //when to charge: after booking 0
            cy.get('.paymenschedule-body [id*="payment_single_enable"]').uncheck({force:true}).should('not.be.checked') //Chargeback Protection
            //Remaining Balance
            cy.get('.paymenschedule-body [class="card-section-title mt-1 mb-2"]').if().should('contain.text','Remaining Balance')
            cy.get('.paymenschedule-body [class="form-control custom-select-arrow"]').if().select('0') //Immediately
            if (toggle.prop('checked')) {
                cy.log("Reservation Payment is already enabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="paymentSchedule"] [id*="OnOffForSource"]').click({ force: true }).wait(1000) //Click toggle to enable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
                cy.log("Reservation Payment is now enabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
    }
    disableReservationPayment(bSource)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="paymentSchedule"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            if (!toggle.prop('checked')) {
                cy.log("Reservation Payment is already Disabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="paymentSchedule"] [id*="OnOffForSource"]').click({ force: true }) //Click toggle to disable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
                cy.log("Reservation Payment is now Disabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
    }
    enableProtectionOnReservationPayment(bSource)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="paymentSchedule"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            cy.get('[id*="paymentSchedule"] [aria-expanded="false"]').if().click() //If not than expand it
            cy.get('.paymenschedule-body .card-section-title.mb-2').should('contain.text','Collect Booking Amount')
            cy.get('.paymenschedule-body [id*="payment_single_enable"]').check({force:true}).should('be.checked') //Chargeback Protection
            if (toggle.prop('checked')) {
                cy.log("Reservation Payment is already enabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="paymentSchedule"] [id*="OnOffForSource"]').click({ force: true }) //Click toggle to enable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
                cy.log("Reservation Payment is now enabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
    }
    disableProtectionOnReservationPayment(bSource)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="paymentSchedule"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            cy.get('[id*="paymentSchedule"] [aria-expanded="false"]').if().click() //If not than expand it
            cy.get('.paymenschedule-body .card-section-title.mb-2').should('contain.text','Collect Booking Amount')
            cy.get('.paymenschedule-body [id*="payment_single_enable"]').uncheck({force:true}).should('not.be.checked') //Chargeback Protection
            if (toggle.prop('checked')) {
                cy.log("Reservation Payment is already enabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="paymentSchedule"] [id*="OnOffForSource"]').click({ force: true }) //Click toggle to enable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
                cy.log("Reservation Payment is now enabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
    }
    enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="cardValidation"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            
            cy.get('[id*="cardValidation"] [aria-expanded="false"]').if().click() //If not than expand it
            cy.get('.creditcard-body [class="card-section-title mb-2"]').should('contain.text','How much to authorize?')
            cy.get('.creditcard-body [id*="amountType"]').select(cc_amountType).wait(1000) //Fixed Amount, %age of booking, First Night
            cy.get('.creditcard-body [placeholder="Fixed amount"]').if().type('{selectall}'+cc_Amount) //CC Auth Amount
            cy.get('.creditcard-body [id*="ccPercentBooking"]').if().select(cc_Amount) //CC Auth %
            cy.get('.creditcard-body [id*="auth_enable"]').uncheck({force:true}).should('not.be.checked') //Chargeback Protection
            cy.get('.creditcard-body [class="card-section-title mt-1 mb-2 pb-0"]').should('contain.text','When to authorize?')
            cy.get('.creditcard-body [id*="timeAfterBooking"]').select(cc_authTime) //Authorized Immediately, 1 hour to 365 days
            cy.get('.creditcard-body [id*="checkAuto"]').uncheck({force:true}).should('not.be.checked') //Keep extending the authorization until the end of checkout
            
            if (toggle.prop('checked')) {
                cy.log("Credit Card Validation is already enabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="cardValidation"] [id*="OnOffForSource"]').click({ force: true }) //Click toggle to enable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist')//Success toast
                cy.log("Credit Card Validation is now enabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
    }
    disableCCValidation(bSource)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="cardValidation"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            
            cy.get('[id*="cardValidation"] [aria-expanded="false"]').if().click() //If not than expand it
            cy.get('.creditcard-body [class="card-section-title mb-2"]').should('contain.text','How much to authorize?')
            
            if (!toggle.prop('checked')) {
                cy.log("Credit Card Validation is already disabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="cardValidation"] [id*="OnOffForSource"]').click({ force: true }) //Click toggle to disable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist')//Success toast
                cy.log("Credit Card Validation is now disabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
    }
    enableProtectionCCValidation(bSource)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="cardValidation"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            
            cy.get('[id*="cardValidation"] [aria-expanded="false"]').if().click() //If not than expand it
            cy.get('.creditcard-body [class="card-section-title mb-2"]').should('contain.text','How much to authorize?')
            cy.get('.creditcard-body [id*="auth_enable"]').should('exist').check({force:true}) //enable Chargeback Protection
            if (toggle.prop('checked')) {
                cy.log("Credit Card Validation is already enabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="cardValidation"] [id*="OnOffForSource"]').click({ force: true }) //Click toggle to enable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist')//Success toast
                cy.log("Credit Card Validation is now enabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')

    }
    disableProtectionCCValidation(bSource)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="cardValidation"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            
            cy.get('[id*="cardValidation"] [aria-expanded="false"]').if().click() //If not than expand it
            cy.get('.creditcard-body [class="card-section-title mb-2"]').should('contain.text','How much to authorize?')
            cy.get('.creditcard-body [id*="auth_enable"]').should('exist').uncheck({force:true}) //disable Chargeback Protection
            if (toggle.prop('checked')) {
                cy.log("Credit Card Validation is already enabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="cardValidation"] [id*="OnOffForSource"]').click({ force: true }) //Click toggle to enable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist')//Success toast
                cy.log("Credit Card Validation is now enabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')

    }
    enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="securityDeposit"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            
            cy.get('[id*="securityDeposit"] [aria-expanded="false"]').if().click() //If not than expand it
            cy.get('.security-body [class="card-section-title mt-1 mb-2"]').should('contain.text','How much to authorize?')
            cy.get('.security-body [id*="securityDepositAmountType"]').select(sd_amountType).wait(1000) //Fixed Amount, %age of booking, First Night
            cy.get('.security-body [placeholder="Amount"]').if().type('{selectall}'+ sd_Amount) //SD Auth Amount
            cy.get('.security-body [id*="amountTypePaymentSelect"]').if().select(sd_Amount) //SD Auth %
            cy.get('.security-body [id*="auth_enable"]').uncheck({force:true}).should('not.be.checked') //Chargeback Protection
            cy.get('.security-body [class="card-section-title mt-1 mb-2 pb-0"]').should('contain.text','When to authorize?')
            cy.get('.security-body [id*="timeAfterBooking"]').select(sd_authTime) //Authorized Immediately, 1 hour to 365 days
            cy.get('.security-body [id*="checkAuto"]').uncheck({force:true}).should('not.be.checked') //Keep extending the authorization until the end of checkout
            cy.get('.security-body [class="alert alert-warning mb-1"]').should('contain.text','Security deposit is automatically released 3 days after checkout. You can manually release anytime')
            cy.get('.security-body [class="alert alert-warning mb-0"]').should('contain.text','If guest credit card is not available, an email notification will be sent with a link for guest to add a card')
            
            if (toggle.prop('checked')) {
                cy.log("Security Deposit Validation is already enabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="securityDeposit"] [id*="OnOffForSource"]').click({ force: true }) //Click toggle to enable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist')//Success toast
                cy.log("Security Deposit Validation is now enabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
    }
    enableProtectionOnSecurityDeposit(bSource)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="securityDeposit"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            
            cy.get('[id*="securityDeposit"] [aria-expanded="false"]').if().click() //If not than expand it
            cy.get('.security-body [class="card-section-title mt-1 mb-2"]').should('contain.text','How much to authorize?')
            cy.get('.security-body [id*="auth_enable"]').check({force:true}).should('be.checked') //Chargeback Protection
            cy.get('.security-body [class="alert alert-warning mb-1"]').should('contain.text','Security deposit is automatically released 3 days after checkout. You can manually release anytime')
            cy.get('.security-body [class="alert alert-warning mb-0"]').should('contain.text','If guest credit card is not available, an email notification will be sent with a link for guest to add a card')
            
            if (toggle.prop('checked')) {
                cy.log("Security Deposit Validation is already enabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="securityDeposit"] [id*="OnOffForSource"]').click({ force: true }) //Click toggle to enable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist')//Success toast
                cy.log("Security Deposit Validation is now enabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
    }
    disableProtectionOnSecurityDeposit(bSource)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="securityDeposit"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            
            cy.get('[id*="securityDeposit"] [aria-expanded="false"]').if().click() //If not than expand it
            cy.get('.security-body [class="card-section-title mt-1 mb-2"]').should('contain.text','How much to authorize?')
            cy.get('.security-body [id*="auth_enable"]').uncheck({force:true}).should('not.be.checked') //Chargeback Protection
            cy.get('.security-body [class="alert alert-warning mb-1"]').should('contain.text','Security deposit is automatically released 3 days after checkout. You can manually release anytime')
            cy.get('.security-body [class="alert alert-warning mb-0"]').should('contain.text','If guest credit card is not available, an email notification will be sent with a link for guest to add a card')
            
            if (toggle.prop('checked')) {
                cy.log("Security Deposit Validation is already enabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="securityDeposit"] [id*="OnOffForSource"]').click({ force: true }) //Click toggle to enable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist')//Success toast
                cy.log("Security Deposit Validation is now enabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
    }
    enableAutoRefund(bSource, toggleStatus, refundTime, cancelfee, cancelWithin, flatfee)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('.show [id*="cancelationPolicy"] [id*="OnOffForSource"]').then(toggle => { //Toggle status
            cy.get('[id*="cancelationPolicy"] [aria-expanded="false"]').if().click().wait(1000) //If not than expand it
            cy.get('[id*="cancelationPolicy"] .booking-accordion-title').should('contain.text','Reservation Auto Refund')
            cy.get('.cancellation-body .card-section-title span').should('contain.text','Auto refund any collected amount if reservation is cancelled')
            // both toggles are off
            if (toggleStatus === 0){
                cy.get('input[id*="CPS_afterBookingStatus"]').then(afterBookingToggle =>{
                    if (afterBookingToggle.prop('checked')) {
                        cy.get(afterBookingToggle).click({ force: true }).wait(1000) //Click toggle to disable
                        cy.log("1st toggle is now disabled for after booking")
                    } else {
                        cy.log("1st toggle is already disabled for after booking")
                    }
                })
                cy.get('.cancel-booking input[id*="checkAuto"]').then(beforeCheckinToggle =>{
                    if (beforeCheckinToggle.prop('checked')) {
                        cy.get(beforeCheckinToggle).click({ force: true }).wait(1000) //Click toggle to disable
                        cy.log("2nd toggle is now disable for Before checkin")
                        
                    } else {
                        cy.log("2nd toggle is already disabled for Before checkin")
                    }
                })   
                cy.get('.anytime [id*="timeAfterBooking"]').should('not.exist') //input fields will be disabled if both toggles are disabled
            }
            
            // 1st toggle After booking
            if (toggleStatus === 1){
                cy.get('input[id*="CPS_afterBookingStatus"]').then(afterBookingToggle =>{
                    if (afterBookingToggle.prop('checked')) {
                        cy.log("1st toggle is already enabled for after booking")
                    } else {
                        cy.get(afterBookingToggle).click({ force: true }).wait(1000) //Click toggle to enable
                        cy.log("1st toggle is now enabled for after booking")
                    }
                    cy.get('.anytime [id*="timeAfterBooking"]').should('exist').select(refundTime) // anytime After booking 0
                })    
            }
            // 2nd toggle Before check-in
            if(toggleStatus === 2){
                cy.get('.cancel-booking input[id*="checkAuto"]').then(beforeCheckinToggle =>{
                    if (beforeCheckinToggle.prop('checked')) {
                        cy.log("2nd toggle is already enabled for Before checkin")
                    } else {
                        cy.get(beforeCheckinToggle).click({ force: true }).wait(1000) //Click toggle to enable
                        cy.log("2nd toggle is now enabled for Before checkin")
                        cy.get('.view-edit-title').if().should('contain.text','In case of contradiction between charging & not charging policy, not charging policy will supersede.')
                        cy.get('button[class="swal2-confirm swal2-styled"]').if().should('be.visible').should('contain.text','OK').click() //OK
                    }
                    cy.get('.anytime [id*="timeAfterBooking"]').should('exist').select(refundTime) // anytime After booking 0
                })    

            }
            cy.wait(1000)
            //Cancellation fee 
            cy.get('[class="card-section-title mt-4 mb-1"]').if().should('contain.text','Please specify Cancellation Fee amount if a reservation is cancelled')
            cy.get('.cancelfee select[class="custom-select-arrow form-control"]').if().eq(0).select(cancelfee) //% value of Cancellation Fee
            cy.get('.cancelwithin [id*="timeAfterBooking"]').if().eq(0).select(cancelWithin) //if canceled Within
            cy.get('.flatfee input').if().eq(0).type('{selectall}' + flatfee)

            //AutoPayment Toggle status 
            if (toggle.prop('checked')) {
                cy.log("Auto Refund is already enabled for: " + bSource)
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
            } else {
                cy.get('.show [id*="cancelationPolicy"] [id*="OnOffForSource"]').click({ force: true }).wait(1000) //Click toggle to enable
                cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
                cy.contains('Settings Saved!').should('exist') //Success toast
                cy.log("Auto Refund is now enabled for: " + bSource)
            }
        })
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
    }

    createBookingSource(BSname)
    {
        cy.get('.booking-source-btn [data-target="#bookingSourceAddEditModal"]').should('contain.text','Add Booking Source').click() //Add Booking Source
        cy.get('[id="bookingSourceAddEditModal"] .modal-title').should('be.visible').and('contain.text','Add Booking Source') //heading on modal
        cy.get('#product_img_heading').should('contain.text','Booking Source Logo') 
        cy.get('#product_img_sub').should('contain.text','Only image file allowed to upload here.')
        cy.get('#bs_logo_btn').should('contain.text','Upload Logo')
        cy.get('#bs_logo').attachFile('Images/testImage.jpeg').wait(1000) //Logo image upload
        cy.get('#name').should('be.visible').type(BSname) //BS Name
        cy.get('[title="Save data"]').should('contain.text','Save').click() //Save
        cy.wait(1000)
    }
    deleteBookingSource()
    {
        cy.get('[title="Delete booking source"]').should('contain.text','Delete').and('be.visible').click()// Delete button
        cy.get('[id="swal2-title"]').should('contain.text','Are you sure, you want to delete this Booking Source?').and('be.visible')
        cy.get('.swal2-cancel').should('contain.text','No') //No button
        cy.get('.swal2-confirm').should('contain.text','Yes').click() //Yes Button
        
    }
    validateToastMsg(msg)
    {
        cy.get('.toast-message').should('exist').should('contain.text', msg)
    }
    validateAppliedAPSettings(bSource1, bSource2) {
        cy.get('[class*="card sourceBooking-card"] .logo-title').contains(bSource1).then(ele => {
            cy.wrap(ele).parents('[class*="card sourceBooking-card"]')
                .find('[id*="headingOne"]').invoke('text').then(text => {
                    cy.log('These AP settings are applied on this BS: ' + text)
                    cy.get('[class*="card sourceBooking-card"] .logo-title').contains(bSource2).then(ele => {
                        cy.wrap(ele).parents('[class*="card sourceBooking-card"]').find('[id*="editAutoPayments"]').click()
                    })//Edit BS Icon
                    cy.get('[class="modal-content autopayment-modal"]').should('be.visible') //Modal window
                    if (text.includes('Credit Card')) {
                        cy.get('[id*="cardValidation"] [id*="OnOffForSource"]').should('be.checked')
                        cy.log('Credit Card Validation is enabled for this BS')
                    } else {
                        cy.get('[id*="cardValidation"] [id*="OnOffForSource"]').should('not.be.checked')
                        cy.log('Credit Card Validation is not enabled for this BS')
                    }
                    if (text.includes('Reservation')) {
                        cy.get('[id*="paymentSchedule"] [id*="OnOffForSource"]').should('be.checked')
                        cy.log('Reservation Charges is enabled for this BS')
                    } else {
                        cy.get('[id*="paymentSchedule"] [id*="OnOffForSource"]').should('not.be.checked')
                        cy.log('Reservation Charges is not enabled for this BS')
                    }
                    if (text.includes('Security')) {
                        cy.get('[id*="securityDeposit"] [id*="OnOffForSource"]').should('be.checked')
                        cy.log('Security Deposit Auth is enabled for this BS')
                    } else {
                        cy.get('[id*="securityDeposit"] [id*="OnOffForSource"]').should('not.be.checked')
                        cy.log('Security Deposit Auth is not enabled for this BS')
                    }
                    if (text.includes('Auto Refund')) {
                        cy.get('[id*="cancelationPolicy"] [id*="OnOffForSource"]').should('be.checked')
                        cy.log('Reservation Auto Refund is enabled for this BS')
                    } else {
                        cy.get('[id*="cancelationPolicy"] [id*="OnOffForSource"]').should('not.be.checked')
                        cy.log('Reservation Auto Refund is not enabled for this BS')
                    }
                    cy.get('[id*="closeAPDetailsmodal"]').should('contain.text', 'Cancel').click() //Close modal
                })
        })
    }
    copyAPSettings(OldBS, newBS)
    {
        this.clickEditBS(OldBS) //Edit BS
        cy.get('.paymentrule-card [data-target="#m_modal_copy-auto-payment-settings"]').should('contain.text','Copy Settings To')
        .should('be.visible').click() //Copy Settings to
        cy.get('.show [id="exampleModalLabel"]').should('be.visible').and('contain.text','Copy Booking Source Setting') //modal heading
        cy.get('.show .input-container').should('contain.text','Select an option').click() //Select an option 
        cy.get('.list_item').contains(newBS).parents('.list_item').find('input.list_input').check({force:true}) //check desired BS
        cy.get('.show [id="exampleModalLabel"]').should('be.visible').and('contain.text','Copy Booking Source Setting').click() //click modal heading to close the dropdown
        cy.get('.copysettings-modal .btn-success').should('contain.text','Save').and('be.visible').click() //Save
        //Confirmation toast
        cy.get('.view-edit-title').should('be.visible').should('contain.text','Click Save below to apply the new payment rules to the selected Booking source(s) and discard the old settings')
        cy.get('.swal2-confirm').should('contain.text','Save').click() //Save
        cy.get('.toast-text').should('contain.text','AP Settings Copied Successfully!')
        /*
        //Save AP settings
        cy.get('[data-target*=".collapse.show"] .btn-success').should('be.visible').click() //Save
        cy.contains('Settings Saved!').should('exist') //Success toast
        cy.log("Autopayment Settings copied to " + newBS + " successfully!")
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('not.exist')
        */
    }
    selectBSOnCopyAPSettings(toBS)
    {
        cy.get('.paymentrule-card [data-target="#m_modal_copy-auto-payment-settings"]').should('contain.text','Copy Settings To')
        .should('be.visible').click() //Copy Settings to
        cy.get('.show [id="exampleModalLabel"]').should('be.visible').and('contain.text','Copy Booking Source Setting') //modal heading
        cy.get('.show .input-container').should('contain.text','Select an option').click() // click copy to field
        cy.get('.show .selectDeselect').should('be.visible').click().wait(1000) //select all
        cy.get('.show .selectDeselect').should('be.visible').click().wait(1000)  //deselect all
        cy.get('.show [placeholder="Search"]').should('exist').type(toBS)
        cy.get('.list_item').contains(toBS).parents('.list_item').find('input.list_input').check({force:true}) //check desired BS
        cy.get('.show [id="exampleModalLabel"]').should('be.visible').and('contain.text','Copy Booking Source Setting').click() //click modal heading to close the dropdown
        cy.wait(1000)
        cy.get('.show .input-container').should('contain.text','1 items selected') //validate Selection
    }
    deselectBSOnCopyAPSettings(toBS)
    {
        cy.get('.paymentrule-card [data-target="#m_modal_copy-auto-payment-settings"]')
            .if('visible').should('contain.text','Copy Settings To').click() //Copy Settings to
        cy.get('.show [id="exampleModalLabel"]').should('be.visible').and('contain.text','Copy Booking Source Setting') //modal heading
        cy.get('.show .input-container').should('contain.text','1 items selected').click() // click copy to field
        cy.get('.show [placeholder="Search"]').should('exist').clear().type(toBS)
        cy.get('.list_item').contains(toBS).parents('.list_item').find('input.list_input').uncheck({force:true}) 
        cy.get('.show [id="exampleModalLabel"]').should('be.visible').and('contain.text','Copy Booking Source Setting').click() //click modal heading to close the dropdown
        cy.wait(1000)
        cy.get('.show .input-container').should('contain.text','Select an option') //validate deselection
    }
    addCancellationFee(index, bSource, cancelfee, cancelWithin, flatfee)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('[id*="cancelationPolicy"] [aria-expanded="false"]').if().click().wait(1000) //If not than expand it
        cy.get('.another-btn').scrollIntoView().should('contain.text','+ Add Another').and('be.visible').click()//+ Add Another
        cy.get('.cancelfee select[class="custom-select-arrow form-control"]').eq(index).select(cancelfee) //% value of Cancellation Fee
        cy.get('.cancelwithin [id*="timeAfterBooking"]').eq(index).select(cancelWithin) //if canceled Within
        cy.get('.flatfee input').eq(index).type('{selectall}' + flatfee)
        cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
        cy.contains('Settings Saved!').should('exist') //Success toast
        cy.get('.autopayment-modal').should('not.be.visible')
    }
    deleteCancellationFee(index, bSource)
    {
        cy.get('.show .booking-accordion-title.paymentrules-logo').should('contain.text', bSource)
        cy.get('[id*="cancelationPolicy"] [aria-expanded="false"]').if().click().wait(1000) //If not than expand it
        cy.get('.cross-btn').should('be.visible').eq(index).click() //Delete icon
        cy.get('.show [data-target*="collapse.show"] [class="btn btn-success btn-sm px-3"]').should('exist').click().wait(1000) //Save
        cy.contains('Settings Saved!').should('exist') //Success toast
        cy.get('.autopayment-modal').should('not.be.visible')
    }
    
    //Tooltips
    validateHelpLinkTooltip()
    {
        cy.get('.help-link .fa-question-circle').should('be.visible').click()
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','How Does Auto Payment Work?')
        cy.get('.tooltip-inner a').should('have.attr','href','https://help.chargeautomation.com/en/articles/5479679-auto-payments-setting').and('contain.text','Learn More')
    }
    validateCCValidationTooltip()
    {
        cy.get('[id*="cardValidation"] [aria-expanded="false"]').if().click().wait(1000) //If not than expand it
        cy.get('[id*="cardValidation"] .fa-info-circle').eq(0).should('be.visible').trigger('mouseenter')//heading tooltip
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','You can use this option to ensure customer is using a valid card by putting a temporary authorization (hold) on the card')
        cy.get('.tooltip-inner a').should('have.attr','href',' http://help.chargeautomation.com/en/articles/5479679-auto-payments-setting').and('contain.text','Learn More')
        cy.get('[id*="cardValidation"] .fa-info-circle').eq(0).should('be.visible').trigger('mouseleave')//heading tooltip

        cy.get('[id*="cardValidation"] .fa-info-circle').eq(1).should('be.visible').trigger('mouseenter') //Chargeback tooltip
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','Protect your payments from fraud')
        cy.get('.tooltip-inner a').should('have.attr','href','https://help.chargeautomation.com/en/articles/4568168-chargeback-protection').and('contain.text','Learn More')
        cy.get('[id*="cardValidation"] .fa-info-circle').eq(1).should('be.visible').trigger('mouseleave') //Chargeback tooltip
    }
    validateReservationTooltip()
    {
        cy.get('[id*="paymentSchedule"] [aria-expanded="false"]').if().click().wait(1000) //If not than expand it
        cy.get('[id*="paymentSchedule"] .fa-info-circle').eq(0).should('be.visible').trigger('mouseenter')//heading tooltip
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','If you need to collect reservation payment for the above booking source, select when & how much to collect & the system will automatically collect it')
        cy.get('.tooltip-inner a').should('have.attr','href',' http://help.chargeautomation.com/en/articles/5479679-auto-payments-setting').and('contain.text','Learn More')
        cy.get('[id*="paymentSchedule"] .fa-info-circle').eq(0).should('be.visible').trigger('mouseleave')//heading tooltip

        cy.get('[id*="paymentSchedule"] .fa-info-circle').eq(1).should('be.visible').trigger('mouseenter')//Chargeback tooltip
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','Protect your payments from fraud')
        cy.get('.tooltip-inner a').should('have.attr','href','https://help.chargeautomation.com/en/articles/4568168-chargeback-protection').and('contain.text','Learn More')
        cy.get('[id*="paymentSchedule"] .fa-info-circle').eq(1).should('be.visible').trigger('mouseleave')//Chargeback tooltip
    }
    validateSDTooltip()
    {
        cy.get('[id*="securityDeposit"] [aria-expanded="false"]').if().click().wait(1000) //If not than expand it
        cy.get('[id*="securityDeposit"] .fa-info-circle').eq(0).should('be.visible').trigger('mouseenter')//heading tooltip
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','You can use this option to put a temporary authorization (hold) on the card for the above booking source')
        cy.get('.tooltip-inner a').should('have.attr','href',' http://help.chargeautomation.com/en/articles/5479679-auto-payments-setting').and('contain.text','Learn More')
        cy.get('[id*="securityDeposit"] .fa-info-circle').eq(0).should('be.visible').trigger('mouseleave')//heading tooltip

        cy.get('[id*="securityDeposit"] .fa-info-circle').eq(1).should('be.visible').trigger('mouseenter')//Chargeback tooltip
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','Protect your payments from fraud')
        cy.get('.tooltip-inner a').should('have.attr','href','https://help.chargeautomation.com/en/articles/4568168-chargeback-protection').and('contain.text','Learn More')
        cy.get('[id*="securityDeposit"] .fa-info-circle').eq(1).should('be.visible').trigger('mouseleave')//Chargeback tooltip

        cy.get('[id*="securityDeposit"] .fa-info-circle').eq(2).should('be.visible').trigger('mouseenter')
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','Default check-in time is 4:00PM local time.')
        cy.get('[id*="securityDeposit"] .fa-info-circle').eq(2).should('be.visible').trigger('mouseleave')
    }
    validateAutoRefundTooltip()
    {
        cy.get('[id*="cancelationPolicy"] [aria-expanded="false"]').if().click().wait(1000) //If not than expand it
        cy.get('[id*="cancelationPolicy"] .fa-info-circle').eq(0).should('be.visible').trigger('mouseenter')//heading tooltip
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','If you are collecting Reservation payment, you can also create refund rules in case of cancellation. This is optional.')
        cy.get('.tooltip-inner a').should('have.attr','href',' http://help.chargeautomation.com/en/articles/5479679-auto-payments-setting').and('contain.text','Learn More')
        cy.get('[id*="cancelationPolicy"] .fa-info-circle').eq(0).should('be.visible').trigger('mouseleave')//heading tooltip

        cy.get('[id*="cancelationPolicy"] .fa-info-circle').eq(1).should('be.visible').trigger('mouseenter')//Chargeback tooltip
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','Any collected reservation payment will be refunded automatically.')
        cy.get('[id*="cancelationPolicy"] .fa-info-circle').eq(1).should('be.visible').trigger('mouseleave')//Chargeback tooltip

        cy.get('[id*="cancelationPolicy"] .fa-info-circle').eq(2).should('be.visible').trigger('mouseenter')
        cy.get('.tooltip-inner').should('be.visible').and('contain.text','Default check-in time is 4:00PM local time.')
        cy.get('[id*="cancelationPolicy"] .fa-info-circle').eq(2).should('be.visible').trigger('mouseleave')
    }
}
