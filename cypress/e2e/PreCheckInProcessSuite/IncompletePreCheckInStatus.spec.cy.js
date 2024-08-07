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

describe('Incomplete Pre Check-In status Test Cases', () => {

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

  it('CA_CPCT_09 > Validate If user try to complete the Pre CheckIn process without filling All Guest detail above 18. They will be able to complete it but Pre checkin will be considered incomplete', () => {
    onlineCheckinSettings.allGuestOver18WithAll()
    guidebookPage.goToGuidebook()
    guidebookPage.enableGuideBook('Test Property1 Guide') //Enable the Test Property1 Guide
    //Open Edit Profile
    dashboard.openProfileModal()
    dashboard.selectPropertyNameBrand() //Select Property Name & Brand
    dashboard.saveProfileChanges()

    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    //Here 1st adult status is completed and 2nd is incomplete
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.get('.col-sm-9 > .translate').should('contain', 'Guest(s) details missing!') //On precheckin welcome page, an error shows as 2nd guest data is incomplete
    cy.get('.col-sm-3 > .btn > .translate').should('have.text', 'Update Now') //update now button 
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    bookingPage.validatePrecheckinStatusAsIncomplete() //Validate that the new booking status is incomplete
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it('CA_CPCT_10 > Validate If user try to complete the Pre CheckIn process without filling all Guest detail (Adult, Children and Babies). They will be able to complete it but Pre checkin will be considered incomplete', () => {
    onlineCheckinSettings.selectWhenAllGuestRequired()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    //Here 1st adult status is completed and 2nd is incomplete
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.get('.col-sm-9 > .translate').should('contain', 'Guest(s) details missing!') //On precheckin welcome page, an error shows as 2nd guest data is incomplete
    cy.get('.col-sm-3 > .btn > .translate').should('have.text', 'Update Now') //update now button
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    bookingPage.validatePrecheckinStatusAsIncomplete() //Validate that the new booking status is incomplete
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it("CA_CPCT_11 > If Who is required to upload the document? is selected to 'All guests' then all guests need to upload ID based on basic info settings who will complete pre-checkin", () => {
    onlineCheckinSettings.allGuestOver18UploadID()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addIDAndCreditCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    preCheckIn.editGuestDetailAddIDCard('Adult') //Add guest and ID detail in 1st incomplete Adult
    //apply previous settings
    cy.visit('/')
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
  })
  it('CA_CPCT_12 > Validate that a booking created using different booking Source "NewBS" will reflect the same source on booking detail and in Complete Pre Check-In Process', () => {
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    onlineCheckinSettings.selectLicenseAndIDcard()
    const bSource = 'NewBS'
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
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
    cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
    cy.wait(3000)

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
    cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
    cy.wait(3000)
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
