
import { LoginPage } from "../pageObjects/LoginPage"

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
    cy.get('.navbar-nav [href="https://master.chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
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
    //Select Property
    cy.get('select[id="assigned_property"]:visible').select(propertyName)  //.should('have.value', '2500' )
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
    cy.get('input[id="first_name"]').eq(0)
      .type("QA")
    cy.get('input[id="last_name"]').eq(0)
      .type("Tester")
    // Enter email
    function generateUserName() {
      let text = "";
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

      for (let i = 0; i < 10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
      return text;
    }
    const generatedUserName = generateUserName()
    cy.get('input[id="email"]')
      .should('have.attr', 'placeholder', 'Email').eq(0)
      .type(generatedUserName + '@mailinator.com') //Add a random email
    //Add Adult, child and nationality
    cy.get('input[id="num_adults"]').eq(0).clear().type(adults)
    cy.get('input[id="num_child"]').eq(0).clear().type(child)
    cy.get('select[id="nationality"]').eq(0).select("Pakistani").wait(2000)
    cy.get('[class="modal-footer mt-3"] [name="Save Changes"]').eq(0).should('be.visible').click()
    cy.get('[class="toast toast-success"]').should('contain.text','Booking added successfully')
  }
  validatePrecheckInStatusAsCompleted() {
    cy.get('.navbar-nav [href="https://master.chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.url().should('include', '/bookings') //validate URL
    cy.get('.booking-card .guest-name span[class="translate"]').eq(0)
      .should('contain.text', 'Pre check-in completed') //Validate first booking Precheckin status
  }
  validatePrecheckinStatusAsIncomplete() {
    cy.get('.navbar-nav [href="https://master.chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
    cy.url().should('include', '/bookings') //validate URL
    cy.get('.page-title.translate').should('contain', 'Bookings')
    cy.get('.booking-card .guest-name span[class="translate"]').eq(0)
      .should('contain.text', 'Pre check-in incomplete') //validate first booking incomplete status
  }
  mailValidation() {
    cy.get('.navbar-nav [href="https://master.chargeautomation.com/client/v2/bookings"]').should('contain.text', 'Bookings').click() //Bookings tab
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
  goToBookingPage()
  {
    cy.get('[href*="chargeautomation.com/client/v2/bookings"]').should('contain.text','Bookings').click().wait(2000)
  }
  addBookingInFutureDate(propertyName, sourceName, adults, child) {
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
        cy.get(todate).eq(2).click({ force: true }) //Select from date - 3 days after from current date
        cy.get('.custom-date-box').eq(0).click()
        cy.wait(1000)
        cy.get(todate).eq(10).click({ force: true }) //Click todate - 7 days after from date
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
    cy.get('input[id="first_name"]').eq(0)
      .type("QA")
    cy.get('input[id="last_name"]')
      .type("Tester").eq(0)
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
    cy.get('[class="toast toast-success"]').should('contain.text','Booking added successfully')
  }
  validateCCCountOnBooking(index)
  {
    cy.get('[id*="add_credit_card_button"]').eq(index).click() //index is booking count from top
    cy.get('#guest_credit_card_modal .modal-title').should('contain.text','Guest Credit Card') //Validate popup heading
    cy.wait(3000)
    
    cy.get('#card-element') //this will shown on popup if no card is added yet
    .if().then(()=>
    {
      const numberOfStoreCards = 0 //Number of added cards are 0
      cy.log("Number of cards on popup: " +numberOfStoreCards)
            cy.get('[id="guest_credit_card_modal_close"]').click() //Cancel button
            cy.get('[id*="add_credit_card_button"]').eq(index).invoke('text').then((text)=>
            {
                cy.log(text)
                 // Use JavaScript string manipulation to extract the number from the text
                const ccCount = parseInt(text.replace(/\D/g, ''), 10);
                cy.log("The CC Count on the booking: " +ccCount)
                expect(numberOfStoreCards).to.equal(ccCount)
            })
    })    
    .else()
    .get('[class="guest-card-wrap"]').its('length').then((count) => { //Count of added CC 
            const numberOfStoreCards = count;
            cy.log("Number of cards on popup: " +numberOfStoreCards)
            cy.get('[id="guest_credit_card_modal_close"]').click() //Close button
            cy.get('[id*="add_credit_card_button"]').eq(index).invoke('text').then((text)=>
            {
                cy.log(text)
                 // Use JavaScript string manipulation to extract the number from the text
                const ccCount = parseInt(text.replace(/\D/g, ''), 10);
                cy.log("The CC Count on the booking: " +ccCount)
                expect(numberOfStoreCards).to.equal(ccCount)
            })
        })
  }
  validateDocCountOnBooking(index)
  {
    cy.get('.booking-card-info [class="btn btn-xs translate"]:nth-child(2)').eq(index).click() //index is booking count from top
        cy.wait(4000)
        var numberOfUploadedDoc = 0
        cy.get('[class="badge badge-success"]')
        .if().should('exist').its('length').then((count1) => { //Count of uploaded verified documents
            numberOfUploadedDoc = count1;
        })
        cy.get('[class="badge badge-warning"]')
        .if().should('exist').its('length').then((count2) => { //Count of uploaded Pending documents
          numberOfUploadedDoc = numberOfUploadedDoc + count2
          cy.log("Number of Uploaded Documents: " +numberOfUploadedDoc)
        })
            cy.get('[id="closeGuestPopup"]').click().wait(1000) //Close button
            cy.get('.booking-card-info [class="btn btn-xs translate"]:nth-child(2)').eq(index).invoke('text').then((text)=>
            {
                cy.log(text)
                 // Use JavaScript string manipulation to extract the number from the text
                const docCount = parseInt(text.replace(/\D/g, ''), 10);
                cy.log("The Document Count on the booking: " +docCount).wait(1000)
                expect(numberOfUploadedDoc).to.equal(docCount)
            })

  }
  
  //Pre-checkins and Guest Portal Links Validations
  clientCompletedPrecheckinGuestPortal()
  {
    cy.log('A client accessing the “Pre Checkin” IF Pre checkin Completed: Direct to Guest Portal!')
        cy.get('[class="small text-success"]') //First Complete precheckin booking
        .parents('[class="for-booking-list-page-only-outer"]')
        .find('[class="fas fa-ellipsis-h"]').eq(0).click() //3dot icon
        cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text','Booking Details') //Booking Detail
        .invoke('attr','href').then((bookingdetail)=>{
            cy.visit("https://master.chargeautomation.com"+bookingdetail) //Visit the booking detail
        }) 
        cy.get('[id="tab_general-guest-experience"]').should('contain.text','Online Check-in').click().wait(2000) //Online Check-in tab
        cy.get('[href*="https://master.chargeautomation.com/pre-checkin/"]').should('contain.text','Visit Pre-Check-In Wizard') //Visit Pre-Check-In Wizard link
        .invoke('attr','href').then((precheckinlink)=>{
            cy.visit(precheckinlink) //Visit the precheckin link will redirects to Guest portal as precheckin is completed
        }) 
        cy.url().should('include','chargeautomation.com/guest-portal/') //Validate the Url
        cy.get('[id="upsell_purchased_tab"]').should('contain.text','Add On Service') //Validate Guest portal Page
  }
  clientIncompletePrecheckinToLastStep()
  {
    cy.log('A client accessing the “Pre Checkin” IF Pre checkin InComplete: Direct to Pre checkin page to last incomplete step in Pre checkin also The client should have “Admin View Mode” and “Live Mode”')
        cy.visit('/client/v2/bookings')
        cy.get('[class="small text-danger"]') //First InComplete Precheckin Booking
        .parents('[class="for-booking-list-page-only-outer"]')
        .find('[class="fas fa-ellipsis-h"]').eq(0).click() //3dot icon
        cy.get('.show [href*="chargeautomation.com/pre-checkin/"]').should('exist')
        .invoke('attr','href').then((link)=>{ //Precheckin link
            const precheckinlink = link
            cy.visit(link) //Visit the precheckin page
            cy.url().should('include','/pre-checkin') //Validate URL
        })
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(4000) //Save button should exists
        cy.contains('Get Started').if().click() //Get started button on precheckin Welcome screen
        cy.get('[class="popup-modal-heading"]').should('be.visible').should('contain.text','You are in View Only Mode').wait(2000) //Heading on popup
        cy.get('[class="btn btn-sm btn-secondary px-3 got-it-btn"]').should('contain.text','Got it').click().wait(1000) //Got it button
        cy.get('[class="button-cover"]').should('contain.text','Admin View-Only Mode').should('contain.text','Live Mode') //Validate Admin & Live Mode option
  }
  clientGuestPortalCompletePrecheckin()
  {
    cy.log('A client accessing the “Guest Portal” link while in session, IF Pre checkin Completed: Direct to Guest Portal')
        cy.visit('/client/v2/bookings')
        cy.get('[class="small text-success"]') //First Complete precheckin booking
        .parents('[class="for-booking-list-page-only-outer"]')
        .find('[class="fas fa-ellipsis-h"]').eq(0).click() //3dot icon
        cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text','Booking Details') //Booking Detail
        .invoke('attr','href').then((bookingdetail)=>{
            cy.visit("https://master.chargeautomation.com"+bookingdetail) //Visit the booking detail
        }) 
        cy.get('[id="tab_general-guest-experience"]').should('contain.text','Online Check-in').click().wait(2000) //Online Check-in tab
        cy.get('[href*="https://master.chargeautomation.com/guest-portal/"]').should('contain.text','Visit Guest Portal') //Visit Guest Portal link
        .invoke('attr','href').then((guestportallink)=>{
            cy.visit(guestportallink) //Visit the guestportal link will redirects to Guest portal as precheckin is completed
        }) 
        cy.url().should('include','chargeautomation.com/guest-portal/') //Validate the Url
        cy.get('[id="upsell_purchased_tab"]').should('contain.text','Add On Service') //Validate Guest portal Page
  }
  clientGuestPortalIncompletePrecheckin()
  {
    cy.log('A client accessing the “Guest Portal” link while in session, IF Pre checkin Incomplete: Direct to Guest Portal (Modal alert to inform client) (You are only able to access this page because you are an admin. Your guests will not be able to access this page until they complete Pre check-in)')
        cy.visit('/client/v2/bookings')
        cy.get('[class="small text-danger"]') //First InComplete Precheckin Booking
        .parents('[class="for-booking-list-page-only-outer"]')
        .find('[class="fas fa-ellipsis-h"]').eq(0).click() //3dot icon
        cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text','Booking Details') //Booking Detail
        .invoke('attr','href').then((bookingdetail)=>{
            cy.visit("https://master.chargeautomation.com"+bookingdetail) //Visit the booking detail
        }) 
        cy.get('[id="tab_general-guest-experience"]').should('contain.text','Online Check-in').click().wait(2000) //Online Check-in tab
        cy.get('[href*="https://master.chargeautomation.com/guest-portal/"]').should('contain.text','Visit Guest Portal') //Visit Guest Portal link
        .invoke('attr','href').then((guestportallink)=>{
            cy.visit(guestportallink) //Visit the guestportal link will redirects to Guest portal as precheckin is incomplete
        }) 
        cy.url().should('include','chargeautomation.com/guest-portal/') //Validate the Url
        //Validate the popup and info
        cy.get('[id="upsell_purchased_tab"]').should('contain.text','Add On Service')
        cy.get('[class="view-edit-desc"]').should('contain.text','You are only able to access this page because you are an admin. Your guests will not be able to access this page until they complete Pre check-in.')
        cy.get('[class="swal2-confirm swal2-styled"]').should('contain.text','OK').click() //OK to close the popup
  }
  guestCompletePrecheckinToGuestPortal()
  {
    cy.log('Guest accessing the “Pre Checkin” link IF Pre checkin Completed: Direct to Guest Portal')
        this.goToBookingPage()
        cy.get('[class="small text-success"]') //First Complete precheckin booking
        .parents('[class="for-booking-list-page-only-outer"]')
        .find('[class="fas fa-ellipsis-h"]').eq(0).click() //3dot icon
        cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text','Booking Details') //Booking Detail
        .invoke('attr','href').then((bookingdetail)=>{
            cy.visit("https://master.chargeautomation.com"+bookingdetail) //Visit the booking detail
        }) 
        cy.get('[id="tab_general-guest-experience"]').should('contain.text','Online Check-in').click().wait(2000) //Online Check-in tab
        cy.get('[href*="https://master.chargeautomation.com/pre-checkin/"]').should('contain.text','Visit Pre-Check-In Wizard') //Visit Pre-Check-In Wizard link
        .invoke('attr','href').then((precheckinlink)=>{
            cy.get('[id="dropdownMenuButton"]').should('exist').click() //Click Profile menu
            cy.get('[class="dropdown-item text-danger"]').should('contain.text','Logout').click().wait(3000)//Logout
            cy.clearCookies() 
            cy.visit(precheckinlink) //Visit the precheckin link will redirects to Guest portal as precheckin is completed
        }) 
        cy.url().should('include','chargeautomation.com/guest-portal/') //Validate the Url
        cy.get('[id="upsell_purchased_tab"]').should('contain.text','Add On Service')
        
  }
  guestIncompletePrecheckinToLastStep()
  {
    cy.log('Guest accessing the “Pre Checkin” IF Pre checkin InComplete: Direct to Pre checkin page to last incomplete step in Pre checkin!')
        cy.visit('/')
        loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal
        this.goToBookingPage()
        cy.get('[class="small text-danger"]') //First InComplete Precheckin Booking
        .parents('[class="for-booking-list-page-only-outer"]')
        .find('[class="fas fa-ellipsis-h"]').eq(0).click() //3dot icon
        cy.get('.show [href*="chargeautomation.com/pre-checkin/"]').should('exist')
        .invoke('attr','href').then((precheckinlink)=>{ //Precheckin link
            cy.get('[id="dropdownMenuButton"]').should('exist').click() //Click Profile menu
            cy.get('[class="dropdown-item text-danger"]').should('contain.text','Logout').click().wait(3000) //Logout
            cy.clearCookies() 
            cy.visit(precheckinlink) //Visit the precheckin page
        })
        cy.url().should('include','/pre-checkin') //Validate URL
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(4000) //Save button should exists
  }
  guestGuestPortalPrecheckinCompleted()
  {
    cy.log('Guest accessing the “Guest Portal” link while in session, IF Pre checkin Completed: Direct to Guest Portal')
        cy.visit('/')
        loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal
        this.goToBookingPage()
        cy.get('[class="small text-success"]') //First Complete precheckin booking
        .parents('[class="for-booking-list-page-only-outer"]')
        .find('[class="fas fa-ellipsis-h"]').eq(0).click() //3dot icon
        cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text','Booking Details') //Booking Detail
        .invoke('attr','href').then((bookingdetail)=>{
            cy.visit("https://master.chargeautomation.com"+bookingdetail) //Visit the booking detail
        }) 
        cy.get('[id="tab_general-guest-experience"]').should('contain.text','Online Check-in').click().wait(2000) //Online Check-in tab
        cy.get('[href*="https://master.chargeautomation.com/guest-portal/"]').should('contain.text','Visit Guest Portal') //Visit Guest Portal link
        .invoke('attr','href').then((guestportallink)=>{
            cy.get('[id="dropdownMenuButton"]').should('exist').click() //Click Profile menu
            cy.get('[class="dropdown-item text-danger"]').should('contain.text','Logout').click().wait(3000) //Logout
            cy.clearCookies()
            cy.visit(guestportallink) //Visit the guestportal link will redirects to Guest portal as precheckin is completed
        }) 
        cy.url().should('include','chargeautomation.com/guest-portal/') //Validate the Url
        cy.get('[id="upsell_purchased_tab"]').should('contain.text','Add On Service')
  }
  guestGuestPortalPrecheckinIncomplete()
  {
    cy.log('Guest accessing the “Guest Portal” link while in session, IF Pre checkin Incomplete: Direct to Pre checkin page to last incomplete step in Pre checkin')
        cy.visit('/')
        loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal
        this.goToBookingPage()
        cy.get('[class="small text-danger"]') //First InComplete Precheckin Booking
        .parents('[class="for-booking-list-page-only-outer"]')
        .find('[class="fas fa-ellipsis-h"]').eq(0).click() //3dot icon
        cy.get('.show [href*="/client/v2/booking-detail/"]').should('contain.text','Booking Details') //Booking Detail
        .invoke('attr','href').then((bookingdetail)=>{
            cy.visit("https://master.chargeautomation.com"+bookingdetail) //Visit the booking detail
        }) 
        cy.get('[id="tab_general-guest-experience"]').should('contain.text','Online Check-in').click().wait(2000) //Online Check-in tab
        cy.get('[href*="https://master.chargeautomation.com/guest-portal/"]').should('contain.text','Visit Guest Portal') //Visit Guest Portal link
        .invoke('attr','href').then((guestportallink)=>{
            cy.get('[id="dropdownMenuButton"]').should('exist').click() //Click Profile menu
            cy.get('[class="dropdown-item text-danger"]').should('contain.text','Logout').click().wait(3000) //Logout
            cy.clearCookies()
            cy.visit(guestportallink) //Visit the guestportal link will redirects to Pre checkin page to last incomplete step in Pre checkin
        }) 
        cy.url().should('include','chargeautomation.com/pre-checkin') //Validate the Url
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(4000) //Save button should exists
  }
}