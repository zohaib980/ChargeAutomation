/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"
import { ReuseableCode } from "../../support/ReuseableCode"
import { GuidebookPage } from "../../../pageObjects/GuidebookPage"
import { Dashboard } from "../../../pageObjects/Dashboard"
import { Guestportal } from "../../../pageObjects/Guestportal"
import { PropertiesPage } from "../../../pageObjects/PropertiesPage"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn
const bookingDetailPage = new BookingDetailPage
const reuseableCode = new ReuseableCode
const guidebookPage = new GuidebookPage
const dashboard = new Dashboard
const guestportal = new Guestportal
const propertiesPage = new PropertiesPage

describe('Guest Portal Test Cases', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Test Property1'
  const companyName = 'CA'
  const bSource = 'NewBS'
  const guestAddress = '768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan';
  const postalCode = '54000';

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
  })
  //Guest portal payment details cases
  it('CA_CAGP_12 > On guest portal, under Payment details verify that guest can update his payment method', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    let propName = 'QA Test Property'
    const adult = reuseableCode.getRandomNumber(2, 7)
    const child = reuseableCode.getRandomNumber(1, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate (1Adult,0Child)
    bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => { cy.wrap(href).as('precheckinlink') })

    // User will logout from the portal and will open preCheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
    cy.wait(2000)

    //Welcome Page On Precheckin
    cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').wait(5000)
    preCheckIn.validatePropertyName(propName) //Validate propertyName on Precheckin Page
    preCheckIn.clickSaveContinue() //Save & Continue
    //BASIC INFO
    preCheckIn.addBasicInfo() //Add and validate basic info
    cy.get('.form-section-title > h4').should('contain.text', 'Guest Details').and('be.visible').wait(4000)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    preCheckIn.clickSaveContinue() //Save & Continue
    preCheckIn.addCreditCardInfo() //Add credit card and submit the payment, proceed to Summary page
    //Summary Page
    preCheckIn.validatePropertyNameOnSummaryPage(propName)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    preCheckIn.clickSaveContinue() //Save & Continue

    //***Guest Portal***
    guestportal.validatePropertyName(propName)
    //Payment details
    guestportal.expandPaymentDetails()
    //Update Payment method
    guestportal.updatePaymentMethod()
  })
})
