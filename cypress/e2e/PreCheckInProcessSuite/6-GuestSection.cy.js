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

describe('PreCheckin - Guest Tab test cases', function () {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Waqas DHA'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
  })
  it('CA_PCW_07 > Validate Add new Guest functionality', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    preCheckIn.takeSelfy() //Add selfy and Move to guest tab
    preCheckIn.addValidateNewGuest() //Add Guest and Validate the changes
  })
  it('CA_PCW_08 > Validate Delete Guest functionality', () => {

    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    preCheckIn.takeSelfy() //Add selfy and click Save & Continue
    preCheckIn.deleteGuest() //First Add and then delete a new guest
  })
  it('CA_PCW_09 > Validate share link for Guest Registration functionality', () => {
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    preCheckIn.takeSelfy() //Add selfy and click Save & Continue
    preCheckIn.goToGuestShareLink() //Go to the guest share link of First Incomplete Guest
    preCheckIn.guestRegistration(propName) //Fill the guest Registration form and save changes
  })
  it('CA_PCW_10 > Validate share link Guest Registration validations', () => {
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    preCheckIn.takeSelfy() //Add selfy and click Save & Continue
    preCheckIn.goToGuestShareLink() //Go to the guest share link of First Incomplete Guest
    preCheckIn.guestRegValidations(propName) //Validate Guest registration modal fields and add guest data and save changes
  })
  it('CA_PCW_11 > Validate Add guest detail functionality', () => {

    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    preCheckIn.takeSelfy() //Add selfy and click Save & Continue
    preCheckIn.editGuestDetail('Adult') //Add guest details in First incomplete guest and save changes
  })
  it('CA_PCW_13 > Validate Edit Guest detail functionality', () => {
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    preCheckIn.takeSelfy() //Add selfy and click Save & Continue
    preCheckIn.editGuestDetail('Adult') //Edit guest details in First incomplete guest and save changes

  })
  it('CA_PCW_14 > Validate change Main guest functionality', () => {

    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    preCheckIn.takeSelfy() //Add selfy and click Save & Continue
    preCheckIn.editGuestDetail('Adult') //Edit guest details in First incomplete guest and save changes
    cy.reload()
    preCheckIn.setAsMainGuest() //Set the 2nd Complete status guest as Main Guest and save changes
  })
  it('CA_PCW_18 > On Guest tab, guest can update any of the identification docs until it approves from the client', () => {
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
})