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
  //Guest Portal download page
  it('CA_CAGP_04 > Guests can download the Guest portal page, and verify all data matching with the guest portal', () => {
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
    onlineCheckinSettings.enableGuestPassportIDToggle()
    onlineCheckinSettings.enableCreditCardScanOfGuestToggle()
    guidebookPage.goToGuidebook()
    //Disable the Test Property1 Guide
    guidebookPage.enableGuideBook('Guidebook 1')
    //Open Edit Profile
    dashboard.openProfileModal()
    dashboard.getClientName().then(text => { cy.wrap(text).as('clientName') })
    dashboard.getClientEmail().then(text => { cy.wrap(text).as('clientEmail') })
    dashboard.getClientPhone().then(text => { cy.wrap(text).as('clientPhone') })
    dashboard.getClientAddress().then(text => { cy.wrap(text).as('clientAddress') })
    dashboard.getCompanyName().then(text => { cy.wrap(text).as('companyName') })
    dashboard.getCompanyEmail().then(text => { cy.wrap(text).as('companyEmail') })
    dashboard.getCompanyPhone().then(text => { cy.wrap(text).as('companyPhone') })
    dashboard.getCompanyAddress().then(text => { cy.wrap(text).as('companyAddress') })
    dashboard.selectPropertyNameBrand() //Select Property Name & Brand
    dashboard.saveProfileChanges()

    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(1, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate (1Adult,0Child)
    bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => { cy.wrap(href).as('precheckinlink') })
    // Here we will copy and Visit the Pre Check-In process after logout from the portal
    bookingDetailPage.goToBookingDetailPage(propName) // Visit the booking detail page of first booking
    bookingDetailPage.getBookingID().then(text => { cy.wrap(text).as('bookingID') })         // Alias bookingID using cy.wrap()
    bookingDetailPage.getBookingSource().then(text => { cy.wrap(text).as('bookingSource') })     // Alias bookingSource using cy.wrap()
    bookingDetailPage.getCheckinDate().then(text => { cy.wrap(text).as('checkInDate') })       // Alias checkInDate using cy.wrap()
    bookingDetailPage.getCheckOutDate().then(text => { cy.wrap(text).as('checkOutDate') })      // Alias checkOutDate using cy.wrap()
    bookingDetailPage.getAdultCount().then(text => { cy.wrap(text).as('adultCount').should('eq', String(adult)) }) //Alias adultCount using cy.wrap()
    bookingDetailPage.getChildCount().then(text => { cy.wrap(text).as('childCount').should('eq', String(child)) })  //Alias childCount using cy.wrap()
    bookingDetailPage.getFullName().then(text => { cy.wrap(text).as('fullName') })          // Alias fullName using cy.wrap()
    bookingDetailPage.getGuestEmail().then(text => { cy.wrap(text).as('email') })             // Alias email using cy.wrap()
    bookingDetailPage.getTrxAmount().then(text => { cy.wrap(text).as('TrxAmount') })        // Alias TrxAmount using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    cy.get('.text-md > span').should('contain.text', 'Please start Pre Check-in').and('be.visible')
    //Welcome Page On Precheckin
    cy.get('.welcome-guest-header > .mb-0').should('contain.text', 'Welcome').and('be.visible')
    preCheckIn.validatePropertyName(propName) //Validate propertyName on Precheckin Page
    cy.get('@bookingID').then(bookingID => { preCheckIn.validateReferenceNo(bookingID) }) // Validate Reference Number
    cy.get('@bookingSource').then(bookingSource => { preCheckIn.validateSourceType(bookingSource) }) // Validate Soruce type
    cy.get('@TrxAmount').then(TrxAmount => { preCheckIn.validateTxAmount(TrxAmount) }) // Validate Amount  
    cy.get('@checkInDate').then(checkInDate => { preCheckIn.validateCheckinDate(checkInDate) }) // Validate check In date
    cy.get('@checkOutDate').then(checkOutDate => { preCheckIn.validateCheckoutDate(checkOutDate) }) // Validate CheckOut Date    
    preCheckIn.clickSaveContinue() //Save & Continue
    //BASIC INFO
    cy.get('h4[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION').and('be.visible')
    cy.get('@fullName').then(fullName => { preCheckIn.validateFullNameOnWelcome(fullName) })  //Validate Full Name
    cy.get('@email').then(email => { preCheckIn.validateEmail(email) })                //Validate email
    cy.get('@adultCount').then(adultCount => { preCheckIn.validateAdultCount(adultCount) })       //Validate Adult Count
    cy.get('@childCount').then(childCount => { preCheckIn.validateChildCount(childCount) })     //Validate Child Count
    preCheckIn.addBasicInfo() //Add and validate basic info
    preCheckIn.fillQuestionnaires() //Fill Questionnier
    preCheckIn.selectArrivalBy('Car') //Select Car
    preCheckIn.addAndValidateIdCard()
    preCheckIn.takeSelfy()
    // Guest Tab
    cy.get('@fullName').then(fullName => { preCheckIn.validateFullNameOnGuestTab(fullName) }) //Valdidate Guest Full Name
    cy.get('@email').then(email => { preCheckIn.validateEmailOnGuestTab(email) })       //Validate Guest Email
    const guestCount = (parseInt(adult) + parseInt(child)).toString();
    preCheckIn.validateGuestCountOnGuestTab(guestCount) //Validate Guest count on Guest Tab
    preCheckIn.clickSaveContinue() //Save & Continue
    preCheckIn.allAddOnServices() //Select All AddOns Services
    preCheckIn.addCreditCardInfo() //Add credit card and submit the payment, proceed to Summary page
    // Validate Summary Page
    preCheckIn.validatePropertyNameOnSummaryPage(propName)
    cy.get('@bookingSource').then(bookingSource => { preCheckIn.validateSourceOnSummaryPage(bookingSource) })
    cy.get('@bookingID').then(bookingID => { preCheckIn.validateBookingIDonSummaryPage(bookingID) })
    cy.get('@TrxAmount').then(TrxAmount => { preCheckIn.validateTxAmountOnSummaryPage(TrxAmount) })
    cy.get('@checkInDate').then(checkInDate => { preCheckIn.validateCheckinDateOnSummaryPage(checkInDate) })
    cy.get('@checkOutDate').then(checkOutDate => { preCheckIn.validateCheckoutDateOnSummaryPage(checkOutDate) })
    cy.get('@fullName').then(fullName => {
      preCheckIn.verifyFullNameOnSummaryPage(fullName)
      preCheckIn.verifySummaryPaymentMethod(fullName)
    })
    cy.get('@email').then(email => { preCheckIn.verifyEmailOnSummaryPage(email) })
    //Summary page
    preCheckIn.getGuestPhone().then(text => { cy.wrap(text).as('guestPhone') })        //alias guestPhone using cy.wrap
    preCheckIn.getGuestDOB().then(text => { cy.wrap(text).as('guestDOB') })        //alias guestDOB using cy.wrap
    preCheckIn.verifySummaryContactInfo()
    preCheckIn.verifyGuestCountOnSummary(adult, child)
    preCheckIn.verifySummaryQuestionnairesInfo()
    preCheckIn.verifySummaryArrival('Car')
    preCheckIn.verifySummaryIDcardInfo()
    preCheckIn.verifySummarySignature()

    //***Guest Portal***
    guestportal.goTOPrintView()
    //*** Guest Portal - Print View ***/
    cy.get('@companyEmail').then(companyEmail => {
      cy.get('@companyPhone').then(companyPhone => {
        guestportal.verifyPhoneEmailOnPrintPage(companyEmail, companyPhone)
      })
    })
    guestportal.verifyBasicDetailsOnDownloadPage(propName)
    //Booking Details
    guestportal.verifyBookingDetailsOnDownloadPage()
    //Add On Services
    guestportal.verifyAddOnServicesOnDownloadPage()
    //Instructions
    guestportal.verifyInstructionsOnDownloadPage()
    //ID Proof Related
    guestportal.verifyIDProofOnDownloadPage()
  })
})
