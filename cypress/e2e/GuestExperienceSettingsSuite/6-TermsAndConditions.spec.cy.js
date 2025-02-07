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

describe('Guest Experience Settings > Terms and Conditions', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'QA Test Property'
  const bSource = 'Direct'
  
  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword)
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
    cy.get('h1[class="page-title"]').should('contain.text', 'Your Summary')
    cy.get('[class="gp-property-dl small"]').should('contain.text','Booked with')
    cy.get('[id="customCheck2"]').should('not.exist') //terms & conditions check will not be shown
  })
  it('CA_TC_002 > Terms and Conditions: If Property is not matching with selected booking source then "Terms & Conditions" options will not shown on precheckin (your summmary)', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.enableCollectAcceptanceTermsConditionToggle()
    onlineCheckinSettings.setTermsConditionSource('NewBS')
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
    cy.get('h1[class="page-title"]').should('contain.text', 'Your Summary')
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
    cy.get('h1[class="page-title"]').should('contain.text', 'Your Summary')
    cy.get('[id="customCheck2"]').should('exist') //Terms & conditions check will be shown
    cy.get('[data-test="precheckinSaveBtn"]').should('not.be.enabled') //Save & Continue
    cy.get('[id="customCheck2"]').should('exist').click({force: true}) //Check Terms & conditions
    preCheckIn.clickSaveContinue()

    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.setTermsConditionSource('All Booking Source')
    onlineCheckinSettings.enableAllToggles()
  })

})

