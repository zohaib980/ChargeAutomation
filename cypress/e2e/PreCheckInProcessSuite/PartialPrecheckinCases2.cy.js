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

describe('Partial PreCheckin link test Scenarios - Verification tab to Credit card tab', function () {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Waqas DHA'
  const bSource = 'TEST_PMS_NO_PMS'
  const guestAddress = '768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan'
  const postalCode = '54000'

  beforeEach(() => {
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
  })
  it('CA_PCW_15 > Validate add on services', () => {

    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    preCheckIn.takeSelfy() //Add selfy and click Save & Continue
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Click Save & Continue to Skip the guest tab
    preCheckIn.validateAllAddOnServices()
  })
  it('CA_PCW_16 > Validate enabled/disabled properties status on "Create booking" popup', () => {
    propertiesPage.goToProperties()
    const propName = 'Test Property1'
    propertiesPage.disableProperty(propName) //Disable the status of a property
    bookingPage.goToBookingPage()
    bookingPage.validateDeactivateProperty(propName) //On create booking popup validate that property does not exists
    propertiesPage.goToProperties()
    propertiesPage.enableProperty(propName) //Enable the status of a property
    bookingPage.goToBookingPage()
    bookingPage.validateActiveProperty(propName) //On create booking popup validate that property exists
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

    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    bookingPage.goToBookingPage()

    //Approve docs on booking    
    bookingPage.ApproveBookingDoc('id_card_front')
    bookingPage.ApproveBookingDoc('id_card_back')
    bookingPage.ApproveBookingDoc('credit_card')

    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => {
      cy.visit(precheckinlink)
    })
    //Update option will not be shown on doc at verification tab
    cy.get('.gp-step.step-completed').contains('Verification').should('be.visible').click()
    cy.get('.form-section-title').should('be.visible').and('contain.text', 'Uploaded').and('contain.text', 'Document(s)') //heading
    cy.get('.fa-pencil-alt').should('not.exist') //pencil icon

  })
  it('CA_PCW_18 > On Verification tab, guest can update any of the identification docs until it approves from the client', () => {

    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableCollectBasicInfoToggle()
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
    //Basic info Tab
    preCheckIn.addBasicInfo()
    //Questionnaire Tab
    preCheckIn.skipQuestionnaires()
    //Verification Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    //Update doc on Guest tab
    preCheckIn.updateIDLicenseOnGuestTab()
    cy.get('@docUpdateStatus').then(docUpdateStatus => {
      expect(docUpdateStatus).to.be.true; // docs updated successfully
    })

    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    bookingPage.goToBookingPage()

    //Approve docs on booking    
    bookingPage.ApproveBookingDoc('id_card_front')
    bookingPage.ApproveBookingDoc('id_card_back')
    bookingPage.ApproveBookingDoc('credit_card')

    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => {
      cy.visit(precheckinlink)
    })
    //Update doc on Guest tab
    preCheckIn.updateIDLicenseOnGuestTab()
    cy.get('@docUpdateStatus').then(docUpdateStatus => {
      expect(docUpdateStatus).to.be.false //doc upload option is not shown after approving docs
    })


  })
  it('CA_PCW_19 > On Add-on tab, if any mandatory upsell is available then the guest is not able to skip this step', () => {

    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    onlineCheckinSettings.disableCollectArrivaltimeToggle()
    onlineCheckinSettings.disableGuestPassportIDToggle()
    onlineCheckinSettings.disableCreditCardScanOfGuestToggle()
    onlineCheckinSettings.disableSelfiePictureToggle()
    //Create a new booking
    bookingPage.goToBookingPage()
    let propName = 'Test Property2' //contain a mandatory upsell
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1)
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
    //Add-on Tab
    preCheckIn.validateMandatoryAddon()
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