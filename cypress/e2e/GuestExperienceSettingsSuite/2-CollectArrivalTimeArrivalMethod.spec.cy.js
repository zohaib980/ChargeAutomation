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

describe('Guest Experience Settings > Collect Arrival time & arrival method', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'QA Test Property'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword)
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
    onlineCheckinSettings.setArrivalBySource('NewBS') //Set arrival by method
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
    cy.get("#standard_check_in_time").should('contain', '16:00')
  })
})

