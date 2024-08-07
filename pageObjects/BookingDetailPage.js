
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
    cy.get('.page-title.translate').should('contain', 'Bookings').wait(2000)
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
    cy.get('#tab_general-payment-detail > .mt-sm-15').click({ force: true }) //Payment detail tab
    cy.scrollTo('bottom')
    cy.wait(4000)
    return cy.get('.col-md-4 > .table-responsive > .table > :nth-child(1) > .text-right').invoke('text')
  }

  validateTriggeredMessages(templateName, userType, attemptCount = 0) {
    cy.get("a[id='tab_general-sent-email-detail'] span[class='mt-sm-15']").should('contain.text', 'Messages').click({ force: true }) //Messages tab
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.booking-sent-emails .card-section-title').should('be.visible').and('contain.text', 'Messages')
    cy.get('.card-inset-table table thead').should('be.visible').should('contain.text', 'Subject/Title').and('contain.text', 'Sent To')
      .and('contain.text', 'Sent Date & Time').and('contain.text', 'View Message')

    cy.get('.card-inset-table tbody tr').invoke('text').then((text) => {
      cy.log(text)
      if (text.includes(templateName)) {
        cy.get('.card-inset-table tbody tr').contains(templateName)
          .parents('tr').find('td[class="py-2"]:nth-child(2)').should('contain.text', userType)
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
    cy.get('.booking-sent-emails .card-section-title').should('be.visible').and('contain.text', 'Messages')
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

}