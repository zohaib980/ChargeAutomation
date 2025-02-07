

import { LoginPage } from "./LoginPage";
import { ReuseableCode } from "../cypress/support/ReuseableCode";
import { BookingDetailPage } from "../pageObjects/BookingDetailPage";

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const bookingDetailPage = new BookingDetailPage

export class PreCheckIn {

  clickSaveContinue() {
    cy.wait(1000)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click()
  }
  validateCompletedStatus(tabName) {
    cy.get('.gp-step').should('be.visible').and('contain.text', tabName)
    cy.get('.gp-step').contains(tabName).parents('.gp-step').should('have.class', 'step-completed')
  }
  validateIncompletedStatus(tabName) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.gp-step').should('be.visible').and('contain.text', tabName)
    cy.get('.gp-step').contains(tabName).parents('.gp-step').should('not.have.class', 'step-completed')
  }
  addBasicInfo() {
    cy.get('[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION').and('be.visible') //Validate Basic Info tab heading
    cy.get('.gp-step').should('contain.text', 'Basic Info').and('be.visible').wait(1000)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.iti__selected-flag').should('exist').click() //Select Phone country code
    cy.get('[id*="__item-pk"]').should('exist').and('contain.text', 'Pakistan (‫پاکستان‬‎)').click()
    cy.get('[id*=phone-]').type('{enter}3047557094').should('contain.value', '3047557094')
    cy.get('[placeholder="Date of birth"]').should('exist').then((elem) => {
      cy.get(elem).click()
      //Select DOB
      cy.get('[class="vc-title"]').should('be.visible').click()
      cy.get('[class*="vc-nav-title"]').click()
      cy.get('[class="vc-nav-arrow is-left"]').dblclick() //Arrow left
      cy.get('[class="vc-nav-item"]').eq(0).click() //year
      cy.get('[class="vc-nav-item"]').eq(0).click() //month
      cy.get('[class*="vc-day-content"]').eq(10).click() //Day
    })
    cy.get('#\\39 ').select('Male')
    cy.get("#update-property-address") //Address 
      .should('have.attr', 'placeholder', 'Please type your address').clear()
      .type('768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan').wait(1000).invoke('val').as('guestAddress')
    cy.get("#\\31 1").type('54000') //Postal Code
    cy.get('[data-test="basicguestTitle"]').should('contain.text', 'GUESTS')
    cy.get('[data-test="basicguestAdults"]').should('contain.text', 'Adults')
    cy.get('[data-test="basicguestChildren"]').should('contain.text', 'Children (2-17 years)')
    this.clickSaveContinue() //Save & Continue
  }
  addAndValidateBasicInfo(phone, adult, child, guestAddress, postalCode) {
    cy.get('[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION') //Validate Basic Info tab heading
    cy.get('.gp-step').should('contain.text', 'Basic Info').and('be.visible')
    this.clickSaveContinue() //Click Save to show errors on fields
    cy.get('.invalid-feedback').should('contain', 'Invalid phone number.')
    // Validate invalid Phone Number
    cy.get('.iti__selected-flag').should('exist').click()
    cy.get('#iti-0__item-pk').type('{enter}' + phone) //enter phone number
    this.clickSaveContinue()
    cy.verifyToast('Mandatory fields are required')

    // Validate Field level Validation
    cy.xpath('(//small[normalize-space()="Date of Birth is required."])[1]').should('contain', 'Date of Birth is required.')
    cy.xpath('//small[normalize-space()="Gender is required."]').should('contain', 'Gender is required.')
    cy.xpath('//small[normalize-space()="Address is required."]').should('contain', 'Address is required.')
    cy.xpath('//small[normalize-space()="Zip Code is required."]').should('contain', 'Zip Code is required.')
    cy.get('[data-test="basicguestTitle"]').should('contain.text', 'GUESTS')
    // Validate Adults
    cy.get('[data-test="basicguestAdults"]').should('contain.text', 'Adults')
    cy.get('#guestAdults').should('contain.value', String(adult))
    // Validate Childs
    cy.get('[data-test="basicguestChildren"]').should('contain.text', 'Children (2-17 years)')
    cy.get('[data-test="basicChildrenInput"]').should('contain.value', String(child))
    cy.get('.badge').should('contain.text', (parseInt(adult) + parseInt(child)).toString())
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
    cy.get("#update-property-address").should('have.attr', 'placeholder', 'Please type your address').clear().type(guestAddress)//Add Address
    cy.get("#\\31 1").type(postalCode) //Postal Code
    this.clickSaveContinue() //Save & Continue
    this.validateCompletedStatus('Basic Info')
  }
  fillQuestionnaires() {
    cy.get('[data-test="questionnaireTitle"]').should('have.text', 'Some Importent Questions!').and('be.visible')
    cy.get('[data-test="questionnaireDesc"]').should('have.text', 'Please answer the below Questions.')
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    // Validate Mandatory Fields
    this.clickSaveContinue() //Save button
    cy.get('.invalid-feedback > span').should('contain', 'Answer is required.')
    // Enter note about any suggestion?
    cy.contains('Enter note about any suggestion?').parents('[class*="form-group questionaire-form mb-0"]')
      .find('[placeholder="Type your answer"]').should('have.attr', 'placeholder', 'Type your answer').clear().type('This is Automation Testing')
    // Date Question
    cy.get('[class="fa fa-calendar"]').should('exist').click() //Calender icon
    const rand = reuseableCode.getRandomNumber(0, 28)
    cy.get('.vc-day.in-month').should('exist').eq(rand).click()
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    // Enter Phone Number
    cy.get('.iti__selected-flag').should('exist').click() //Select Phone country code
    cy.get('[id*="__item-pk"]').should('exist').and('contain.text', 'Pakistan (‫پاکستان‬‎)').click()
    cy.get('[id*=phone-]').type('{enter}304')
    this.clickSaveContinue()
    cy.verifyToast('Country code is missing in the Phone Number')
    cy.get('.iti__selected-flag').should('exist').click() //Select Phone country code
    cy.get('[id*="__item-pk"]').should('exist').and('contain.text', 'Pakistan (‫پاکستان‬‎)').click()
    cy.get('[id*=phone-]').should('exist').clear().type('{enter}+923047557094').should('contain.value', '3047557094')
    // Enter Email
    cy.contains('Email').parents('[class*="form-group questionaire-form mb-0"]')
      .find('[placeholder="Type your answer"]').clear().type('automationmailinator.com')
    this.clickSaveContinue()
    cy.get('.text-danger > span').should('contain', 'Answer must be a valid email address.') //error checking
    cy.contains('Email').parents('[class*="form-group questionaire-form mb-0"]')
      .find('[placeholder="Type your answer"]').should('have.attr', 'placeholder', 'Type your answer').clear().type('automation@mailinator.com')
    // Do you need an extra bed?
    cy.contains('Do you need an extra bed?').parents('[class*="form-group questionaire-form mb-0"]')
      .find('[name="single_choice_option"]').eq(0).should('not.be.checked').check({ force: true })
    // How many beds do you need?
    cy.contains('How many beds do you need?').parents('[class*="form-group questionaire-form mb-0"]')
      .find('[placeholder="Type your answer"]').should('have.attr', 'placeholder', 'Type your answer').clear().type('2')
    // Provide some basic infos 
    cy.contains('Provide some basic infos').parents('[class*="form-group questionaire-form mb-0"]')
      .find('[placeholder="Type your answer"]').should('have.attr', 'placeholder', 'Type your answer').clear().type('This is Test Automation Testing Some Basic Infos')
    // Choose your breakfast
    cy.contains('Choose your breakfast').parents('[class*="form-group questionaire-form mb-0"]')
      .find('[name="single_choice_option"]').eq(0).should('not.be.checked').click({ force: true }) //Bread Butter
    // What facilities do you need?
    cy.get('input[value="Spa"]').should('not.be.checked').check({ force: true }).should('be.checked')  //Spa
    cy.get('input[value="Jim"]').should('not.be.checked').check({ force: true }).should('be.checked')  //Jim
    cy.get('input[value="Swimming Pool"]').should('not.be.checked').check({ force: true }).should('be.checked')  //Swimming Pool
    // Upload your ID?
    cy.get('input[type="file"]').attachFile('Images/testImage.jpeg').wait(3000)
    this.clickSaveContinue()
    cy.get('[class="gp-step step-completed "]').should('contain.text', 'Questionnaire') // Questionnaire tab is completed
  }
  skipQuestionnaires() {
    cy.get('[data-test="questionnaireTitle"]').should('have.text', 'Some Importent Questions!')
    cy.get('[data-test="questionnaireDesc"]').should('have.text', 'Please answer the below Questions.')
    // Enter note about any suggestion?
    cy.contains('Enter note about any suggestion?').parents('[class*="form-group questionaire-form mb-0"]')
      .find('[placeholder="Type your answer"]').should('have.attr', 'placeholder', 'Type your answer').clear().type('This is Automation Testing')
    this.clickSaveContinue()
    cy.get('[class="gp-step step-completed "]').should('contain.text', 'Questionnaire') // Questionnaire tab is completed
  }
  fillAndValidatePreCheckinArrival() {
    //Fill and validate Arrival Info
    // Arrival by Car with time 16:00
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION')
    cy.get('label[for="guestArrivalMethod"]').should('have.text', 'Arriving By')
    cy.get("#guestArrivalMethod").select('Car')
    cy.wait(2000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time')
    cy.get("#standard_check_in_time").select('16:00')
    cy.wait(2000)
    // Arrival by Other Validation
    cy.get("#guestArrivalMethod").select('Other')
    cy.wait(2000)
    cy.get("#standard_check_in_time").select('13:00')
    cy.wait(2000)
    this.clickSaveContinue()
    cy.get('.form-text.text-danger').should('contain', 'Other detail is required.')
    cy.get('#other').type('Testing Arrival by Other')
    // Arrival By Flight
    cy.get("#guestArrivalMethod").select('Flight')
    cy.wait(2000)
    cy.get('#flightNumber').type('PIA-9669')
    cy.get("#standard_check_in_time").select('14:30')
    cy.wait(3000)
    this.clickSaveContinue()
    this.validateCompletedStatus('Arrival')
  }
  selectArrivalBy(arriveBy) {
    //Fill and validate Arrival Info
    // Arrival by Car with time 16:00
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').and('be.visible')
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('label[for="guestArrivalMethod"]').should('have.text', 'Arriving By')
    if (arriveBy == "Car") {
      cy.get("#guestArrivalMethod").should('be.visible').select('Car').should('have.value', 'Car')
      cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time')
      cy.get("#standard_check_in_time").should('be.visible').select('16:00')
    }
    if (arriveBy == "Other") {
      // Arrival by Other Validation
      cy.get("#guestArrivalMethod").should('be.visible').select('Other').should('have.value', 'Other')
      cy.get('input[placeholder="Other details"]').should('exist').type('Testing Arrival by Other')
      cy.get("#standard_check_in_time").should('be.visible').select('16:00')
    }
    if (arriveBy == "Flight") {
      // Arrival By Flight
      cy.get("#guestArrivalMethod").should('be.visible').select('Flight').should('have.value', 'Flight')
      cy.get('#flightNumber').should('be.visible').type('PIA-9669').should('have.value', 'PIA-9669')
      cy.get("#standard_check_in_time").should('be.visible').select('16:00')
    }
    this.clickSaveContinue() //Save & Continue
    this.validateCompletedStatus('Arrival')
  }
  goToDocVerification(bSource) {
    bookingDetailPage.getPrecheckinLinkOnFirstBooking().then((link) => { //Wrap the precheckin link
      cy.wrap(link).as('myLink')
      // User will logout from the portal and will open CheckIn link
      loginPage.logout()
      cy.visit(link)
      cy.get('.welcome-guest-header > .mb-0').should('contain.text', 'Welcome').and('be.visible')
      cy.get('.text-md > span').should('contain.text', 'Please start Pre Check-in').and('be.visible')
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      // Validate Soruce type
      cy.get('.gp-property-dl').should('be.visible').and('contain.text', bSource)
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      this.clickSaveContinue() //Save and Continue on Welcome tab
      cy.get('[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION') //Validate Basic Info tab heading
      this.addBasicInfo()
      // Enter Note in mandatory field on Questionnaire
      // Enter note about any suggestion?
      cy.contains('Enter note about any suggestion?').parents('[class*="form-group questionaire-form mb-0"]')
        .find('[placeholder="Type your answer"]').should('have.attr', 'placeholder', 'Type your answer').clear().type('This is Automation Testing')
      this.clickSaveContinue() //Save & Continue on Questionnarie
      cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').and('be.visible')//Validate ARRIVAL INFORMATION Heading
      cy.wait(2000)
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      this.clickSaveContinue() //Save& Continue 
    })
  }
  addAndValidateIdCard() {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.wait(2000)
    cy.get('[for="drivers_license"]').should('contain.text', "Driver's License").and('be.visible')
    cy.get('[for="id_card"]').should('contain.text', 'ID Card').and('be.visible')
    cy.get('#id_card').scrollIntoView().click({ force: true }).should('be.checked').wait(1000)
    cy.get('.upload-title').eq(0).should('contain.text', 'ID Card (Front Side)').and('be.visible')
    cy.get('.upload-title').eq(1).should('contain.text', 'ID Card (Back Side)').and('be.visible')
    cy.get('.upload-title').eq(2).should('contain.text', 'CREDIT CARD').and('be.visible')
    //Validate upload buttons
    cy.get('[class*="btn btn-primary"]').eq(0).should('contain.text', 'Upload ID Card Front')
    cy.get('[class*="btn btn-primary"]').eq(1).should('contain.text', 'Upload ID Card Back')
    cy.get('[class*="btn btn-primary"]').eq(2).should('contain.text', 'Upload Credit Card')
    this.clickSaveContinue()
    cy.get('.form-text.text-danger').eq(0).should('contain.text', 'Identification front side is required.')
    cy.get('.form-text.text-danger').eq(1).should('contain.text', 'Identification back side is required.')
    cy.get('.form-text.text-danger').eq(2).should('contain.text', 'Credit card is required.')
    //Now upload normal size images
    const idFront = 'Images/IdCardFront.png'
    cy.get("input[data-notify-id='id_card_front_uploaded']").attachFile(idFront).wait(3000)
    const backImage = 'Images/IdCardBack.png'
    cy.get("input[data-notify-id='id_card_back_uploaded']").attachFile(backImage)
    cy.wait(3000)
    const cardImage = 'Images/visaCard.png'
    cy.get("#credit_card_file").attachFile(cardImage)
    cy.wait(5000)
    this.clickSaveContinue() //Click Save & Continue
    this.validateCompletedStatus('Verification')
  }
  updateIDLicenseOnVerification() {
    cy.get('.gp-step.step-completed').contains('Verification').should('be.visible').click()
    cy.get('.form-section-title').should('be.visible').and('contain.text', 'Uploaded').and('contain.text', 'Document(s)') //heading

    cy.get(':nth-child(1) > .UploadImages > label').should('be.visible') //pencil icon
    cy.get(':nth-child(2) > .UploadImages > label').should('be.visible') //pencil icon
    cy.get(':nth-child(3) > .UploadImages > label').should('be.visible') //pencil icon
    const testImage = 'Images/testImage.jpeg'
    cy.get('input[type="file"][name="id_card_front"]').attachFile(testImage).wait(3000)
    cy.get('input[type="file"][name="id_card_back"]').attachFile(testImage).wait(3000)
    cy.get('input[type="file"][name="credit_card"]').attachFile(testImage).wait(3000)
  }
  updateIDLicenseOnGuestTab() {
    cy.get('.gp-inset > .form-section-title > h4').should('be.visible').and('contain.text', 'Guest Details') //Heading
    cy.get('td [class="guest-edit"]').eq(0).should('be.visible').click() //first view/edit
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    //Guest detail modal
    cy.get('.basic-details .form-section-title').should('contain.text', 'Upload Document').and('be.visible') //UPLOAD DOCUMENT
    cy.get('body').then(body => {
      if (body.find('.show .fa-pencil-alt').length > 0) { //Pencil icon is showing on docs
        cy.get(':nth-child(1) > .UploadImages > label').should('be.visible') //pencil icon
        cy.get(':nth-child(2) > .UploadImages > label').should('be.visible') //pencil icon

        const testImage = 'Images/testImage.jpeg'
        cy.get('input[type="file"][name="id_card_front"]').attachFile(testImage).wait(3000)
        cy.get('input[type="file"][name="id_card_back"]').attachFile(testImage).wait(3000)
        cy.get('.show .modal-footer .btn-success').scrollIntoView().should('be.visible').and('contain.text', 'Save').click() //Save
        cy.get('.loading-label').should('not.exist') //loader should be disappear  
        cy.verifyToast('Data saved Successfully')
        cy.wrap(true).as('docUpdateStatus')
      }
      else {
        //Upload (pencil) icon is not showing on approved docs
        cy.get('.show .modal-footer .btn-success').scrollIntoView().should('be.visible').and('contain.text', 'Save').click() //Save
        cy.get('.loading-label').should('not.exist') //loader should be disappear  
        cy.verifyToast('Data saved Successfully')
        cy.wrap(false).as('docUpdateStatus')
      }
    })

  }
  addCCandIdCardinHD() {
    cy.get('[for="drivers_license"]').should('contain.text', "Driver's License").and('be.visible')
    cy.get('[for="id_card"]').should('contain.text', 'ID Card').and('be.visible')
    cy.get('#id_card').should('not.be.checked').click({ force: true }).wait(2000)
    cy.get('.upload-title').eq(0).should('contain.text', 'ID Card (Front Side)').and('be.visible')
    cy.get('.upload-title').eq(1).should('contain.text', 'ID Card (Back Side)').and('be.visible')
    cy.get('.upload-title').eq(2).should('contain.text', 'CREDIT CARD').and('be.visible')
    //Validate upload buttons
    cy.get('[class*="btn btn-primary"]').eq(0).should('contain.text', 'Upload ID Card Front').and('be.visible')
    cy.get('[class*="btn btn-primary"]').eq(1).should('contain.text', 'Upload ID Card Back').and('be.visible')
    cy.get('[class*="btn btn-primary"]').eq(2).should('contain.text', 'Upload Credit Card')
    this.clickSaveContinue()
    cy.get('.form-text.text-danger').eq(0).should('contain.text', 'Identification front side is required.')
    cy.get('.form-text.text-danger').eq(1).should('contain.text', 'Identification back side is required.')
    cy.get('.form-text.text-danger').eq(2).should('contain.text', 'Credit card is required.')

    // Validate by uploading more then 15mb image
    const morethen15mbImage = 'Images/greaterThan15mb.jpg'
    cy.get("input[data-notify-id='id_card_front_uploaded']").attachFile(morethen15mbImage)
    cy.get('[id="toast-container"]').should('contain.text', 'Image size must be less than 15 MB').wait(5000)
    cy.get("input[data-notify-id='id_card_back_uploaded']").attachFile(morethen15mbImage)
    cy.get('[id="toast-container"]').should('contain.text', 'Image size must be less than 15 MB').wait(5000)
    cy.get("#credit_card_file").attachFile(morethen15mbImage)
    cy.get('[id="toast-container"]').should('contain.text', 'Image size must be less than 15 MB').wait(5000)
    //Now upload normal size images
    const lessthe10mbImage = 'Images/LessThen10mb.jpg'
    cy.get("input[data-notify-id='id_card_front_uploaded']").attachFile(lessthe10mbImage).wait(1000)
    cy.get('.loading-label').should('not.exist')
    cy.get("input[data-notify-id='id_card_back_uploaded']").attachFile(lessthe10mbImage).wait(1000)
    cy.get('.loading-label').should('not.exist')
    cy.get("#credit_card_file").attachFile(lessthe10mbImage).wait(1000)
    cy.get('.loading-label').should('not.exist')

    this.clickSaveContinue() //Click Save & Continue
    this.validateCompletedStatus('Verification')
  }

  addAndValidateDrivingDoc() {
    cy.get('[for="drivers_license"]').should('contain', "Driver's License")
    cy.get('[for="id_card"]').should('contain', 'ID Card')
    cy.get('.doc-wrap > :nth-child(2) > div > .btn').should('contain', "Upload Driver's License Front")
    cy.get(':nth-child(3) > div > .btn').should('contain', "Upload Driver's License Back")
    cy.get('.fileUpload').should('contain', 'Upload Credit Card')
    cy.get('.loading-label').should('not.exist') //loader should be disappear  
    this.clickSaveContinue()
    cy.get(':nth-child(2) > .form-text').should('contain', 'Identification front side is required.')
    cy.get(':nth-child(3) > .form-text').should('contain', 'Identification back side is required.')
    cy.get(':nth-child(4) > .form-text').should('contain', 'Credit card is required.')
    // Validate Png type image
    const frontImage = 'Images/front.pdf'
    cy.get("input[data-notify-id='drivers_license_front_uploaded']").attachFile(frontImage).wait(3000)
    const backImage = 'Images/back.pdf'
    cy.get("input[data-notify-id='drivers_license_back_uploaded']").attachFile(backImage).wait(3000)
    const cardImage = 'Images/card.pdf'
    cy.get('input[data-notify-id="credit_card_uploaded"]').attachFile(cardImage)
    cy.wait(5000)
    this.clickSaveContinue()
    this.validateCompletedStatus('Verification')
  }
  uploadDocuments(idFront, idBack, creditCard){
      cy.get('.loading-label').should('not.exist') //loader should be disappear  
      cy.get("input[data-notify-id='drivers_license_front_uploaded']").attachFile(idFront).wait(3000)
      cy.get('#toast-container').if().should('not.contain.text','Identification front side is required')
      cy.get('img[alt="drivers_license_front"]').should('exist') //image uploaded
      cy.get("input[data-notify-id='drivers_license_back_uploaded']").attachFile(idBack).wait(3000)
      cy.get('#toast-container').if().should('not.contain.text','Identification back side is required')
      cy.get('img[alt="drivers_license_back"]').should('exist') //image uploaded
      cy.get('input[data-notify-id="credit_card_uploaded"]').attachFile(creditCard).wait(3000)
      cy.get('#toast-container').if().should('not.contain.text','Credit card is required')
      cy.get('img[alt="credit_card"]').should('exist') //image uploaded
  }
  addIDAndCreditCard() {
    cy.get(".form-section-title").should('contain.text', 'Upload Document(s)') //Validate Heading
    cy.wait(3000)
    cy.get('#id_card').if().should('not.be.checked').click({ force: true }).wait(2000) //ID checkbox
    // Validate png type images.
    const idFront = 'Images/IdCardFront.png'
    cy.get("input[data-notify-id='id_card_front_uploaded']").should('exist').attachFile(idFront).wait(3000)
    const backImage = 'Images/IdCardBack.png'
    cy.get("input[data-notify-id='id_card_back_uploaded']").should('exist').attachFile(backImage)
    cy.wait(3000)
    const cardImage = 'Images/visaCard.png'
    cy.get("#credit_card_file").attachFile(cardImage)
    cy.wait(5000)
    this.clickSaveContinue() //Click Save & Continue
    //Validate Selfie tab status
    cy.get('.gp-step.step-completed').should('be.visible').and('contain.text', 'Verification')
  }
  takeSelfy() {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('div[class="gp-box gp-box-of-inner-pages"] p:nth-child(1)').should('have.text', 'Take a selfie to authenticate your identity').and('be.visible')
    cy.wait(3000)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.camera-button-container > .btn-success').click({ force: true })
    cy.wait(1000)
    this.clickSaveContinue() //Save & Continue
    this.validateCompletedStatus('Self Portrait')
  }
  addValidateNewGuest() {
    cy.get('div[class="gp-box gp-box-of-inner-pages page-tab-01 pre-checkin-tabs"] h4:nth-child(1)').should('contain.text', 'Guest Details')
    cy.get('button[data-target="#addGuestModal"]').click({ force: true }) //Add Guest Button
    cy.get('#newGuestModel').should('have.text', 'Guest')
    // Validation
    cy.get('button[class="btn btn-success btn-sm px-3"]').click({ force: true })
    cy.verifyToast('The name field is required')
    cy.get(':nth-child(1) > .form-text').should('contain', 'The name field is required.')
    cy.get(':nth-child(2) > .form-text').should('contain', 'The email field is required.')
    cy.get(':nth-child(1) > label').should('contain', 'Full Name*').wait(3000)
    cy.get("input[placeholder='Full name']")
      .should('have.attr', 'placeholder', 'Full name').type('QA Guest') //Guest Name
    cy.get(':nth-child(2) > label').should('contain', 'Email*')
    cy.get("input[placeholder='Email']")
      .should('have.attr', 'placeholder', 'Email').type('qaguest@mailinator.com') //Guest Email
    cy.get('#cancelButtonOfNewGuestModal').should('be.visible')
    cy.get('button[class="btn btn-success btn-sm px-3"]').click({ force: true })
    cy.verifyToast('Guest added Successfully')
    //Validate Added guest
    cy.get('tr td .guest-name').filter(':contains("QA Guest")').should('contain', 'QA Guest')
    cy.get('td span[class="guest-email"]').filter(':contains("qaguest@mailinator.com")').should('exist');
    this.clickSaveContinue() //Save & Continue
    this.validateCompletedStatus('Guest')
  }
  deleteGuest() {
    this.addValidateNewGuest() //Add a new guest
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[class="btn btn-default d-none d-md-inline-block"]').should('be.visible').click() //Back to guest
    // Delete Added Guest
    cy.get('h6:contains("QA Guest")').parents('tr').find('button.guest-delete').should('exist').click() //Click delete on QA Guest
    cy.get('.view-edit-title').should('contain', 'Do you want to delete this Guest?')
    cy.get('.swal2-cancel').should('be.visible')
    cy.get('.swal2-confirm').should('be.visible').click({ force: true })
    cy.verifyToast('Guest deleted Successfully')
  }
  editGuestDetail(guestType, index = 0) {
    cy.get('div[class="gp-box gp-box-of-inner-pages page-tab-01 pre-checkin-tabs"] h4:nth-child(1)').should('contain.text', 'Guest Details') //Guest Detail Heading
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('td:contains("Incomplete")').eq(index).parents('tr').find('button.guest-edit').should('exist').click() //Edit First incomplete guest
    cy.get('#exampleModalLabel > span').should('contain', guestType).wait(3000)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.show [placeholder="Full name"]').should('be.visible').clear().type('Test Guest')
    cy.get('.iti__selected-flag').should('exist').click() //Select Phone country code
    cy.get('[id*="__item-pk"]').should('exist').and('contain.text', 'Pakistan (‫پاکستان‬‎)').click()
    cy.get('[id*=phone-]').type('{enter}3047557094').should('contain.value', '3047557094')
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
    cy.verifyToast('Data saved Successfully')
    //validate changes saved correctly
    cy.get('td h6[class="guest-name"]').filter(':contains("Test Guest")').eq(0).should('have.text', 'Test Guest')
    cy.get('tr td .guest-email').filter(':contains("' + generatedUserName + '@mailinator.com")').should('contain', generatedUserName + '@mailinator.com');
    cy.get('td [class="badge badge-success"]').eq(1).should('contain', 'Completed') //Validated 2nd guest status
  }
  editGuestDetailAddIDCard(guestType) {
    cy.get('.form-section-title h4').should('contain.text', 'Guest Details') //Guest Detail Heading
    cy.get('td:contains("Incomplete")').eq(0).parents('tr').find('button.guest-edit').should('exist').click() //Edit First incomplete guest
    //Add Guest Detail
    cy.get('.show #exampleModalLabel').should('contain', guestType).and('be.visible')
    cy.get('.show [placeholder="Full name"]').clear().type('Test Guest')
    cy.get('.iti__selected-flag').should('exist').click() //open country code list
    cy.get('#iti-0__item-pk').should('contain.text', 'Pakistan').click() //select Pakistan
    cy.get('.show [id*="phone"]').should('be.visible').type('{selectall}+923047557094') //add phone number
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
    cy.get('.show select[id="8"]').select("Pakistani") //select nationality
    // Enter email
    function generateUserName() {
      let text = "";
      let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

      for (let i = 0; i < 10; i++)
        text += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
      return text;
    }
    const generatedUserName = generateUserName()
    cy.get('.show [placeholder="Email address"]').should('be.visible').clear().type(generatedUserName + '@mailinator.com') //Email
    cy.get('.show [id="9"]').select('Female') //Select gender
    cy.get('.show #update-property-address').clear().type('768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan').wait(2000)
    cy.get('.show [placeholder="Zip code"]').clear().type('54000') //Zipcode
    //Add ID card
    cy.get('.upload-title').should('contain.text', 'ID Card (Front Side)').and('contain.text', 'ID Card (Back Side)')
    cy.get('.upload-document-wrap #id_card_front_file').attachFile('Images/IdCardFront.png').wait(3000) //Attaching front ID
    cy.get('.upload-document-wrap #id_card_back_file').attachFile('Images/IdCardBack.jpeg').wait(3000) //Attaching Back ID
    //Save the changes
    cy.get('button[class="btn btn-success btn-sm"]').click({ force: true }).wait(4000)
    cy.verifyToast('Data saved Successfully')
    //validate changes saved correctly
    cy.get('td h6[class="guest-name"]').filter(':contains("Test Guest")').should('have.text', 'Test Guest')
    cy.get('tr td .guest-email').filter(':contains("' + generatedUserName + '@mailinator.com")').should('contain', generatedUserName + '@mailinator.com');
    cy.get('td [class="badge badge-success"]').eq(1).should('contain', 'Completed') //Validated 2nd guest status
  }
  setAsMainGuest() {
    cy.get('td:contains("Complete")').eq(1).parents('tr').find('button.guest-edit').should('exist').click().wait(1000) //Edit 2nd Complete status guest
    cy.get('.toggle-switch').click().wait(3000) //Enable the toggle to mark as main guest
    cy.get('button[class="btn btn-success btn-sm"]').click({ force: true }).wait(3000) //Save 
    cy.verifyToast('Data saved Successfully')
  }
  goToGuestShareLink() {
    //Go to the guest share link
    cy.wait(2000)
    cy.get('td:contains("Incomplete")').eq(0).parents('tr').find('button.guest-share').click() //First Incomplete Guest
    cy.get('.input-group-append > .btn').click({ force: true }) //Copy Link
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
    cy.get('.iti__selected-flag').should('exist').click() //Select Phone country code
    cy.get('[id*="__item-pk"]').should('exist').and('contain.text', 'Pakistan (‫پاکستان‬‎)').click()
    cy.get('[id*=phone-]').type('{enter}3047557094').should('contain.value', '3047557094')
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
    cy.verifyToast('Data saved Successfully')
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
    cy.get('.iti__selected-flag').should('exist').click() //Select Phone country code
    cy.get('[id*="__item-pk"]').should('exist').and('contain.text', 'Pakistan (‫پاکستان‬‎)').click()
    cy.get('[id*=phone-]').should('exist').type('{enter}3047557094')
    cy.get("button[class='btn btn-primary btn-sm']").should('be.visible').click({ force: true })
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
    cy.verifyToast('Data is not valid')
    cy.xpath("//small[@class='form-text text-danger invalid-feedback']")
      .should('contain', 'Email Address is not valid.')
    cy.xpath("(//input[@id='1'])[1]")
      .clear().type(generatedUserName + '@mailinator.com').wait(4000)
    cy.get("button[class='btn btn-primary btn-sm']")
      .should('be.visible').click({ force: true })
    cy.verifyToast('Data saved Successfully')
  }
  validateAllAddOnServices() {
    cy.get('[class="upsell-header-infos"]').eq(0).should('contain.text', 'E-bike Rental')
    cy.get('[class="upsell-header-infos"]').eq(1).should('contain.text', 'Airport Pickup')
    cy.get('div[class="text-center mt-4 lead fw-500"] span:nth-child(3)')
      .should('have.text', 'CA$0')
    cy.get("label[for='select-all-available-addOns']").click({ force: true }) // Select and validate All Upsells
    cy.get('div[class="text-center mt-4 lead fw-500"] span:nth-child(3)')
      .should('have.text', 'CA$285')
      .then($addsAmount => {
        const adds_on_total = $addsAmount.text();
        cy.log(adds_on_total)
        this.clickSaveContinue() //Save button
        cy.get('[class="table-responsive"] tr:nth-child(2) td:first-child').should('contain.text', 'E-bike Rental')
        cy.get('[class="table-responsive"] tr:nth-child(3) td:first-child').should('contain.text', 'Airport Pickup')
        cy.get('.col-md-4 > .table-responsive > .table > tr > .text-right')
          .then($amountText => {
            const Total = $amountText.text();
            expect(Total).to.include(adds_on_total)
          })
      })
    cy.get('.btn-default').click({ force: true }) //back
    cy.get("label[for*='add_on_check_']").eq(0).click({ force: true }) //Uncheck the first upsell
    cy.get('div[class="text-center mt-4 lead fw-500"] span:nth-child(3)')
      .should('have.text', 'CA$85')
      .then($addsAmount => {
        const adds_on_total = $addsAmount.text();
        cy.log(adds_on_total)
        this.clickSaveContinue()
        cy.get('td:nth-child(1) strong:nth-child(1)').should('contain', 'Airport Pickup')
        cy.get('.col-md-4 > .table-responsive > .table > tr > .text-right')
          .then($amountText => {
            const Total = $amountText.text();
            expect(Total).to.include(adds_on_total)
          })
      })
    cy.get('.btn-default').click({ force: true }) //Back
    cy.get("label[for*='add_on_check_']").eq(1).click({ force: true }).wait(2000)
    cy.get('div[class="text-center mt-4 lead fw-500"] span:nth-child(3)')
      .should('have.text', 'CA$0')
    cy.get("label[for*='add_on_check_']").eq(0).click({ force: true })
    cy.get('div[class="text-center mt-4 lead fw-500"] span:nth-child(3)')
      .should('have.text', 'CA$200')
      .then($addsAmount => {
        const adds_on_total = $addsAmount.text();
        cy.log(adds_on_total)
        this.clickSaveContinue()
        cy.get('td:nth-child(1) strong:nth-child(1)').should('contain', 'E-bike Rental')
        cy.get('.col-md-4 > .table-responsive > .table > tr > .text-right')
          .then($amountText => {
            const Total = $amountText.text();
            expect(Total).to.include(adds_on_total)
          })
      })
  }
  validateAddOnCreditCardTab() {
    cy.get(':nth-child(5) > .form-section-title > h4').should('contain.text', 'ADD-ON SERVICES') //heading
    cy.get('.card-inset-table tr:first-child').should('contain.text', 'Add on services').and('contain.text', 'Day')
      .and('contain.text', 'Person').and('contain.text', 'Unit Price').and('contain.text', 'Total') //First heading row

    let totalSum = 0
    cy.get('.card-inset-table tr td:nth-child(5)').each(element => { // Extract the upsell price from each row
      const priceText = element.text().trim()
      // Remove non-numeric characters
      const price = parseFloat(priceText.replace(/[^\d.]/g, ''))
      // Add the price to the total sum
      totalSum += price
    }).then(() => {
      cy.wrap(totalSum).as('totalSum')
      cy.get('table .text-success').scrollIntoView().should('be.visible').invoke('text').then(text => { // Extract the Total upsell amount
        const priceText = text.trim()
        // Remove non-numeric characters
        const TotalPrice = parseFloat(priceText.replace(/[^\d.]/g, ''))
        expect(totalSum).to.be.eq(TotalPrice)
      })
      cy.get('[data-test="precheckinSaveBtnOne"] span span').should('be.visible').invoke('text').then(text => {// Extract the Total upsell amount from pay button
        const priceText = text.trim()
        // Remove non-numeric characters
        const TotalPrice = parseFloat(priceText.replace(/[^\d.]/g, ''))
        expect(totalSum).to.be.eq(TotalPrice)
      })
    })

  }
  allAddOnServices() {
    cy.get('[class="upsell-header-infos"]').eq(0).should('contain.text', 'E-bike Rental').and('be.visible')
    cy.get('[class="upsell-header-infos"]').eq(1).should('contain.text', 'Airport Pickup').and('be.visible')
    cy.get("label[for='select-all-available-addOns']").click({ force: true }) //Select all
    cy.get('div[class="text-center mt-4 lead fw-500"] span:nth-child(3)')
      .should('contain.text', '$285')
      .then($addsAmount => {
        const adds_on_total = $addsAmount.text();
        cy.log(adds_on_total)
        this.clickSaveContinue() //Save
        cy.get('.col-md-4 > .table-responsive > .table > tr > .text-right')
          .then($amountText => {
            const Total = $amountText.text();
            expect(Total).to.include(adds_on_total)
          })
      })
    this.clickSaveContinue() //Save & Continue
  }
  validateMandatoryAddon() {
    cy.contains('Mandatory Add-on Services').should('be.visible') //Heading
    cy.get('[class="request-badge mandatory"]').parents('.upsell-addon-wrapper').find('.mandatory-checkbox input')
      .should('have.attr', 'disabled', 'disabled') //Mandatory Tag and checkbox
    cy.get('.mandatory .ca-addon-charge').should('be.visible').invoke('text').then(text => {
      const price = text.replace(/[^\d]/g, '') // Remove all non-numeric characters
      cy.log("Mandatory Upsell Price: " + price)
      cy.get('.text-center.mt-4 span:nth-child(3)').should('exist').invoke('text').then(text => {
        const addOnTotal = text.replace(/[^\d]/g, '') // Remove all non-numeric characters
        cy.log("Add-on Total : " + addOnTotal)
        expect(addOnTotal).to.be.eq(price)
      })
    })

  }
  selectAddOnService1() {
    cy.get('[class="upsell-header-infos"]').eq(0).should('contain.text', 'E-bike Rental')
    cy.get('[class="upsell-header-infos"]').eq(1).should('contain.text', 'Airport Pickup')
    cy.get('label[for*="add_on_check_"]').eq(1).click({ force: true }) //Airport Pickup
    cy.get('div[class="text-center mt-4 lead fw-500"] span:nth-child(3)')
      .should('contain.text', '$85')
      .then($addsAmount => {
        const adds_on_total = $addsAmount.text();
        cy.log(adds_on_total)
        this.clickSaveContinue() //Save
        cy.get('.col-md-4 > .table-responsive > .table > tr > .text-right')
          .then($amountText => {
            const Total = $amountText.text();
            expect(Total).to.include(adds_on_total)
          })
      })
    this.clickSaveContinue()
  }
  addCreditCardInfo() {
    cy.get('.mb-4 > .form-section-title > h4').should('contain', 'PAYMENT SUMMARY').and('be.visible').wait(3000)
    /*
    cy.getIframeBody('#card-number-element iframe[name*="__privateStripeFrame"]')
      .find('input[name="cardnumber"]').should('be.visible').and('be.enabled').type('4242424242424242') //card number
    cy.getIframeBody('#card-expiry-element iframe[name*="__privateStripeFrame"]')
      .find('input[name="exp-date"]').should('be.visible').and('be.enabled').type('1229', { force: true })  // expiry
    cy.getIframeBody('#card-cvc-element iframe[name*="__privateStripeFrame"]')
      .find('input[name="cvc"]').should('be.visible').and('be.enabled').type('123', { force: true })    //cvc
    cy.get('#postal-code').should('be.visible').type('45000') //Postal Code
    */
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('#card-element').should('exist').within(() => {
      cy.fillElementsInput('cardNumber', '4242424242424242')
      cy.fillElementsInput('cardExpiry', '1025') // MMYY
      cy.fillElementsInput('cardCvc', '123')
      cy.fillElementsInput('postalCode', '90210')
    })
    this.clickSaveContinue()
  }
  validateCreditCardFields() {
    cy.get('.stripe-add-card').should('be.visible').and('contain.text', '+ ADD CREDIT CARD') //+ ADD CREDIT CARD
    cy.get('[for="full_name"]').should('be.visible').and('contain.text', 'Name On Card') //Name label
    cy.get('[placeholder="Name On Card"]').should('exist') //Name input field
    cy.get('[for="card-element"]').should('contain.text', 'Credit/Debit Card') //Credit/Debit card label
    cy.wait(3000)
    this.clickSaveContinue()
    cy.get('#card-input-errors').should('contain.text', 'Your card number is incomplete.')
    cy.verifyToast('Your card number is incomplete')
  }
  paymentMethodValidation() {
    cy.get(':nth-child(3) > .form-section-title > h4').should('contain', 'PAYMENT METHOD')
    cy.get(':nth-child(18) > :nth-child(4) > .gp-dl > :nth-child(2)').should('contain', 'QA Tester')
    cy.get(':nth-child(18) > :nth-child(4) > .gp-dl > :nth-child(3)').should('contain', '**** **** **** 4242')
  }
  addAndValidateSignature() {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('canvas').should('exist').then($canvas => {
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
    cy.get('[id="customCheck2"]').if().check({ force: true }) //if Terms and conditions checkbox then enable it
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    this.clickSaveContinue()
    cy.get('.page-title').should('contain', 'Welcome') //Guest portal
  }
  validatePaymentSummary(RCAmount, SDAmount) {
    cy.get('.form-section-title').eq(0).should('be.visible').and('contain.text', 'PAYMENT SUMMARY') //heading
    cy.get('.default-badge').should('be.visible').invoke('text').then(count => { //Count on badge
      cy.get('body').then(body => {
        const paymentCount = body.find('.payment-border').length //Payment items count
        expect(parseInt(paymentCount)).to.be.eq(parseInt(count))
      })
    })
    cy.get('.payment-border').eq(0).should('contain.text', 'Reservation Charge') //Reservation Charge
    cy.get('.payment-border').eq(0).find('.fa-dollar-sign').should('be.visible')  //Dollar icon
    cy.get('.default-row.payment-border td:nth-child(2)').eq(0).should('exist').should('contain.text', RCAmount) //Reservation Amount
    cy.get('.payment-border td:nth-child(3) .badge').eq(0).should('exist') //Status badge

    cy.get('.payment-border').eq(1).should('contain.text', 'Security Deposit') //Security Deposit
    cy.get('.payment-border').eq(1).find('.fa-lock').should('be.visible')  //Lock icon
    cy.get('.default-row.payment-border td:nth-child(2)').eq(1).should('exist').should('contain.text', SDAmount) //Security Deposit Amount
    cy.get('.payment-border td:nth-child(3) .badge').eq(1).should('exist') //Status badge

  }

  //Summary Page 
  verifySummaryContactInfo() {
    cy.wait(3000)
    cy.get(':nth-child(3) > .col-12 > .form-section-title > h4').should('contain', 'CONTACT INFO')
    cy.get(':nth-child(4) > .row > :nth-child(2) > .gp-dl > dd').should('contain', '+923047557094')
    cy.get(':nth-child(4) > .row > :nth-child(3) > .gp-dl > dd').should('contain', 'Jan 08, 1992')
    cy.get(':nth-child(4) > .row > :nth-child(4) > .gp-dl > dd').should('contain', 'Pakistani')
    cy.get(':nth-child(6) > .gp-dl > dd').should('contain', 'Male')
    cy.get(':nth-child(7) > .gp-dl > dd')
      .should('contain', '768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town')
    cy.get(':nth-child(8) > .gp-dl > dd').should('contain', '54000')
    cy.get(':nth-child(9) > .gp-dl > dd > :nth-child(1)').if().should('contain', 'Adult')
    cy.get(':nth-child(9) > .gp-dl > dd > :nth-child(2)').if().should('contain', 'Child')
  }
  verifyGuestCountOnSummary(adult, child) {
    cy.contains('Number of Guest').parents('[class="gp-dl dl-with-icon"]').find('dd').then(ele => {
      const count = ele.text()
      cy.log(count)
      if (parseInt(count) === (parseInt(adult) + parseInt(child))) {
        cy.get(ele).should('contain.text', '1')
      }
      else {
        cy.get(ele).should('contain.text', adult).and('contain.text', child)
      }
    })

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
    cy.get(':nth-child(17) > :nth-child(2) > .gp-dl > dd').should('contain', '16:00')
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
  verifySummaryPaymentMethod(fullName) {
    cy.get(':nth-child(3) > .form-section-title > h4').should('contain', 'PAYMENT METHOD')
    cy.get(':nth-child(18) > :nth-child(4) > .gp-dl > :nth-child(2)').should('contain', fullName)
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
    this.clickSaveContinue()
    cy.get('.page-title').should('contain', 'Welcome')
  }
  getGuestPhone() {
    return cy.get('.col-md-6:nth-child(2) dl dd').eq(1).invoke('text')
  }
  getGuestDOB() {
    return cy.get('.col-md-6:nth-child(3) dl dd').eq(1).invoke('text').then(text => {
      const date = new Date(text);
      // Get day, month, and year components
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const year = date.getFullYear();
      // Format the date in the desired format
      const formattedDate = `${day}-${month}-${year}`;
      return formattedDate
    })

  }

  //Welcome Page
  validateWelcomeMessage() {
    cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').and('be.visible')
    cy.get('.text-md > span').should('contain', 'Please start Pre Check-in').should('be.visible')
    cy.get(':nth-child(1) > :nth-child(2) > .dl-with-icon > dt').should('be.visible').and('contain.text', 'Amount')
  }
  validateBookingSource(bSource) {
    cy.get('.text-md > span').should('contain.text', 'Please start Pre Check-in').and('be.visible')
    cy.get('[class="gp-property-dl small"]').should('contain.text', 'Booked through').and('contain.text', bSource)
  }
  validatePropertyName(propName) {
    cy.get('.text-md > span').should('contain.text', 'Please start Pre Check-in').and('be.visible')
    cy.get('.welcome-guest-header > .mb-0').should('contain.text', 'Welcome').and('be.visible')
    cy.get('[class="gp-property-legend"] p').should('contain.text', propName).and('be.visible')
  }
  validateCompanyName(companyName) {
    cy.get('.text-md > span').should('contain.text', 'Please start Pre Check-in').and('be.visible')
    cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').and('be.visible')
    cy.get('[class="gp-property-legend"] p').should('contain.text', companyName)
  }
  validateReferenceNo(bookingID) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('span.single-line').should('be.visible').and('contain.text', bookingID)
  }
  validateSourceType(bSource) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.gp-property-dl').should('be.visible').and('contain.text', bSource)
  }
  validateTxAmount(tAmount) {
    cy.get('.loading-label').should('not.exist').wait(2000) //loader should be disappear
    cy.get('[class="col-lg-6 col-md-6 col-xs-6"] dd').eq(1).should('be.visible').and('contain.text', tAmount)
  }
  validateCheckinDate(checkInDate) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[class="col-lg-6 col-md-6 col-xs-6"] dd').eq(2).then($cIn => {
      const dateCheckIn = $cIn.text().replace(/,/g, '')
      cy.log(dateCheckIn)
      cy.wrap(dateCheckIn).should('eq', checkInDate)
    })
  }
  validateCheckoutDate(checkOutDate) {
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[class="col-lg-6 col-md-6 col-xs-6"] dd').eq(3).then($cOut => {
      const dateCheckOut = $cOut.text().replace(/,/g, '')
      cy.log(dateCheckOut)
      cy.wrap(dateCheckOut).should('eq', checkOutDate)
    })
  }

  //BASIC INFO
  validateFullNameOnWelcome(fName) {
    cy.get('input[placeholder="Full name"]').should('have.value', fName)
  }
  validateEmail(email) {
    cy.get('[placeholder="Email address"]').should('have.value', email)
  }
  validateAdultCount(adultCount) {
    cy.get('[id="guestAdults"]').invoke('val').then((text) => {
      cy.wrap(text).should('eq', adultCount)
    })
  }
  validateChildCount(childCount) {
    cy.get('[id="guestChildren"]').invoke('val').then((text) => {
      cy.wrap(text).should('eq', childCount)
    })
  }
  //GUEST TAB
  validateFullNameOnGuestTab(fName) {
    cy.get('table[class="table guest-table"] h6[class="guest-name"]').invoke('text').then((text) => {
      cy.wrap(text).should('eq', fName) //Validate Guest Name
    })
  }
  validateEmailOnGuestTab(emailText) {
    cy.get("table[class='table guest-table'] span[class='guest-email']").invoke('text').then((text) => {
      cy.wrap(text).should('eq', emailText) //Validate Email
    })
  }
  validateGuestCountOnGuestTab(count) {
    cy.get('div[class="gp-box gp-box-of-inner-pages page-tab-01 pre-checkin-tabs"] h4:nth-child(1)').should('contain.text', 'Guest Details').and('contain.text', count)
    cy.get('td .guest-type').then($elements => {
      const size = $elements.length.toString()
      cy.wrap(size).should('eq', count)
    })
  }

  validatePropertyNameOnSummaryPage(propName) {
    cy.get('.page-title').should('contain', 'Your Summary')
    cy.get('[class="gp-property-legend"] p').should('contain.text', propName).and('be.visible')
  }
  validateCompanyNameOnSummaryPage(companyName) {
    cy.get('.page-title').should('contain', 'Your Summary')
    cy.get('[class="gp-property-legend"] p').should('contain.text', companyName).and('be.visible')
  }
  validateSourceOnSummaryPage(bSource) {
    cy.get('[class="gp-property-legend"] [class="gp-property-dl small"] span').should('contain.text', bSource)
  }
  validateBookingIDonSummaryPage(bookingID) {
    cy.get('div[class="col"] h4').should('contain', 'REVIEW BOOKING DETAILS')
    cy.get('.col-md-12 > .row > :nth-child(1) > .gp-dl > dd').should('contain.text', bookingID)
  }
  validateTxAmountOnSummaryPage(tAmount) {
    cy.get('[class="gp-dl dl-with-icon"] dd').eq(1).should('contain.text', tAmount)
  }
  validateCheckinDateOnSummaryPage(checkInDate) {
    cy.get('[class="gp-dl dl-with-icon"] dd').eq(2)
      .then(($sCIn) => {
        const myCheckInDate = $sCIn.text().replace(/,/g, '');
        cy.log(myCheckInDate)
        cy.wrap(myCheckInDate).should('eq', checkInDate)
      })
  }
  validateCheckoutDateOnSummaryPage(checkOutDate) {
    cy.get('[class="gp-dl dl-with-icon"] dd').eq(3)
      .then(($sCOut) => {
        const myCheckOutDate = $sCOut.text().replace(/,/g, '');
        cy.log(myCheckOutDate)
        cy.wrap(myCheckOutDate).should('eq', checkOutDate)
      })
  }
  verifyFullNameOnSummaryPage(fName) {
    cy.get(':nth-child(4) > .row > :nth-child(1) > .gp-dl > dd').should('contain.text', fName)
  }
  verifyEmailOnSummaryPage(email) {
    cy.get(':nth-child(5) > .gp-dl > dd').should('contain.text', email)
  }
}

