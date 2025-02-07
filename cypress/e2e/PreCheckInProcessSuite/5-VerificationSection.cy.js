/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"
import { PropertiesPage } from "../../../pageObjects/PropertiesPage"
import { ReuseableCode } from "../../support/ReuseableCode"
import { Dashboard } from "../../../pageObjects/Dashboard"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn
const bookingDetailPage = new BookingDetailPage
const propertiesPage = new PropertiesPage
const reuseableCode = new ReuseableCode
const dashboard = new Dashboard

describe('PreCheckin - Verification Tab test cases', function () {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Waqas DHA'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
  })
  it('CA_PCW_05 > Validate the upload Id card and Credit Card Validation', () => {
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    onlineCheckinSettings.enableCollectArrivaltimeToggle(bSource)
    onlineCheckinSettings.setCollectPassportIDofGuestSource(bSource)
    onlineCheckinSettings.enableCreditCardScanOfGuestToggle()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
  })
  it('CA_PCW_06 > Validate the upload Driving License and Credit Card Validation', () => {
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    onlineCheckinSettings.setCollectPassportIDofGuestSource(bSource)
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateDrivingDoc() //Add and validate Driving License & Credit card
  })
  it('CA_PCW_17 > On Verification tab, guest can update any of the identification docs until it approves from the client', () => {

    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.enableGuestPassportIDToggle()
    onlineCheckinSettings.enableCreditCardScanOfGuestToggle()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    onlineCheckinSettings.disableSelfiePictureToggle()
    //Create a new booking
    bookingPage.goToBookingPage()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
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
    //Verification Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards

    //Update doc on verification tab
    preCheckIn.updateIDLicenseOnVerification()

    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    bookingPage.goToBookingPage()

    //Approve docs on booking    
    bookingPage.ApproveBookingDoc('id_card_front')
    bookingPage.ApproveBookingDoc('id_card_back')
    bookingPage.ApproveBookingDoc('credit_card')

    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => {
      cy.visit(precheckinlink).wait(3000)
    })
    //Update option will not be shown on doc at verification tab 
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('.gp-step.step-completed').contains('Verification').should('be.visible').click()
    cy.get('.form-section-title').should('be.visible').and('contain.text', 'Uploaded').and('contain.text', 'Document(s)') //heading
    cy.get('.fa-pencil-alt').should('not.exist') //pencil icon

  })
})