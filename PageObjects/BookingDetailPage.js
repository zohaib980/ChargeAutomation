
export class BookingDetailPage {

  getPrecheckinLinkOnFirstBooking() {
    cy.get('.page-title.translate').should('contain', 'Bookings').wait(2000)
    cy.xpath("(//i[@class='fas fa-ellipsis-h'])[2]").click({ force: true }) //3dot on first booking
    return cy.get('.show [href*="chargeautomation.com/pre-checkin"]').invoke('attr', 'href')
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
    cy.get('.booking-property-heading').should('have.text', propName)
    cy.wait(4000)
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


}