/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"
import { PropertiesPage } from "../../../pageObjects/PropertiesPage"
import { GuidebookPage } from "../../../pageObjects/GuidebookPage"
import { Dashboard } from "../../../pageObjects/Dashboard"
import { ReuseableCode } from "../../support/ReuseableCode"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn
const bookingDetailPage = new BookingDetailPage
const propertiesPage = new PropertiesPage
const guidebookPage = new GuidebookPage
const dashboard = new Dashboard
const reuseableCode = new ReuseableCode

describe('PreCheckin - Other Precheckin Test cases', function () {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Waqas DHA'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
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
  it('CA_PCW_22 > Validate all precheckin tabs status is incomplete until guest submit all required details on each tab', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()

    //Create a new booking
    bookingPage.goToBookingPage()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1)

    bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => {
      cy.wrap(href).as('precheckinlink')
    })
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page On Precheckin
    preCheckIn.validateWelcomeMessage()
    preCheckIn.clickSaveContinue() //Save & Continue

    //BASIC INFO
    cy.get('[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION').and('be.visible')
    preCheckIn.clickSaveContinue() //Save & Continue
    cy.get('.form-group .invalid-feedback').should('be.visible').and('contain.text', 'Invalid phone number')
    //Basic Info tab should not be marked as completed
    preCheckIn.validateIncompletedStatus('Basic Info')
    //revisit the precheckin link
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Validate the Basic Info tab status is incomplete
    preCheckIn.validateIncompletedStatus('Basic Info')
    preCheckIn.addBasicInfo()
    preCheckIn.validateCompletedStatus('Basic Info')
    //Questionnaire Tab
    cy.get('[data-test="questionnaireTitle"]').should('have.text', 'Some Importent Questions!').and('be.visible')
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
    preCheckIn.fillQuestionnaires() //Fill Questionnier
    preCheckIn.validateCompletedStatus('Questionnaire')

    //ARRIVAL
    preCheckIn.selectArrivalBy('Car') //Select Car
    preCheckIn.validateCompletedStatus('Basic Info')
    preCheckIn.validateCompletedStatus('Questionnaire')
    preCheckIn.validateCompletedStatus('Arrival')

    //VERIFICATION
    cy.get('[for="drivers_license"]').should('contain.text', "Driver's License").and('be.visible')
    preCheckIn.clickSaveContinue() //Save & Continue
    cy.get('.col-6.col-xs-12 .text-danger').should('be.visible')
      .and('contain.text', 'Identification front side is required').and('contain.text', 'Identification back side is required')
    //revisit the precheckin link
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateIncompletedStatus('Verification')
    preCheckIn.addAndValidateIdCard()
    preCheckIn.validateCompletedStatus('Verification')

    //SELFIE
    cy.get('div[class="gp-box gp-box-of-inner-pages"] p:nth-child(1)').should('have.text', 'Take a selfie to authenticate your identity').and('be.visible')
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    preCheckIn.clickSaveContinue() //Save & Continue
    cy.wait(2000)
    //revisit the precheckin link
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    preCheckIn.validateIncompletedStatus('Self Portrait')
    preCheckIn.takeSelfy()
    preCheckIn.validateCompletedStatus('Self Portrait')

    //GUEST TAB
    preCheckIn.validateIncompletedStatus('Guest')
    preCheckIn.clickSaveContinue() //Save & Continue
    preCheckIn.validateCompletedStatus('Guest')

    //Add-on Services
    preCheckIn.validateIncompletedStatus('Add-on Services')
    preCheckIn.allAddOnServices() //Select All AddOns Services
    preCheckIn.validateCompletedStatus('Add-on Services')

    //CREDIT CARD
    cy.get('.mb-4 > .form-section-title > h4').should('contain', 'PAYMENT SUMMARY').and('be.visible').wait(3000)
    preCheckIn.clickSaveContinue()
    cy.verifyToast('Your card number is incomplete')
    preCheckIn.validateIncompletedStatus('Credit Card')
    preCheckIn.addCreditCardInfo() //Add caredit card and submit the payment
    cy.get('.page-title').should('be.visible').and('contain.text', 'Your Summary')
  })
  it('CA_CPCT_12 > Validate that a booking created using different booking Source "NewBS" will reflect the same source on booking detail and in Complete Pre Check-In Process', () => {
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    onlineCheckinSettings.setAllBookingSource()
    onlineCheckinSettings.enableAllToggles()
    dashboard.openProfileModal()
    dashboard.selectPropertyNameBrand()
    dashboard.saveProfileChanges()
    const bSource = 'NewBS'
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(1, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate (1Adult,0Child)
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
    bookingDetailPage.getAdultCount().then(text => {
      cy.wrap(text).as('adultCount').should('eq', String(adult)) //Alias adultCount using cy.wrap()
    })
    bookingDetailPage.getChildCount().then(text => {
      cy.wrap(text).as('childCount').should('eq', String(child))  //Alias childCount using cy.wrap()
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
    //BASIC INFO
    cy.get('[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION')

    cy.get('@fullName').then(fullName => {
      preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
    })
    cy.get('@email').then(email => {
      preCheckIn.validateEmail(email)             //Validate email
    })
    cy.get('@adultCount').then(adultCount => {
      preCheckIn.validateAdultCount(adultCount)       //Validate Adult Count
    })
    cy.get('@childCount').then(childCount => {
      preCheckIn.validateChildCount(childCount)       //Validate Child Count
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
    const guestCount = (parseInt(adult) + parseInt(child)).toString();
    preCheckIn.validateGuestCountOnGuestTab(guestCount) //Validate Guest count on Guest Tab
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
    preCheckIn.verifyGuestCountOnSummary(adult, child)
    preCheckIn.verifySummaryQuestionnairesInfo()
    preCheckIn.verifySummaryArrival('Car')
    preCheckIn.verifySummaryIDcardInfo()
    preCheckIn.verifySummarySignature()
  })
  it('CA_CPCT_13 > Validate that a booking created using different Property Name "Test Property1" will reflect the same property Name on booking detail and in Complete Pre Check-In Process', () => {
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    onlineCheckinSettings.selectLicenseAndIDcard()
    dashboard.openProfileModal()
    dashboard.selectPropertyNameBrand()
    dashboard.saveProfileChanges()
    const propName = 'Test Property1'
    const bSource = 'NewBS'
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(1, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate (1Adult,0Child)
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
    bookingDetailPage.getAdultCount().then(text => {
      cy.wrap(text).as('adultCount').should('eq', String(adult)) //Alias adultCount using cy.wrap()
    })
    bookingDetailPage.getChildCount().then(text => {
      cy.wrap(text).as('childCount').should('eq', String(child))  //Alias childCount using cy.wrap()
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
    //BASIC INFO
    cy.get('[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION')

    cy.get('@fullName').then(fullName => {
      preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
    })
    cy.get('@email').then(email => {
      preCheckIn.validateEmail(email)                 //Validate email
    })
    cy.get('@adultCount').then(adultCount => {
      preCheckIn.validateAdultCount(adultCount)       //Validate Adult Count
    })
    cy.get('@childCount').then(childCount => {
      preCheckIn.validateChildCount(childCount)       //Validate Child Count
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
    const guestCount = (parseInt(adult) + parseInt(child)).toString();
    preCheckIn.validateGuestCountOnGuestTab(guestCount) //Validate Guest count on Guest Tab
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
    preCheckIn.verifyGuestCountOnSummary(adult, child)
    preCheckIn.verifySummaryQuestionnairesInfo()
    preCheckIn.verifySummaryArrival('Car')
    preCheckIn.verifySummaryIDcardInfo()
    preCheckIn.verifySummarySignature()
  })
})