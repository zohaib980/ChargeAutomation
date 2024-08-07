
import { ReuseableCode } from "../cypress/support/ReuseableCode";
import { LoginPage } from "../pageObjects/LoginPage"

const reuseableCode = new ReuseableCode
const loginPage = new LoginPage

export class BookingPage {

  addNewBookingAndValidate(propertyName, sourceName, adults, child) {
    let oldBookingId
    // A recursive Funtion will wait until the new booking displayed on the booking listing page
    const waitForBookingIdChange = () => {
      return cy.get('[class="inline"]').eq(0)
        .then(($newId) => {
          const newBookingId = $newId.text().trim()
          cy.log(newBookingId)
          if (newBookingId !== oldBookingId) {
            // Old booking ID has changed to a new booking ID
            cy.log(`Old Booking ID ${oldBookingId} changed to New Booking ID ${newBookingId}.`)
          }
          else {
            // Old booking ID remains the same, retry the check
            cy.wait(4000);
            waitForBookingIdChange(); // Recursive-like call to check again
          }
        })
    };
    cy.get('.navbar-nav [href*="chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.url().should('include', '/bookings') //Validate URL
    cy.get('.page-title.translate').should('contain', 'Bookings').wait(4000) //Validate Page Title
    cy.get('.text-small.translate').should('contain', 'View all your bookings') //Validate Page Subtitle
    cy.get('[class="inline"]').eq(0)
      .then(($oldId) => {
        oldBookingId = $oldId.text().trim()
        cy.log(oldBookingId)
        this.happyAddBooking(propertyName, sourceName, adults, child)
        // A recursive Funtion will wait until the new booking displayed on the booking listing page
        waitForBookingIdChange();
      });
  }
  happyAddBooking(propertyName, sourceName, adults, child) {
    cy.get('#add_booking_button').click()
    cy.get('[id="add_edit_booking_modal"] .modal-title').should('be.visible').and('contain.text', 'Booking Details') //modal heading
    //Select Property
    cy.get('#bookings-tabContent [for="assigned_property"]').should('contain.text', 'Property')
    cy.get('select[id="assigned_property"]').should('be.visible').select(propertyName)
    //Select Date
    cy.get('.custom-date-box').eq(0).click()
    cy.wait(1000)
    cy.get('[aria-label*="your start date."].asd__day--today button').eq(0).invoke('text').then((fromDate) => {
      cy.log(fromDate)
      cy.get('[role="presentation"] [aria-label*="your start date."] button').then((todate) => {
        cy.log(todate)
        cy.get('[aria-label*="your start date."].asd__day--today button').eq(0).click() //from date
        cy.get('.custom-date-box').eq(0).click()
        cy.wait(1000)
        cy.get(todate).eq(8).click({ force: true }) //Click todate
      })
    })
    // Select Source
    cy.get('#bookings-tabContent [for="booking_source"]').should('contain.text', 'Booking Source')
    cy.get('select[id="booking_source"]').eq(0)
      .select(sourceName)
    // Reservation Status
    cy.get('#bookings-tabContent [for="reservation_status"]').should('contain.text', 'Reservation Status')
    cy.get('select[id="reservation_status"]').eq(0).select("Confirmed")
    // Booking Amount
    cy.get('#bookings-tabContent [for="total_booking_amount"]').should('contain.text', 'Total Booking Amount')
    cy.get('input[id="total_booking_amount"]').eq(0).type('100')
    // Enter Internal Note
    cy.get('#bookings-tabContent [for="bookingNotes"]').should('contain.text', 'Internal Notes')
    cy.get('textarea[id="bookingNotes"]').eq(0).type('Testing Automation')
    //Guest Information
    cy.get('#accordion-booking-booker-heading b').should('contain.text', 'Guest Information')
    // First Name and Last Name
    cy.get('#bookings-tabContent [for="first_name"]').should('contain.text', 'First Name')
    const firstName = reuseableCode.getRandomFirstName()
    cy.get('input[id="first_name"]').eq(0).type(firstName)
    cy.get('#bookings-tabContent [for="last_name"]').should('contain.text', 'Last Name')
    const lastName = reuseableCode.getRandomLastName()
    cy.get('input[id="last_name"]').eq(0).type(lastName)
    // Enter email
    function generateUserName() {
      let text = "";
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

      for (let i = 0; i < 10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
      return text;
    }
    const generatedUserName = generateUserName()
    cy.get('#bookings-tabContent [for="email"]').should('contain.text', 'Email')
    cy.get('input[id="email"]').should('have.attr', 'placeholder', 'Email').eq(0)
      .type(generatedUserName + '@mailinator.com') //Add a random email
    //Add Adult, child and nationality
    cy.get('#bookings-tabContent [for="num_adults"]').should('contain.text', 'Adults')
    cy.get('input[id="num_adults"]').eq(0).type('{selectall}').type(adults)
    cy.get('input[id="num_child"]').eq(0).type('{selectall}').type(child)
    cy.get('#bookings-tabContent [for="nationality"]').should('contain.text', 'Nationality')
    cy.get('select[id="nationality"]').eq(0).select("Pakistani").wait(2000)
    cy.get('[class="modal-footer mt-3"] [name="Save Changes"]').eq(0).should('be.visible').click()
    cy.get('[class="toast toast-success"]').should('contain.text', 'Booking added successfully')
    cy.get('.loading-label').should('not.exist') //loader should be disappear     
  }
  validatePrecheckInStatusAsCompleted() {
    cy.get('.navbar-nav [href*="chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.url().should('include', '/bookings') //validate URL
    cy.get('.booking-card .guest-name span[class="translate"]').eq(0)
      .should('contain.text', 'Pre check-in completed') //Validate first booking Precheckin status
  }
  validatePrecheckinStatusAsIncomplete() {
    cy.get('.navbar-nav [href*="chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.url().should('include', '/bookings') //validate URL
    cy.get('.page-title.translate').should('contain', 'Bookings')
    cy.get('.booking-card .guest-name span[class="translate"]').eq(0)
      .should('contain.text', 'Pre check-in incomplete') //validate first booking incomplete status
  }

  mailValidation() {
    cy.get('.navbar-nav [href*="chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.xpath("(//i[@class='fas fa-ellipsis-h'])[2]") //3dot icon on first booking
      .click({ force: true })
    cy.get('[class*="show"] [href*="/client/v2/booking-detail"]')//Go to Booking detail
      .invoke("removeAttr", "target", { force: true })
      .click({ force: true })
    cy.wait(3000)
    cy.get("a[id='tab_general-sent-email-detail'] span[class='mt-sm-15']").should('contain.text', 'Messages').click({ force: true }) //Messages tab
    cy.get('[class="subject"]:contains("✅ Pre Check-in Completed")').eq(0)
      .then($text => {
        const guestTitle = $text.text();
        cy.log(guestTitle)
        cy.wrap(guestTitle).should('contain', 'Pre Check-in Completed')
        cy.xpath("(//td[contains(text(), 'Guest')])[1]").should('contain', 'Guest')
        cy.get('[class="subject"]:contains("✅ Pre Check-in Completed")').eq(1)
          .then($text => {
            const hostTitle = $text.text();
            cy.log(hostTitle)
            cy.wrap(hostTitle).should('contain', 'Pre Check-in Completed')
            cy.xpath("(//td[contains(text(), 'Host')])[1]").should('contain', 'Host')
          })
      })
  }
  goToBookingPage() {
    cy.get('[href*="chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click({ force: true })
    cy.get('.page-title').should('be.visible').and('contain.text', 'Bookings') //heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  addBookingInFutureDate(propertyName, sourceName, adults, child, afterCurrentDate) {
    cy.get('#add_booking_button').click()
    //Select Property
    cy.get('select[id="assigned_property"]:visible').select(propertyName)  //.should('have.value', '2500' )
    //Select Date
    cy.get('.custom-date-box').eq(0).click()
    cy.wait(1000)
    cy.get('[aria-label*="your start date."].asd__day--today button').eq(0).invoke('text').then((fromDate) => {
      cy.log(fromDate)
      cy.get('[role="presentation"] [aria-label*="your start date."] button').then((todate) => {
        cy.log(todate)
        //cy.get('[aria-label*="your start date."].asd__day--today button').eq(0).click() //from date
        cy.get(todate).eq(parseInt(afterCurrentDate)).click({ force: true }) //Select from date - 3 days after from current date
        cy.get('.custom-date-box').eq(0).click()
        cy.wait(1000)
        cy.get(todate).eq(parseInt(afterCurrentDate) + 5).click({ force: true }) //Click todate - 7 days after from date
      })
    })
    // Select Source
    cy.get('select[id="booking_source"]').eq(0)
      .select(sourceName)
    // Reservation Status
    cy.get('select[id="reservation_status"]').eq(0)
      .select("Confirmed")
    // Booking Amount
    cy.get('input[id="total_booking_amount"]').eq(0)
      .type('100')
    // Enter Note
    cy.get('textarea[id="bookingNotes"]').eq(0)
      .type('Testing Automation')
    // First Name and Last Name
    let firstName = reuseableCode.getRandomFirstName()
    let lastName = reuseableCode.getRandomLastName()
    cy.get('input[id="first_name"]').eq(0)
      .type(firstName)
    cy.get('input[id="last_name"]').eq(0)
      .type(lastName)
    // Enter email
    function generateUserName() {
      let text = "";
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

      for (let i = 0; i < 10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
      return text;
    }
    const generatedUserName = generateUserName()
    cy.get('input[id="email"]').eq(0)
      .should('have.attr', 'placeholder', 'Email')
      .type(generatedUserName + '@mailinator.com') //Add a random email
    //Add Adult, child and nationality
    cy.get('input[id="num_adults"]').eq(0).clear().type(adults)
    cy.get('input[id="num_child"]').eq(0).clear().type(child)
    cy.get('select[id="nationality"]').eq(0).select("Pakistani").wait(2000)
    cy.get('[class="modal-footer mt-3"] [name="Save Changes"]').eq(0).should('be.visible').click()
    cy.get('[class="toast toast-success"]').should('contain.text', 'Booking added successfully')
    cy.wait(5000)
  }
  validateCCCountOnBooking(index) {
    cy.get('[id*="add_credit_card_button"]').eq(index).click() //index is booking count from top
    cy.get('#guest_credit_card_modal .modal-title').should('contain.text', 'Guest Credit Card') //Validate popup heading
    cy.wait(3000)

    cy.get('#card-element') //this will shown on popup if no card is added yet
      .if().then(() => {
        const numberOfStoreCards = 0 //Number of added cards are 0
        cy.log("Number of cards on popup: " + numberOfStoreCards)
        cy.get('[id="guest_credit_card_modal_close"]').click() //Cancel button
        cy.get('[id*="add_credit_card_button"]').eq(index).invoke('text').then((text) => {
          cy.log(text)
          // Use JavaScript string manipulation to extract the number from the text
          const ccCount = parseInt(text.replace(/\D/g, ''), 10);
          cy.log("The CC Count on the booking: " + ccCount)
          expect(numberOfStoreCards).to.equal(ccCount)
        })
      })
      .else()
      .get('[class="guest-card-wrap"]').its('length').then((count) => { //Count of added CC 
        const numberOfStoreCards = count;
        cy.log("Number of cards on popup: " + numberOfStoreCards)
        cy.get('[id="guest_credit_card_modal_close"]').click() //Close button
        cy.get('[id*="add_credit_card_button"]').eq(index).invoke('text').then((text) => {
          cy.log(text)
          // Use JavaScript string manipulation to extract the number from the text
          const ccCount = parseInt(text.replace(/\D/g, ''), 10);
          cy.log("The CC Count on the booking: " + ccCount)
          expect(numberOfStoreCards).to.equal(ccCount)
        })
      })
  }
  validateDocCountOnBooking(index) {
    cy.get('.booking-card-info [class="btn btn-xs translate"]:nth-child(2)').eq(index).click() //index is booking count from top
    cy.wait(6000)
    var numberOfUploadedDoc = 0
    cy.get('[class="badge badge-success"]')
      .if().should('exist').its('length').then((count1) => { //Count of uploaded verified documents
        numberOfUploadedDoc = count1;
      })
    cy.get('[class="badge badge-warning"]')
      .if().should('exist').its('length').then((count2) => { //Count of uploaded Pending documents
        numberOfUploadedDoc = numberOfUploadedDoc + count2
        cy.log("Number of Uploaded Documents: " + numberOfUploadedDoc)
      })
    cy.get('[id="closeGuestPopup"]').click().wait(1000) //Close button
    cy.get('.booking-card-info [class="btn btn-xs translate"]:nth-child(2)').eq(index).invoke('text').then((text) => {
      cy.log(text)
      // Use JavaScript string manipulation to extract the number from the text
      const docCount = parseInt(text.replace(/\D/g, ''), 10);
      cy.log("The Document Count on the booking: " + docCount).wait(1000)
      expect(numberOfUploadedDoc).to.equal(docCount)
    })

  }
  validateDeactivateProperty(propName) {
    cy.get('[id="add_booking_button"]').should('contain.text', 'Add New Booking').click().wait(1000) //Add new booking
    cy.get('select[id="assigned_property"]').should('not.contain.text', propName)
    cy.get('[id="add_booking_close_modal"]').should('contain.text', 'Cancel').click() //Close the popup
  }
  validateActiveProperty(propName) {
    cy.get('[id="add_booking_button"]').should('contain.text', 'Add New Booking').click().wait(1000) //Add new booking
    cy.get('select[id="assigned_property"]').should('contain.text', propName)

  }
  //Pre-checkins and Guest Portal Links Validations
  clientCompletedPrecheckinGuestPortal() {
    cy.log('A client accessing the “Pre Checkin” IF Pre checkin Completed: Direct to Guest Portal!')
    cy.get('[class="small text-success"]').eq(0) //First Complete precheckin booking
      .parents('.booking-card')
      .find('[class="fas fa-ellipsis-h"]').eq(1).click() //3dot icon
    cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text', 'Booking Details') //Booking Detail
      .invoke('attr', 'href').then((bookingdetailLink) => {
        cy.visit(bookingdetailLink) //Visit the booking detail
      })
    cy.get('[id="tab_general-guest-experience"]').should('contain.text', 'Online Check-in').click().wait(2000) //Online Check-in tab
    cy.get('[href*="chargeautomation.com/pre-checkin/"]').should('contain.text', 'Visit Pre-Check-In Wizard') //Visit Pre-Check-In Wizard link
      .invoke('attr', 'href').then((precheckinlink) => {
        cy.visit(precheckinlink) //Visit the precheckin link will redirects to Guest portal as precheckin is completed
      })
    cy.url().should('include', 'chargeautomation.com/guest-portal/') //Validate the Url
    cy.get('[id="additional_guest_details_tab"]').should('contain.text', 'Guest Details')
  }
  clientIncompletePrecheckinToLastStep() {
    cy.log('A client accessing the “Pre Checkin” IF Pre checkin InComplete: Direct to Pre checkin page to last incomplete step in Pre checkin also The client should have “Admin View Mode” and “Live Mode”')
    cy.visit('/client/v2/bookings')
    cy.get('[class="small text-danger"]').eq(0) //First InComplete Precheckin Booking
      .parents('.booking-card')
      .find('[class="fas fa-ellipsis-h"]').eq(1).click() //3dot icon
    cy.get('.show[aria-labelledby="moreMenu"] ul li [data-label="Share"]').click({ force: true })
    cy.get('.loading-label').should('not.exist') //loader should be disappear 
    cy.get('[id="shareBookingModal_linkCopyInput"]').invoke('val').then((link) => { //precheckin link
      cy.get('[id*="shareBookingModal"] .modal-footer [data-dismiss="modal"]').click() // close the modal
      cy.visit(link) //Visit the precheckin page
      cy.url().should('include', '/pre-checkin') //Validate URL
    })

    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(4000) //Save button should exists
    cy.contains('Get Started').if().click() //Get started button on precheckin Welcome screen
    cy.get('[class="popup-modal-heading"]').should('be.visible').should('contain.text', 'You are in View Only Mode').wait(2000) //Heading on popup
    cy.get('[class="btn btn-sm btn-secondary px-3 got-it-btn"]').should('contain.text', 'Got it').click().wait(1000) //Got it button
    cy.get('[class="button-cover"]').should('contain.text', 'Admin View-Only Mode').should('contain.text', 'Live Mode') //Validate Admin & Live Mode option
  }
  clientGuestPortalCompletePrecheckin() {
    cy.log('A client accessing the “Guest Portal” link while in session, IF Pre checkin Completed: Direct to Guest Portal')
    cy.visit('/client/v2/bookings')
    cy.get('[class="small text-success"]').eq(0) //First Complete precheckin booking
      .parents('.booking-card')
      .find('[class="fas fa-ellipsis-h"]').eq(1).click() //3dot icon
    cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text', 'Booking Details') //Booking Detail
      .invoke('attr', 'href').then((bookingdetailLink) => {
        cy.visit(bookingdetailLink) //Visit the booking detail
      })
    cy.get('[id="tab_general-guest-experience"]').should('contain.text', 'Online Check-in').click().wait(2000) //Online Check-in tab
    cy.get('[href*="chargeautomation.com/guest-portal/"]').should('contain.text', 'Visit Guest Portal') //Visit Guest Portal link
      .invoke('attr', 'href').then((guestportallink) => {
        cy.visit(guestportallink) //Visit the guestportal link will redirects to Guest portal as precheckin is completed
      })
    cy.url().should('include', 'chargeautomation.com/guest-portal/') //Validate the Url
    cy.get('[id="additional_guest_details_tab"]').should('contain.text', 'Guest Details')
  }
  clientGuestPortalIncompletePrecheckin() {
    cy.log('A client accessing the “Guest Portal” link while in session, IF Pre checkin Incomplete: Direct to Guest Portal (Modal alert to inform client) (You are only able to access this page because you are an admin. Your guests will not be able to access this page until they complete Pre check-in)')
    cy.visit('/client/v2/bookings')
    cy.get('[class="small text-danger"]').eq(0) //First InComplete Precheckin Booking
      .parents('.booking-card')
      .find('[class="fas fa-ellipsis-h"]').eq(1).click() //3dot icon
    cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text', 'Booking Details') //Booking Detail
      .invoke('attr', 'href').then((bookingdetailLink) => {
        cy.visit(bookingdetailLink) //Visit the booking detail
      })
    cy.get('[id="tab_general-guest-experience"]').should('contain.text', 'Online Check-in').click().wait(2000) //Online Check-in tab
    cy.get('[href*="chargeautomation.com/guest-portal/"]').should('contain.text', 'Visit Guest Portal') //Visit Guest Portal link
      .invoke('attr', 'href').then((guestportallink) => {
        cy.visit(guestportallink) //Visit the guestportal link will redirects to Guest portal as precheckin is incomplete
      })
    cy.url().should('include', 'chargeautomation.com/guest-portal/') //Validate the Url
    //Validate the popup and info
    cy.get('[class="view-edit-desc"]').should('contain.text', 'You are only able to access this page because you are an admin. Your guests will not be able to access this page until they complete Pre check-in.')
    cy.get('[class="swal2-confirm swal2-styled"]').should('be.visible').should('contain.text', 'OK').click() //OK to close the popup
    cy.get('[id="additional_guest_details_tab"]').should('contain.text', 'Guest Details')
  }
  guestCompletePrecheckinToGuestPortal() {
    cy.log('Guest accessing the “Pre Checkin” link IF Pre checkin Completed: Direct to Guest Portal')
    this.goToBookingPage()
    cy.get('[class="small text-success"]').eq(0) //First Complete precheckin booking
      .parents('.booking-card')
      .find('[class="fas fa-ellipsis-h"]').eq(1).click() //3dot icon
    cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text', 'Booking Details') //Booking Detail
      .invoke('attr', 'href').then((bookingdetailLink) => {
        cy.visit(bookingdetailLink) //Visit the booking detail
      })
    cy.get('[id="tab_general-guest-experience"]').should('contain.text', 'Online Check-in').click().wait(2000) //Online Check-in tab
    cy.get('[href*="chargeautomation.com/pre-checkin/"]').should('contain.text', 'Visit Pre-Check-In Wizard') //Visit Pre-Check-In Wizard link
      .invoke('attr', 'href').then((precheckinlink) => {
        cy.get('[id="dropdownMenuButton"]').should('exist').click() //Click Profile menu
        cy.get('[class="dropdown-item text-danger"]').should('contain.text', 'Logout').click().wait(3000)//Logout
        cy.clearCookies()
        cy.visit(precheckinlink) //Visit the precheckin link will redirects to Guest portal as precheckin is completed
      })
    cy.url().should('include', 'chargeautomation.com/guest-portal/') //Validate the Url
    cy.get('[id="additional_guest_details_tab"]').should('contain.text', 'Guest Details')

  }
  guestIncompletePrecheckinToLastStep() {
    cy.get('[class="small text-danger"]').eq(0) //First InComplete Precheckin Booking 
      .parents('.booking-card')
      .find('[class="fas fa-ellipsis-h"]').eq(1).click() //3dot icon
    
      cy.get('.show[aria-labelledby="moreMenu"] ul li [data-label="Share"]').click({ force: true })
      cy.get('.loading-label').should('not.exist') //loader should be disappear 
      cy.get('[id="shareBookingModal_linkCopyInput"]').invoke('val').then((precheckinlink) => { //precheckin link
        cy.get('[id*="shareBookingModal"] .modal-footer [data-dismiss="modal"]').click() // close the modal
        cy.get('[id="dropdownMenuButton"]').should('exist').click() //Click Profile menu
        cy.get('[class="dropdown-item text-danger"]').should('contain.text', 'Logout').click().wait(3000) //Logout
        cy.clearCookies()
        cy.visit(precheckinlink) //Visit the precheckin page
      })
    cy.url().should('include', '/pre-checkin') //Validate URL
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(4000) //Save button should exists
  }
  guestToGuestPortalPrecheckinCompleted() {
    cy.get('[class="small text-success"]').eq(0) //First Complete precheckin booking
      .parents('.booking-card')
      .find('[class="fas fa-ellipsis-h"]').eq(1).click() //3dot icon
    cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text', 'Booking Details') //Booking Detail
      .invoke('attr', 'href').then((bookingdetailLink) => {
        cy.visit(bookingdetailLink) //Visit the booking detail
      })
    cy.get('[id="tab_general-guest-experience"]').should('contain.text', 'Online Check-in').click().wait(2000) //Online Check-in tab
    cy.get('[href*="chargeautomation.com/guest-portal/"]').should('contain.text', 'Visit Guest Portal') //Visit Guest Portal link
      .invoke('attr', 'href').then((guestportallink) => {
        cy.get('[id="dropdownMenuButton"]').should('exist').click() //Click Profile menu
        cy.get('[class="dropdown-item text-danger"]').should('contain.text', 'Logout').click().wait(3000) //Logout
        cy.clearCookies()
        cy.visit(guestportallink) //Visit the guestportal link will redirects to Guest portal as precheckin is completed
      })
    cy.url().should('include', 'chargeautomation.com/guest-portal/') //Validate the Url
    cy.get('[id="additional_guest_details_tab"]').should('contain.text', 'Guest Details')
  }
  guestToGuestPortalPrecheckinIncomplete() {
    cy.get('[class="small text-danger"]').eq(0) //First InComplete Precheckin Booking
      .parents('.booking-card')
      .find('[class="fas fa-ellipsis-h"]').eq(1).click() //3dot icon
    cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text', 'Booking Details') //Booking Detail
      .invoke('attr', 'href').then((bookingdetailLink) => {
        cy.visit(bookingdetailLink) //Visit the booking detail
      })
    cy.get('[id="tab_general-guest-experience"]').should('contain.text', 'Online Check-in').click().wait(2000) //Online Check-in tab
    cy.get('[href*="chargeautomation.com/guest-portal/"]').should('contain.text', 'Visit Guest Portal') //Visit Guest Portal link
      .invoke('attr', 'href').then((guestportallink) => {
        cy.get('[id="dropdownMenuButton"]').should('exist').click() //Click Profile menu
        cy.get('[class="dropdown-item text-danger"]').should('contain.text', 'Logout').click().wait(3000) //Logout
        cy.clearCookies()
        cy.visit(guestportallink) //Visit the guestportal link will redirects to Pre checkin page to last incomplete step in Pre checkin
      })
    cy.url().should('include', 'chargeautomation.com/pre-checkin') //Validate the Url
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(4000) //Save button should exists
  }
  //Booking Listing 
  validateNullSD() {
    cy.get('[id*="single_booking_box-outer"]').eq(0)
      .find('.booking-box-deposit').eq(0).should('contain.text', '0.00') //SD is not applied here
  }
  getRCAmmount(index){
    cy.get('[id*="single_booking_box-outer"]').eq(0).find('[id*="booking-payment-status-tooltip"]')
    return cy.get('[class*="total_amount_of"]').eq(index).should('exist').invoke('text')
  }
  getSDAmmount(index){
  cy.get('[id*="single_booking_box-outer"]').eq(0).find('[id*="booking-payment-status-tooltip"]') //wait for status update
    return cy.get('.booking-box-deposit span[class*="sd_amount_"]').eq(index).should('exist').invoke('text')
  }
  validateReservationChgStatus(status1, status2 = null) {
    // Create the regular expression, accounting for status2 being null
    // The regular expression is constructed conditionally, appending status2 to the pattern only if it is not null.
    const regex = new RegExp(`${status1}${status2 ? '|' + status2 : ''}`);

    cy.get('[id*="single_booking_box-outer"]').eq(0).find('[id*="booking-payment-status-tooltip"]').eq(0) // Reservation charge status on 1st booking
      .then(($element) => {
        const text = $element.text();
        expect(text).to.match(regex);
      });
  }
  validateSDStatus(status1, status2 = null) {
    // Create the regular expression, accounting for status2 being null
    // The regular expression is constructed conditionally, appending status2 to the pattern only if it is not null.
    const regex = new RegExp(`${status1}${status2 ? '|' + status2 : ''}`);
    cy.get('[id*="single_booking_box-outer"]').eq(0).find('[id*="bl-sd-"]')
      .if().eq(0).then(($element) => {
        const text = $element.text();
        expect(text).to.match(regex);
      })
      .else().then(() => {
        cy.reload()
        this.validateSDStatus(status1, status2 = null)
      })
  }
  expandBooking(num) {
    cy.get('.card-pane').should('be.visible').eq(num).click()
    //cy.get('[class="card-collapse collapsed bookinglist-dropdown"]').should('be.visible').eq(num).click()
    cy.wait(4000)
  }
  PaymentScheduleNotContain(paymentType) {
    cy.get('.booking-card-status-grid').eq(0).should('be.visible').should('not.contain.text', paymentType)
  }
  validateStatus(trxType, status1, status2 = null) {
    // Create the regular expression, accounting for status2 being null
    //The regular expression is constructed conditionally, appending status2 to the pattern only if it is not null.
    const regex = new RegExp(`${status1}${status2 ? '|' + status2 : ''}`);

    cy.get('.grid-item-title').contains(trxType).scrollIntoView().parents('.status-grid-item')
      .find('.status-grid-item-state').then(($element) => {
        const text = $element.text();
        expect(text).to.match(regex);
      })
  }
  valiateTrxAmount(trxType, trxAmount) {
    cy.get('.grid-item-title').contains(trxType).scrollIntoView().parents('.status-grid-item').find('.grid-item-title').should('contain.text', trxAmount)
  }
  addCCOnNewBooking() {
    cy.wait(2000)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click().wait(3000) //CC tag on first booking
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card') //heading
    //Add credit card detail
    /*
    cy.getIframeBody('#card-number-element iframe[name*="__privateStripeFrame"]')
      .find('input[name="cardnumber"]').should('be.visible').type('4242424242424242') //card number
    cy.getIframeBody('#card-expiry-element iframe[name*="__privateStripeFrame"]')
      .find('input[name="exp-date"]').should('be.visible').and('be.enabled').type('1229')  // expiry
    cy.getIframeBody('#card-cvc-element iframe[name*="__privateStripeFrame"]')
      .find('input[name="cvc"]').should('be.visible').type('123')    //cvc
    cy.get('#postal-code').should('be.visible').type('45000') //Postal Code
    */
    cy.get('#card-element').within(() => {
      cy.fillElementsInput('cardNumber', '4242424242424242');
      cy.fillElementsInput('cardExpiry', '1026'); // MMYY
      cy.fillElementsInput('cardCvc', '123');
      cy.fillElementsInput('postalCode', '90210');
    })
    
    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
    cy.get('.toast-message').should('contain.text', 'Card updated successfully')
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  validate3DSAuthenticationToast() {
    cy.get('.toast-message').should('contain.text', 'This card is protected with 3DS authentication, please authenticate your transaction')
  }
  getBookingNumber(index) {
    return cy.get('[class="table-box-check"] div div span').eq(index).should('exist').invoke('text')
  }
  changeBookingStatus(status) {
    cy.get('.hidden-xs [id="moreMenu"]').should('exist').eq(0).click()
    cy.get('.show a[data-target="#add_edit_booking_modal"]').should('contain.text', 'Edit Booking').click() //Edit Booking
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id="reservation_status"]').should('exist').select(status) //Booking Status
    cy.get('[class="modal-footer mt-3"] [name="Save Changes"]').should('contain.text', 'Save Changes').click() //Save Changes
    cy.get('.loading-label').should('not.exist') //loader should be disappear  
    cy.get('[class="toast toast-success"]').should('contain.text', 'Booking cancelled successfully')
  }
  approveTransaction(trxType) {
    cy.get('.grid-item-title').contains(trxType).scrollIntoView()
      .parents('.status-grid-item').find('.grid-item-action').click() //action menu
    //cy.get('[class="status-grid-item"]').contains(trxType).should('be.visible').first()
    //  .parents('.status-grid-item').find('.grid-item-action').click() //action menu
    cy.get('[id*="drop-down-actions"].show .dropdown-item').contains("Approve").click() //Approve
    cy.get('.form-submission-title').should('be.visible').should('contain.text', 'We will attempt to refund payment shortly')
    cy.get('.form-submission-desc').should('contain.text', 'You will be redirected to your Portal in a few seconds.')
  }
  validateRCTooltipMsg(msg) {
    cy.get('[id*="booking-payment-status-tooltip-"]').eq(0).trigger('mouseenter')
    cy.get('.tooltip').should('be.visible').should('contain.text', msg)
  }

  ApproveBookingDoc(doctype){
    cy.get('.booking-card-info-buttons a:nth-child(2)').eq(0).should('be.visible').click() //doc icon on first booking
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    if (doctype == 'id_card_front') {
      cy.get('#id_card_front_action #id_uploaded_action').should('be.visible').click() //Action
      cy.get('[class="dropdown-menu dropdown-menu-right show"] .dropdown-item:first-child').should('contain.text', 'Approve').click() //Approve
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get('#id_card_front_action .badge-success').should('be.visible') //approved icon
    }
    else if(doctype == 'id_card_back'){
      cy.get('#id_card_back_action #id_uploaded_action').should('be.visible').click() //Action
      cy.get('[class="dropdown-menu dropdown-menu-right show"] .dropdown-item:first-child').should('contain.text', 'Approve').click() //Approve
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get('#id_card_back_action .badge-success').should('be.visible') //approved icon
    }
    else if (doctype == 'drivers_license_front') {
      cy.get('#drivers_license_front_action #id_uploaded_action').should('be.visible').click() //Action
      cy.get('[class="dropdown-menu dropdown-menu-right show"] .dropdown-item:first-child').should('contain.text', 'Approve').click() //Approve
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get('#drivers_license_front_action .badge-success').should('be.visible') //approved icon
    }
    else if(doctype == 'drivers_license_back'){
      cy.get('#drivers_license_back_action #id_uploaded_action').should('be.visible').click() //Action
      cy.get('[class="dropdown-menu dropdown-menu-right show"] .dropdown-item:first-child').should('contain.text', 'Approve').click() //Approve
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get('#drivers_license_back_action .badge-success').should('be.visible') //approved icon
    }
    else if(doctype == 'credit_card'){
      cy.get('#credit_card_action #id_uploaded_action').should('be.visible').click() //Action
      cy.get('[class="dropdown-menu dropdown-menu-right show"] .dropdown-item:first-child').should('contain.text', 'Approve').click() //Approve
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get('#credit_card_action .badge-success').should('be.visible') //approved icon
    }
    cy.get('#closeGuestPopup').should('be.visible').and('contain.text', 'Close').click() //close
  }
}