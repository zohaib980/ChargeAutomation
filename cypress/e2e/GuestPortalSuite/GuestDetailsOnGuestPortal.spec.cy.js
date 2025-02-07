/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"
import { ReuseableCode } from "../../support/ReuseableCode"
import { Guestportal } from "../../../pageObjects/Guestportal"
import { Dashboard } from "../../../pageObjects/Dashboard"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn
const bookingDetailPage = new BookingDetailPage
const reuseableCode = new ReuseableCode
const guestportal = new Guestportal
const dashboard = new Dashboard

describe('Guest Portal Test Cases', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'QA Test Property'
  const companyName = 'CA'
  const bSource = 'NewBS'


  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
  })
  //Guest portal Guest details cases
  it('CA_CAGP_08 > On guest portal, under Guest details Validate Add Guest functionality', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    dashboard.openProfileModal()
    dashboard.selectPropertyNameBrand()
    dashboard.saveProfileChanges()
    const adult = reuseableCode.getRandomNumber(1, 7)
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
    //Guest Details
    guestportal.validateGuestTab(adult, child)
    //Validate total guest count
    guestportal.validateGuestCountOnGuestTab()
    //Add guest
    guestportal.addNewGuestOnGuestPortal('Adult Guest1', 'adultguest1@yopmail.com', 'Adult')
    guestportal.addNewGuestOnGuestPortal('Child Guest1', 'childguest1@yopmail.com', 'Child')
    guestportal.validateGuestCountOnGuestTab()
  })
  it('CA_CAGP_09 > On guest portal, under Guest details Validate Delete Guest functionality', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    const adult = reuseableCode.getRandomNumber(1, 7)
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
    //Guest Details
    guestportal.validateGuestTab(adult, child)
    //Validate total guest count
    guestportal.validateGuestCountOnGuestTab()
    //Delete guest
    guestportal.deleteGuesFromGuestPortal(1) //2nd adult
    guestportal.validateGuestCountOnGuestTab()
    guestportal.deleteGuesFromGuestPortal('-1') //last child
    guestportal.validateGuestCountOnGuestTab()
  })
  it('CA_CAGP_10 > On guest portal, under Guest details Validate Share Link buttons', () => {
    //On guest portal, under Guest details Validate Share Link button works as expected and opens a modal showing the different ways you can share the link: Email, Whatsapp, Skype, Messenger or copy link
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    const adult = reuseableCode.getRandomNumber(1, 4)
    const child = reuseableCode.getRandomNumber(1, 3)
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
    //Guest Details
    guestportal.validateGuestTab(adult, child)
    //Validate total guest count
    guestportal.validateGuestCountOnGuestTab()
    //Validate Share guest link
    let count = parseInt(adult) + parseInt(child)
    for (let i = 0; i < count; i++) {
      guestportal.validateShareLink(i)
    }

  })
  it('CA_CAGP_11 > On guest portal, under Guest details Validate that Guest can change the main guest on guest portal', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
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
    //Guest Details
    guestportal.validateGuestTab(adult, child)
    //Validate main guest
    guestportal.validateMainGuestOnGuestTab()
    cy.get('@mainGuest').then(mainGuest => {
      //Update main guest
      guestportal.updateMainGuest('Test Guest1')
      guestportal.validateMainGuestOnGuestTab()
      cy.get('@mainGuest').then(newMainGuest => {
        expect(newMainGuest).to.equal('Test Guest1')
        expect(mainGuest).not.to.equal(newMainGuest)
      })
    })

    loginPage.happyLogin(loginEmail, loginPassword)
    bookingPage.goToBookingPage()
    bookingDetailPage.goToBookingDetailPage(propName) //first booking
    //Validate main guest changed on booking details under prechcheckin tab
    cy.get('@mainGuest').then(newMainGuest => {
      bookingDetailPage.validateMainGuest(newMainGuest)
    })
  })
})
