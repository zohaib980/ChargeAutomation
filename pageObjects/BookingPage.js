
import { ReuseableCode } from "../cypress/support/ReuseableCode";
import { LoginPage } from "../pageObjects/LoginPage"

const reuseableCode = new ReuseableCode
const loginPage = new LoginPage

export class BookingPage {
  goToBookingPage() {
    cy.get('[href*="chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click({ force: true })
    cy.get('.page-title').should('be.visible').and('contain.text', 'Bookings') //heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  goToBookingDetail(index) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.booking_more_options [class="fas fa-ellipsis-h"]').eq(index).should('exist').click() //3dot icon
    cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text', 'Booking Details').invoke('attr', 'href').then((bookingdetailLink) => {
        cy.visit(bookingdetailLink) //Visit the booking detail
        cy.url().should('include','/booking-detail/')
        cy.get('[id="tab_general-booking-details"]').should('be.visible').and('contain.text','Booking Detail')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
      })
  }
  addNewBookingAndValidate(propertyName, bSource, adults, child) {
    let oldBookingId
    // A recursive Funtion will wait until the new booking displayed on the booking listing page
    const waitForBookingIdChange = () => {
      return cy.get('[class="inline"]').eq(0).then(($newId) => {
        const newBookingId = $newId.text().trim()
        cy.log(newBookingId)
        if (newBookingId !== oldBookingId) {
          // Old booking ID has changed to a new booking ID
          cy.log(`New Booking is created with Booking ID ${newBookingId}.`)
        }
        else {
          // Old booking ID remains the same, retry the check
          cy.wait(4000)
          waitForBookingIdChange() // Recursive-like call to check again
        }
      })
    }
    cy.get('.navbar-nav [href*="chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.url().should('include', '/bookings') //Validate URL
    cy.get('.page-title.translate').should('be.visible').and('contain.text', 'Bookings') //Validate Page Title
    cy.get('.text-small.translate').should('be.visible').and('contain.text', 'View all your bookings') //Validate Page Subtitle
    cy.get('[class="inline"]').eq(0).then(($oldId) => {
      oldBookingId = $oldId.text().trim()
      cy.log(oldBookingId)
      this.happyAddBooking(propertyName, bSource, adults, child)
      // A recursive Funtion will wait until the new booking displayed on the booking listing page
      waitForBookingIdChange()
    })
  }
  addBookingInFutureDate(propertyName, bSource, adults, child, afterCurrentDate) {
    cy.get('#add_booking_button').click()
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    //Select Property
    cy.get('select[id="assigned_property"]:visible').select(propertyName)
    //Select Date
    cy.get('.custom-date-box').eq(0).click()
    cy.wait(1000)
    cy.get('[aria-label*="your start date."].asd__day--today button').eq(0).invoke('text').then((fromDate) => {
      cy.log(fromDate)
      cy.get('[role="presentation"] [aria-label*="your start date."] button').then((todate) => {
        cy.log(todate)
        cy.get(todate).eq(parseInt(afterCurrentDate)).click({ force: true }) //Select from date - 3 days after from current date
        cy.get('.custom-date-box').eq(0).click()
        cy.wait(1000)
        cy.get(todate).eq(parseInt(afterCurrentDate) + 5).click({ force: true }) //Click todate - 7 days after from date
      })
    })
    // Select Source
    cy.get('select[id="booking_source"]').eq(0).should('be.visible').select(bSource)
    // Reservation Status
    cy.get('select[id="reservation_status"]').eq(0).should('be.visible').select("Confirmed")
    // Booking Amount
    cy.get('input[id="total_booking_amount"]').eq(0).should('be.visible').type('100')
    // Enter Note
    cy.get('textarea[id="bookingNotes"]').eq(0).should('be.visible').type('Testing Automation')
    // First Name and Last Name
    let firstName = reuseableCode.getRandomFirstName()
    let lastName = reuseableCode.getRandomLastName()
    cy.wrap(firstName).as('firstName')
    cy.wrap(lastName).as('lastName')
    cy.get('input[id="first_name"]').eq(0).should('be.visible').type(firstName)
    cy.get('input[id="last_name"]').eq(0).should('be.visible').type(lastName)
    // Enter email
    function generateUserName() {
      let text = "";
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

      for (let i = 0; i < 10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
      return text;
    }
    const generatedUserName = generateUserName()
    const guestEmail = generatedUserName + '@mailinator.com'
    cy.get('input[id="email"]').eq(0)
      .should('have.attr', 'placeholder', 'Email')
      .type(guestEmail) //Add a random email
    cy.wrap(guestEmail).as('guestEmail')
    //Add Adult, child and nationality
    cy.get('input[id="num_adults"]').eq(0).clear().type(adults)
    cy.get('input[id="num_child"]').eq(0).clear().type(child)
    cy.get('select[id="nationality"]').eq(0).select("Pakistani")
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[class="modal-footer mt-3"] [name="Save Changes"]').eq(0).should('be.visible').click() //Save
    cy.get('[class="toast toast-success"]').should('contain.text', 'Booking added successfully')
    cy.get('[class="toast toast-success"]').should('not.exist')
  }
  happyAddBooking(propertyName, bSource, adults, child) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#add_booking_button').should('be.visible').click()
    cy.get('[id="add_edit_booking_modal"] .modal-title').should('be.visible').and('contain.text', 'Booking Details') //modal heading
    //Select Property
    cy.get('#bookings-tabContent [for="assigned_property"]').should('contain.text', 'Property')
    cy.get('select[id="assigned_property"]').should('be.visible').select(propertyName)
    //Select Date
    cy.get('.custom-date-box').eq(0).click()
    //cy.wait(1000)
    cy.get('[aria-label*="your start date."].asd__day--today button').eq(0).invoke('text').then((fromDate) => {
      cy.log(fromDate)
      cy.get('[role="presentation"] [aria-label*="your start date."] button').then((todate) => {
        cy.log(todate)
        cy.get('[aria-label*="your start date."].asd__day--today button').eq(0).click() //from date
        cy.get('.custom-date-box').eq(0).click()
        //cy.wait(1000)
        cy.get(todate).eq(8).click({ force: true }) //Click todate
      })
    })
    // Select Source
    cy.get('#bookings-tabContent [for="booking_source"]').should('contain.text', 'Booking Source')
    cy.get('select[id="booking_source"]').eq(0).select(bSource)
    // Reservation Status
    cy.get('#bookings-tabContent [for="reservation_status"]').should('contain.text', 'Reservation Status')
    cy.get('select[id="reservation_status"]').eq(0).select("Confirmed", { force: true })
    // Booking Amount
    cy.get('#bookings-tabContent [for="total_booking_amount"]').should('contain.text', 'Total Booking Amount')
    cy.get('input[id="total_booking_amount"]').eq(0).type('100')
    // Enter Internal Note
    cy.get('#bookings-tabContent [for="bookingNotes"]').should('contain.text', 'Internal Notes')
    cy.get('textarea[id="bookingNotes"]').eq(0).type('Testing Automation')
    //Guest Information
    cy.get('#accordion-booking-booker-heading b').should('contain.text', 'Guest Information')
    // First Name and Last Name
    let firstName = reuseableCode.getRandomFirstName()
    let lastName = reuseableCode.getRandomLastName()
    cy.wrap(firstName).as('firstName')
    cy.wrap(lastName).as('lastName')
    cy.get('#bookings-tabContent [for="first_name"]').should('contain.text', 'First Name')
    cy.get('input[id="first_name"]').eq(0).type(firstName)
    cy.get('#bookings-tabContent [for="last_name"]').should('contain.text', 'Last Name')
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
    cy.get('select[id="nationality"]').eq(0).select("Pakistani")
    cy.get('[class="modal-footer mt-3"] [name="Save Changes"]').eq(0).should('be.visible').click()
    cy.get('[class="toast toast-success"]').should('contain.text', 'Booking added successfully')
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  removeEmailFromBooking(index) {
    //Remove email from booking
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.booking_more_options [id="moreMenu"]').eq(index).should('be.visible').click()
    cy.get('.booking_more_options [data-target="#add_edit_booking_modal"]').eq(index).should('contain.text', 'Edit Booking').click({ force: true })
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#add_edit_booking_modal .modal-title').should('be.visible').and('contain.text', 'Booking Details') //heading on modal
    cy.get('#add_edit_booking_modal [id="email"]').should('be.visible').clear() //clear email field
    cy.get('#add_edit_booking_modal [name="Save Changes"]').should('be.visible').and('contain.text', 'Save Changes').click().wait(1000) //Save Changes
    cy.get('.swal2-icon-warning.swal2-show').if().then(() => {
      cy.get('.view-edit-title').should('contain.text', 'Contact Information Missing').and('be.visible')
      cy.get('.view-edit-desc').should('contain.text', 'This reservation is missing email and phone number. ChargeAutomation will not be able to send any communication to the guest.').and('be.visible')
      cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'I Understand').click()
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get('[class="toast toast-success"]').should('contain.text', 'Booking updated successfully')
    })
  }
  addConfirmationCode(index, confirmationCode) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.booking_more_options [id="moreMenu"]').eq(index).should('be.visible').click()
    cy.get('.booking_more_options [data-target="#add_edit_booking_modal"]').eq(index).should('contain.text', 'Edit Booking').click({ force: true })
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#add_edit_booking_modal .modal-title').should('be.visible').and('contain.text', 'Booking Details') //heading on modal
    cy.get('[id="booking_confirmation_code"]').scrollIntoView().should('be.visible').clear().type(confirmationCode) //add Confrimation code
    cy.get('#add_edit_booking_modal [name="Save Changes"]').should('be.visible').and('contain.text', 'Save Changes').click().wait(1000) //Save Changes
    cy.get('[class="toast toast-success"]').should('contain.text', 'Booking updated successfully')
  }
  addAccessCode(index, accessCode) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.booking_more_options [id="moreMenu"]').eq(index).should('be.visible').click()
    cy.get('.booking_more_options [data-target="#add_edit_booking_modal"]').eq(index).should('contain.text', 'Edit Booking').click({ force: true })
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#add_edit_booking_modal .modal-title').should('be.visible').and('contain.text', 'Booking Details') //heading on modal
    cy.get('[id="booking_access_code"]').scrollIntoView().should('be.visible').clear().type(accessCode) //add Access code
    cy.get('#add_edit_booking_modal [name="Save Changes"]').should('be.visible').and('contain.text', 'Save Changes').click().wait(1000) //Save Changes
    cy.get('[class="toast toast-success"]').should('contain.text', 'Booking updated successfully')
  }
  validateAccessCode(accessCode) {
    cy.get('[class="booking-details-box"]').contains('Access Code').parents('[class="booking-details-box"]').should('contain.text', accessCode).and('be.visible')
  }
  getGuestPortalLinkOnBooking(index) {
    cy.get('.booking_more_options #moreMenu').eq(index).should('be.visible').click() //3dot
    cy.get('.booking_more_options a[href*="chargeautomation.com/guest-portal/"]').eq(index).then($ele => {
      const guestPortalLink = $ele.attr('href')
      cy.wrap(guestPortalLink).as('guestPortalLink')
    })
  }
  visitGuestPortalAsClient(guestPortalLink) {
    cy.visit(guestPortalLink)
    cy.url().should('include', '/guest-portal/')
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.view-edit-body').should('be.visible').and('contain.text', 'You are only able to access this page because you are an admin. Your guests will not be able to access this page until they complete Pre check-in.')
    cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'OK').click() //OK
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
  validatePrecheckinStatus(checkinStatus, index, count) {
    if (checkinStatus == 'Completed') {
      cy.get('.guest-name-overflow div.small span').should('be.visible').eq(index).should('contain.text', 'Pre check-in completed').and('contain.text', count)
    }
    if (checkinStatus == 'Incomplete') {
      cy.get('.guest-name-overflow div.small span').should('be.visible').eq(index).should('contain.text', 'Pre check-in incomplete').and('contain.text', count)
    }
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
  validateCCCountOnBooking(index) {
    cy.get('[id*="add_credit_card_button"]').eq(index).click() //index is booking count from top
    cy.get('#guest_credit_card_modal .modal-title').should('contain.text', 'Guest Credit Card').and('be.visible') //Validate popup heading
    cy.wait(3000)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#card-element') //this will shown on popup if no card is added yet
      .if().then(() => {
        const numberOfStoreCards = 0 //Number of added cards are 0
        cy.log("Number of cards on popup: " + numberOfStoreCards)
        cy.get('[id="guest_credit_card_modal_close"]').and('be.visible').click() //Cancel button
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
        cy.get('[id="guest_credit_card_modal_close"]').and('be.visible').click() //Close button
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
    cy.get('.loading-label').should('not.exist') //loader should be disappear
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
  ApproveBookingDoc(doctype) {
    cy.get('.booking-card-info-buttons a:nth-child(2)').eq(0).should('be.visible').click() //doc icon on first booking
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    if (doctype == 'id_card_front') {
      cy.get('#id_card_front_action #id_uploaded_action').should('be.visible').click() //Action
      cy.get('[class="dropdown-menu dropdown-menu-right show"] .dropdown-item:first-child').should('contain.text', 'Approve').click() //Approve
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get('#id_card_front_action .badge-success').should('be.visible') //approved icon
    }
    else if (doctype == 'id_card_back') {
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
    else if (doctype == 'drivers_license_back') {
      cy.get('#drivers_license_back_action #id_uploaded_action').should('be.visible').click() //Action
      cy.get('[class="dropdown-menu dropdown-menu-right show"] .dropdown-item:first-child').should('contain.text', 'Approve').click() //Approve
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get('#drivers_license_back_action .badge-success').should('be.visible') //approved icon
    }
    else if (doctype == 'credit_card') {
      cy.get('#credit_card_action #id_uploaded_action').should('be.visible').click() //Action
      cy.get('[class="dropdown-menu dropdown-menu-right show"] .dropdown-item:first-child').should('contain.text', 'Approve').click() //Approve
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get('#credit_card_action .badge-success').should('be.visible') //approved icon
    }
    cy.get('#closeGuestPopup').should('be.visible').and('contain.text', 'Close').click() //close
  }
  rejectDocOnBooking(bookingIndex, docIndex) {
    cy.get('.booking-card-info [class="btn btn-xs translate"]:nth-child(2)').eq(bookingIndex).should('contain.text', 'Documents').click()
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#upload_doc .modal-title').should('be.visible').and('contain.text', 'Documents')
    cy.get('#upload_doc [id="id_uploaded_action"]').eq(docIndex).should('be.visible').click() //Action
    cy.get('#upload_doc [data-target="#get_image_description"]').eq(docIndex).should('be.visible').click() //Reject
    cy.get('[id="get_image_description"].show .modal-title').should('be.visible').and('contain.text', 'Rejection Reason') //popup modal
    cy.get('[id="get_image_description"].show [for="description"]').should('be.visible').and('contain.text', 'Please mention reason')
    cy.get('[id="get_image_description"].show .form-text.mb-2').should('contain.text', '(Rejection reason, improvements, suggestions etc)')
    cy.get('[id="get_image_description"].show [id="description"]').should('be.visible').type('Testing Reason')
    cy.get('[id="get_image_description"].show [id="force_close_guest_document_description_modal"]').should('contain.text', 'Close')
    cy.get('[id="get_image_description"].show .btn-success').should('be.visible').and('contain.text', 'Submit').click() // Submit
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#upload_doc .badge-danger').should('be.visible').and('contain.text', 'Rejected') //Verify the tag
    cy.get('#upload_doc [id="closeGuestPopup"]').should('be.visible').and('contain.text', 'Close').click() //Close
  }
  validateDeactivateProperty(propName) {
    cy.get('[id="add_booking_button"]').should('contain.text', 'Add').and('be.visible').click().wait(1000) //Add new booking
    cy.get('select[id="assigned_property"]').should('not.contain.text', propName)
    cy.get('[id="add_booking_close_modal"]').should('contain.text', 'Cancel').click() //Close the popup
  }
  validateActiveProperty(propName) {
    cy.get('[id="add_booking_button"]').should('contain.text', 'Add').and('be.visible').click().wait(1000) //Add new booking
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
  getRCAmmount(index) {
    cy.get('[id*="single_booking_box-outer"]').eq(0).find('[id*="booking-payment-status-tooltip"]')
    return cy.get('[class*="total_amount_of"]').eq(index).should('exist').invoke('text')
  }
  getSDAmmount(index) {
    cy.get('[id*="single_booking_box-outer"]').eq(0).find('[id*="booking-payment-status-tooltip"]').wait(1000) //wait for status update
    return cy.get('.booking-box-deposit span[class*="sd_amount_"]').eq(index).should('exist').invoke('text')
  }
  validateReservationChgStatus(status1, status2 = null) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
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
    cy.get('.loading-label').should('not.exist') //loader should be disappear
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
  addCCOnNewBooking(cardNumber = '4242424242424242') {
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
      cy.fillElementsInput('cardNumber', cardNumber)
      cy.fillElementsInput('cardExpiry', '1026') // MMYY
      cy.fillElementsInput('cardCvc', '123')
      cy.fillElementsInput('postalCode', '90210')
    })

    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
  }
  addCCOnNewBookingAuthNet(cardNumber, guestName = null, postalCode = '45000') {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click().wait(3000) //CC tag on first booking
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card') //heading

    cy.get('.card-name-group-label > label').should('be.visible').and('contain.text', 'Name On Card') //label
    if (guestName != null) {
      cy.get('#full_name').should('be.visible').and('have.value', guestName)
    }
    cy.get('#payment-form > :nth-child(2) > .col-lg-12 > .form-group > label').should('be.visible').and('contain.text', 'Card Number') //label
    cy.get('#cardNumber').should('be.visible').type(cardNumber)
    cy.get('.col-lg-5 > .form-group > label').should('contain.text', 'Expiration Month') //label
    cy.get('#expiryMonth').select('12 (DEC)') //month
    cy.get('.col-lg-4 > .form-group > label').should('contain.text', 'Expiration Year') //label
    cy.get('#expiryYear').select('2029') //year
    cy.get('.col-lg-3 > .form-group > label').should('contain.text', 'CVV/CVC') //label
    cy.get('#cvn').type('123')

    cy.get('.mt-3 > .col-lg-12 > .form-group > .label-style').should('contain.text', 'Country')
    cy.get('[name="bill-to-country"] input[type="search"]').click().then(() => {
      cy.get('#vs2__listbox').contains('li', 'Pakistan').click()
    })
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get(':nth-child(2) > .form-group > .label-style').should('contain.text', 'State')
    cy.get('[name="bill-to-state"] input[type="search"]').click().then(() => {
      cy.get('#vs3__listbox').contains('li', 'Punjab').click()
    })
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get(':nth-child(3) > .form-group > .label-style').should('contain.text', 'City')
    cy.get('[name="bill-to-city"] input[type="search"]').type('Lahore').then(() => {
      cy.get('#vs4__listbox').contains('li', 'Lahore').click()
    })
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[for="bill-to-address1"]').should('contain.text', 'Address line 1')
    cy.get('#bill-to-address1').type('Johar Town')
    cy.get('[for="bill-to-address2"]').should('contain.text', 'Address line 2')
    cy.get('#bill-to-address2').should('exist')
    cy.get('[for="postalCode"]').should('contain.text', 'Zip Code')
    cy.get('#postalCode').type(postalCode)

    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
  }
  addCCOnNewBookingCybersource(cardNumber, guestName = null, email = null, postalCode = '45000') {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click().wait(3000) //CC tag on first booking
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card') //heading

    cy.get('.card-name-group-label > label').should('be.visible').and('contain.text', 'Name On Card') //label
    if (guestName != null) {
      cy.get('#full_name').should('be.visible').and('have.value', guestName)
    }
    cy.get('#payment-form > :nth-child(2) > .col-lg-12 > .form-group > label').should('be.visible').and('contain.text', 'Card Number') //label
    cy.getIframeBody('[id="number-container"] iframe[title="secure payment field"]').find('[id="number"]').type(cardNumber)
    cy.get('.col-lg-5 > .form-group > label').should('contain.text', 'Expiration Month') //label
    cy.get('#expiryMonth').select('12 (DEC)') //month
    cy.get('.col-lg-4 > .form-group > label').should('contain.text', 'Expiration Year') //label
    cy.get('#expiryYear').select('2029') //year
    cy.get('.col-lg-3 > .form-group > label').should('contain.text', 'CVV/CVC') //label
    cy.getIframeBody('[id="securityCode-container"] iframe[title="secure payment field"]').find('[id="securityCode"]').type('123')

    cy.get(':nth-child(1) > .col-lg-12 > .form-group > label').should('contain.text', 'Email')
    if (email != null) {
      cy.get('#bill-to-email').should('be.visible').and('have.value', email)
    }

    cy.get('[for="bill-to-country"]').should('contain.text', 'Country')
    cy.get('[name="bill-to-country"] input[type="search"]').click({ force: true }).then(() => {
      cy.get('#vs2__listbox').contains('li', 'Pakistan').click()
    })
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[for="bill-to-state"]').should('contain.text', 'State')
    cy.get('[name="bill-to-state"] input[type="search"]').click({ force: true }).then(() => {
      cy.get('#vs3__listbox').contains('li', 'Punjab').click()
    })
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[for="bill-to-city"]').should('contain.text', 'City')
    cy.get('[name="bill-to-city"] input[type="search"]').type('Lahore', { force: true }).then(() => {
      cy.get('#vs4__listbox').contains('li', 'Lahore').click()
    })

    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[for="bill-to-address1"]').should('contain.text', 'Address line 1')
    cy.get('#bill-to-address1').type('Johar Town')
    cy.get('[for="bill-to-postal"]').should('contain.text', 'Postal Code')
    cy.get('[id="bill-to-postal"]').should('exist').type(postalCode)

    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
  }
  addCCOnNewBookingRedsys(cardNumber, expiry, cvc, guestName = null) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click().wait(3000) //CC tag on first booking
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card') //heading

    cy.get('.card-name-group-label > label').should('be.visible').and('contain.text', 'Name On Card') //label
    if (guestName != null) {
      cy.get('#full_name').should('be.visible').and('have.value', guestName)
    }
    cy.wait(15000)
    cy.getIframeBody('iframe[id="redsys-hosted-pay-button"]').find('h4[id="textoSuperior"]').should('contain.text', 'Credit or debit card').and('be.visible')
    cy.getIframeBody('iframe[id="redsys-hosted-pay-button"]').find('[id="card-number"]').should('exist').type(cardNumber) //card number
    cy.getIframeBody('iframe[id="redsys-hosted-pay-button"]').find('[id="card-expiration"]').should('exist').type(expiry) //expiry
    cy.getIframeBody('iframe[id="redsys-hosted-pay-button"]').find('[id="card-cvv"]').should('exist').type(cvc) //cvc

    cy.getIframeBody('iframe[id="redsys-hosted-pay-button"]').find('[id="iv-visa"]').should('be.visible') // visa logo
    cy.getIframeBody('iframe[id="redsys-hosted-pay-button"]').find('[id="iv-mc"]').should('be.visible') // MC logo
    cy.getIframeBody('iframe[id="redsys-hosted-pay-button"]').find('[id="iv-aex"]').should('be.visible') //JCB logo

    cy.getIframeBody('iframe[id="redsys-hosted-pay-button"]').find('[id="divImgAceptar"]').should('be.visible').and('contain.text', 'Add Card').trigger('mousedown').trigger('mouseup').wait(1000).click() //Add card 
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    //3ds verification
    cy.get('[id="redsys-terminal3ds-verification-modal"] .modal-title').should('be.visible').and('contain.text', 'Verify 3D secure card')
    cy.wait(10000)

    //nested iframe  
    cy.get('[src*="/redsyc-payment-confirmation-page?"]')
      .its('0.contentDocument')
      .its('body')
      .find('iframe[id="redsys_iframe_acs"]')
      .its('0.contentDocument')
      .its('body').then(secondIframeBody => {
        cy.wrap(secondIframeBody).find('[id="cabecera"]').should('contain.text', 'Simulador de autenticación EMV3DS')
        cy.wrap(secondIframeBody).find('[id="input1"] [type="radio"]').should('exist').check({ force: true }) //radio button
        cy.wrap(secondIframeBody).find('[id="acceptB"] [value="Enviar"]').should('exist').click({ force: true }) //Enviar
      })
    /*
    cy.get('h2[id="swal2-title"]').should('exist').and('contain.text', 'Are you sure to update credit Card?')
    cy.get('.swal2-cancel').should('exist').and('contain.text', 'Cancel')
    cy.get('.swal2-confirm').should('exist').and('contain.text', 'Yes, Update Now!').click({force:true}) //Yes, Update Now!
      */
    cy.wait(5000)
  }
  close3DSModalRedsys() {
    cy.get('#redsys-terminal3ds-verification-modal > .modal-dialog > .modal-content > .modal-header > #close_3ds_modal > span').should('be.visible').click() //close the 3ds modal
  }
  addCCOnNewBookingPayFast(transType) {
    cy.wait(2000)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click().wait(3000) //CC tag on first booking
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card') //heading

    cy.get('[variable="desc"] > :nth-child(1) > div').should('be.visible').and('contain.text', "Ensure your details below are correct, then click 'Proceed to Add Card' to enter your payment method (credit/debit card)")
    cy.get('[variable="fName"] [class="card-name-group-label"]').should('contain.text', 'First Name')
    cy.get('[variable="fName"] [for="fName"]').should('be.visible').invoke('val').then(fName => { cy.wrap(fName).as('firstName') })
    cy.get('[variable="lName"] [class="card-name-group-label"]').should('contain.text', 'Last Name')
    cy.get('[variable="lName"] [for="lName"]').should('be.visible').invoke('val').then(lName => { cy.wrap(lName).as('lastName') })
    cy.get('[variable="eMail"] [class="card-name-group-label"]').should('contain.text', 'Email')
    cy.get('[variable="eMail"] [class="form__input"]').should('be.visible').invoke('val').then(email => { cy.wrap(email).as('email') })
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click()
    cy.wait(25000)

    if (transType == 'Accept') { //add a card on booking
      cy.getIframeBody('iframe[id="payfast_compact_engine_iframe"]').find('[id="header"] .title').should('be.visible') // Check modal title is visible
      cy.getIframeBody('iframe[id="payfast_compact_engine_iframe"]').find('[id="contentBox"] h3').should('be.visible')
        .and('contain.text', 'You have a balance of') // Check balance text is visible

      cy.getIframeBody('iframe[id="payfast_compact_engine_iframe"]').find('[id="contentBox"] [id="pay-with-wallet"]')
        .and('contain.text', 'Complete Payment').click({ force: true })  // Click on "Complete Payment"

      cy.getIframeBody('iframe[id="payfast_compact_engine_iframe"]').find('[id="processing-loader"]').should('be.visible') // Wait for loader to appear
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get('.show [class="modal-footer"] .btn-primary').should('not.exist')
    }
    else if (transType == 'Decline') {
      cy.getIframeBody('iframe[id="payfast_compact_engine_iframe"]').should('be.visible').find('[id="header"] .title').should('be.visible') // Check modal title is visible
      cy.getIframeBody('iframe[id="payfast_compact_engine_iframe"]').find('[id="contentBox"] h3').should('be.visible')
        .and('contain.text', 'You have a balance of') // Check balance text is visible
      cy.getIframeBody('iframe[id="payfast_compact_engine_iframe"]').find('[id="contentBox"] [id="pay-with-wallet"]')
        .should('contain.text', 'Complete Payment')
      cy.getIframeBody('iframe[id="payfast_compact_engine_iframe"]').find('[id="credit--card"] .close').should('be.visible').click() // Cancel the payment
    }

  }
  addCCOnNewBookingWorldPayWPG(cardNumber, guestEmail, guestName = null, postalCode = '45000') {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click() //CC tag on first booking
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card').wait(5000) //heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.getIframeBody('#pci-iframe').find('[id="cardNumberLabel"]').should('be.visible').and('contain.text', 'Card number:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardNumber"]').should('be.visible').type(cardNumber)

    cy.getIframeBody('#pci-iframe').find('[id="expirationLabel"]').should('be.visible').and('contain.text', 'Expiration:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationMonth"]').select('12') //month
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationYear"]').select('2027')  //year
    cy.getIframeBody('#pci-iframe').find('[id="cardCvv"]').should('be.visible').type('123') //cvv

    cy.getIframeBody('#pci-iframe').find('[id="nameOnCardLabel"]').should('be.visible').and('contain.text', 'Name On Card:') //label
    if (guestName != null) {
      cy.getIframeBody('#pci-iframe').find('[id="cardNameOnCard"]').should('be.visible').type(guestName)
    }

    cy.get('[class="terminal-addon-fields__wrapper"] [for="email"]').should('be.visible').and('contain.text', 'Email Address') //label
    cy.get('[class="terminal-addon-fields__wrapper"] [name="email"]').should('be.visible').and('contain.value', guestEmail)

    cy.get('[class="terminal-addon-fields__wrapper"] [for="phone"]').should('be.visible').and('contain.text', 'Phone Number') //label
    const phoneNo = ('+92' + reuseableCode.getRandomPhoneNumber())
    cy.get('[class="terminal-addon-fields__wrapper"] [id*="phone-"]').should('be.visible').clear().type(phoneNo)

    cy.get('[class="terminal-addon-fields__wrapper"] [for="bill-to-country"]').should('contain.text', 'Country')
    cy.get('[name="bill-to-country"] input[type="search"]').click().then(() => {
      cy.get('#vs2__listbox').contains('li', 'Pakistan').click()
    })
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[for="bill-to-city"]').should('contain.text', 'City')
    cy.get('[name="bill-to-city"] input[type="search"]').click().then((element) => {
      cy.wait(1000)
      cy.wrap(element).type('Lahore').wait(1000)
      cy.get('#vs3__listbox').contains('li', 'Lahore').click()
    })

    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[for="Address1"]').should('contain.text', 'Billing Address') //label
    cy.get('[name="Address1"]').type('Johar Town')

    cy.get('[for="PostCode"]').should('contain.text', 'Billing PostCode') //label
    cy.get('[name="PostCode"]').type(postalCode)

    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
  }
  verifyPCIBookingOTP(otp) {
    cy.getIframeBody('#pci-iframe').find('[id="otp"]').should('be.visible').type(otp)
    cy.getIframeBody('#pci-iframe').find('[id="sendOtp"]').should('be.visible').and('contain.text', 'Pay').click() //Pay
  }
  addCCOnNewBookingPaypalBusinessWPG(cardNumber, guestEmail, guestName = null, postalCode = '45000') {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click() //CC tag on first booking
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card').wait(5000) //heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.getIframeBody('#pci-iframe').find('[id="cardNumberLabel"]').should('be.visible').and('contain.text', 'Card number:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardNumber"]').should('be.visible').type(cardNumber)

    cy.getIframeBody('#pci-iframe').find('[id="expirationLabel"]').should('be.visible').and('contain.text', 'Expiration:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationMonth"]').select('12') //month
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationYear"]').select('2027')  //year
    cy.getIframeBody('#pci-iframe').find('[id="cardCvv"]').should('be.visible').type('123') //cvv

    cy.getIframeBody('#pci-iframe').find('[id="nameOnCardLabel"]').should('be.visible').and('contain.text', 'Name On Card:') //label
    if (guestName != null) {
      cy.getIframeBody('#pci-iframe').find('[id="cardNameOnCard"]').should('be.visible').type(guestName)
    }

    cy.get('[class="terminal-addon-fields__wrapper"] [for="email"]').should('be.visible').and('contain.text', 'Email Address') //label
    cy.get('[class="terminal-addon-fields__wrapper"] [name="email"]').should('be.visible').and('contain.value', guestEmail)

    cy.get('[class="terminal-addon-fields__wrapper"] [for="phone"]').should('be.visible').and('contain.text', 'Phone Number') //label
    const phoneNo = ('+92' + reuseableCode.getRandomPhoneNumber())
    cy.get('[class="terminal-addon-fields__wrapper"] [id*="phone-"]').should('be.visible').clear().type(phoneNo)

    cy.get('[class="terminal-addon-fields__wrapper"] [for="bill-to-country"]').should('contain.text', 'Country')
    cy.get('[name="bill-to-country"] input[type="search"]').click().then(() => {
      cy.get('#vs2__listbox').contains('li', 'Pakistan').click()
    })

    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
  }
  addCCOnNewBookingMonerisPG(cardNumber, guestEmail, guestName = null, postalCode = '45000') {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click() //CC tag on first booking
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card').wait(5000) //heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.getIframeBody('#pci-iframe').find('[id="cardNumberLabel"]').should('be.visible').and('contain.text', 'Card number:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardNumber"]').should('be.visible').type(cardNumber)

    cy.getIframeBody('#pci-iframe').find('[id="expirationLabel"]').should('be.visible').and('contain.text', 'Expiration:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationMonth"]').select('12') //month
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationYear"]').select('2027')  //year
    cy.getIframeBody('#pci-iframe').find('[id="cardCvv"]').should('be.visible').type('123') //cvv

    cy.getIframeBody('#pci-iframe').find('[id="nameOnCardLabel"]').should('be.visible').and('contain.text', 'Name On Card:') //label
    if (guestName != null) {
      cy.getIframeBody('#pci-iframe').find('[id="cardNameOnCard"]').should('be.visible').type(guestName)
    }

    cy.get('[class="terminal-addon-fields__wrapper"] [for="email"]').should('be.visible').and('contain.text', 'Email Address') //label
    cy.get('[class="terminal-addon-fields__wrapper"] [name="email"]').should('be.visible').and('contain.value', guestEmail)

    cy.get('[class="terminal-addon-fields__wrapper"] [for="phone"]').should('be.visible').and('contain.text', 'Phone Number') //label
    const phoneNo = reuseableCode.getRandomPhoneNumber()
    cy.get('[class="terminal-addon-fields__wrapper"] [id*="phone-"]').should('be.visible').type('+92' + phoneNo)

    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
  }
  addCCOnNewBookingRepydCardPG(cardNumber, guestEmail, guestName = null, postalCode = '45000') {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click() //CC tag on first booking
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card').wait(5000) //heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.getIframeBody('#pci-iframe').find('[id="cardNumberLabel"]').should('be.visible').and('contain.text', 'Card number:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardNumber"]').should('be.visible').type(cardNumber)

    cy.getIframeBody('#pci-iframe').find('[id="expirationLabel"]').should('be.visible').and('contain.text', 'Expiration:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationMonth"]').select('12') //month
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationYear"]').select('2027')  //year
    cy.getIframeBody('#pci-iframe').find('[id="cardCvv"]').should('be.visible').type('123') //cvv

    cy.getIframeBody('#pci-iframe').find('[id="nameOnCardLabel"]').should('be.visible').and('contain.text', 'Name On Card:') //label
    if (guestName != null) {
      cy.getIframeBody('#pci-iframe').find('[id="cardNameOnCard"]').should('be.visible').type(guestName)
    }

    cy.get('[class="terminal-addon-fields__wrapper"] [for="email"]').should('be.visible').and('contain.text', 'Email Address') //label
    cy.get('[class="terminal-addon-fields__wrapper"] [name="email"]').should('be.visible').and('contain.value', guestEmail)

    cy.get('[class="terminal-addon-fields__wrapper"] [for="phone"]').should('be.visible').and('contain.text', 'Phone Number') //label
    const phoneNo = reuseableCode.getRandomPhoneNumber()
    cy.get('[class="terminal-addon-fields__wrapper"] [id*="phone-"]').should('be.visible').type('+92' + phoneNo)

    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[for="address1"]').should('contain.text', 'Billing address') //label
    cy.get('[name="address1"]').type('Johar Town')

    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
  }
  addCCOnNewBookingTotalProcessingPG(cardNumber, guestEmail, guestName = null, postalCode = '45000') {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click() //CC tag on first booking
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card').wait(5000) //heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.getIframeBody('#pci-iframe').find('[id="cardNumberLabel"]').should('be.visible').and('contain.text', 'Card number:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardNumber"]').should('be.visible').type(cardNumber)

    cy.getIframeBody('#pci-iframe').find('[id="expirationLabel"]').should('be.visible').and('contain.text', 'Expiration:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationMonth"]').select('12') //month
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationYear"]').select('2027')  //year
    cy.getIframeBody('#pci-iframe').find('[id="cardCvv"]').should('be.visible').type('123') //cvv

    cy.getIframeBody('#pci-iframe').find('[id="nameOnCardLabel"]').should('be.visible').and('contain.text', 'Name On Card:') //label
    if (guestName != null) {
      cy.getIframeBody('#pci-iframe').find('[id="cardNameOnCard"]').should('be.visible').type(guestName)
    }

    cy.get('[class="terminal-addon-fields__wrapper"] [for="email"]').should('be.visible').and('contain.text', 'Email Address') //label
    cy.get('[class="terminal-addon-fields__wrapper"] [name="email"]').should('be.visible').and('contain.value', guestEmail)

    cy.get('[class="terminal-addon-fields__wrapper"] [for="phone"]').should('be.visible').and('contain.text', 'Phone Number') //label
    const phoneNo = reuseableCode.getRandomPhoneNumber()
    cy.get('[class="terminal-addon-fields__wrapper"] [id*="phone-"]').should('be.visible').type('+92' + phoneNo)

    cy.get('[class="terminal-addon-fields__wrapper"] [for="bill-to-country"]').should('contain.text', 'Country')
    cy.get('[name="bill-to-country"] input[type="search"]').click().then(() => {
      cy.get('#vs2__listbox').contains('li', 'Pakistan').click()
    })

    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
  }
  addCCOnNewBookingNuveiPG(cardNumber, guestEmail, guestName = null, postalCode = '45000') {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click() //CC tag on first booking
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card').wait(5000) //heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.getIframeBody('#pci-iframe').find('[id="cardNumberLabel"]').should('be.visible').and('contain.text', 'Card number:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardNumber"]').should('be.visible').type(cardNumber)

    cy.getIframeBody('#pci-iframe').find('[id="expirationLabel"]').should('be.visible').and('contain.text', 'Expiration:') //label
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationMonth"]').select('12') //month
    cy.getIframeBody('#pci-iframe').find('[id="cardExpirationYear"]').select('2027')  //year
    cy.getIframeBody('#pci-iframe').find('[id="cardCvv"]').should('be.visible').type('123') //cvv

    cy.getIframeBody('#pci-iframe').find('[id="nameOnCardLabel"]').should('be.visible').and('contain.text', 'Name On Card:') //label
    if (guestName != null) {
      cy.getIframeBody('#pci-iframe').find('[id="cardNameOnCard"]').should('be.visible').type(guestName)
    }

    cy.get('[class="terminal-addon-fields__wrapper"] [for="email"]').should('be.visible').and('contain.text', 'Email Address') //label
    cy.get('[class="terminal-addon-fields__wrapper"] [name="email"]').should('be.visible').and('contain.value', guestEmail)

    cy.get('[class="terminal-addon-fields__wrapper"] [for="phone"]').should('be.visible').and('contain.text', 'Phone Number') //label
    const phoneNo = reuseableCode.getRandomPhoneNumber()
    cy.get('[class="terminal-addon-fields__wrapper"] [id*="phone-"]').should('be.visible').type('+92' + phoneNo)

    cy.get('[class="terminal-addon-fields__wrapper"] [for="bill-to-country"]').should('contain.text', 'Country')
    cy.get('[name="bill-to-country"] input[type="search"]').click().then(() => {
      cy.get('#vs2__listbox').contains('li', 'Pakistan').click()
    })

    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
  }
  openAddCCModal() {
    cy.get('[id*="add_credit_card_button"]').eq(0).should('contain.text', 'Credit Card').click().wait(3000) //CC tag on first booking
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Guest Credit Card') //heading
  }
  clickSaveAndUse() {
    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]')
      .should('contain.text', 'Save & Use').and('be.visible').click({ force: true })
  }
  getBookingID(index) {
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
  //Additional Charge
  openAdditionalChargeModal() {
    cy.get('.grid-btn').should('be.visible').click() //+ button
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#additionalChargeModal #transactionModalLabel').should('be.visible').and('contain.text', 'Additional Charge') //heading
    cy.get('#additionalChargeModal [id="charge-tab"]').should('be.visible').and('contain.text', '$').and('contain.text', 'Charge')
  }
  addAmountOnAC(amount) {
    cy.get('#additionalChargeModal [for="transactionAmount"]').should('be.visible').and('contain.text', 'Amount')
    cy.get('#additionalChargeModal #transactionAmount').should('be.visible').type(amount) //Amount
  }
  addDescriptionOnAC(description) {
    cy.get('#additionalChargeModal [for="transactionDescription"]').should('be.visible').and('contain.text', 'Description')
    cy.get('#additionalChargeModal [placeholder="Type description"]').should('be.visible').type(description) //Description
  }
  enableChargebackOnAC() {
    cy.get('#additionalChargeModal #additional-more-settings.collapsed').if().should('be.visible').and('contain.text', 'More Settings').click()
    cy.get('#additionalChargeModal .col-form-label').eq(1).should('be.visible').and('contain.text', 'Chargeback Protection') //label
    cy.get('#additionalChargeModal [id="additional-charge-payment-request-cb-toggle"]').should('exist').check({ force: true }) //Enable
  }
  selectScheduledTime(index, hour, min) { //dayAfterToday, hour, min
    cy.get('[id="additional-more-settings"].collapsed').should('be.visible').and('contain.text', 'More Settings').click() //More Settings
    cy.get('#additionaltransactionSettings input[placeholder="Select date & time"]').should('be.visible').click() //calender field
    cy.get('.show .calendar .datepicker-day.enable').then(days => {
      if (days.length <= index) {
        cy.get('.show .calendar .datepicker-next').should('be.visible').click() //next
      }
    })
    cy.get('.show .calendar .datepicker-day.enable').eq(index).should('exist').click({ force: true }) //date
    cy.get('.show .time-picker .time-picker-column-hours div button:nth-child(' + (parseInt(hour) + 2) + ')').should('exist').click({ force: true }) //Hour 23
    cy.get('.show .time-picker .time-picker-column-minutes div button:nth-child(' + (parseInt(min) + 2) + ')').should('exist').click({ force: true }) //Min 59
    cy.get('.show .datepicker-button.validate').should('exist').click({ force: true }).wait(1000) //TICK
  }
  clickChargeNowOnACModal() {
    cy.get('#additionalChargeModal [class="btn btn-sm btn-primary pl-3 pr-4"]').should('be.visible').and('contain.text', 'Charge Now').click() // Charge Now 
  }
  clickSendPaymentLinkOnAC() {
    cy.get('#additionalChargeModal .dropdown-item').eq(0).should('contain.text', 'Send Payment Link').click({ force: true })
  }
  clickScheduleChargeOnAc() {
    cy.get('#additionalChargeModal .dropdown-item').eq(1).should('contain.text', 'Schedule Charge').click({ force: true })
  }
  addCConAdditionalCharge(creditCard, noCard) {
    cy.get('[id*="additionalChargeNowModal-"].show .modal-title').should('be.visible').and('contain.text', 'Payment Method') //heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[href="#newPaymentMethod"][role="button"][aria-expanded="false"]').if().should('be.visible').and('contain.text', 'Add Card').click()
    if (noCard === true) {
      cy.get('#card-element').should('be.visible').and('not.have.attr', 'disabled').wait(2000)
      // Add no card detail
    } else {
      cy.wait(4000)
      cy.get('#card-element').within(() => {
        cy.fillElementsInput('cardNumber', creditCard)
        cy.fillElementsInput('cardExpiry', '1028') // MMYY
        cy.fillElementsInput('cardCvc', '123')
        cy.fillElementsInput('postalCode', '90210')
      })
    }
    cy.get('[id*="additionalChargeNowModal-"].show [class="btn btn-sm btn-primary"]').should('be.visible').and('contain.text', 'Charge Now').click() //Charge now
  }
  validateBookingLog(trxType, message) {
    cy.get('.activity-log-table td:nth-child(2)').contains(trxType)
      .parents('.activity-log-table tr').find('.activelog-desc').should('contain.text', message)
  }
  validateACTrxStatus(trxStatus) {
    cy.get('.grid-item-title').contains('Additional Charges')
      .parents('.grid-item-content').find('.badge').should('contain.text', trxStatus)
  }
  validateChargebackStatusOnAC(threeDSStatus) {
    if (threeDSStatus === 'pending') {
      cy.get('.grid-item-title').contains('Additional Charges')
        .parents('.grid-item-content').find('.fa-shield-alt').should('have.class', 'text-muted').and('be.visible')
    }
    if (threeDSStatus === 'applied') {
      cy.get('.grid-item-title').contains('Additional Charges')
        .parents('.grid-item-content').find('.fa-shield-alt').should('have.class', 'text-primary').and('be.visible')
    }
  }
  getAuthlinkOnAdditionalCharge() {
    cy.get('.grid-item-title').contains('Additional Charges')
      .parents('.status-grid-item').find('.dropdown-toggle').should('be.visible').click() //Dropdown
    cy.intercept('POST', '/client/v2/resend-email-link').as('resendEmailLink')
    // Trigger the action to copy the link
    cy.get('[class*="dropdown-menu-right translate show"] .dropdown-item').contains('Copy Authentication Link (URL)').should('be.visible').click()
    // Wait for the API call to complete
    cy.wait('@resendEmailLink').then((interception) => {
      const responseData = interception.response.body
      const authLink = responseData.data  // Extract the url
      cy.wrap(authLink).as('authLink')
    })
  }
  visitCopyLinkURLOnAdditionalCharge() {
    cy.get('.grid-item-title').contains('Additional Charges')
      .parents('.status-grid-item').find('.dropdown-toggle').should('be.visible').click() //Dropdown
    cy.intercept('POST', '/client/v2/additional-charge-request-link').as('acRequestLink')
    // Trigger the action to copy the link
    cy.get('[class*="dropdown-menu-right translate show"] .dropdown-item').contains('Copy Link (URL)').should('be.visible').click()
    // Wait for the API call to complete
    cy.wait('@acRequestLink').then((interception) => {
      const responseData = interception.response.body
      const linkURL = responseData.data  // Extract the url
      // Visit the authentication link
      cy.visit(linkURL)

    })
  }
  clickCopyAuthLinkOnBooking(trxType) {
    cy.get('.grid-item-title').contains(trxType)
      .parents('.status-grid-item').find('.dropdown-toggle').should('be.visible').click() //Dropdown
    // Trigger the action to copy the link
    cy.get('[class*="dropdown-menu-right translate show"] .dropdown-item').contains('Copy Link (URL)').should('be.visible').click()

  }
  clickChargeNow(transactionType) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.grid-item-title').contains(transactionType)
      .parents('.status-grid-item').find('.dropdown-toggle').should('be.visible').click() //Dropdown
    //Try to charge the AC using Charge Now
    cy.get('[class*="dropdown-menu-right translate show"] .dropdown-item').contains('Charge Now').should('be.visible').click().wait(1000)
    cy.get('.view-edit-title').should('be.visible').and('contain.text', 'Are you sure you want to charge the payment now?')
    cy.get('.swal2-cancel').should('be.visible').and('contain.text', 'Cancel')
    cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Yes').click() //Yes
  }
  clickAuthorizeNow(transactionType) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.grid-item-title').contains(transactionType)
      .parents('.status-grid-item').find('.dropdown-toggle').should('be.visible').click() //Dropdown
    //Authorize Now option
    cy.get('[class*="dropdown-menu-right translate show"] .dropdown-item').contains('Authorize Now').should('be.visible').click().wait(1000)
    cy.get('.view-edit-title').should('be.visible').and('contain.text', 'Are you sure you want to authorize the payment now?')
    cy.get('.swal2-cancel').should('be.visible').and('contain.text', 'Cancel')
    cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Yes').click() //Yes
  }
  approve3DSOnStripe() {
    cy.get('@authLink').then(authLink => {
      cy.origin('https://hooks.stripe.com', { args: { authLink } }, ({ authLink }) => {
        cy.visit(authLink)
        cy.wait(4000)

        cy.get('iframe[name*="__privateStripeFrame"]')
          .its('0.contentDocument')
          .its('body')
          .find('iframe[id="challengeFrame"]')
          .its('0.contentDocument')
          .its('body')
          .find('#test-source-authorize-3ds').should('be.visible').click()
        cy.wait(2000)
      })
    })
  }
  chargeNowWithout3DS() {
    cy.get('.grid-item-title').contains('Additional Charges')
      .parents('.status-grid-item').find('.dropdown-toggle').should('be.visible').click() //Dropdown
    cy.get('[class*="dropdown-menu-right translate show"] .dropdown-item').contains('Charge Now (without 3D)').should('be.visible').click()
    cy.get('.swal2-icon-warning .view-edit-title').should('be.visible').and('contain.text', 'Are you sure you want to process this transaction without chargeback protection?')
    cy.get('.swal2-icon-warning .swal2-cancel').should('be.visible').and('contain.text', 'Cancel')
    cy.get('.swal2-icon-warning .swal2-confirm').should('be.visible').and('contain.text', 'Yes').click() //Yes
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  markAsPaidOnAC() {
    cy.get('.grid-item-title').contains('Additional Charges')
      .parents('.status-grid-item').find('.dropdown-toggle').should('be.visible').click() //Dropdown
    cy.get('[class*="dropdown-menu-right translate show"] .dropdown-item').contains('Mark as Paid').should('be.visible').click()
    cy.get('.swal2-icon-warning .view-edit-title').should('be.visible').and('contain.text', 'Are you sure you want to Mark as Paid?')
    cy.get('.swal2-icon-warning .swal2-cancel').should('be.visible').and('contain.text', 'Cancel')
    cy.get('.swal2-icon-warning .swal2-confirm').should('be.visible').and('contain.text', 'Yes').click() //Yes
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  markAdditionalChargeAsVoid() {
    cy.get('.grid-item-title').contains('Additional Charges')
      .parents('.status-grid-item').find('.dropdown-toggle').should('be.visible').click() //Dropdown
    cy.get('[class*="dropdown-menu-right translate show"] .dropdown-item').contains('Void').should('be.visible').click()
    cy.get('.swal2-icon-warning .view-edit-title').should('be.visible').and('contain.text', 'Are you sure you want to void additional charges?')
    cy.get('.swal2-icon-warning .swal2-cancel').should('be.visible').and('contain.text', 'Cancel')
    cy.get('.swal2-icon-warning .swal2-confirm').should('be.visible').and('contain.text', 'Yes').click() //Yes
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  refundAdditionalCharge(updatedAmount) {
    cy.get('.grid-item-title').contains('Additional Charges')
      .parents('.status-grid-item').find('.dropdown-toggle').should('be.visible').click() //Dropdown
    cy.get('[class*="dropdown-menu-right translate show"] .dropdown-item').contains('Refund').should('be.visible').click()
    cy.get('.show h4.modal-title').should('be.visible').and('contain.text', 'Refund Amount')
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.show [id="transactionAmount"]').should('be.visible').invoke('val').then(currentAmount => { cy.wrap(currentAmount).as('currentAmount') })
    cy.get('.show [id="transactionAmount"]').should('be.visible').clear().wait(500)
    cy.get('.show [id="transactionAmount"]').should('be.visible').type(updatedAmount).wait(500).should('contain.value', updatedAmount)
    cy.get('.show [id="description_RA_refund_amount"]').should('be.visible').type('Refunded Amount: ' + updatedAmount).should('contain.value', updatedAmount).wait(500)
    cy.get('.show [id="close-refund"]').should('be.visible').and('contain.text', 'Cancel')
    cy.get('[id="refund_amount"].show [class="btn btn-sm btn-success px-3"]').should('be.visible').and('contain.text', 'Refund').click()

    cy.get('.swal2-icon-warning .view-edit-title').should('be.visible').and('contain.text', 'Are you sure you want to process this refund?')
    cy.get('.swal2-icon-warning .swal2-cancel').should('be.visible').and('contain.text', 'Cancel')
    cy.get('.swal2-icon-warning .swal2-confirm').should('be.visible').and('contain.text', 'Yes, Refund now').click() //Yes
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  processACOnCopiedURL(acStatus, amount, creditCard) {
    cy.get('.badge ').should('be.visible').and('contain.text', acStatus) //AC status
    cy.get('.price').should('be.visible').and('contain.text', amount) //AC Price

    cy.get('.tp-list-title').should('be.visible').and('contain.text', 'Add Card')
    cy.get('[for="full_name"]').should('be.visible').and('contain.text', 'Name On Card')
    cy.get('[for="card-element"]').should('be.visible').and('contain.text', 'Credit/Debit Card')
    cy.get('#card-element').within(() => {
      cy.fillElementsInput('cardNumber', creditCard)
      cy.fillElementsInput('cardExpiry', '1028') // MMYY
      cy.fillElementsInput('cardCvc', '123')
      cy.fillElementsInput('postalCode', '90210')
    })
    cy.get('.text-center.text-muted').should('be.visible').and('contain.text', 'Your card will be authorized or charged according to the due dates')
    cy.get('.btn-success.btn-block').should('be.visible').and('contain.text', 'Pay ' + amount).click()

  }
  updateScheduledDate(transactionType, numberOfdays) { //Number of days after checkinDate
    cy.get('.grid-item-title').contains(transactionType)
      .parents('.grid-item-content').find('#trigger_edit_schedule_date_modal').should('be.visible').click()
    cy.get('#edit_schedule_date_modal.show .modal-title').should('be.visible').and('contain.text', 'Schedule Due Date')
    cy.get('#edit_schedule_date_modal.show [for="changed_date"]').should('be.visible').and('contain.text', 'Select Due Date') //label
    cy.get('.show [id="changed_date"]').should('be.visible').click() //date input field

    const dateSelector = '.show [class="asd__day asd__day--enabled"][style*="color: rgb(86, 90, 92);"]' //active dates
    if (numberOfdays == null) {
      //select current date
      cy.get('.asd__day--today[style*="color: rgb(86, 90, 92);"]').should('be.visible').click()
    } else {
      cy.get(dateSelector).eq(parseInt(numberOfdays) - 1).then(($element) => {
        if ($element.is(':visible')) {
          cy.wrap($element).click() // Click if visible
        } else {
          cy.get('[class="calender-icon"] .asd__change-month-button--next button').should('be.visible').click()// Click the arrow icon to move to next view if element isn't visible
          cy.wrap($element).click() // Click if visible
        }
      })
    }

    cy.get('[id="changed_date"]').should('be.visible').invoke('val').then(updatedDate => { cy.wrap(updatedDate).as('updatedDate') })
    cy.get('#edit_schedule_date_modal.show .btn-success').should('be.visible').and('contain.text', 'Update').click()
    cy.verifyToast('Due date has been updated successfully')
  }
  updateACAmount(newAmount) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.grid-item-title').contains('Additional Charges')
      .parents('.status-grid-item').find('.dropdown-toggle').should('be.visible').click() //Dropdown
    cy.get('[class*="dropdown-menu-right translate show"] .dropdown-item').contains('Change amount').should('be.visible').click()
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#change_amount_modal.show .modal-title').should('be.visible').and('contain.text', 'Change Additional Amount')
    cy.get('#change_amount_modal.show .form-group:nth-child(1)').should('be.visible').and('contain.text', 'Current Amount')
    cy.get('#change_amount_modal.show [aria-describedby="current_amount"]').should('be.visible').invoke('val').then(amount => {
      const truncatedAmount = amount.replace('.00', '')
      cy.wrap(truncatedAmount.trim()).as('oldAmount')
    })
    cy.get('#change_amount_modal.show .form-group:nth-child(2)').should('be.visible').and('contain.text', 'New Amount')
    cy.get('#change_amount_modal.show [placeholder="New Amount"]').should('be.visible').type(newAmount).and('contain.value', newAmount).wait(1000)
    cy.get('#change_amount_modal.show .btn-success').should('be.visible').and('contain.text', 'Change Amount').click()
    cy.get('.view-edit-title').should('be.visible').and('contain.text', 'Are you sure you want to change the transaction amount?')
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Yes').click()
    cy.verifyToast('The transaction amount has been changed successfully.')
  }
  //Search booking
  searchBooking(keyword) {
    cy.get('[id="filter-search"]').should('be.visible').and('attr', 'placeholder', 'Search by keywords').clear().type(keyword, '{ enter }').wait(500)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
  }
  validateSearchResults(keyword) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.wait(1000)
    cy.get('.card-pane .row.no-gutters').then((elements) => {
      if (elements.length === 0) {
        cy.log('No results found') // If No results found
      } else {
        cy.get('.booking-card').should('exist').each(($ele) => {
          cy.wrap($ele).should('contain.text', keyword)  //Each result should be as per keyword
        })
      }
    })

  }
}