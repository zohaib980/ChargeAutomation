/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"
import { ReuseableCode } from "../../support/ReuseableCode"
import { GuidebookPage } from "../../../pageObjects/GuidbookPage"
import { Dashboard } from "../../../pageObjects/Dashboard"
import { Guestportal } from "../../../pageObjects/Guestportal"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn
const bookingDetailPage = new BookingDetailPage
const reuseableCode = new ReuseableCode
const guidebookPage = new GuidebookPage
const dashboard = new Dashboard
const guestportal = new Guestportal

describe('Complete Precheckin Status Test Cases', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Waqas DHA'
  const bSource = 'TEST_PMS_NO_PMS'
  const guestAddress = '768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan';
  const postalCode = '54000';

  beforeEach(() => {
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
  })
  
  it('CA_CPCT_01 > Validate Complete Pre Check-In Process with Source PMS-No-PMS, using document as ID Card, Arrival by Car, Only available Guests and using all Services', () => {
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.selectLicenseAndIDcard()
    onlineCheckinSettings.setAllBookingSource()
    guidebookPage.goToGuidebook()
    guidebookPage.enableGuideBook('Test Property1 Guide') //Enable the Test Property1 Guide
    //Open Edit Profile
    dashboard.openProfileModal()
    dashboard.selectPropertyNameBrand() //Select Property Name & Brand
    dashboard.saveProfileChanges()
    bookingPage.addNewBookingAndValidate(propName, bSource, 1, 0) //Create a new booking and validate (1Adult,0Child)
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
    preCheckIn.validatePropertyName(propName) //Validate propertyName on Precheckin Page
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
    cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
    cy.wait(3000)

    cy.get('@fullName').then(fullName => {
      preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
    })
    cy.get('@email').then(email => {
      preCheckIn.validateEmail(email)             //Validate email
    })
    preCheckIn.addBasicInfo() //Add and validate basic info
    preCheckIn.fillQuestionnaires() //Fill Questionnier
    preCheckIn.selectArrivalBy('Car') //Select Car
    preCheckIn.addAndValidateIdCard()
    preCheckIn.takeSelfy()
    // Guest Tab
    cy.get('@fullName').then(fullName => {
      preCheckIn.validateFullNameOnGuestTab(fullName) //Valdidate Guest Full Name
    })
    cy.get('@email').then(email => {
      preCheckIn.validateEmailOnGuestTab(email)       //Validate Guest Email
    })
    preCheckIn.clickSaveContinue() //Save & Continue
    preCheckIn.allAddOnServices() //Select All AddOns Services
    preCheckIn.addCreditCardInfo() //Add caredit card and submit the payment, proceed to Summary page
    // Validate Summary Page
    preCheckIn.validatePropertyNameOnSummaryPage(propName)
    cy.get('@bookingSource').then(bookingSource => {
      preCheckIn.validateSourceOnSummaryPage(bookingSource)
    })
    cy.get('@bookingID').then(bookingID => {
      preCheckIn.validateBookingIDonSummaryPage(bookingID)
    })
    cy.get('@TrxAmount').then(TrxAmount => {
      preCheckIn.validateTxAmountOnSummaryPage(TrxAmount)
    })
    cy.get('@checkInDate').then(checkInDate => {
      preCheckIn.validateCheckinDateOnSummaryPage(checkInDate)
    })
    cy.get('@checkOutDate').then(checkOutDate => {
      preCheckIn.validateCheckoutDateOnSummaryPage(checkOutDate)
    })
    cy.get('@fullName').then(fullName => {
      preCheckIn.verifyFullNameOnSummaryPage(fullName)
      preCheckIn.verifySummaryPaymentMethod(fullName)
    })
    cy.get('@email').then(email => {
      preCheckIn.verifyEmailOnSummaryPage(email)
    })
    preCheckIn.verifySummaryContactInfo()
    preCheckIn.verifySummaryQuestionnairesInfo()
    preCheckIn.verifySummaryArrival('Car')
    preCheckIn.verifySummaryIDcardInfo()
    preCheckIn.verifySummarySignature()
  })
  it('CA_CPCT_02 > Validate Complete Pre Check-In Process using document as Driving License, Arrival by other, add more Guests and using only one Service from all', () => {
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult. 1Child)
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
    preCheckIn.validatePropertyName(propName) //Validate propertyName on Precheckin Page
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
    cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
    cy.wait(3000)

    cy.get('@fullName').then(fullName => {
      preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
    })
    cy.get('@email').then(email => {
      preCheckIn.validateEmail(email)             //Validate email
    })
    preCheckIn.addBasicInfo() //Add and validate basic info
    preCheckIn.fillQuestionnaires() //Fill Questionnier
    preCheckIn.selectArrivalBy('Other')
    preCheckIn.addAndValidateDrivingDoc()
    preCheckIn.takeSelfy()
    preCheckIn.addValidateNewGuest()  //Adding a new guest
    preCheckIn.selectAddOnService1()  //Selecting a single AddOnService
    preCheckIn.addCreditCardInfo()
    // Validate Summary Page
    preCheckIn.validatePropertyNameOnSummaryPage(propName)
    cy.get('@bookingSource').then(bookingSource => {
      preCheckIn.validateSourceOnSummaryPage(bookingSource)
    })
    cy.get('@bookingID').then(bookingID => {
      preCheckIn.validateBookingIDonSummaryPage(bookingID)
    })
    cy.get('@TrxAmount').then(TrxAmount => {
      preCheckIn.validateTxAmountOnSummaryPage(TrxAmount)
    })
    cy.get('@checkInDate').then(checkInDate => {
      preCheckIn.validateCheckinDateOnSummaryPage(checkInDate)
    })
    cy.get('@checkOutDate').then(checkOutDate => {
      preCheckIn.validateCheckoutDateOnSummaryPage(checkOutDate)
    })
    cy.get('@fullName').then(fullName => {
      preCheckIn.verifyFullNameOnSummaryPage(fullName)
      preCheckIn.verifySummaryPaymentMethod(fullName)
    })
    cy.get('@email').then(email => {
      preCheckIn.verifyEmailOnSummaryPage(email)
    })
    preCheckIn.verifySummaryContactInfo()
    preCheckIn.verifySummaryQuestionnairesInfo()
    preCheckIn.verifySummaryArrival('Other')
    preCheckIn.verifySummaryLicenseInfo()
    preCheckIn.verifySummarySignature()
  })
  it('CA_CPCT_03 > Validate Booking Guest PrecheckIn status when the Primary guest complete the pre CheckIn on booking listing page. ', () => {
    bookingPage.addNewBookingAndValidate(propName, bSource, 1, 0) //Create a new booking and validate (1Adult, 0Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest Detail Tab
    cy.wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
  })
  it("CA_CPCT_04 > Validate Under 'Who is required to Complete the Above Details?' setting if only primary guest is selected then pre-checkin will get completed when primary guest complete pre-checkin and also 2 emails sent for Pre Check-in Completed one is for guest and second one for client", () => {
    onlineCheckinSettings.applySelectOnlyPrimaryGuestSettings()
    bookingPage.addNewBookingAndValidate(propName, bSource, 1, 0) //Create a new booking and validate (1Adult, 0Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    //The guest tab will not be shown, user is directed to AllAddons tab
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card detail and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.mailValidation()  // Go to booking detail and Validate Mails
  })
  it("CA_CPCT_05 > Validate Under Who is required to Complete the Above Details? with All Guests (Adult, Children and Babies) is selected “When primary guest completes it” under When is pre check-in considered completed? settings then guest will tab and mark completed when Only the primary guest complete the pre-checkin and also 2 emails sent for Pre Check-in Completed one is for main guest and second one for client", () => {
    onlineCheckinSettings.adultChildrenBabiesWithPrimaryGuest()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    cy.wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    bookingPage.mailValidation()  // Go to booking detail and Validate Mails
  })
  it("CA_CPCT_06 > Validate Under Who is required to Complete the Above Details? with All Guests (Adult, Children and Babies) is selected ”When all required guests complete it” under When is pre check-in considered completed? settings then guest will tab and mark completed when all guests complete the pre-checkin and also 2 emails sent for Pre Check-in Completed one is for main guest and second one for client", () => {
    onlineCheckinSettings.adultChildrenBabiesWithAllRequiredGuest()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    preCheckIn.editGuestDetail("Adult") //Add detail in 1st incomplete Guest (Adult)
    preCheckIn.editGuestDetail("Child") //Add detail in 1st incomplete Guest (Child)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    bookingPage.mailValidation()  // Go to booking detail and Validate Mails
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it('CA_CPCT_07 > Under "Who is required to Complete the Above Details?" and "All Guests (Over 18)" is selected “When primary guest completes it” under "When is pre check-in considered completed?" settings then guest will tab and mark completed when "All Guests (Over 18)" complete the pre-checkin and also 2 emails sent for "Pre Check-in Completed" one is for main guest and second one for client', () => {
    onlineCheckinSettings.allGuestOver18WithPrimary()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 0) //Create a new booking and validate (2Adult, 0Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    bookingPage.mailValidation()  // Go to booking detail and Validate Mails
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it('CA_CPCT_08 > Under "Who is required to Complete the Above Details?" and "All Guests (Over 18)" is selected ”When all required guests complete it” under "When is pre check-in considered completed?" settings then guest will tab and mark completed when "All Guests (Over 18)" complete the pre-checkin and also 2 emails sent for "Pre Check-in Completed" one is for main guest and second one for client', () => {
    onlineCheckinSettings.allGuestOver18WithAll()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 0) //Create a new booking and validate (2Adult, 0Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    preCheckIn.editGuestDetail("Adult") //Add detail in 1st incomplete Guest (Adult)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    bookingPage.mailValidation()  // Go to booking detail and Validate Mails
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
})
