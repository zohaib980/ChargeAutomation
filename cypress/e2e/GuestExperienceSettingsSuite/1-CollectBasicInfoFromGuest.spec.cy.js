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

describe('Guest Experience Settings > Collect Basic Information From Guest', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'QA Test Property'
  const bSource = 'Direct'
  const guestAddress = '768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan'
  const postalCode = '54000'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword)
  })
  //Collect Basic Information From Guest 
  it('CA_CBIFG_01 > Validate all basic info fields on precheckin when all "Collect Basic Detail" options are enabled from guest experience settings', () => {
    onlineCheckinSettings.checkAllCollectBasicDetailCheckboxes()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.setAllBookingSource()
    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate 
    bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => { cy.wrap(href).as('precheckinlink') }) // Alias precheckinlink using cy.wrap()
    // Here we will copy and Visit the Pre Check-In process after logout from the portal
    bookingDetailPage.goToBookingDetailPage(propName) // Visit the booking detail page of first booking
    bookingDetailPage.getBookingID().then(text => { cy.wrap(text).as('bookingID') })             // Alias bookingID using cy.wrap()
    bookingDetailPage.getBookingSource().then(text => { cy.wrap(text).as('bookingSource') })     // Alias bookingSource using cy.wrap()
    bookingDetailPage.getCheckinDate().then(text => { cy.wrap(text).as('checkInDate') })         // Alias checkInDate using cy.wrap()
    bookingDetailPage.getCheckOutDate().then(text => { cy.wrap(text).as('checkOutDate') })       // Alias checkOutDate using cy.wrap()
    bookingDetailPage.getAdultCount().then(text => { cy.wrap(text).as('adultCount').should('eq', adult.toString()) }) //Alias adultCount using cy.wrap()
    bookingDetailPage.getChildCount().then(text => { cy.wrap(text).as('childCount').should('eq', child.toString()) }) //Alias childCount using cy.wrap()
    bookingDetailPage.getFullName().then(text => { cy.wrap(text).as('fullName') })               // Alias fullName using cy.wrap()
    bookingDetailPage.getGuestEmail().then(text => { cy.wrap(text).as('email') })                // Alias email using cy.wrap()
    bookingDetailPage.getTrxAmount().then(text => { cy.wrap(text).as('TrxAmount') })             // Alias TrxAmount using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page On Precheckin
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.validatePropertyName(propName) //Validate propertyName on Precheckin Page
    cy.get('@bookingID').then(bookingID => { preCheckIn.validateReferenceNo(bookingID) })            // Validate Reference Number
    cy.get('@bookingSource').then(bookingSource => { preCheckIn.validateSourceType(bookingSource) }) // Validate Soruce type
    cy.get('@TrxAmount').then(TrxAmount => { preCheckIn.validateTxAmount(TrxAmount) })               // Validate Amount
    cy.get('@checkInDate').then(checkInDate => { preCheckIn.validateCheckinDate(checkInDate) })      // Validate check In date
    cy.get('@checkOutDate').then(checkOutDate => { preCheckIn.validateCheckoutDate(checkOutDate) })  // Validate CheckOut Date
    preCheckIn.clickSaveContinue() //Save & Continue
    //BASIC INFO
    cy.get('h4[data-test="basicContactTitle"]').should('contain.text', 'CONTACT INFORMATION').and('be.visible')
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
    const phone = reuseableCode.getRandomPhoneNumber()  //Generate a random phone Number
    preCheckIn.addAndValidateBasicInfo(phone, adult, child, guestAddress, postalCode)
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION') //Validate ARRIVAL Tab 
  })
  it('CA_CBIFG_02 > Validate that on precheckin the basic info tab will not be shown when "Collect Basic Information From Guest(s)" toggle is disable', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
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
    //As Basic Info Toggle is OFF, this tab will not be shown
    cy.get('[data-test="precheckinSaveBtnOne"]').should('exist').wait(5000) //Save button should be shown
    cy.get('[class="fa fa-info"]').should('not.exist') //Basic Info should not exist
  })
  it('CA_CBIFG_03 > On booking listing and details Verify the Pre-Checkin Count Does Not Update for Incomplete Pre-Checkin', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.allGuestOver18WithAll()

    const adult = '2'
    const child = '1'
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //2 adult and 1 child
    //validate precheckin status on booking listing page
    bookingPage.validatePrecheckinStatus('Incomplete', 0, '0/2')  //checkinStatus, index, count
    bookingDetailPage.getPrecheckinLinkOnFirstBooking()
      .then(href => { cy.wrap(href).as('precheckinlink') })  // Alias precheckinlink using cy.wrap()
    // User will logout from the portal and will open CheckIn link
    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    //Welcome Page On Precheckin
    preCheckIn.validateBookingSource(bSource)
    preCheckIn.clickSaveContinue() //Save & Continue
    //BASIC INFO
    const phone = reuseableCode.getRandomPhoneNumber()  //Generate a random phone Number
    preCheckIn.addAndValidateBasicInfo(phone, adult, child, guestAddress, postalCode)

    preCheckIn.selectArrivalBy('Car')
    preCheckIn.addAndValidateIdCard()
    preCheckIn.takeSelfy()
    preCheckIn.editGuestDetail("Adult", 0) //Add detail in 1st incomplete Guest (Adult)

    loginPage.happyLogin(loginEmail, loginPassword)
    bookingPage.goToBookingPage()
    //validate precheckin status on booking listing page
    bookingPage.validatePrecheckinStatus('Incomplete', 0, '1/2')  //checkinStatus, index, count
    //Validate status on booking detail page
    bookingDetailPage.goToBookingDetailPage(propName)
    bookingDetailPage.goToOnlineCheckinTab()
    bookingDetailPage.verifyPrecheckinStatus('1/2')

    loginPage.logout()
    cy.get('@precheckinlink').then(precheckinlink => { cy.visit(precheckinlink) })
    cy.get('[class="gp-step active"]').should('be.visible').wait(2000)
    preCheckIn.clickSaveContinue()
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes

    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.goToBookingPage()
    //validate precheckin status
    bookingPage.validatePrecheckinStatus('Pre check-in completed', 0, null)  //checkinStatus, index, count will not be shown for completed

    //Validate status on booking detail page
    bookingDetailPage.goToBookingDetailPage(propName)
    bookingDetailPage.goToOnlineCheckinTab()
    bookingDetailPage.verifyPrecheckinStatus('2/2')
  })
})

