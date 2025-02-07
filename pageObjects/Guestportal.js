export class Guestportal {
    validatePropertyName(propName) {
        cy.get('.company-logo').should('contain.text', propName) //Company logo
        cy.get('[class="mb-0 notranslate"]').should('contain.text', propName) //Title
    }
    validateCompanyName(companyName) {
        cy.get('.company-logo').should('contain.text', companyName) //Company logo
        cy.get('[class="mb-0 notranslate"]').should('contain.text', companyName) //Title
    }
    VerifyPropertyAddress() {
        cy.get('@propertyAddress').then(propertyAddress => {
            cy.get('.gp-location').should('be.visible').and('contain.text', propertyAddress)
        })
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
    validateDisabledGuidebook(guidebook) {
        cy.get('[data-target="#property_guide_book_detail_model"]').should('not.contain.text', guidebook) //Guidebook
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
    expandGuestTab() {
        cy.get('#additional_guest_details_tab').should('contain.text', 'Guest Details').click() //heading
    }
    validateShareLink(index) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('[data-id="#guest_details_tab"][aria-expanded="false"]').if().click() //expand if not already tab 
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('[data-test="guestBodyShareLink"]').eq(index).should('be.visible').and('contain.text', 'Share link').click().wait(1000) //share link
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('[data-test="guestModalShareTitle"]').should('be.visible').and('contain.text', 'Share Link to') //modal header
        cy.get('[data-test="guestModalShareViaTitle"]').should('be.visible').and('contain.text', 'Share this link via') //heading
        cy.get('[data-test="guestModashareEmailList"]').should('be.visible').and('contain.text', 'Email') //email
        cy.get('[data-test="guestModashareEmailList"] a').should('have.attr', 'href')
        cy.get('[data-test="guestModashareWhatsAppList"]').should('be.visible').and('contain.text', 'Whatsapp') //whatsapp
        cy.get('[data-test="guestModashareWhatsAppList"] a').should('have.attr', 'href')
        cy.get('[data-test="guestModashareSkypeList"]').should('be.visible').and('contain.text', 'Skype') //Skype
        cy.get('[data-test="guestModashareSkypeList"] a').should('have.attr', 'href')
        cy.get('[data-test="guestModashareMessengerList"]').should('be.visible').and('contain.text', 'Messenger') //Messenger
        cy.get('[data-test="guestModashareMessengerList"] a').should('have.attr', 'href', 'https://m.me')
        cy.get('[data-test="guestModalCopyTo"]').should('be.visible').and('contain.text', 'or copy link')
        cy.get('[data-test="guestModalShareLinkCopyInput"]').should('exist') //link input field
        cy.get('[data-test="guestModalCopyBtn"]').should('be.visible').and('contain.text', 'Copy')
        cy.get('[id="shareLinkModal"] [class="btn btn-secondary btn-sm"]').should('be.visible').and('contain.text', 'Close').click().and('not.be.visible').wait(500) //Close
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
    validateGuestTab(adult, child) {
        cy.get('#additional_guest_details_tab').should('be.visible').and('contain.text', 'Guest Details').click() //tab
        cy.get('[id="collapseGuestDetails"] h4').should('be.visible').and('contain.text', 'Guest Details') //heading
        cy.get('h4 > .badge').should('be.visible').and('contain.text', '1/' + (parseInt(adult) + parseInt(child)))
        cy.get('[id="collapseGuestDetails"] [class="guest-sub-title"]').should('contain.text', 'Additional guest details are required for this reservation').and('contain.text', 'You can complete these now or share a link with the respective individuals to complete. Alternatively, you can skip now and complete this later')
        //Guest Table
        cy.get('[data-test="guestName"]').should('contain.text', 'Name').and('be.visible')
        cy.get('[data-test="guestEmail"]').should('contain.text', 'Email').and('be.visible')
        cy.get('[data-test="guestStatus"]').should('contain.text', 'Status').and('be.visible')
    }
    validateGuestCountOnGuestTab() {
        cy.get('[data-test="guestTable"] tr td .guest-name').its('length').then(count => {
            cy.get('[data-parent="#guest-info"] h4 .badge').should('be.visible').and('contain.text', '1/' + parseInt(count))
        })
    }
    addNewGuestOnGuestPortal(guestName, email, type) {
        cy.get('.btn-primary.btn-sm').should('be.visible').and('contain.text', 'Add Guest').click()
        cy.get('#addGuestModal > .modal-dialog > .modal-content > .modal-header').should('be.visible').and('contain.text', 'Guest')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('[data-test="guestModalLabelName"] > .translate').should('contain.text', 'Full Name').and('be.visible').wait(2000)
        cy.get('[data-test="guestModalInputName"]').should('be.visible').type(guestName).wait(1000).should('contain.value', guestName) //name
        cy.get('[data-test="guestModalLabelEmail"] > .translate > :nth-child(1) > font').should('contain.text', 'Email')
        cy.get('[data-test="guestModalInputEmail"]').should('be.visible').type(email).wait(1000).should('contain.value', email) //email
        cy.get('[data-test="guestModalLabelType"] > .translate').should('contain.text', 'Type')
        cy.get('[data-test="guestModalSelectType"]').select(type) //type
        cy.get('[data-test="guestModalInputCancelBtn"]').should('be.visible').and('contain.text', 'Cancel')
        cy.get('[data-test="guestModalInputAddBtn"]').should('be.visible').and('contain.text', 'Add').click() //ADD
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.verifyToast('Guest added Successfully')
    }
    deleteGuesFromGuestPortal(index) {
        cy.get('[data-test="guestBodyDeleteGuest"].guest-delete').eq(index).should('exist').click({ force: true }) //delete
        cy.get('.view-edit-title').should('be.visible').and('contain.text', 'Do you want to delete this Guest?')
        cy.get('.swal2-cancel').should('be.visible').and('contain.text', 'No, Cancel')
        cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Yes, delete').click().wait(1000) //Yes, delete
        cy.get('.loading-label').should('not.exist') //loader should be disappear
    }
    validateMainGuestOnGuestTab() {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('[data-test="guestBodyViewEdit"]').eq(0).should('be.visible').click() //Edit main guest
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.wait(2000)
        cy.get('#guestDetailsModal.show .modal-header span:nth-child(1)').should('be.visible').invoke('text').then(mainGuest => {
            cy.log('Current Main Guest is: ' + mainGuest)
            cy.wrap(mainGuest).as('mainGuest')
        })
        cy.get('#guestDetailsModal.show .modal-header').should('be.visible').and('contain.text', 'Details')
        cy.get('#guestDetailsModal.show [id="mainguest"]').should('exist').click({ force: true }) //OFF the toggle
        cy.get('#guestDetailsModal.show .btn-success').should('be.visible').and('contain.text', 'Save').click() //Save
        cy.verifyToast('Booking must have one main guest')
        cy.get('#guestDetailsModal.show #cancelButton').should('be.visible').click() //Cancel
    }
    updateMainGuest(guestName) {
        cy.get('[data-test="guestBodyViewEdit"]').eq(1).should('be.visible').click() //Edit main guest
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('#guestDetailsModal.show .modal-header').should('be.visible').and('contain.text', 'Details')
        cy.get('#guestDetailsModal.show [id="mainguest"]').should('exist').click({ force: true }) //ON the toggle
        cy.get('#guestDetailsModal.show .guest-title').should('contain.text', 'Set as main guest')
        cy.get('#guestDetailsModal.show [placeholder="Full name"]').should('be.visible').type(guestName)
        cy.get('#guestDetailsModal.show [id*="phone"]').should('be.visible').type('{enter}' + '3014226585')
        cy.get('#guestDetailsModal.show [placeholder="Date of birth"]').should('exist').then((elem) => {
            cy.get(elem).click()
            //Select DOB
            cy.get('[class="vc-title"]').click()
            cy.get('[class*="vc-nav-title"]').click()
            cy.get('[class="vc-nav-arrow is-left"]').dblclick() //Arrow left
            cy.get('[class="vc-nav-item"]').eq(0).click() //year
            cy.get('[class="vc-nav-item"]').eq(0).click() //month
            cy.get('[class*="vc-day-content"]').eq(10).click() //Day
        })
        cy.get('#guestDetailsModal.show [id="8"]').should('be.visible').select('Pakistani')
        cy.get('#guestDetailsModal.show [placeholder="Email address"]').should('be.visible').type('testguest1@yopmail.com')
        cy.get('#guestDetailsModal.show [id="9"]').should('be.visible').select('Male')
        cy.get('#guestDetailsModal.show [placeholder="Please type your address"]').should('be.visible').type('Lahore Ring Road, Lahore, Pakistan')
        cy.get('#guestDetailsModal.show [placeholder="Zip code"]').should('be.visible').type('45000')

        cy.get('#guestDetailsModal.show .btn-success').should('be.visible').and('contain.text', 'Save').click() //Save
        cy.verifyToast('Data saved Successfully').wait(3000)
        cy.get('.loading-label').should('not.exist') //loader should be disappear
    }
    expandPaymentDetails() {
        cy.get('[id="payment_details_tab"].collapsed').should('be.visible').and('contain.text', 'Payment Details').click() //Payment Details
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
        cy.get('[id="document_upload_tab"].collapsed').should('contain.text', 'Document Upload').click() //heading
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
    verifyRejectedDoc(docType) {
        cy.get('.alert-danger').should('be.visible').and('contain.text', 'Required documents missing.')
        cy.get('.alert-danger .btn-danger').should('be.visible').and('contain.text', 'Update Now')
        cy.wait(3000)
        cy.get('[id="document_upload_tab"].collapsed').should('be.visible').and('contain.text', 'Document Upload').click() //Document Upload
        cy.get('.guest-portal-doc-upload-status.bg-danger').should('be.visible').and('contain.text', docType + ' Rejected')
        cy.get('[data-target="#upload_documents"]').should('be.visible').and('contain.text', 'Upload again')  //Upload again
    }
    updatePaymentMethod() {
        cy.get('#collapseThree-gp-payment-details .card-section-title').eq(0).should('be.visible').and('contain.text', 'Card Details')
        cy.get('#collapseThree-gp-payment-details .card-section-title').eq(1).should('be.visible').and('contain.text', 'Payment')
        cy.get('#collapseThree-gp-payment-details .table tr').should('contain.text', 'Title').and('contain.text', 'Date')
            .and('contain.text', 'Amount').and('contain.text', 'Status')
        cy.get('[id="update-card-terminal"]').should('be.visible') //card section
        cy.get('[id="update-card-terminal"] [id="btn_edit_payment_detail_card"]').should('contain.text', 'Edit').click() //edit
        cy.get('.card-name-group-label [for="full_name"]').should('be.visible').and('contain.text', 'Name On Card')
        cy.get('[id="full_name"]').should('be.visible').invoke('val').as('guestName')
        cy.get('[for="card-element-payment-details"]').should('be.visible').and('contain.text', 'Credit/Debit Card')
        cy.get('#card-element-payment-details').within(() => {
            cy.fillElementsInput('cardNumber', '5555555555554444')
            cy.fillElementsInput('cardExpiry', '1026') // MMYY
            cy.fillElementsInput('cardCvc', '123')
            cy.fillElementsInput('postalCode', '45000')
        })
        cy.get('#collapseThree-gp-payment-details .btn-secondary').should('be.visible').and('contain.text', 'Cancel') //Cancel
        cy.get('[id="guest-portal-save-card-button"]').should('be.visible').and('contain.text', 'Save').click() // Save
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.verifyToast('Card added successfully')
        cy.get('[id="update-card-terminal"] .align-items-center').should('contain.text', '10/2026').and('contain.text', '**** 4444')
        cy.get('[id="update-card-terminal"] [src="/v2/img/mastercard-icon.svg"]').should('be.visible') //mastercard logo
    }
    //Update Info
    updateBasicInfoOnGuestPortal(newFullName, newPhoneNo, newEmail, newGuestAddress, newZipCode) {
        //cy.get('#BookingInfo_tab').should('be.visible').click() //tab
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.card:nth-child(1)  [class="text-primary link-btn"]').should('be.visible').click() //edit
        cy.get(':nth-child(1) > .gp-dl > dd').should('be.visible').and('contain.text', 'Confirmed') //booking Status
        cy.get('.gp-dl > .notranslate').should('be.visible').invoke('text').as('bookingID')  //alias bookingID
        cy.get('.card:nth-child(1) [placeholder="Date of birth"]').should('be.visible').invoke('val').as('DOB') //alias DOB
        cy.get('select#8 option:selected').invoke('text').as('nationality') //alias nationality
        cy.get('select#9 option:selected').invoke('text').as('gender') //alias Gender

        cy.get('.card:nth-child(1) [placeholder="Full name"]').clear().type(newFullName)
        cy.get('.card:nth-child(1) [placeholder="0301 2345678"]').clear().type(newPhoneNo)
        cy.get('.card:nth-child(1) [placeholder="Email address"]').clear().type(newEmail)
        cy.get('.card:nth-child(1) [placeholder="Please type your address"]').clear().type(newGuestAddress + '{enter}')
        cy.get('.card:nth-child(1) [placeholder="Zip code"]').clear().type(newZipCode)

        cy.get('.card:nth-child(1) .btn-success').should('be.visible').and('contain.text', 'Update').click() //Update
        cy.verifyToast('Basic information updated')
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

    validatePurchasedAddons() {
        cy.get('[id="upsell_purchased_tab"].collapsed').should('be.visible').and('contain.text', 'Add On Service').click() //tab
        cy.get('#collapseSeven-gp-add-on .card-section-title').eq(0).should('contain.text', 'Purchased Add-on Services') //Purchased Add-on Services heading
        cy.get('#collapseSeven-gp-add-on .card-section-title h4 span:nth-child(2)').eq(0).invoke('text').then(text => {
            cy.log('The number of Purchased Add-on Services: ' + text) // log count
        })
    }
    validateAddons() {
        cy.get('[id="upsell_purchased_tab"].collapsed').should('be.visible').and('contain.text', 'Add On Service').click() //tab
        cy.get('#collapseSeven-gp-add-on .card-section-title').eq(0).should('contain.text', 'Purchased Add-on Services') //Purchased Add-on Services heading
        cy.get('.add-service-card-container').eq(0).should('be.visible').and('contain.text', 'Airport Pickup').and('contain.text', 'A safe, reliable  & on-time quality service with luggage assistance.')
            .and('contain.text', '85') //Price
        cy.get('#collapseSeven-gp-add-on .card-section-title').eq(1).should('contain.text', 'Available Add-on Services') //Available Add-on Services heading
        cy.get('.add-service-card-container').eq(1).should('be.visible').and('contain.text', 'E-bike Rental').and('contain.text', 'Take e-bike for the day and explore the city')
            .and('contain.text', '25') //Price
    }
    selectRecommendedAddon() {
        cy.get('.gp-recomended-addd-ons').should('be.visible').and('contain.text', 'Recommended')
        cy.get('.gp-recomended-addd-ons .gp-addon-card').should('be.visible').and('contain.text', 'E-bike Rental')
            .and('contain.text', 'Take e-bike for the day and explore the city').and('contain.text', '$25')
        cy.get('.gp-recomended-addd-ons .gp-addon-card .btn-outline-primary').and('contain.text', 'Add To Cart').should('exist').click() //Add to Cart
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.verifyToast('Cart updated successfully')

        cy.get('.add-on-item').should('be.visible').and('contain.text', '1') //cart tag 
        cy.get('.new-service-cart-wrap').should('be.visible').and('contain.text', 'Bill Summary').and('contain.text', '1 item')
            .and('contain.text', 'E-bike Rental').and('contain.text', '$25.00')
            .and('contain.text', 'Total Payable Amount').and('contain.text', '$200.00')
        cy.get('.new-service-cart-wrap [id="btn_addonCartSummaryModal"]').should('be.visible').and('contain.text', 'Pay Now') //Pay Now
    }
    purchaseAddon() {
        cy.get('.new-service-cart-wrap [id="btn_addonCartSummaryModal"]').should('be.visible').and('contain.text', 'Pay Now').click() //Pay Now
        cy.get('[id="addonCartSummaryModalLabel"]').should('be.visible').and('contain.text', 'Cart')
        cy.get('#addonCartSummaryModal .card-section-title').eq(0).should('contain.text', 'ADD-ON SERVICES') //heading
        cy.get('#addonCartSummaryModal .card-section-title').eq(1).should('contain.text', 'PAYMENT METHOD')  //heading
        cy.get('#addonCartSummaryModal .card-inset-table').should('be.visible').and('contain.text', 'E-bike Rental')
            .and('contain.text', '25.00')
        //add new card
        cy.get('#addonCartSummaryModal [id="bth_add_card_form"]').should('be.visible').and('contain.text', 'Add Card').click() //Add Card
        cy.get('#card-element-2').within(() => {
            cy.fillElementsInput('cardNumber', '5555555555554444')
            cy.fillElementsInput('cardExpiry', '1026') // MMYY
            cy.fillElementsInput('cardCvc', '123')
            cy.fillElementsInput('postalCode', '45000')
        })
        cy.get('[id="addonCartSummaryModal_close"]').should('be.visible').and('contain.text', 'Cancel')
        cy.get('.modal-footer > .btn-primary').should('contain.text', 'Proceed To Pay').click() //Proceed To Pay
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.verifyToast('Card added successfully')
        cy.verifyToast('Payment charged successfully')
        cy.get('.guest-addon-body .badge-info').should('contain.text', '2') //purchased addons tag updated

    }
    validateFooterStatement() {
        cy.get('#footer-statement').should('contain.text', 'Powered by').and('contain.text', 'ChargeAutomation')
    }
    //**Guest portal Print view (Download Page)*/
    goTOPrintView() {
        cy.get('#property_guide_book_tab').should('be.visible')
        cy.get('.gp-property-legend .btn-outline-primary').should('be.visible').and('contain.text', 'Download Page').then(ele => {
            const downloadPageLink = ele.attr('href')
            cy.wrap(downloadPageLink).as('downloadPageLink')
        })
        cy.get('@downloadPageLink').then(downloadPageLink => {
            cy.visit(downloadPageLink, {
                onBeforeLoad(win) {
                    // Stub the window.print function to prevent the print dialog
                    cy.stub(win, 'print').as('print')
                }
            })
        })
    }
    verifyPhoneEmailOnPrintPage(email, phoneNo) {
        cy.get(`[href*="'mailto:'"]`).should('be.visible').and('contain.text', email)
        cy.get(`[href*="'tel:'"]`).should('be.visible').and('contain.text', phoneNo)
    }
    verifyBasicDetailsOnDownloadPage(propName) {
        cy.get('@fullName').then(fullName => { cy.get('.header > h2').should('be.visible').and('contain.text', 'Welcome').and('contain.text', fullName) })
        cy.get('.header > h4').should('contain.text', 'Congratulations! Booking is Confirmed')
        cy.get('@bookingID').then(bookingID => { cy.get('h5').should('contain.text', bookingID) })
        cy.get('tr td div h2').should('be.visible').and('contain.text', propName)
        cy.get('tr td div p:nth-child(2)').should('be.visible').and('contain.text', 'Johar Town Road, Block Q Phase 2 Johar Town, Lahore, Pakistan 45000')
    }
    verifyBookingDetailsOnDownloadPage() {
        cy.get('td h2').contains('Booking Details').should('be.visible') //heading
        cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(2)').should('contain.text', 'Booking Status').and('contain.text', 'Confirmed')
        cy.get('@bookingID').then(bookingID => { cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(2)').should('contain.text', 'Booking No.').and('contain.text', bookingID) })

        cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(3)').should('contain.text', 'Check-In Date')
        cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(3)').should('contain.text', 'Check-Out Date')

        cy.get('@checkInDate').then(checkInDate => {
            const formattedCheckInDate = checkInDate.replace(/\s(\d{4})$/, ', $1')
            cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(3) td:nth-child(1) p:nth-child(2)')
                .invoke('text')
                .then(text => {
                    const formattedText = text.trim().replace(/(\w+ \d{1,2}, \d{4})/, date => {
                        const [month, day, year] = date.split(' ');
                        const dayNumber = parseInt(day);
                        return `${month} ${dayNumber < 10 ? '0' + dayNumber : dayNumber}, ${year}`;
                    });
                    expect(formattedText).to.eq(formattedCheckInDate);
                })
        })

        cy.get('@checkOutDate').then(checkOutDate => {
            const formattedcheckOutDate = checkOutDate.replace(/\s(\d{4})$/, ', $1')
            cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(3) td:nth-child(2) p:nth-child(2)')
                .invoke('text')
                .then(text => {
                    const formattedText = text.trim().replace(/(\w+ \d{1,2}, \d{4})/, date => {
                        const [month, day, year] = date.split(' ');
                        const dayNumber = parseInt(day);
                        return `${month} ${dayNumber < 10 ? '0' + dayNumber : dayNumber}, ${year}`;
                    });
                    expect(formattedText).to.eq(formattedcheckOutDate);
                })
        })
        cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(4)').should('contain.text', 'Arriving By').and('contain.text', 'Car')
        cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(4)').should('contain.text', 'Estimated Arrival Time').and('contain.text', '16:00')
        cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(5)').should('contain.text', 'Address').and('contain.text', 'Johar Town Road, Block Q Phase 2 Johar Town, Lahore, Pakistan 45000')

        cy.get('@fullName').then(fullName => { cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(7)').should('contain.text', 'Full Name').and('contain.text', fullName) })
        cy.get('@guestPhone').then(guestPhone => { cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(7)').should('contain.text', 'Phone Number').and('contain.text', guestPhone) })
        cy.get('@guestDOB').then(guestDOB => { 
            const reformattedDOB = guestDOB.split('-').reverse().join('-')
            cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(8)').should('contain.text', 'Date of Birth').and('contain.text', reformattedDOB) })
        cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(8)').should('contain.text', 'Nationality').and('contain.text', 'Pakistani')
        cy.get('@email').then(email => { cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(9)').should('contain.text', 'Email Address').and('contain.text', email) })
        cy.get('[id="booking_confirmation_detail"] tr:nth-child(4) table tr:nth-child(9)').should('contain.text', 'Gender').and('contain.text', 'Male')
    }

    verifyAddOnServicesOnDownloadPage() {
        cy.get('tr td table h2').contains('Add On Services').should('be.visible') //Heading
        cy.get('td > .border-bottom').should('contain.text', 'Purchased Add-on Service')
        cy.get(':nth-child(2) > [style="width: 55%; vertical-align: top; padding-bottom: 10px;"] > table > tbody > tr > td > h3')
            .should('contain.text', 'E-bike Rental')
        cy.get(':nth-child(3) > [style="width: 55%; vertical-align: top; padding-bottom: 10px;"] > table > tbody > tr > td > h3')
            .should('contain.text', 'Airport Pickup')
        cy.get(':nth-child(2) > [style="width: 15%; text-align: right;"] > p').should('contain.text', '$200')
        cy.get(':nth-child(3) > [style="width: 15%; text-align: right;"] > p').should('contain.text', '$85')
        cy.get('.border-bottom > :nth-child(1) > p').should('contain.text', 'Total Amount')
        cy.get('[style="text-align: right;"] > p').should('contain.text', '$285')
    }
    verifyInstructionsOnDownloadPage() {
        cy.get('tr td table h2').contains('Instructions').should('be.visible') //heading
        cy.get('[style="vertical-align: top; padding-bottom: 20px;"] > h4').should('contain.text', 'Guidebook 1')
        cy.get(':nth-child(2) > [style="vertical-align: top; padding-bottom: 20px;"] > div > p').should('contain.text', 'Guidebook 1 Description')
    }
    verifyIDProofOnDownloadPage() {
        cy.get('.mt-3 > tbody > :nth-child(1) > td > h2').should('contain.text', 'ID Proof Related')
        cy.get(':nth-child(2) > .pl-2 > ul > li > h4').should('contain.text', 'Signature') //label
        cy.get(':nth-child(2) > .pl-2 > ul > li > p > img').should('exist') //signature
        cy.get(':nth-child(3) > .pl-2 > ul > li > h4').should('contain.text', 'Selfie') //Selfie label
        cy.get(':nth-child(3) > .pl-2 > ul > li > p > img').should('exist') //Selfie

        cy.get('.footer > :nth-child(1) > table > tbody > tr > td > h2').should('contain.text', 'Thank you for booking with us')
        cy.get('.footer > :nth-child(1) > table > tbody > tr > td > p').should('contain.text', "We're dedicated to giving you the best experience possible")

    }
}   