export class Guestportal {
    validatePropertyName(propName) {
        cy.get('.company-logo').should('contain.text', propName) //Company logo
        cy.get('[class="mb-0 notranslate"]').should('contain.text', propName) //Title
    }
    validateCompanyName(companyName) {
        cy.get('.company-logo').should('contain.text', companyName) //Company logo
        cy.get('[class="mb-0 notranslate"]').should('contain.text', companyName) //Title
    }
    validateCompanyPhone(companyPhone) {
        cy.get('.gp-nav').should('contain.text', companyPhone)
    }
    validateCompanyAddress(companyAddress) {
        cy.get('.gp-location').should('contain.text', companyAddress)
    }
    validateCheckInOutDate(checkInDate, checkOutDate) {
        //checkInDate
        const inDateParts = checkInDate.split(" ");
        let inDay = inDateParts[1]
        if (inDay.startsWith("0")) {
            inDay = inDay.substring(1);
          }
          // Reconstruct the date string
        const formattedCheckInDate = `${inDateParts[0]} ${inDay} ${inDateParts[2]}`;

        //checkOutDate
        const outDateParts = checkOutDate.split(" ");
        let outDay = outDateParts[1]
        if (outDay.startsWith("0")) {
            outDay = outDay.substring(1);
          }
          // Reconstruct the date string
        const formattedCheckOutDate = `${outDateParts[0]} ${outDay} ${outDateParts[2]}`;

        cy.get('.gp-datetime').invoke('text').then(dateRange => {
            const date = dateRange.split(' - ')
            const startDate = date[0].trim()
            // Remove the year part from the end date
            const endDate = date[1].split(',')[0].trim();
            
            expect(formattedCheckInDate).to.contains(startDate)
            expect(formattedCheckOutDate).to.contains(endDate)
        })
    }
    validateGuidebookInstruction(guidebook) {
        cy.get('#property_guide_book_tab').should('contain.text', 'instructions')
        cy.get('[data-target="#property_guide_book_detail_model"]').should('contain.text', guidebook) //Guidebook
    }
    validateDisabledGuidebook() {
        cy.get('#property_guide_book_tab').should('not.exist')
        cy.get('[data-target="#property_guide_book_detail_model"]').should('not.exist') //Guidebook
    }
    validateBookingStatus() {
        cy.get('#headingOne').should('contain.text', 'Booking Information').click() //heading
        cy.get('.booking-info-body .text-success.translate').should('contain.text', 'Confirmed') //Booking status
    }
    validateBookingID(bookingID) {
        cy.get('[class="card-body booking-info-body"] [class="col-6 col-xs-12"]:nth-child(2)').should('contain.text', bookingID)
    }
    validateCheckinDate(checkInDate) {
        const date = checkInDate.split(" ")
        const fromDate = date[0] + " " + date[1]
        cy.get('[class="card-body booking-info-body"] [class="col-6 col-xs-12"]:nth-child(3) dd').should('contain.text', fromDate)
    }
    validateCheckoutDate(checkOutDate) {
        const date = checkOutDate.split(" ")
        const toDate = date[0] + " " + date[1]
        cy.get('[class="card-body booking-info-body"] [class="col-6 col-xs-12"]:nth-child(4) dd').should('contain.text', toDate)
    }
    validateCompAdd(companyAddress) {
        cy.get('[class="card-body booking-info-body"] .address-wrap').should('contain.text', companyAddress)
    }
    validateFullName(fullName) {
        cy.get('[class*="booking-info-body"] [class="col-6 col-xs-12"]:nth-child(7) dd').should('contain.text', fullName)
    }
    validateGuestPhone(guestPhone) {
        cy.get('[class*="booking-info-body"] [class="col-6 col-xs-12"]:nth-child(8) dd').should('contain.text', guestPhone)
    }
    validateGuestDOB(guestDOB) {
        cy.get('[class*="booking-info-body"] [class="col-6 col-xs-12"]:nth-child(9) dd').should('contain.text', guestDOB)
    }
    validateGuestEmail(guestEmail) {
        cy.get('[class*="booking-info-body"] [class="col-6 col-xs-12"]:nth-child(11) dd').should('contain.text', guestEmail)
    }
    validateGuestAddress(guestAddress) {
        cy.get('[class*="booking-info-body"] [class="col-6 col-xs-12"]:nth-child(13) dd').should('contain.text', guestAddress)
    }
    validateGuestPostalCode(postalCode) {
        cy.get('[class*="booking-info-body"] [class="col-6 col-xs-12"]:nth-child(14) dd').should('contain.text', postalCode)
    }
    validateGuestCount(adult, child) {
        cy.get('#additional_guest_details_tab').should('contain.text', 'Guest Details').click() //heading
        cy.get('#collapseGuestDetails .card-section-title .badge').should('contain.text', (parseInt(adult) + parseInt(child))) //Guest count
    }
    validateGuestFullName(fullName) {
        cy.get('#collapseGuestDetails [data-test="guestBodyName"]').should('contain.text', fullName)
    }
    validateGuestEmail(guestEmail) {
        cy.get('#collapseGuestDetails [data-test="guestBodyEmail"]').should('contain.text', guestEmail)
    }
    validateGuestStatus() {
        cy.get('#collapseGuestDetails [data-test="guestBodyComplete"]').should('contain.text', 'Completed')
    }
    validateSharelinkCount(adult, child) {
        cy.get('#collapseGuestDetails [data-test="guestBodyShareLink"]').should('exist').then(elements => {
            const count = elements.length
            expect(count).to.be.eq(parseInt(adult) + parseInt(child)) //The share link count is equal to total guests
        })
    }
    validateAddGuestButton() {
        cy.get('#collapseGuestDetails [data-target="#addGuestModal"]').should('contain.text', 'Add Guest') //Add Guest button
    }
    expandPaymentDetails() {
        cy.get('#payment_details_tab').should('contain.text', 'Payment Details').click() //Payment Details heading
        cy.get('#collapseThree-gp-payment-details .card-section-title').eq(0).should('contain.text', 'Card Details') //Card Details
    }
    validateFullNameOnPaymentDetail(fullName) {
        cy.get('#collapseThree-gp-payment-details [class="rounded border card-wrap notranslate"]')
            .should('contain.text', fullName)
            .and('contain.text', 'Edit')
    }
    validatePaymentDetail() {
        cy.get('#collapseThree-gp-payment-details .card-section-title').eq(1).should('contain.text', 'Payment') //Payment
        cy.get('#collapseThree-gp-payment-details [class*="gp-amounttable"]')
            .should('contain.text', 'Title')
            .and('contain.text', 'Date')
            .and('contain.text', 'Amount')
            .and('contain.text', 'Status')
            .and('contain.text', 'Payment')
            .and('contain.text', 'Security Deposit')
    }
    validateTrxAmount(TrxAmount) {
        cy.get('.gp-payment-details .amount-td').eq(0).should('contain.text', TrxAmount)
    }
    validateDocUpload() {
        cy.get('#headingFive').should('contain.text', 'Document Upload').click() //heading
        cy.get('#guestImages_panel [class*="col-md-12 pt-3"]').eq(0).should('contain.text', 'ID Submitted')
        cy.get('#guestImages_panel [class*="col-md-12 pt-3"]').eq(1).should('contain.text', 'Credit Card Submitted')
        cy.get('#guestImages_panel [class*="col-md-12 pt-3"]').eq(2).should('contain.text', 'Selfie Submitted')
        cy.get('#guestImages_panel [class*="col-md-12 pt-3"]').eq(3).should('contain.text', 'Signature Submitted')
        cy.get('#guestImages_panel [class*="col-md-12 pt-3"] i[class="fas fa-check-circle text-primary"]').then(elements => {
            const count = elements.length
            expect(count).to.be.eq(4)
            if (count === 4) {
                cy.log('All documents are submitted!')
            }
        })
    }
    Updatequestionnaire() {
        cy.get('[data-id="#collapseSevenQuestionaire"]').should('contain.text', 'Questionnaire').click() //Heading
        cy.get('[class="card-body guest-portal-questionnaire"]')
            .should('contain.text', 'Some Important Questions!')
            .and('contain.text', 'Enter note about any suggestion?')
            .and('contain.text', 'Date Question')
            .and('contain.text', 'Alternate Phone Number')
            .and('contain.text', 'Email')
            .and('contain.text', 'Do you need an extra bed?')
            .and('contain.text', 'How many beds do you need?')
            .and('contain.text', 'Provide some basic infos')
            .and('contain.text', 'Choose your breakfast')
            .and('contain.text', 'What facilities do you need?')
            .and('contain.text', 'Upload your ID?')
        cy.get('[class="guestportal-edit-footer"] button').should('contain.text', 'Edit').click() //Edit
        cy.get('[data-test*="questionaireShortInput"]').type('{selectall} This is automated Testing') //Enter note about any suggestion?*
        cy.get('.guest-portal-questionnaire [data-test*="questionairDate"]').click() // Click Date Question
        cy.get('.guest-portal-questionnaire .is-today').click() //Select today date
        cy.get('.guest-portal-questionnaire [id*="phone-"]').type('{selectall}+923014336278') //phone
        cy.get('[data-test*="questionaireEmail"]').type('{selectall}emailforquestionarrie@yopmail.com') //email
        cy.get('[data-test*="questionairRadio"]').eq(0).click() //Do you need an extra bed? Yes
        cy.get('[data-test*="questionairNumber"]').type('{selectall}3') //How many beds do you need?
        cy.get('[data-test*="questionaireTextarea"]').type('{selectall}This is Test Automation Testing Some Basic Infos') //Provide some basic infos
        cy.get('[data-test*="questionairRadio"]').eq(2).click() //Choose your breakfast -> Bread Butter
        cy.get('[data-test*="questionairCheckbox"]').eq(0).check() //What facilities do you need? -> Spa
        cy.get('[data-test*="questionairCheckbox"]').eq(1).check() //What facilities do you need? -> Jim
        cy.get('[data-test*="questionairCheckbox"]').eq(2).check() //What facilities do you need? -> Swimming Pool
        cy.get('.guest-portal-questionnaire [name="Save Changes"]').should('contain.text', 'Save Changes').click() //Save Changes
        cy.get('[class="toast toast-success"]').should('contain.text', 'Questions updated.') //Success toast
    }
    validateAddons() {
        cy.get('#upsell_purchased_tab').should('contain.text', 'Add On Service').click() //heading
        cy.get('#collapseSeven-gp-add-on .card-section-title').eq(0).should('contain.text', 'Purchased Add-on Services') //Purchased Add-on Services heading
        cy.get('#collapseSeven-gp-add-on .card-section-title h4 span:nth-child(2)').invoke('text').then(text => {
            cy.log('The number of Purchased Add-on Services: ' + text) // log count
        })
    }
    validateFooterStatement()
    {
        cy.get('#footer-statement').should('contain.text', 'Powered by').and('contain.text', 'ChargeAutomation')
    }
}