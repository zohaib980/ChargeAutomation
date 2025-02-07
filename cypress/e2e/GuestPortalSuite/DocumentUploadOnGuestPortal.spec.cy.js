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
  //Guest portal document upload
  it('CA_CAGP_13 > On guest portal, under Document Upload Verify if any document type is rejected then the reject message will show with the upload option', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
    onlineCheckinSettings.enableGuestPassportIDToggle()
    onlineCheckinSettings.enableCreditCardScanOfGuestToggle()
    dashboard.openProfileModal()
    dashboard.selectPropertyNameBrand()
    dashboard.saveProfileChanges()
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
    //VERIFICATION
    preCheckIn.addIDAndCreditCard()
    //CREDIT CARD
    preCheckIn.addCreditCardInfo() //Add credit card and submit the payment, proceed to Summary page
    //Summary Page
    preCheckIn.validatePropertyNameOnSummaryPage(propName)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    preCheckIn.clickSaveContinue() //Save & Continue

    //***Guest Portal***
    guestportal.validatePropertyName(propName)
    //Document Upload
    cy.get('[id="document_upload_tab"].collapsed').should('be.visible').and('contain.text', 'Document Upload').click() //Document Upload
    cy.get('.guest-portal-doc-upload-status').eq(0).should('contain.text', 'ID Submitted')
    cy.get('.guest-portal-doc-upload-status').eq(1).should('contain.text', 'Credit Card Submitted')

    loginPage.happyLogin(loginEmail, loginPassword)
    bookingPage.goToBookingPage()
    //Reject a document on booking listing
    bookingPage.rejectDocOnBooking(0, 0) //bookingIndex, docIndex

    loginPage.logout()
    //Revisit the guest portal
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    guestportal.verifyRejectedDoc('ID')

  })
  it('CA_CAGP_14 > On guest portal, under Addon Services Validate Add-On services', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.enableOfferAddonUpsellsToggle()
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

    //ADD-On Services
    preCheckIn.selectAddOnService1() // selects 2nd addon
    //CREDIT CARD
    preCheckIn.addCreditCardInfo() //Add credit card and submit the payment, proceed to Summary page
    //Summary Page
    preCheckIn.validatePropertyNameOnSummaryPage(propName)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    preCheckIn.clickSaveContinue() //Save & Continue

    //***Guest Portal***
    guestportal.validatePropertyName(propName)
    //Add On Services
    guestportal.validateAddons()
    //Add Recommended Addons
    guestportal.selectRecommendedAddon()
    //Pay for addons by adding New card
    guestportal.purchaseAddon()
  })
})
