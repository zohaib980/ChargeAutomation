
export class BookingDetailPage {

  getPrecheckinLinkOnFirstBooking() {
    cy.get('.page-title.translate').should('contain', 'Bookings').wait(2000)
    cy.xpath("(//i[@class='fas fa-ellipsis-h'])[2]").click({ force: true }) //3dot on first booking
    cy.get('.show[aria-labelledby="moreMenu"] ul li [data-label="Share"]').click({ force: true })
    cy.get('.loading-label').should('not.exist') //loader should be disappear 
    return cy.get('[id="shareBookingModal_linkCopyInput"]').invoke('val').then((link) => { //precheckin link
      cy.get('[id*="shareBookingModal"] .modal-footer [data-dismiss="modal"]').click() // close the modal
      return cy.wrap(link)
    })
  }
  goToBookingDetailPage(propName) {
    cy.get('.page-title').should('contain.text', 'Bookings').wait(2000)
    cy.get('[class*="show"] [href*="/client/v2/booking-detail"]')
      .if()                     //if menu already open
      .else().then(() => {        //else open it
        cy.xpath("(//i[@class='fas fa-ellipsis-h'])[2]").click({ force: true }) //3dot on first booking
      })
    cy.get('[class*="show"] [href*="/client/v2/booking-detail"]').invoke("removeAttr", "target", { force: true }).click({ force: true }) //Booking Detail link
    cy.url().should('include', '/booking-detail') //Validate URL
    cy.get('.loading-label').should('not.exist') //loader should be disappear 
    cy.get('.booking-property-heading').should('have.text', propName)
    cy.get('.booking-details-infos > .card-section-title > h4').should('exist') //booking heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  getBookingID() {
    return cy.get('#bookingID').invoke('val')
  }
  getBookingSource() {
    return cy.get('#source').invoke('val')
  }
  getCheckinDate() {
    return cy.get('#checkinDate').invoke('val')
  }
  getCheckOutDate() {
    return cy.get('#checkoutDate').invoke('val')
  }
  getAdultCount() {
    return cy.get('[id="guestsAdults"]').invoke('val')
  }
  getChildCount() {
    return cy.get('[id="guestsChildren"]').invoke('val')
  }
  getFullName() {
    return cy.xpath('(//input[@id="6"])[1]').invoke('val')
  }
  getGuestEmail() {
    return cy.xpath('(//input[@id="1"])[1]').invoke('val')
  }
  getTrxAmount() {
    const checkAmount = (retryCount = 0) => {
      if (retryCount >= 5) {
        throw new Error('Max retries reached, amount is still $0.00')
      }
      cy.get('.loading-label').should('not.exist') // Wait for loader to disappear
      cy.get('#tab_general-payment-detail > .mt-sm-15').click({ force: true }) // Click payment details tab
      cy.scrollTo('bottom');
      cy.get('.loading-label').should('not.exist') // Ensure loader disappears again

      return cy.get('.table-borderless.table-sm tr:nth-child(1) .text-right')
        .should('be.visible')
        .invoke('text')
        .then(amount => {
          if (amount.includes('$0.00')) {
            // If the amount is $0.00, wait and retry
            cy.wait(5000)
            cy.reload()
            cy.get('[id="tab_general-payment-detail"]').should('be.visible').click() // Reload and click payment tab again
            return checkAmount(retryCount + 1) // Retry
          } else {
            expect(amount).not.to.include('$0.00')
            return cy.wrap(amount)
          }
        })
    }
    // Initial call
    return checkAmount()
  }
  validateMainGuest(mainGuest) {
    cy.get('[id="tab_general-guest-experience"]').should('be.visible').and('contain.text', 'Online Check-in').click() //Online Check-in tab
    cy.get('.form-row .pre-checkin-status-alert .font-weight-bold').eq(0).should('contain.text', mainGuest + ' (Main Guest)')
  }
  validateTriggeredMessages(templateName, userType, attemptCount = 0) {
    cy.get("a[id='tab_general-sent-email-detail'] span[class='mt-sm-15']").should('contain.text', 'Messages').click({ force: true }) //Messages tab
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#tab_general-sent-email-detail').should('be.visible').and('contain.text', 'Messages')
    cy.get('.card-inset-table table thead').should('be.visible').should('contain.text', 'Subject/Title').and('contain.text', 'Sent To')
      .and('contain.text', 'Sent Date & Time').and('contain.text', 'View Message')

    cy.get('.card-inset-table tbody tr').invoke('text').then((text) => {
      cy.log(text)
      if (text.includes(templateName) && text.includes(userType)) {
        cy.get('.card-inset-table tbody tr').filter(`:contains(${templateName}):contains(${userType})`)
          .find('td[class="py-2"]:nth-child(2)').should('contain.text', userType)
      } else {
        if (attemptCount < 15) {
          attemptCount++; // Increment the attempt counter
          cy.get('[id="tab_general-payment-attempts-activity-log"]').should('contain.text', 'Activity Log').click()
          cy.get('.loading-label').should('not.exist') // Wait for loader to disappear
          cy.get('.booking-activity-log .card-section-title').should('contain.text', 'Activity Log').should('be.visible')
          cy.wait(30000)
          this.validateTriggeredMessages(templateName, userType, attemptCount + 1)
        } else {
          cy.log('Max attempts reached! ' + templateName + ' email is not triggered within 5 min')
          throw new Error('Max attempts reached! email is not triggered within 5 min')
        }
      }
    })
  }
  validateUntriggeredMessages(templateName) {
    cy.get("a[id='tab_general-sent-email-detail'] span[class='mt-sm-15']").should('contain.text', 'Messages').click({ force: true }) //Messages tab
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#tab_general-sent-email-detail').should('be.visible').and('contain.text', 'Messages')
    cy.get('.card-inset-table table thead').should('be.visible').should('contain.text', 'Subject/Title').and('contain.text', 'Sent To')
      .and('contain.text', 'Sent Date & Time').and('contain.text', 'View Message')
    cy.get('.card-inset-table tbody tr').should('not.contain.text', templateName)
  }
  getBookingIDfromURL() {
    return cy.url().then((url) => {
      const regex = /\/booking-detail\/(\d+)/;
      const match = url.match(regex);
      if (match) {
        const bookingID = match[1];
        cy.log('Booking ID: ', bookingID)
        expect(bookingID).to.match(/^\d+$/)
        return cy.wrap(bookingID)
      } else {
        throw new Error('Booking ID is not found in URL');
      }
    })
  }

  //Verify booking info
  verifyBookingID(bookingID) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear 
    cy.get('h1.page-title').should('be.visible').and('contain.text', bookingID)
  }
  verifyBookingSource(bSource) {
    cy.get('[id="source"]').should('be.visible').and('contain.value', bSource)
  }
  verifyFullName(fullName) {
    cy.get('[placeholder="Full name"]').should('be.visible').and('contain.value', fullName)
  }
  verifyGuestPhoneNo(phoneNo) {
    cy.get('[class="booking-guestinfos"] [class="custom-phone-input"] [id*="phone-"]').invoke('val')
      .then((actualPhoneNo) => {
        const normalizedActual = `+92${actualPhoneNo.replace(/\s+/g, '').slice(1)}` // Remove spaces and replace leading '0' with '+92'
        const normalizedExpected = phoneNo.replace(/\s+/g, '') // Normalize the expected phone number: remove any spaces
        expect(normalizedActual).to.eq(normalizedExpected)
      })
  }
  verifyGuestDOB(DOB) {
    cy.get('[placeholder="Date of birth"]').should('be.visible').and('contain.value', DOB)
  }
  verifyNationality(nationality) {
    cy.get('select[id="8"] option:selected').should('contain.text', nationality)
  }
  verifyGuestEmail(email) {
    cy.get('[placeholder="Email address"]').should('contain.value', email)
  }
  verifyGuestGender(gender) {
    cy.get('select[id="9"] option:selected').should('contain.text', gender)
  }
  verifyGuestAddress(guestAddress) {
    cy.get('[id="update-property-address"]').should('contain.value', guestAddress)
  }
  verifyZipCode(zipCode) {
    cy.get('[placeholder="Zip code"]').should('contain.value', zipCode)
  }
  goToOnlineCheckinTab() {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.nav-item [id="tab_general-guest-experience"]').should('be.visible').and('contain.text', 'Online Check-in').click()
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  verifyPrecheckinStatus(count) {
    cy.get('.card-section-title .badge').should('be.visible').and('contain.text', count).invoke('text').then((text) => { //validate the tag
      const completedCount = text.split('/')[0].trim(); // Extract the numerator
      cy.get('.alert-success').should('have.length', completedCount) //Completed precheckins count will be verified with numerator value
        .each((element) => {
          cy.wrap(element).should('contain.text', 'Pre-Check-In Wizard Successfully Completed!')
        })
    })
  }
  verifyAccessCode(accessCode) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[for="booking_access_code"]').should('be.visible').and('contain.text', 'Access Code') //Label
    cy.get('[id="booking_access_code"]').should('contain.value', accessCode).and('be.visible') //input
  }

  //Update booking details
  addAccessCode(accessCode) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id="booking_access_code"]').should('be.visible').clear().type(accessCode).should('contain.value', accessCode)
  }
  clickSaveChanges(){
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.booking-pane-footer .btn-success').should('be.visible').and('contain.text','Save').click()
  }
}