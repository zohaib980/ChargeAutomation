/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn
const bookingDetailPage = new BookingDetailPage

describe('PreCheckin - Credit card tab test cases', function () {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Waqas DHA'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
  })
  it('CA_PCW_20 > On credit card tab, Validate Payment summary and ADD-on Services details', () => {

    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.disableGuestPassportIDToggle()
    onlineCheckinSettings.disableCreditCardScanOfGuestToggle()
    onlineCheckinSettings.disableSelfiePictureToggle()

    //Create a new booking
    bookingPage.goToBookingPage()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1)
    //Get RC Amount
    bookingPage.getRCAmmount(0).then(RCAmount => { //first booking
      cy.wrap(RCAmount).as('RCAmount')
    })
    //Get SD Amount
    bookingPage.getSDAmmount(0).then(SDAmount => { //first booking
      cy.wrap(SDAmount).as('SDAmount')
    })

    //Validate newly created booking detail with pre-checkin welcome page
    bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => {
      cy.wrap(href).as('precheckinlink') // Alias precheckinlink using cy.wrap()
    })
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => {
      cy.visit(precheckinlink)
    })
    cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
    cy.wait(2000)

    //Welcome Page On Precheckin
    cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').wait(5000)

    preCheckIn.clickSaveContinue() //Save & Continue
    //Questionnaire Tab
    preCheckIn.skipQuestionnaires()
    //Add-on Tab
    preCheckIn.allAddOnServices()

    //Credit Card tab
    //Validate Payment Summary
    cy.get('@RCAmount').then(RCAmount => {
      cy.get('@SDAmount').then(SDAmount => {
        preCheckIn.validatePaymentSummary(RCAmount, SDAmount)
      })
    })
    //Validate Credit card fields
    preCheckIn.validateCreditCardFields() //Fields and error validation

    //Validate Addon Services
    preCheckIn.validateAddOnCreditCardTab()
  })
})