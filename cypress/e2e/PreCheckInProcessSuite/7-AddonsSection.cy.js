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

describe('Precheckin - Add-on tab test cases', function () {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Waqas DHA'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
  })
  it('CA_PCW_15 > Validate add on services', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    preCheckIn.takeSelfy() //Add selfy and click Save & Continue
    preCheckIn.clickSaveContinue() //Click Save & Continue to Skip the guest tab
    preCheckIn.validateAllAddOnServices()
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
})