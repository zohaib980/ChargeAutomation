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

describe('Guest Experience Settings > Collect Passport/ID of Guest', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'QA Test Property'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword)
  })
  //Collect Passport/ID of Guest
  it('CA_CPIG_01 > Collect Passport/ID of Guest: Validate If Collect Passport/ID of Guest section is OFF then it will not show be shown on Verification tab in pre-checkin', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableGuestPassportIDToggle()
    onlineCheckinSettings.enableCreditCardScanOfGuestToggle()
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
  
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.removePassportExemptedCountry() //Revert the settings
  })
  it('CA_CPIG_06 > Collect Passport/ID of Guest: Validate Document upload instructions should be visible on the pre-checkin', () => {
    onlineCheckinSettings.setDocInstructions()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
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
    
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.removeDocInstructions() //Revert the settings
  })
  it('CA_CPIG_09 > Collect Passport/ID of Guest: Guest can only upload following type of documents jpeg, png, jpg, heif, heic, pdf', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.selectLicenseAndIDcard()
    onlineCheckinSettings.enableCreditCardScanOfGuestToggle()
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
    preCheckIn.uploadDocuments('Images/IdCardFront.jpeg', 'Images/IdCardBack.jpeg', 'Images/CreditCard.jpeg')
    preCheckIn.uploadDocuments('Images/IdCardFront.png', 'Images/IdCardBack.png', 'Images/CreditCard.png')
    preCheckIn.uploadDocuments('Images/IdCardFront.jpg', 'Images/IdCardBack.jpg', 'Images/CreditCard.jpg')
    preCheckIn.uploadDocuments('Images/IdCardFront.heif', 'Images/IdCardBack.heif', 'Images/CreditCard.heif')
    preCheckIn.uploadDocuments('Images/IdCardFront.heic', 'Images/IdCardBack.heic', 'Images/CreditCard.heic')
    
  })
})

