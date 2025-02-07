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

describe('Guest Experience Settings > Collect Credit Card Scan of Guest', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'QA Test Property'
  const bSource = 'Direct'

  beforeEach(() => {

    loginPage.happyLogin(loginEmail, loginPassword)
  })
  // Collect Credit Card Scan of Guest 
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
    cy.get("p[class='upload-title'] span").should('contain.text', 'CREDIT CARD') //CREDIT CARD title
    preCheckIn.clickSaveContinue()
    cy.get('[class="form-text text-danger my-0"]').should('contain.text', 'Credit card is required.') //Validate error
    const cardImage = 'Images/visaCard.png'
    cy.get("#credit_card_file").attachFile(cardImage) //Upload credit card
    cy.wait(5000)
    preCheckIn.clickSaveContinue()
  })
  it('CA_CGCC_02 > "Collect Credit Card Scan of Guest": If Bookings channel is not matching with selected booking source then Verification tab will not be shown on precheckin', () => {
    onlineCheckinSettings.setCollectCreditCardScanofGuestSource('NewBS')
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
    preCheckIn.clickSaveContinue()  //Save & Continue
    //As the booking source is different VERIFICATION Tab will not be shown
    preCheckIn.clickSaveContinue()  //Save & Continue
    cy.get('.gp-step').contains('Verification').should('not.exist') //Verification tab

    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.setCollectCreditCardScanofGuestSource('All Booking Source')
    onlineCheckinSettings.enableCreditCardScanOfGuestToggle()
    onlineCheckinSettings.enableGuestPassportIDToggle() //Revert the settings
  })
})

