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

describe('PreCheckin - Questionnier tab test cases', function () {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Waqas DHA'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
  })
  it('CA_PCW_03 > Validate the questionnier step', () => {
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult,1Child)
    //Validate newly created booking detail with pre-checkin welcome page
    bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => {
      cy.wrap(href).as('precheckinlink') // Alias precheckinlink using cy.wrap()
    })
    // Here we will copy and Visit the Pre Check-In process after logout from the portal
    bookingDetailPage.goToBookingDetailPage(propName) // Visit the booking detail page of first booking
    bookingDetailPage.getBookingID().then(text => {
      cy.wrap(text).as('bookingID')         // Alias bookingID using cy.wrap()
    })
    bookingDetailPage.getBookingSource().then(text => {
      cy.wrap(text).as('bookingSource')     // Alias bookingSource using cy.wrap()
    })
    bookingDetailPage.getCheckinDate().then(text => {
      cy.wrap(text).as('checkInDate')       // Alias checkInDate using cy.wrap()
    })
    bookingDetailPage.getCheckOutDate().then(text => {
      cy.wrap(text).as('checkOutDate')      // Alias checkOutDate using cy.wrap()
    })
    bookingDetailPage.getFullName().then(text => {
      cy.wrap(text).as('fullName')          // Alias fullName using cy.wrap()
    })
    bookingDetailPage.getGuestEmail().then(text => {
      cy.wrap(text).as('email')             // Alias email using cy.wrap()
    })
    bookingDetailPage.getTrxAmount().then(text => {
      cy.wrap(text).as('TrxAmount')         // Alias TrxAmount using cy.wrap()
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
    cy.get('@bookingID').then(bookingID => {
      preCheckIn.validateReferenceNo(bookingID) // Validate Reference Number
    })
    cy.get('@bookingSource').then(bookingSource => {
      preCheckIn.validateSourceType(bookingSource) // Validate Soruce type
    })
    cy.get('@TrxAmount').then(TrxAmount => {
      preCheckIn.validateTxAmount(TrxAmount) // Validate Amount  
    })
    cy.get('@checkInDate').then(checkInDate => {
      preCheckIn.validateCheckinDate(checkInDate) // Validate check In date
    })
    cy.get('@checkOutDate').then(checkOutDate => {
      preCheckIn.validateCheckoutDate(checkOutDate) // Validate CheckOut Date    
    })
    preCheckIn.clickSaveContinue() //Save & Continue
    cy.get('h4[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION').and('be.visible')
    
    cy.get('@fullName').then(fullName => {
      preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
    })
    cy.get('@email').then(email => {
      preCheckIn.validateEmail(email)             //Validate email
    })
    preCheckIn.addBasicInfo() //Add basic info and move to questionnarie tab
    preCheckIn.fillQuestionnaires() //fill all questionnarie fields and move to Arrival Tab
  })
  it('CA_PCW_21 > Validate the Questionnaire tab status is incomplete until the required questions are not answered', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableCollectBasicInfoToggle()

    //Create a new booking
    bookingPage.goToBookingPage()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1)

    bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => {
      cy.wrap(href).as('precheckinlink')
    })
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => {
      cy.visit(precheckinlink)
    })
    //Welcome Page On Precheckin
    cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').and('be.visible')
    cy.get('.text-md > span').should('contain', 'Please start Pre Check-in').should('be.visible')
    cy.get(':nth-child(1) > :nth-child(2) > .dl-with-icon > dt.notranslate').should('be.visible').and('contain.text', 'Amount')
    preCheckIn.clickSaveContinue() //Save & Continue

    //BASIC INFO
    preCheckIn.addBasicInfo() //Add and validate basic info
    //Basic Info tab should be marked completed
    preCheckIn.validateCompletedStatus('Basic Info')
    //Questionnaire 
    preCheckIn.clickSaveContinue() //Save & Continue
    cy.get('.has-error .text-danger.invalid-feedback').should('be.visible').and('contain.text', 'Answer is required') //validate error

    //revisit the precheckin link
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateCompletedStatus('Basic Info')
    //Validate the Questionnaire tab status is incomplete as the required questions are not answered
    preCheckIn.validateIncompletedStatus('Questionnaire')
    cy.reload()
    preCheckIn.fillQuestionnaires()
    preCheckIn.validateCompletedStatus('Questionnaire')
  })
})