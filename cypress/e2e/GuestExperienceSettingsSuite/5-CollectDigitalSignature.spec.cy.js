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

describe('Guest Experience Settings > Collect Digital Signature', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'QA Test Property'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword)
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
    onlineCheckinSettings.setCollectDigitalSignatureSource('NewBS')
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
})

