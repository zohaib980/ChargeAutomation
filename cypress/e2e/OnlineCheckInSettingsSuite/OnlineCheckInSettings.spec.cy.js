/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"
import { ReuseableCode } from "../../support/ReuseableCode"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn
const bookingDetailPage = new BookingDetailPage
const reuseableCode = new ReuseableCode

describe('Test Online CheckIn Settings Functionalities', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'QA Test Property'
  const bSource = 'TEST_PMS_NO_PMS'
  const guestAddress = '768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan'
  const postalCode = '54000'

  beforeEach(() => {
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
  })
  //Collect Basic Information From Guest 
  it('CA_CBIFG_01 > Validate all basic info fields on precheckin when all "Collect Basic Detail" options are enabled from guest experience settings', () => {
    onlineCheckinSettings.checkAllCollectBasicDetailCheckboxes()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.setAllBookingSource()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => { cy.wrap(href).as('precheckinlink') }) // Alias precheckinlink using cy.wrap()
    // Here we will copy and Visit the Pre Check-In process after logout from the portal
    bookingDetailPage.goToBookingDetailPage(propName) // Visit the booking detail page of first booking
    bookingDetailPage.getBookingID().then(text => { cy.wrap(text).as('bookingID') })             // Alias bookingID using cy.wrap()
    bookingDetailPage.getBookingSource().then(text => { cy.wrap(text).as('bookingSource') })     // Alias bookingSource using cy.wrap()
    bookingDetailPage.getCheckinDate().then(text => { cy.wrap(text).as('checkInDate') })         // Alias checkInDate using cy.wrap()
    bookingDetailPage.getCheckOutDate().then(text => { cy.wrap(text).as('checkOutDate') })       // Alias checkOutDate using cy.wrap()
    bookingDetailPage.getAdultCount().then(text => { cy.wrap(text).as('adultCount').should('eq', adult.toString()) }) //Alias adultCount using cy.wrap()
    bookingDetailPage.getChildCount().then(text => { cy.wrap(text).as('childCount').should('eq', child.toString()) }) //Alias childCount using cy.wrap()
    bookingDetailPage.getFullName().then(text => { cy.wrap(text).as('fullName') })               // Alias fullName using cy.wrap()
    bookingDetailPage.getGuestEmail().then(text => { cy.wrap(text).as('email') })                // Alias email using cy.wrap()
    bookingDetailPage.getTrxAmount().then(text => { cy.wrap(text).as('TrxAmount') })             // Alias TrxAmount using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page On Precheckin
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.validatePropertyName(propName) //Validate propertyName on Precheckin Page
    cy.get('@bookingID').then(bookingID => { preCheckIn.validateReferenceNo(bookingID) })            // Validate Reference Number
    cy.get('@bookingSource').then(bookingSource => { preCheckIn.validateSourceType(bookingSource) }) // Validate Soruce type
    cy.get('@TrxAmount').then(TrxAmount => { preCheckIn.validateTxAmount(TrxAmount) })               // Validate Amount
    cy.get('@checkInDate').then(checkInDate => { preCheckIn.validateCheckinDate(checkInDate) })      // Validate check In date
    cy.get('@checkOutDate').then(checkOutDate => { preCheckIn.validateCheckoutDate(checkOutDate) })  // Validate CheckOut Date
    preCheckIn.clickSaveContinue() //Save & Continue
    //BASIC INFO
    cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
    cy.wait(3000)
    cy.get('@fullName').then(fullName => {
      preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
    })
    cy.get('@email').then(email => {
      preCheckIn.validateEmail(email)                 //Validate email
    })
    cy.get('@adultCount').then(adultCount => {
      preCheckIn.validateAdultCount(adultCount)       //Validate Adult Count
    })
    cy.get('@childCount').then(childCount => {
      preCheckIn.validateChildCount(childCount)       //Validate Child Count
    })
    const phone = reuseableCode.getRandomPhoneNumber()  //Generate a random phone Number
    preCheckIn.addAndValidateBasicInfo(phone, adult, child, guestAddress, postalCode)
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION') //Validate ARRIVAL Tab 
  })
  it('CA_CBIFG_02 > Validate that on precheckin the basic info tab will not be shown when "Collect Basic Information From Guest(s)" toggle is disable', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()                //Save & Continue
    //As Basic Info Toggle is OFF, this tab will not be shown
    cy.get('[data-test="precheckinSaveBtnOne"]').should('exist').wait(5000) //Save button should be shown
    cy.get('[class="fa fa-info"]').should('not.exist') //Basic Info should not exist
  })
  //Collect Arrival time & arrival method
  it('CA_CITG_01 > Validate that If "Collect Arrival time & arrival method " section is OFF from guest settings then it will not show on pre-checkin', () => {
    onlineCheckinSettings.checkAllCollectBasicDetailCheckboxes()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.enableGuestPassportIDToggle()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()                //Save & Continue
    cy.wait(5000)
    //as Collect Arrival time & Arrival Method is OFF arrival tab will not be shown
    cy.get('[data-test="precheckinSaveBtnOne"]').should('exist').wait(5000) //Save button should be shown
    cy.get('[class="fas fa-plane-arrival"]').should('not.exist') //Arrival tab will not be shown
  })
  it("CA_CITG_02 > Collect Arrival time & arrival method: If Booking's channel of Arrival source is not matching with selected booking source then this section will not show", () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableCollectBasicInfoToggle()
    onlineCheckinSettings.enableCollectArrivaltimeToggle()
    onlineCheckinSettings.setArrivalBySource('Direct') //Set arrival by method
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()                //Save & Continue
    cy.wait(5000)
    //as Collect Arrival time & Arrival Method is OFF arrival tab will not be shown
    cy.get('[data-test="precheckinSaveBtnOne"]').should('exist').wait(5000) //Save button should be shown
    cy.get('[class="fas fa-plane-arrival"]').should('not.exist') //Arrival tab will not be shown
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setArrivalBySource('All Booking Source') //Revert the settings
  })
  it('CA_CITG_03 > Collect Arrival time & arrival method: Default "Estimate Arrival Time" should be property "Standard Check-In" If available on arrival tab', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    onlineCheckinSettings.setArrivalBySource('All Booking Source')
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()                //Save & Continue
    cy.get('[data-test="precheckinSaveBtnOne"]').should('exist').wait(5000) //Save button should be shown
    cy.get('[class="fa fa-info"]').should('not.exist') //basic info is OFF
    cy.get('[class="fas fa-plane-arrival"]').should('exist')
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000) //Validate Heading
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time')
    cy.get("#standard_check_in_time").should('contain', '4:00')
  })
  //Collect Passport/ID of Guest
  it('CA_CPIG_01 > Collect Passport/ID of Guest: Validate If Collect Passport/ID of Guest section is OFF then it will not show be shown on Verification tab in pre-checkin', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableGuestPassportIDToggle()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()                //Save & Continue
    cy.get('[data-test="precheckinSaveBtnOne"]').should('exist').wait(5000) //Save button should be shown
    cy.get('[class="fas fa-file-signature"]').should('exist') //Verification tab will be shown but only shows credit card
    cy.get('[id="drivers_license"]').should('not.exist')  // Drv license will not be shown
    cy.get('[id="id_card"]').should('not.exist')          // ID card will not be shown
  })
  it('CA_CPIG_02 > Collect Passport/ID of Guest: Validate that If Booking source is not matching with selected booking source then ID/Passport option will not be shown on Verification tab on precheckin', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.enableGuestPassportIDToggle()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('Direct')
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()                //Save & Continue
    //VERIFICATION TAB
    cy.get('[data-test="precheckinSaveBtnOne"]').should('exist').wait(5000) //Save button should be shown
    cy.get('[class="fas fa-file-signature"]').should('exist') //Verification tab 
    //On VERIFICATION tab only DRIVING License option will be shown as the Booking Source is different
    cy.get("div[class='form-section-title'] h4").should('contain.text', 'Upload Document(s)').wait(1000)
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source') //Revert the settings
  })
  it('CA_CPIG_03 > Collect Passport/ID of Guest: If Select acceptable identification types is Drivers License or ID Card then front and back document will appear', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.selectLicenseAndIDcard()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source')
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()                //Save & Continue
    //VERIFICATION TAB
    cy.get('[data-test="precheckinSaveBtnOne"]').should('exist').wait(5000) //Save button should be shown
    cy.get('[class="fas fa-file-signature"]').should('exist') //Verification tab
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload Document(s)')
    cy.get('[for="drivers_license"]').should('contain', "Driver's License")
    cy.get('[for="id_card"]').should('contain', 'ID Card')
    cy.get('.doc-wrap > :nth-child(2) > div > .btn').should('contain', "Upload Driver's License Front")
    cy.get(':nth-child(3) > div > .btn').should('contain', "Upload Driver's License Back")
    cy.get('#id_card').should('not.be.checked').click({ force: true }).wait(2000)
    cy.xpath('//label[normalize-space()="Upload ID Card Front"]').should('contain', 'Upload ID Card Front')
    cy.xpath('//label[normalize-space()="Upload ID Card Back"]').should('contain', 'Upload ID Card Back')
  })
  it('CA_CPIG_04 > Collect Passport/ID of Guest: If Select acceptable identification types is passport then it will show single file upload option', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.selectPassportOnly()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source')
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()                //Save & Continue
    //VERIFICATION tab, shows only passport option to upload
    cy.get('[class="fas fa-file-signature"]').should('exist') //Verification tab
    cy.get("label[for='passport_file'] span span[class='notranslate']").should('contain', 'Upload Passport')
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.selectLicenseAndIDcard() //Revert the settings
  })
  it('CA_CPIG_05 > Collect Passport/ID of Guest: If passport is select for upload and guest nationality belongs to excluded nationality then passport upload option will not show on Verification tab in precheckin', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.selectPassportOnly()
    onlineCheckinSettings.setPassportExemptedCountry('Pakistan') //Set exempted country
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source')
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()                //Save & Continue
    //VERIFICATION tab, shows no passport option to upload
    cy.get('[class="fas fa-file-signature"]').should('exist') //Verification tab
    cy.get("label[for='passport_file'] span span[class='notranslate']").should('not.exist')
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.removePassportExemptedCountry() //Revert the settings
  })
  it('CA_CPIG_06 > Collect Passport/ID of Guest: Validate Document upload instructions should be visible on the pre-checkin', () => {
    onlineCheckinSettings.setDocInstructions()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.enableGuestPassportIDToggle()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()                //Save & Continue
    //VERIFICATION tab
    cy.get('[class="fas fa-file-signature"]').should('exist') //Verification tab
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload Document(s)')
    cy.wait(3000)
    cy.get("div[class='document-instruction'] span[class='translate']").should('have.text', 'Document Upload Instructions')
    cy.get("pre[class='translate']").should('contain', 'Please Upload Your Valid Document here...')
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.removeDocInstructions() //Revert the settings
  })
  //"Collect Credit Card Scan of Guest" 
  it('CA_CGCC_01 > "Collect Credit Card Scan of Guest": This section will be mandatory and guest will not move without uploading document', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.disableGuestPassportIDToggle()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateBookingSource(bSource) 
    preCheckIn.clickSaveContinue()                //Save & Continue
    //VERIFICATION Tab, Only Credit card will be required as "Guest ID/Passport" toggle is OFF
    cy.get("p[class='upload-title'] span[class='translate']").should('contain', 'CREDIT CARD') //CREDIT CARD title
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }).wait(2000) //Save & Continue
    cy.get("small[class='form-text text-danger my-0'] span[class='translate']").should('contain', 'Credit card is required.') //Validate error
    const cardImage = 'Images/visaCard.png'
    cy.get("#credit_card_file").attachFile(cardImage) //Upload credit card
    cy.wait(5000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }).wait(2000) //Save & Continue
  })
  it('CA_CGCC_02 > "Collect Credit Card Scan of Guest": If Bookings channel is not matching with selected booking source then Verification tab will not be shown on precheckin', () => {
    onlineCheckinSettings.setCollectCreditCardScanofGuestSource('Direct')
    onlineCheckinSettings.disableGuestPassportIDToggle()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page
    preCheckIn.validateBookingSource(bSource)
    cy.get('.text-md > span').should('contain', 'Please start Pre Check-in').wait(2000)
    preCheckIn.clickSaveContinue()                //Save & Continue
    cy.wait(5000)
    //As the booking source is different VERIFICATION Tab will not be shown
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }).wait(2000) //Save & Continue
    cy.get('[class="fas fa-file-signature"]').should('not.exist') //Verification tab 
    
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.setCollectCreditCardScanofGuestSource('All Booking Source')
    onlineCheckinSettings.enableCreditCardScanOfGuestToggle()
    onlineCheckinSettings.enableGuestPassportIDToggle() //Revert the settings
  })
  //Collect Digital Signature
  it('CA_CDS_01 > Collect Digital Signature: If this section is OFF then "Digital Signature" canvas will not be shown on pre-checkin (Your summary)', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()   //Save & Continue
    //Credit Card tab
    preCheckIn.addCreditCardInfo()
    //Your Summary
    cy.get('.page-title').should('contain.text','Your Summary') //heading
    cy.get('[class="gp-property-dl small"]').should('contain.text','Booked with')
    cy.get('div[id="signaturePad-wrapper"] canvas').should('not.exist') //Signature Canvas will not be shown

  })
  it('CA_CDS_02 > Collect Digital Signature: If Bookings channel is not matching with selected booking source then Digital signature canvas will not be shown on precheckin (Your summary)', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.setCollectDigitalSignatureSource('Direct')
    onlineCheckinSettings.enableCollectDigitalSignatureToggle()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()   //Save & Continue
    //Credit Card tab
    preCheckIn.addCreditCardInfo()
    //Your Summary
    cy.get('.page-title').should('contain.text','Your Summary') //heading
    cy.get('[class="gp-property-dl small"]').should('contain.text','Booked with')
    cy.get('div[id="signaturePad-wrapper"] canvas').should('not.exist') //Signature Canvas will not be shown
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.setCollectDigitalSignatureSource('All Booking Source')  //Revert the settings
  })
  it('CA_CDS_03 > Collect Digital Signature: This section will be mandatory and guest will not move without signing document if enabled from Guest experience settings', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.setCollectDigitalSignatureSource('All Booking Source')
    onlineCheckinSettings.enableCollectDigitalSignatureToggle()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()   //Save & Continue
    //Credit Card tab
    preCheckIn.addCreditCardInfo()
    //Your Summary
    cy.get('.page-title').should('contain.text','Your Summary') //heading
    cy.get('[class="gp-property-dl small"]').should('contain.text','Booked with')
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    cy.get('.toast-message').should('contain.text', 'Digital Signature is required').wait(1000) //Error will be shown as signatures are missing
    preCheckIn.addAndValidateSignature()
  })
  //Terms and Conditions
  it('CA_TC_001 > Terms and Conditions: If this section is OFF then terms and conditions checkbox will not show on pre-checkin', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()   //Save & Continue
    //Credit Card tab
    preCheckIn.addCreditCardInfo()
    //Your Summary
    cy.get('.page-title').should('contain.text','Your Summary') //heading
    cy.get('[class="gp-property-dl small"]').should('contain.text','Booked with')
    cy.get('[id="customCheck2"]').should('not.exist') //terms & conditions check will not be shown
  })
  it('CA_TC_002 > Terms and Conditions: If Property is not matching with selected booking source then "Terms & Conditions" options will not shown on precheckin (your summmary)', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.enableCollectAcceptanceTermsConditionToggle()
    onlineCheckinSettings.setTermsConditionSource('Direct')
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()   //Save & Continue
    //As all toggles are OFF user will be directed to Credit card tab
    preCheckIn.addCreditCardInfo()
    //On Summary Screen validate the heading
    cy.get('.page-title > .translate').should('contain.text', 'Your Summary')
    cy.get('[id="customCheck2"]').should('not.exist') //Terms & conditions check will not be shown as the booking source is different
    preCheckIn.clickSaveContinue()
  })
  it('CA_TC_003 > Terms & condition option will be mandatory and guest will not move without signing document if "Terms & Conditions" toggle is enabled from guest experience settings', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.enableCollectAcceptanceTermsConditionToggle()
    onlineCheckinSettings.setTermsConditionSource('All Booking Source')
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue()   //Save & Continue
    //As all toggles are OFF user will be directed to Credit card tab
    preCheckIn.addCreditCardInfo()
    //Your Summary
    cy.get('.page-title > .translate').should('contain.text', 'Your Summary')
    cy.get('[id="customCheck2"]').should('exist') //Terms & conditions check will be shown
    cy.get('[data-test="precheckinSaveBtn"]').should('not.be.enabled') //Save & Continue
    cy.get('[id="customCheck2"]').should('exist').click({force: true}) //Check Terms & conditions
    preCheckIn.clickSaveContinue()
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.setTermsConditionSource('All Booking Source')
    onlineCheckinSettings.enableAllToggles()
  })

})

