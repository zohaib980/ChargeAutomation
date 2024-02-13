

import { LoginPage } from "./LoginPage";
import { Dashboard } from "./Dashboard"

const loginPage = new LoginPage
const dashboard = new Dashboard

export class PreCheckIn {

  clickSaveContinue()
  {
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) 
    cy.wait(2000)
  }
  goToBasicInfoTab() {
    cy.get('.page-title.translate').should('contain', 'Bookings').wait(4000) //Booking page heading
    cy.xpath("(//i[@class='fas fa-ellipsis-h'])[2]").click({ force: true }) //3dot on First booking
    cy.get('.show [href*="chargeautomation.com/pre-checkin"]') //Wrap the precheckin link
      .then(($button) => {
        const link = $button.attr('href');
        cy.wrap(link).as('myLink'); //Get pre-checkin link from 1st booking
        cy.log(link)
        loginPage.logout()
        cy.visit(link) //Visit the pre-checkin link
        cy.wait(4000)
        cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').wait(3000)
        cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
        cy.wait(3000)
        // Validate Soruce type
        cy.get('.gp-property-dl > :nth-child(2) > .notranslate')
          .then(($sour) => {
            const sourceType = $sour.text().trim()
            cy.wrap(sourceType).should('eq', sourceType)
          })
        cy.wait(3000)
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
      })
  }
  addBasicInfo() {
    cy.get('[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION') //Validate Basic Info tab heading
    cy.get(':nth-child(1) > .gp-step > .d-none > .translate').should('contain.text', 'Basic Info')
    cy.get('.iti__selected-flag').click() //Select Phone country code
    cy.get('#iti-0__item-pk').contains('Pakistan (‫پاکستان‬‎)').type('{enter}3047557094') //Add Phone
    cy.get('[placeholder="Date of birth"]').should('exist').then((elem) => {
      cy.get(elem).click()
      //Select DOB
      cy.get('[class="vc-title"]').click()
      cy.get('[class*="vc-nav-title"]').click()
      cy.get('[class="vc-nav-arrow is-left"]').dblclick() //Arrow left
      cy.get('[class="vc-nav-item"]').eq(0).click() //year
      cy.get('[class="vc-nav-item"]').eq(0).click() //month
      cy.get('[class*="vc-day-content"]').eq(10).click() //Day
    })
    cy.get('#\\39 ').select('Male')
    cy.get("#update-property-address") //Address 
      .should('have.attr', 'placeholder', 'Please type your address').clear()
      .type('768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan').wait(2000)
    cy.get("#\\31 1").type('54000') //Postal Code
    cy.get('.mt-2 > h4 > .translate').should('have.text', 'GUESTS')
    cy.get('.guest-select-option > :nth-child(1) > .form-group > label > .translate').should('have.text', 'Adults')
    cy.get('.guest-select-option > :nth-child(2) > .form-group > label > .translate')
      .should('have.text', 'Children (2-17 years)')
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue

  }
  addAndValidateBasicInfo() {
    cy.get('[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION') //Validate Basic Info tab heading
    cy.get(':nth-child(1) > .gp-step > .d-none > .translate').should('contain.text', 'Basic Info')
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Click Save to show errors on fields
    cy.get('.invalid-feedback').should('contain', 'Invalid phone number.')
    // Validate invalid Phone Number
    cy.get('.iti__selected-flag').click()
    cy.get('#iti-0__item-pk').contains('Pakistan (‫پاکستان‬‎)')
      .type('{enter}3047557094')
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get('.toast-message').invoke('text')
      .then((resp) => {
        expect(resp).to.equal('Mandatory fields are required.')
      })
    // Validate Field level Validation
    cy.xpath('(//small[normalize-space()="Date of Birth is required."])[1]').should('contain', 'Date of Birth is required.')
    cy.xpath('//small[normalize-space()="Gender is required."]').should('contain', 'Gender is required.')
    cy.xpath('//small[normalize-space()="Address is required."]').should('contain', 'Address is required.')
    cy.xpath('//small[normalize-space()="Zip Code is required."]').should('contain', 'Zip Code is required.')
    cy.get('.mt-2 > h4 > .translate').should('have.text', 'GUESTS')
    // Validate Adults
    cy.get('.guest-select-option > :nth-child(1) > .form-group > label > .translate')
      .should('have.text', 'Adults')
    cy.get('#guestAdults').invoke('val')
      .then((text) => {
        const adults = text;
        cy.wrap(adults).should('eq', '2')
        cy.get('[data-test="basicAdultPlus"]').click({ force: true })
        cy.get('#guestAdults').invoke('val')
          .then((text) => {
            const afterAddAdults = text;
            cy.wrap(afterAddAdults).should('eq', '3')
          })
      })
    // Validate Childs
    cy.get('.guest-select-option > :nth-child(2) > .form-group > label > .translate')
      .should('have.text', 'Children (2-17 years)')
    cy.get('[data-test="basicChildrenInput"]').invoke('val')
      .then((text) => {
        const child = text;
        cy.wrap(child).should('eq', '1')
        cy.get('[data-test="basicChildrenPlus"]').click({ force: true })
        cy.get('[data-test="basicChildrenInput"]').invoke('val')
          .then((text) => {
            const afterAddChild = text;
            cy.wrap(afterAddChild).should('eq', '2')
          })
      })
    cy.get('.badge').should('contain', '5')
    // Enter all the data into fields
    cy.get('[placeholder="Date of birth"]').should('exist').then((elem) => {
      cy.get(elem).click()
      //Select DOB
      cy.get('[class="vc-title"]').click()
      cy.get('[class*="vc-nav-title"]').click()
      cy.get('[class="vc-nav-arrow is-left"]').dblclick() //Arrow left
      cy.get('[class="vc-nav-item"]').eq(0).click() //year
      cy.get('[class="vc-nav-item"]').eq(0).click() //month
      cy.get('[class*="vc-day-content"]').eq(10).click() //Day
    })
    cy.get("#\\39 ").select('Male') //Gender
    cy.get("#update-property-address").should('have.attr', 'placeholder', 'Please type your address').clear()
      .type('768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan').wait(2000) //Add Address
    cy.get("#\\31 1").type('54000') //Postal Code
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    cy.get('[data-test="questionnaireDesc"]').should('have.text', 'Please answer the below Questions.') //Validate the Questionnarie heading
  }
  fillAndValidatePreCheckinQuestionnier() {
    //Fill and validate Questionnier
    cy.get('[data-test="questionnaireDesc"]').should('have.text', 'Please answer the below Questions.') //Validate the Questionnarie heading
    //cy.get("span[class='translate'] font font").should('have.text', 'Some Importent Questions!')
    cy.get('[data-test="questionnaireDesc"]').should('have.text', 'Please answer the below Questions.').wait(3000)
    // Validate all the Questions
    cy.get('[data-test="questionnaireLabel103"]').should('contain', 'Enter note about any suggestion?*')
    cy.get('[data-test="questionnaireLabel108"]').should('contain', 'Date Question')
    cy.get('[data-test="questionnaireLabel109"]').should('contain', 'Alternate Phone Number')
    cy.get('[data-test="questionnaireLabel110"]').should('contain', 'Email')
    cy.get('[data-test="questionnaireLabel111"]').should('contain', 'Do you need an extra bed?')
    cy.get('[data-test="questionnaireLabel112"]').should('contain', 'How many beds do you need?')
    cy.get('[data-test="questionnaireLabel113"]').should('contain', 'Provide some basic infos')
    cy.get('[data-test="questionnaireLabel114"]').should('contain', 'Choose your breakfast')
    cy.get('[data-test="questionnaireLabel115"]').should('contain', 'What facilities do you need?')
    cy.get('[data-test="questionnaireLabel116"]').should('contain', 'Upload your ID?')
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    // Validate Mandatory Fields
    cy.get('.invalid-feedback > span').should('contain', 'Answer is required.')
    cy.get('#question-103').should('have.attr', 'placeholder', 'Type your answer').clear().type('This is Automation Testing')
    // Enter Phone Number
    cy.get('.iti__selected-flag').click()
    cy.get('#iti-0__item-pk').contains('Pakistan (‫پاکستان‬‎)').type('{enter}304')
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get('.toast-message').invoke('text')
      .then((resp) => {
        expect(resp).to.equal('Invalid phone number')
      })
    cy.get('.iti__selected-flag').click()
    cy.get('#iti-0__item-pk').contains('Pakistan (‫پاکستان‬‎)').type('{selectall}+923047557094')
    // Validate Email field Validations
    cy.get('#question-110').should('have.attr', 'placeholder', 'Type your answer').clear().type('automationmailinator.com')
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get('.text-danger > span').should('contain', 'Answer must be a valid email address.')
    cy.get('#question-110').clear().type('automation@mailinator.com')
    // Validate number range
    cy.get('[data-test="questionairNumber112"]').type('6')
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get(':nth-child(8) > .row > .col-12 > .form-group > .text-danger > span').should('contain', 'Number must be within the range of 1 to 5.')
    // Enter Date
    cy.xpath('(//input[@id="date_trigger_sync108"])[1]').click()
    cy.get('[class*="vc-day-content"]').eq(8).click()
    // Choose Boolean
    cy.get('#question-111-0').should('not.be.checked').click({ force: true })
    // Enter value in Number Field
    cy.get('#question-112').should('have.attr', 'placeholder', 'Type your answer').clear().type('2')
    // Enter text into Text Area
    cy.get('#question-113').should('have.attr', 'placeholder', 'Type your answer').clear().type('This is Test Automation Testing Some Basic Infos')
    // Validate Radio Button
    cy.get('#question-114-0').should('not.be.checked').click({ force: true })
    // Validate CheckBoxes
    cy.get('#checkbox-115-0').should('not.be.checked').check({ force: true }).should('be.checked')
    cy.get('#checkbox-115-1').should('not.be.checked').check({ force: true }).should('be.checked')
    cy.get('#checkbox-115-2').should('not.be.checked').check({ force: true }).should('be.checked')
    // Upload Image
    cy.get('input[data-test="questionaireFile116"]').attachFile('Images/testImage.jpeg').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION')
  }
  fillQuestionnaires() {
    //cy.get("span[class='translate'] font font").should('have.text', 'Some Importent Questions!')
    cy.get('[data-test="questionnaireDesc"]').should('have.text', 'Please answer the below Questions.')
    // Enter Note
    cy.get('#question-103').should('have.attr', 'placeholder', 'Type your answer').clear().type('This is Automation Testing')
    // Enter Date
    cy.xpath('(//input[@id="date_trigger_sync108"])[1]').click()
    cy.get('[class*="vc-day-content"]').eq(8).click()
    // Enter Phone Number
    cy.get('.iti__selected-flag').click()
    cy.get('#iti-0__item-pk').contains('Pakistan (‫پاکستان‬‎)').type('{enter}+923047557094')
    // Enter Email
    cy.get('#question-110').should('have.attr', 'placeholder', 'Type your answer').clear().type('automation@mailinator.com')
    // Choose Boolean
    cy.get('#question-111-0').should('not.be.checked').click({ force: true })
    // Enter value in Number Field
    cy.get('#question-112').should('have.attr', 'placeholder', 'Type your answer').clear().type('2')
    // Enter text into Text Area
    cy.get('#question-113').should('have.attr', 'placeholder', 'Type your answer').clear().type('This is Test Automation Testing Some Basic Infos')
    // Validate Radio Button
    cy.get('#question-114-0').should('not.be.checked').click({ force: true })
    // Validate CheckBoxes
    cy.get('#checkbox-115-0').should('not.be.checked').check({ force: true }).should('be.checked')
    cy.get('#checkbox-115-1').should('not.be.checked').check({ force: true }).should('be.checked')
    cy.get('#checkbox-115-2').should('not.be.checked').check({ force: true }).should('be.checked')
    // Upload Image
    cy.get('input[data-test="questionaireFile116"]').attachFile('Images/testImage.jpeg').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION')
  }
  fillAndValidatePreCheckinArrival() {
    //Fill and validate Arrival Info
    // Arrival by Car with time 12:00
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION')
    cy.get('label[for="guestArrivalMethod"]').should('have.text', 'Arriving By')
    cy.get("#guestArrivalMethod").select('Car')
    cy.wait(2000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time')
    cy.get("#standard_check_in_time").select('12:00')
    cy.wait(2000)
    // Arrival by Other Validation
    cy.get("#guestArrivalMethod").select('Other')
    cy.wait(2000)
    cy.get("#standard_check_in_time").select('10:00')
    cy.wait(2000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get('.form-text.text-danger').should('contain', 'Other detail is required.')
    cy.get('#other').type('Testing Arrival by Other')
    // Arrival By Flight
    cy.get("#guestArrivalMethod").select('Flight')
    cy.wait(2000)
    cy.get('#flightNumber').type('PIA-9669')
    cy.get("#standard_check_in_time").select('10:30')
    cy.wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    //Document verification
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload copy of valid Driver License')
  }
  selectArrivalBy(arriveBy) {
    //Fill and validate Arrival Info
    // Arrival by Car with time 12:00
    if (arriveBy == "Car") {
      cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION')
      cy.get('label[for="guestArrivalMethod"]').should('have.text', 'Arriving By')
      cy.get("#guestArrivalMethod").select('Car')
      cy.wait(2000)
      cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time')
      cy.get("#standard_check_in_time").select('12:00')
      cy.wait(2000)
    } else if (arriveBy == "Other") {
      // Arrival by Other Validation
      cy.get("#guestArrivalMethod").select('Other')
      cy.get('input[placeholder="Other details"]').should('exist').type('Testing Arrival by Other')
      cy.wait(2000)
      cy.get("#standard_check_in_time").select('12:00')
    } else if (arriveBy == "Flight") {
      // Arrival By Flight
      cy.get("#guestArrivalMethod").select('Flight')
      cy.wait(2000)
      cy.get('#flightNumber').type('PIA-9669')
      cy.get("#standard_check_in_time").select('12:00')
    }
    cy.wait(2000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload copy of valid Driver License') //Verification tab
  }
  goToDocVerification() {
    cy.get('.page-title.translate').should('contain', 'Bookings').wait(2000)
    cy.xpath("(//i[@class='fas fa-ellipsis-h'])[2]") //3dot on first booking
      .click({ force: true })
    cy.get('.show [href*="chargeautomation.com/pre-checkin"]') //Wrap the precheckin link
      .then(($button) => {
        const link = $button.attr('href');
        cy.wrap(link).as('myLink');
        cy.log(link)
        // User will logout from the portal and will open CheckIn link
        loginPage.logout()
        cy.visit(link)
        cy.wait(4000)
        cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').wait(3000)
        cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
        cy.wait(3000)
        // Validate Soruce type
        cy.get('.gp-property-dl > :nth-child(2) > .notranslate')
          .then(($sour) => {
            const sourceType = $sour.text().trim()
            expect(sourceType).to.equal(sourceType);
          })
        cy.wait(3000)
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save and Continue on Welcome tab
        cy.get('[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION') //Validate Basic Info tab heading
        this.addBasicInfo()
        // Enter Note in mandatory field on Questionnaire
        cy.get('#question-103').should('have.attr', 'placeholder', 'Type your answer').clear().type('This is Automation Testing')
        cy.wait(3000)
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue on Questionnarie
        cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION')//Validate ARRIVAL INFORMATION Heading
        cy.wait(4000)
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save& Continue on ARRIVAL INFORMATION tab
        //Here the user will be directed to VERIFICATION tab

      })
  }
  addAndValidateIdCard() {
    cy.get('[for="drivers_license"]').should('contain', "Driver's License")
    cy.get('[for="id_card"]').should('contain', 'ID Card')
    cy.get('#id_card').should('not.be.checked').click({ force: true }).wait(2000)
    cy.xpath('//label[normalize-space()="Upload ID Card Front"]').should('contain', 'Upload ID Card Front') //Validate upload buttons
    cy.xpath('//label[normalize-space()="Upload ID Card Back"]').should('contain', 'Upload ID Card Back')
    cy.xpath('//span[normalize-space()="Upload Credit Card"]').should('contain', 'Upload Credit Card')
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }).wait(1000)
    cy.get(':nth-child(2) > .form-text').should('contain', 'Identification front side is required.')
    cy.get(':nth-child(3) > .form-text').should('contain', 'Identification back side is required.')
    cy.get(':nth-child(4) > .form-text').should('contain', 'Credit card is required.')
    // Validate png type images.
    const idFront = 'Images/idCardFront.png'
    cy.get("input[data-notify-id='id_card_front_uploaded']").attachFile(idFront).wait(3000)
    const backImage = 'Images/idCardBack.png'
    cy.get("input[data-notify-id='id_card_back_uploaded']").attachFile(backImage)
    cy.wait(3000)
    const cardImage = 'Images/visaCard.png'
    cy.get("#credit_card_file").attachFile(cardImage)
    cy.wait(5000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Click Save & Continue
    //Validate Selfie tab heading
    cy.get('div[class="gp-box gp-box-of-inner-pages"] p:nth-child(1)').should('have.text', 'Take a selfie to authenticate your identity')
  }
  addAndValidateDrivingDoc() {
    cy.get('[for="drivers_license"]').should('contain', "Driver's License")
    cy.get('[for="id_card"]').should('contain', 'ID Card')
    cy.get('.doc-wrap > :nth-child(2) > div > .btn').should('contain', "Upload Driver's License Front")
    cy.get(':nth-child(3) > div > .btn').should('contain', "Upload Driver's License Back")
    cy.get('.fileUpload').should('contain', 'Upload Credit Card')
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }).wait(1000)
    cy.get(':nth-child(2) > .form-text').should('contain', 'Identification front side is required.')
    cy.get(':nth-child(3) > .form-text').should('contain', 'Identification back side is required.')
    cy.get(':nth-child(4) > .form-text').should('contain', 'Credit card is required.')
    // Validate Png type image
    const frontImage = 'Images/front.pdf'
    cy.get("input[data-notify-id='drivers_license_front_uploaded']").attachFile(frontImage).wait(3000)
    const backImage = 'Images/back.pdf'
    cy.get("input[data-notify-id='drivers_license_back_uploaded']").attachFile(backImage).wait(3000)
    const cardImage = 'Images/card.pdf'
    cy.get("#credit_card_file").attachFile(cardImage)
    cy.wait(5000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get('div[class="gp-box gp-box-of-inner-pages"] p:nth-child(1)').should('have.text', 'Take a selfie to authenticate your identity')
  }
  addIDAndCreditCard() {
    cy.get(".form-section-title").should('contain.text', 'copy of valid Driver License') //Validate Heading
    cy.wait(3000)
    cy.get('#id_card').if().should('not.be.checked').click({ force: true }).wait(2000) //ID checkbox
    // Validate png type images.
    const idFront = 'Images/idCardFront.png'
    cy.get("input[data-notify-id='id_card_front_uploaded']").should('exist').attachFile(idFront).wait(3000)
    const backImage = 'Images/idCardBack.png'
    cy.get("input[data-notify-id='id_card_back_uploaded']").should('exist').attachFile(backImage)
    cy.wait(3000)
    const cardImage = 'Images/visaCard.png'
    cy.get("#credit_card_file").attachFile(cardImage)
    cy.wait(5000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Click Save & Continue
    //Validate Selfie tab heading
    cy.get('div[class="gp-box gp-box-of-inner-pages"] p:nth-child(1)').should('have.text', 'Take a selfie to authenticate your identity')
  }
  takeSelfy() {
    cy.get('div[class="gp-box gp-box-of-inner-pages"] p:nth-child(1)').should('have.text', 'Take a selfie to authenticate your identity')
    cy.wait(3000)
    cy.get('.camera-button-container > .btn-success').click({ force: true })
    cy.wait(2000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //Validate the Guest tab Heading

  }
  addValidateNewGuest() {
    cy.get('div[class="gp-box gp-box-of-inner-pages page-tab-01 pre-checkin-tabs"] h4:nth-child(1)').should('contain.text', 'Guest Details')
    cy.get('table[class="table guest-table"] h6[class="guest-name"]').should('have.text', 'QA Tester').wait(3000)
    cy.get('button[data-target="#addGuestModal"]').click({ force: true }) //Add Guest Button
    cy.get('#newGuestModel').should('have.text', 'Guest')
    // Validation
    cy.get('button[class="btn btn-success btn-sm px-3"]').click({ force: true })
    cy.get('.toast-message').invoke('text')
      .then((resp) => {
        expect(resp).to.equal('The given data was invalid.')
      })
    cy.get(':nth-child(1) > .form-text').should('contain', 'The name field is required.')
    cy.get(':nth-child(2) > .form-text').should('contain', 'The email field is required.')
    cy.get(':nth-child(1) > label').should('contain', 'Full Name*').wait(3000)
    cy.get("input[placeholder='Full name']")
      .should('have.attr', 'placeholder', 'Full name')
      .type('QA Guest')
    cy.get(':nth-child(2) > label').should('contain', 'Email*')
    cy.get("input[placeholder='Email']")
      .should('have.attr', 'placeholder', 'Email')
      .type('qaguest@mailinator.com')
    cy.get('#cancelButtonOfNewGuestModal').should('be.visible')
    cy.get('button[class="btn btn-success btn-sm px-3"]').click({ force: true })
    cy.get('.toast-success > .toast-message').invoke('text')
      .then((resp) => {
        expect(resp).to.equal('Guest added Successfully')
      })
    cy.wait(3000)
    //Validate Added guest
    cy.get('tr td .guest-name').filter(':contains("QA Guest")').should('contain', 'QA Guest')
    cy.get('td span[class="guest-email"]').filter(':contains("qaguest@mailinator.com")').should('exist');
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
  }
  deleteGuest() {
    this.addValidateNewGuest() //Add a new guest
    cy.get('.col > .lead > .translate').should('contain.text', 'Add-on Services') //Validate heading
    cy.get('[class="btn btn-default d-none d-md-inline-block"]').should('exist').click() //Back to guest
    // Delete Added Guest
    cy.get('h6:contains("QA Guest")').parents('tr').find('button.guest-delete').should('exist').click() //Click delete on QA Guest
    cy.get('.view-edit-title').should('contain', 'Do you want to delete this Guest?')
    cy.get('.swal2-cancel').should('be.visible')
    cy.get('.swal2-confirm').should('be.visible').click({ force: true }).wait(3000)
    cy.get(':nth-child(1) > .toast-message').invoke('text')
      .then((resp) => {
        expect(resp).to.equal('Guest deleted Successfully')
      })
  }
  editGuestDetail(guestType) {
    cy.get('div[class="gp-box gp-box-of-inner-pages page-tab-01 pre-checkin-tabs"] h4:nth-child(1)').should('contain.text', 'Guest Details') //Guest Detail Heading
    cy.get('table[class="table guest-table"] h6[class="guest-name"]').eq(0).should('contain.text', 'QA Tester').wait(2000) //Main Adult Guest
    cy.get('td:contains("Incomplete")').eq(0).parents('tr').find('button.guest-edit').should('exist').click() //Edit First incomplete guest
    cy.get('#exampleModalLabel > span').should('contain', guestType).wait(3000)
    cy.xpath('(//input[@id="6"])[1]').clear().type('Test Guest')
    cy.get('.iti__selected-flag').click()
    cy.get('#iti-0__item-pk').contains('Pakistan (‫پاکستان‬‎)').type('{enter}3047557094')
    cy.get('[placeholder="Date of birth"]').should('exist').then((elem) => {
      cy.get(elem).click()
      //Select DOB
      cy.get('[class="vc-title"]').click()
      cy.get('[class*="vc-nav-title"]').click()
      cy.get('[class="vc-nav-arrow is-left"]').dblclick() //Arrow left
      cy.get('[class="vc-nav-item"]').eq(0).click() //year
      cy.get('[class="vc-nav-item"]').eq(0).click() //month
      cy.get('[class*="vc-day-content"]').eq(10).click() //Day
    })
    cy.xpath('(//select[@id="8"])[1]').select("Pakistani")
    // Enter email
    function generateUserName() {
      let text = "";
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

      for (let i = 0; i < 10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
      return text;
    }
    const generatedUserName = generateUserName()
    cy.xpath('(//input[@id="1"])[1]')
      .should('have.attr', 'placeholder', 'Email address')
      .clear()
      .type(generatedUserName + '@mailinator.com')
    cy.xpath('(//select[@id="9"])[1]').select('Female')
    cy.xpath('//input[@id="update-property-address"]').clear()
      .type('768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan').wait(2000)
    cy.xpath('(//input[@id="11"])[1]').clear().type('54000')
    cy.get('button[class="btn btn-success btn-sm"]').click({ force: true }).wait(4000)
    cy.get('.toast-message').should('contain.text', 'Data saved Successfully.') //Success toast
    //validate changes saved correctly
    cy.get('td h6[class="guest-name"]').filter(':contains("Test Guest")').should('have.text', 'Test Guest')
    cy.get('tr td .guest-email').filter(':contains("' + generatedUserName + '@mailinator.com")').should('contain', generatedUserName + '@mailinator.com');
    cy.get('td [class="badge badge-success"]').eq(1).should('contain', 'Completed') //Validated 2nd guest status
  }
  editGuestDetailAddIDCard(guestType) {
    cy.get('div[class="gp-box gp-box-of-inner-pages page-tab-01 pre-checkin-tabs"] h4:nth-child(1)').should('contain.text', 'Guest Details') //Guest Detail Heading
    cy.get('table[class="table guest-table"] h6[class="guest-name"]').eq(0).should('contain.text', 'QA Tester').wait(2000) //Main Adult Guest
    cy.get('td:contains("Incomplete")').eq(0).parents('tr').find('button.guest-edit').should('exist').click() //Edit First incomplete guest
    //Add Guest Detail
    cy.get('#exampleModalLabel > span').should('contain', guestType).wait(3000)
    cy.xpath('(//input[@id="6"])[1]').clear().type('Test Guest')
    cy.get('.iti__selected-flag').click()
    cy.get('#iti-0__item-pk').contains('Pakistan (‫پاکستان‬‎)').type('{enter}3047557094')
    cy.get('[placeholder="Date of birth"]').should('exist').then((elem) => {
      cy.get(elem).click()
      //Select DOB
      cy.get('[class="vc-title"]').click()
      cy.get('[class*="vc-nav-title"]').click()
      cy.get('[class="vc-nav-arrow is-left"]').dblclick() //Arrow left
      cy.get('[class="vc-nav-item"]').eq(0).click() //year
      cy.get('[class="vc-nav-item"]').eq(0).click() //month
      cy.get('[class*="vc-day-content"]').eq(10).click() //Day
    })
    cy.xpath('(//select[@id="8"])[1]').select("Pakistani")
    // Enter email
    function generateUserName() {
      let text = "";
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

      for (let i = 0; i < 10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
      return text;
    }
    const generatedUserName = generateUserName()
    cy.xpath('(//input[@id="1"])[1]')
      .should('have.attr', 'placeholder', 'Email address')
      .clear()
      .type(generatedUserName + '@mailinator.com')
    cy.xpath('(//select[@id="9"])[1]').select('Female')
    cy.xpath('//input[@id="update-property-address"]').clear()
      .type('768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan').wait(2000)
    cy.xpath('(//input[@id="11"])[1]').clear().type('54000')
    //Add ID card
    cy.xpath("//span[normalize-space()='ID Card (Front Side)']").should('have.text', 'ID Card (Front Side)')
    cy.xpath("//span[normalize-space()='ID Card (Back Side)']").should('have.text', 'ID Card (Back Side)')
    cy.xpath("(//input[@id='id_card_front_file'])[2]")
      .attachFile('Images/idCardFront.png').wait(3000) //Attaching front ID
    cy.xpath("(//input[@id='id_card_back_file'])[2]")
      .attachFile('Images/idCardBack.jpeg') //Attaching Back ID
    cy.wait(3000)
    //Save the changes
    cy.get('button[class="btn btn-success btn-sm"]').click({ force: true }).wait(4000)
    cy.get('.toast-message').should('contain.text', 'Data saved Successfully.') //Success toast
    //validate changes saved correctly
    cy.get('td h6[class="guest-name"]').filter(':contains("Test Guest")').should('have.text', 'Test Guest')
    cy.get('tr td .guest-email').filter(':contains("' + generatedUserName + '@mailinator.com")').should('contain', generatedUserName + '@mailinator.com');
    cy.get('td [class="badge badge-success"]').eq(1).should('contain', 'Completed') //Validated 2nd guest status
  }
  setAsMainGuest() {
    cy.get('td:contains("Complete")').eq(1).parents('tr').find('button.guest-edit').should('exist').click() //Edit 2nd Complete status guest
    cy.get('.toggle-switch').click().wait(3000) //Enable the toggle to mark as main guest
    cy.get('button[class="btn btn-success btn-sm"]').click({ force: true }).wait(3000) //Save 
    cy.get('.toast-message').should('contain.text', 'Data saved Successfully.') //Success toast
  }
  goToGuestShareLink() {
    //Go to the guest share link
    cy.wait(2000)
    cy.get('td:contains("Incomplete")').eq(0).parents('tr').find('button.guest-share').click() //First Incomplete Guest
    cy.get('.input-group-append > .btn').click() //Copy Link
    cy.wait(3000)
    cy.get('#shareBookingModal_linkCopyInput').invoke('val').as('inputValue');
    cy.get('@inputValue')
      .then((regLink) => {
        cy.log(regLink)
        cy.visit(regLink) //Visit the link
      })
  }
  guestRegistration(propName) {
    cy.get("div[class='signup-upper'] h2").should('contain', 'Guest Registration') //Guest Registration Modal Heading
    cy.get("div[class='signup-upper'] p")
      .should('contain', 'The following pre check-in details are required to be completed for ' + propName)
    cy.xpath("(//input[@id='6'])[1]")
      .should('have.attr', 'placeholder', 'Full name').clear()
      .type('SQA Tester')
    cy.get(".iti__selected-flag").click()
    cy.get("#iti-0__item-pk").contains('Pakistan (‫پاکستان‬‎)')
      .type('{enter}3047557094')
    cy.get('[placeholder="Date of birth"]').should('exist').then((elem) => {
      cy.get(elem).click()
      //Select DOB
      cy.get('[class="vc-title"]').click()
      cy.get('[class*="vc-nav-title"]').click()
      cy.get('[class="vc-nav-arrow is-left"]').dblclick() //Arrow left
      cy.get('[class="vc-nav-item"]').eq(0).click() //year
      cy.get('[class="vc-nav-item"]').eq(0).click() //month
      cy.get('[class*="vc-day-content"]').eq(10).click() //Day
    })
    cy.xpath("(//select[@id='8'])[1]")
      .select('Pakistani')
    // Email Generator
    function generateUserName() {
      let text = "";
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

      for (let i = 0; i < 10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
      return text;
    }
    const generatedUserName = generateUserName()
    cy.xpath("(//input[@id='1'])[1]")
      .should('have.attr', 'placeholder', 'Email address').clear()
      .type(generatedUserName + '@mailinator.com')
    cy.xpath("(//select[@id='9'])[1]")
      .select('Female')
    cy.get("#update-property-address")
      .should('have.attr', 'placeholder', 'Please type your address').clear()
      .type('768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan').wait(3000)
    cy.xpath("(//input[@id='11'])[1]")
      .should('have.attr', 'placeholder', 'Zip code').clear().type('54000')
    cy.get("button[class='btn btn-primary btn-sm']") //Submit button
      .should('be.visible').click({ force: true })
    cy.wait(5000)
    cy.get('.toast-message').should('contain.text', 'Data saved Successfully.') //Success toast
  }
  guestRegValidations(propName) {
    cy.get("div[class='signup-upper'] h2").should('contain', 'Guest Registration')
    cy.get("div[class='signup-upper'] p")
      .should('contain', 'The following pre check-in details are required to be completed for ' + propName)
    // Validate all the fields
    cy.xpath("//label[@for='6']").should('contain', "Full Name")
    cy.xpath("//label[@for='2']").should('contain', "Phone Number")
    cy.xpath("//label[@for='7']").should('contain', "Date of Birth")
    cy.xpath("//label[@for='8']").should('contain', "Nationality")
    cy.xpath("//label[@for='1']").should('contain', "Email Address")
    cy.xpath("//label[@for='9']").should('contain', "Gender")
    cy.xpath("//label[@for='10']").should('contain', "Address")
    cy.xpath("//label[@for='11']").should('contain', "Zip Code")
    // Validate Field Validations
    cy.get("button[class='btn btn-primary btn-sm']")
      .should('be.visible').click({ force: true })
    cy.get('.invalid-feedback').should('contain', 'Phone number is required')
    cy.get(".iti__selected-flag").click()
    cy.get("#iti-0__item-pk")
      .contains('Pakistan (‫پاکستان‬‎)').type('{enter}304')
    cy.get("button[class='btn btn-primary btn-sm']")
      .should('be.visible').click({ force: true })
    cy.get('.invalid-feedback').should('contain', 'Invalid phone number')
    cy.get(".iti__selected-flag").click()
    cy.get("#iti-0__item-pk")
      .contains('Pakistan (‫پاکستان‬‎)').type('{enter}7557094')
    cy.get("button[class='btn btn-primary btn-sm']")
      .should('be.visible').click({ force: true })
    cy.get('.toast-message').invoke('text')
      .then((resp) => {
        expect(resp).to.equal('Data is not valid')
      })
    cy.xpath("//small[normalize-space()='Full Name is required.']")
      .should('contain', 'Full Name is required.')
    cy.xpath("//small[normalize-space()='Date of Birth is required.']")
      .should('contain', 'Date of Birth is required.')
    cy.xpath("//small[normalize-space()='Nationality is required.']")
      .should('contain', 'Nationality is required.')
    cy.xpath("//small[normalize-space()='Email Address is required.']")
      .should('contain', 'Email Address is required.')
    cy.xpath("//small[normalize-space()='Gender is required.']")
      .should('contain', 'Gender is required.')
    cy.xpath("//small[normalize-space()='Address is required.']")
      .should('contain', 'Address is required.')
    cy.xpath("//small[normalize-space()='Zip Code is required.']")
      .should('contain', 'Zip Code is required.')
    // Enter Actual Data in all the fields expect Email
    cy.xpath("(//input[@id='6'])[1]")
      .should('have.attr', 'placeholder', 'Full name')
      .type('SQA Tester')
    cy.get('[placeholder="Date of birth"]').should('exist').then((elem) => {
      cy.get(elem).click()
      //Select DOB
      cy.get('[class="vc-title"]').click()
      cy.get('[class*="vc-nav-title"]').click()
      cy.get('[class="vc-nav-arrow is-left"]').dblclick() //Arrow left
      cy.get('[class="vc-nav-item"]').eq(0).click() //year
      cy.get('[class="vc-nav-item"]').eq(0).click() //month
      cy.get('[class*="vc-day-content"]').eq(10).click() //Day
    })
    cy.xpath("(//select[@id='8'])[1]")
      .select('Pakistani')
    cy.xpath("(//select[@id='9'])[1]")
      .select('Female')
    cy.get("#update-property-address")
      .should('have.attr', 'placeholder', 'Please type your address').clear()
      .type('768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan').wait(3000)
    cy.xpath("(//input[@id='11'])[1]")
      .should('have.attr', 'placeholder', 'Zip code').clear().type('54000')
    // Email Generator
    function generateUserName() {
      let text = "";
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

      for (let i = 0; i < 10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
      return text;
    }
    const generatedUserName = generateUserName()
    // Enter Wrong Email
    cy.xpath("(//input[@id='1'])[1]")
      .should('have.attr', 'placeholder', 'Email address')
      .type(generatedUserName + 'mailinator.com')
    cy.get("button[class='btn btn-primary btn-sm']")
      .should('be.visible').click({ force: true })
    cy.get('.toast-message').invoke('text')
      .then((resp) => {
        expect(resp).to.equal('Data is not valid')
      }).wait(3000)
    cy.xpath("//small[@class='form-text text-danger invalid-feedback']")
      .should('contain', 'Email Address is not valid.')
    cy.xpath("(//input[@id='1'])[1]")
      .clear().type(generatedUserName + '@mailinator.com').wait(4000)
    cy.get("button[class='btn btn-primary btn-sm']")
      .should('be.visible').click({ force: true })
    cy.wait(5000)
    cy.get('.toast-message').should('contain.text', 'Data saved Successfully.') //Success toast
  }
  validateAllAddOnServices() {
    cy.get('[class="upsell-header-infos"]').eq(0).should('contain.text', 'E-bike Rental')
    cy.get('[class="upsell-header-infos"]').eq(1).should('contain.text', 'Test Upshell')
    cy.get('div[class="text-center mt-4 lead fw-500"] span[class="notranslate"]')
      .should('have.text', 'CA$0')
    cy.get("label[for='select-all-available-addOns']").click({ force: true }) // Select and validate All Upsells
    cy.get('div[class="text-center mt-4 lead fw-500"] span[class="notranslate"]')
      .should('have.text', 'CA$300')
      .then($addsAmount => {
        const adds_on_total = $addsAmount.text();
        cy.log(adds_on_total)
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save button
        cy.get('[class="table-responsive"] tr:nth-child(2) td:first-child').should('contain.text', 'E-bike Rental')
        cy.get('[class="table-responsive"] tr:nth-child(3) td:first-child').should('contain.text', 'Test Upshell')
        cy.get('.col-md-4 > .table-responsive > .table > tr > .text-right')
          .then($amountText => {
            const Total = $amountText.text();
            expect(Total).to.include(adds_on_total)
          })
      })
    cy.get('.btn-default').click({ force: true }) //back
    cy.get("label[for='add_on_check_604']").click({ force: true }) //Uncheck the first upsell
    cy.get('div[class="text-center mt-4 lead fw-500"] span[class="notranslate"]')
      .should('have.text', 'CA$100')
      .then($addsAmount => {
        const adds_on_total = $addsAmount.text();
        cy.log(adds_on_total)
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save button
        cy.get('td:nth-child(1) strong:nth-child(1)').should('contain', 'Test Upshell')
        cy.get('.col-md-4 > .table-responsive > .table > tr > .text-right')
          .then($amountText => {
            const Total = $amountText.text();
            expect(Total).to.include(adds_on_total)
          })
      })
    cy.get('.btn-default').click({ force: true }) //Back
    cy.get("label[for='add_on_check_598']").click({ force: true }).wait(2000)
    cy.get('div[class="text-center mt-4 lead fw-500"] span[class="notranslate"]')
      .should('have.text', 'CA$0')
    cy.get("label[for='add_on_check_604']").click({ force: true })
    cy.get('div[class="text-center mt-4 lead fw-500"] span[class="notranslate"]')
      .should('have.text', 'CA$200')
      .then($addsAmount => {
        const adds_on_total = $addsAmount.text();
        cy.log(adds_on_total)
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
        cy.get('td:nth-child(1) strong:nth-child(1)').should('contain', 'E-bike Rental')
        cy.get('.col-md-4 > .table-responsive > .table > tr > .text-right')
          .then($amountText => {
            const Total = $amountText.text();
            expect(Total).to.include(adds_on_total)
          })
      })
  }
  allAddOnServices() {
    cy.get('[class="upsell-header-infos"]').eq(0).should('contain.text', 'E-bike Rental')
    cy.get('[class="upsell-header-infos"]').eq(1).should('contain.text', 'Test Upshell')
    cy.get("label[for='select-all-available-addOns']").click({ force: true }) //Select all
    cy.get('div[class="text-center mt-4 lead fw-500"] span[class="notranslate"]')
      .should('have.text', 'CA$300')
      .then($addsAmount => {
        const adds_on_total = $addsAmount.text();
        cy.log(adds_on_total)
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save
        cy.get('.col-md-4 > .table-responsive > .table > tr > .text-right')
          .then($amountText => {
            const Total = $amountText.text();
            expect(Total).to.include(adds_on_total)
          })
      })
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //Navigate to Credit card tab
  }
  selectAddOnService1() {
    cy.get('[class="upsell-header-infos"]').eq(0).should('contain.text', 'E-bike Rental')
    cy.get('[class="upsell-header-infos"]').eq(1).should('contain.text', 'Test Upshell')
    cy.get('label[for="add_on_check_598"]').click({ force: true })
    cy.get('div[class="text-center mt-4 lead fw-500"] span[class="notranslate"]')
      .should('have.text', 'CA$100')
      .then($addsAmount => {
        const adds_on_total = $addsAmount.text();
        cy.log(adds_on_total)
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save
        cy.get('.col-md-4 > .table-responsive > .table > tr > .text-right')
          .then($amountText => {
            const Total = $amountText.text();
            expect(Total).to.include(adds_on_total)
          })
      })
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
  }
  addCreditCardInfo() {
    cy.get('.mb-4 > .form-section-title > h4').should('contain', 'PAYMENT SUMMARY').wait(3000)
    cy.get('#card-element').within(() => {
      cy.fillElementsInput('cardNumber', '4242424242424242');
      cy.fillElementsInput('cardExpiry', '1025'); // MMYY
      cy.fillElementsInput('cardCvc', '123');
      cy.fillElementsInput('postalCode', '90210');
    })
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
  }
  paymentMethodValidation() {
    cy.get(':nth-child(3) > .form-section-title > h4').should('contain', 'PAYMENT METHOD')
    cy.get(':nth-child(18) > :nth-child(4) > .gp-dl > :nth-child(2)').should('contain', 'QA Tester')
    cy.get(':nth-child(18) > :nth-child(4) > .gp-dl > :nth-child(3)').should('contain', '**** **** **** 4242')
  }
  addAndValidateSignature() {
    cy.get('canvas').then($canvas => {
      const canvasWidth = $canvas.width()
      const canvasHeight = $canvas.height()
      const canvasCenterX = canvasWidth / 2
      const canvasCenterY = canvasHeight / 2
      const buttonX = canvasCenterX + ((canvasCenterX / 3) * 2)
      const buttonY = canvasCenterY + ((canvasCenterY / 3) * 2)
      cy.wrap($canvas)
        .scrollIntoView()
        .click(buttonX, buttonY)
    })
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get('.page-title').should('contain', 'Welcome')
    cy.get('h1[class="page-title"] span[class="notranslate"]').should('contain', 'QA')
  }

  //Summary Page 
  verifySummaryContactInfo() {
    cy.wait(3000)
    cy.get(':nth-child(3) > .col-12 > .form-section-title > h4').should('contain', 'CONTACT INFO')
    cy.get(':nth-child(4) > .row > :nth-child(2) > .gp-dl > dd').should('contain', '+923047557094')
    cy.get(':nth-child(4) > .row > :nth-child(3) > .gp-dl > dd').should('contain', 'January 8, 1992')
    cy.get(':nth-child(4) > .row > :nth-child(4) > .gp-dl > dd').should('contain', 'Pakistani')
    cy.get(':nth-child(6) > .gp-dl > dd').should('contain', 'Male')
    cy.get(':nth-child(7) > .gp-dl > dd')
      .should('contain', '768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town')
    cy.get(':nth-child(8) > .gp-dl > dd').should('contain', '54000')
    cy.get(':nth-child(9) > .gp-dl > dd > :nth-child(1)').if().should('contain', 'Adult')
    cy.get(':nth-child(9) > .gp-dl > dd > :nth-child(2)').if().should('contain', 'Child')
  }
  verifySummaryQuestionnairesInfo() {
    cy.get(':nth-child(5) > .col-12 > .form-section-title > h4').should('contain', 'QUESTIONNAIRE')
    cy.get(':nth-child(6) > .col-12 > .gp-dl > dd').should('contain', 'This is Automation Testing')
    cy.get(':nth-child(8) > .col-12 > .gp-dl > dd').should('contain', '+923047557094')
    cy.get(':nth-child(9) > .col-12 > .gp-dl > dd').should('contain', 'automation@mailinator.com')
    cy.get(':nth-child(10) > .col-12 > .gp-dl > dd').should('contain', 'Yes')
    cy.get(':nth-child(11) > .col-12 > .gp-dl > dd').should('contain', '2')
    cy.get(':nth-child(12) > .col-12 > .gp-dl > dd').should('contain', 'This is Test Automation Testing Some Basic Infos')
    cy.get(':nth-child(13) > .col-12 > .gp-dl > dd').should('contain', 'Bread Butter')
    cy.get(':nth-child(14) > .col-12 > .gp-dl > dd').should('contain', 'Spa,Jim,Swimming Pool')
  }
  verifySummaryArrival(arrivalBy) {
    cy.get(':nth-child(16) > .col-12 > .form-section-title > h4').should('contain', 'ARRIVAL')
    cy.get(':nth-child(17) > :nth-child(1) > .gp-dl > dd').should('contain', arrivalBy)
    cy.get(':nth-child(17) > :nth-child(2) > .gp-dl > dd').should('contain', '12:00')
  }
  verifySummaryIDcardInfo() {
    cy.get(':nth-child(18) > :nth-child(1) > .form-section-title > h4').should('contain', 'DOCUMENT UPLOADED')
    cy.get(':nth-child(2) > :nth-child(1) > dd > span').should('contain', 'Selfie')
    cy.get(':nth-child(2) > dd > span').should('contain', 'Credit Card Scan')
    cy.get(':nth-child(4) > dd > span').should('contain', 'ID Card')
  }
  verifySummaryLicenseInfo() {
    cy.get(':nth-child(18) > :nth-child(1) > .form-section-title > h4').should('contain', 'DOCUMENT UPLOADED')
    cy.get(':nth-child(2) > :nth-child(1) > dd > span').should('contain', 'Selfie')
    cy.get(':nth-child(2) > dd > span').should('contain', 'Credit Card Scan')
    cy.get(':nth-child(4) > dd > span').should('contain', "Driver's License")
  }
  verifySummaryPaymentMethod() {
    cy.get(':nth-child(3) > .form-section-title > h4').should('contain', 'PAYMENT METHOD')
    cy.get(':nth-child(18) > :nth-child(4) > .gp-dl > :nth-child(2)').should('contain', 'QA Tester')
    cy.get(':nth-child(18) > :nth-child(4) > .gp-dl > :nth-child(3)').should('contain', '**** **** **** 4242')
  }
  verifySummarySignature() {
    cy.get('canvas').then($canvas => {
      const canvasWidth = $canvas.width()
      const canvasHeight = $canvas.height()
      const canvasCenterX = canvasWidth / 2
      const canvasCenterY = canvasHeight / 2
      const buttonX = canvasCenterX + ((canvasCenterX / 3) * 2)
      const buttonY = canvasCenterY + ((canvasCenterY / 3) * 2)
      cy.wrap($canvas)
        .scrollIntoView()
        .click(buttonX, buttonY)
    })
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get('.page-title').should('contain', 'Welcome')
    cy.get('h1[class="page-title"] span[class="notranslate"]').should('contain', 'QA')
  }

  validateReferenceNo(bookingID) {
    cy.get('span.single-line.notranslate')
      .then(($ref) => {
        const referenceID = $ref.text().trim()
        cy.wrap(bookingID).should('eq', referenceID)
      })
  }
  validateSourceType(source) {
    cy.get('.gp-property-dl > :nth-child(2) > .notranslate')
      .then(($sour) => {
        const sourceType = $sour.text().trim()
        cy.wrap(sourceType).should('eq', source)
      })
  }
  validateTxAmount(tAmount) {
    cy.get('[class="col-lg-6 col-md-6 col-xs-6"] [class="notranslate"]:nth-child(3)').eq(0)
      .then(($amount) => {
        const amountTotal = $amount.text().trim()
        cy.wrap(amountTotal).should('eq', tAmount)

      })
  }
  validateCheckinDate(checkInDate) {
    cy.get('[class="col-lg-6 col-md-6 col-xs-6"] [class="notranslate"]:nth-child(3)').eq(1)
      .then($cIn => {
        const dateCheckIn = $cIn.text().replace(/,/g, '');
        cy.log(dateCheckIn)
        cy.wrap(dateCheckIn).should('eq', checkInDate)
      })
  }
  validateCheckoutDate(checkOutDate) {
    cy.get('[class="col-lg-6 col-md-6 col-xs-6"] [class="notranslate"]:nth-child(3)').eq(2)
      .then($cOut => {
        const dateCheckOut = $cOut.text().replace(/,/g, '');
        cy.log(dateCheckOut)
        cy.wrap(dateCheckOut).should('eq', checkOutDate).wait(3000)
      })
  }
  validateFullNameOnWelcome(fName) {
    cy.xpath('(//input[@id="6"])[1]')
      .invoke('val')
      .then((text) => {
        const fullName = text;
        cy.wrap(fullName).should('eq', fName)
      })
  }
  validateEmail(email) {
    cy.xpath('(//input[@id="1"])[1]')
      .invoke('val')
      .then((text) => {
        const emailAddress = text;
        cy.wrap(emailAddress).should('eq', email)
      })
  }
  validateFullNameOnGuestTab(fName) {
    cy.get('div[class="gp-box gp-box-of-inner-pages page-tab-01 pre-checkin-tabs"] h4:nth-child(1)').should('contain.text', 'Guest Details\n                        1/1')
    cy.get('table[class="table guest-table"] h6[class="guest-name"]').invoke('text').then((text)=>{
      cy.wrap(text).should('eq', fName) //Validate Guest Name
    })
  }
  validateEmailOnGuestTab(emailText) {
    cy.get("table[class='table guest-table'] span[class='guest-email']").invoke('text').then((text)=>{
        cy.wrap(text).should('eq', emailText) //Validate Email
      })
  }
  validatePropertyNameOnSummaryPage(propName) {
    cy.get('.page-title').should('contain', 'Your Summary')
    cy.get('.mb-0.notranslate').should('contain.text', propName)
    cy.wait(3000)
  }
  validateSourceOnSummaryPage(source) {
    cy.get('div[class="gp-property-dl small"] span')
      .then(($sSource) => {
        const mySumSource = $sSource.text().replace(/Booked with /g, '')
        cy.log(mySumSource)
        cy.wrap(mySumSource).should('eq', source)
      })
  }
  validateBookingIDonSummaryPage(bookingID) {
    cy.get('div[class="col"] h4').should('contain', 'REVIEW BOOKING DETAILS')
    cy.get('.col-md-12 > .row > :nth-child(1) > .gp-dl > dd')
      .then(($sRefNo) => {
        const myRefNo = $sRefNo.text()
        cy.log(myRefNo)
        cy.wrap(myRefNo).should('eq', bookingID)
      })
  }
  validateTxAmountOnSummaryPage(tAmount) {
    cy.get(':nth-child(2) > .gp-dl > .notranslate')
      .then(($sAmount) => {
        const mySumAmount = $sAmount.text()
        cy.log(mySumAmount)
        cy.wrap(mySumAmount).should('eq', tAmount)
      })
  }
  validateCheckinDateOnSummaryPage(checkInDate) {
    cy.get(':nth-child(3) > .gp-dl > .notranslate')
      .then(($sCIn) => {
        const myCheckInDate = $sCIn.text().replace(/,/g, '');
        cy.log(myCheckInDate)
        cy.wrap(myCheckInDate).should('eq', checkInDate)

      })
  }
  validateCheckoutDateOnSummaryPage(checkOutDate) {

    cy.get('.col-md-12 > .row > :nth-child(4) > .gp-dl > .notranslate')
      .then(($sCOut) => {
        const myCheckOutDate = $sCOut.text().replace(/,/g, '');
        cy.log(myCheckOutDate)
        cy.wrap(myCheckOutDate).should('eq', checkOutDate)
      })
  }
  verifyFullNameOnSummaryPage(fName) {
    cy.get(':nth-child(4) > .row > :nth-child(1) > .gp-dl > dd')
      .then($infoName => {
        const myName = $infoName.text();
        cy.log(myName)
        cy.wrap(myName).should('eq', fName)
      })
  }
  verifyEmailOnSummaryPage(emailText) {
    cy.get(':nth-child(5) > .gp-dl > dd')
      .then($infoEmail => {
        const myEmail = $infoEmail.text();
        cy.log(myEmail)
        cy.wrap(myEmail).should('eq', emailText)
      })
  }
}

