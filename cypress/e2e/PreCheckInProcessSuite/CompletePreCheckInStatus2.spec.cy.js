/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const bookingDetailPage = new BookingDetailPage
const preCheckIn = new PreCheckIn

describe('Complete Precheckin Status Test Cases', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Waqas DHA'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
  })
  it("CA_CPCT_04 > Validate Under 'Who is required to Complete the Above Details?' setting if only primary guest is selected then pre-checkin will get completed when primary guest complete pre-checkin and also 2 emails sent for Pre Check-in Completed one is for guest and second one for client", () => {
    onlineCheckinSettings.applySelectOnlyPrimaryGuestSettings()
    bookingPage.addNewBookingAndValidate(propName, bSource, 1, 0) //Create a new booking and validate (1Adult, 0Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    //The guest tab will not be shown, user is directed to AllAddons tab
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card detail and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes

    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    //Go to booking
    bookingPage.goToBookingPage()
    bookingDetailPage.goToBookingDetailPage(propName)
    //Validate triggered Messages
    bookingDetailPage.validateTriggeredMessages('✅ Pre Check-in Completed', 'Guest')
    bookingDetailPage.validateTriggeredMessages('✅ Pre Check-in Completed', 'Host')
  })
  it("CA_CPCT_05 > Validate Under Who is required to Complete the Above Details? with All Guests (Adult, Children and Babies) is selected “When primary guest completes it” under When is pre check-in considered completed? settings then guest will tab and mark completed when Only the primary guest complete the pre-checkin and also 2 emails sent for Pre Check-in Completed one is for main guest and second one for client", () => {
    onlineCheckinSettings.adultChildrenBabiesWithPrimaryGuest()
    onlineCheckinSettings.enableAllToggles()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    cy.wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes

    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    //Go to booking details
    bookingDetailPage.goToBookingDetailPage(propName)
    //Validate triggered Messages
    bookingDetailPage.validateTriggeredMessages('✅ Pre Check-in Completed', 'Guest')
    bookingDetailPage.validateTriggeredMessages('✅ Pre Check-in Completed', 'Host')
  })
  it("CA_CPCT_06 > Validate Under Who is required to Complete the Above Details? with All Guests (Adult, Children and Babies) is selected ”When all required guests complete it” under When is pre check-in considered completed? settings then guest will tab and mark completed when all guests complete the pre-checkin and also 2 emails sent for Pre Check-in Completed one is for main guest and second one for client", () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.adultChildrenBabiesWithAllRequiredGuest()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    preCheckIn.editGuestDetail("Adult") //Add detail in 1st incomplete Guest (Adult)
    preCheckIn.editGuestDetail("Child") //Add detail in 1st incomplete Guest (Child)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes

    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    //Go to booking details
    bookingDetailPage.goToBookingDetailPage(propName)
    //Validate triggered Messages
    bookingDetailPage.validateTriggeredMessages('✅ Pre Check-in Completed', 'Guest')
    bookingDetailPage.validateTriggeredMessages('✅ Pre Check-in Completed', 'Host')
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it('CA_CPCT_07 > Under "Who is required to Complete the Above Details?" and "All Guests (Over 18)" is selected “When primary guest completes it” under "When is pre check-in considered completed?" settings then guest will tab and mark completed when "All Guests (Over 18)" complete the pre-checkin and also 2 emails sent for "Pre Check-in Completed" one is for main guest and second one for client', () => {
    onlineCheckinSettings.allGuestOver18WithPrimary()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 0) //Create a new booking and validate (2Adult, 0Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes

    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    //Go to booking details
    bookingDetailPage.goToBookingDetailPage(propName)
    //Validate triggered Messages
    bookingDetailPage.validateTriggeredMessages('✅ Pre Check-in Completed', 'Guest')
    bookingDetailPage.validateTriggeredMessages('✅ Pre Check-in Completed', 'Host')
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it('CA_CPCT_08 > Under "Who is required to Complete the Above Details?" and "All Guests (Over 18)" is selected ”When all required guests complete it” under "When is pre check-in considered completed?" settings then guest will tab and mark completed when "All Guests (Over 18)" complete the pre-checkin and also 2 emails sent for "Pre Check-in Completed" one is for main guest and second one for client', () => {
    onlineCheckinSettings.allGuestOver18WithAll()
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 0) //Create a new booking and validate (2Adult, 0Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    preCheckIn.editGuestDetail("Adult") //Add detail in 1st incomplete Guest (Adult)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes

    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal Again
    bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
    //Go to booking details
    bookingDetailPage.goToBookingDetailPage(propName)
    //Validate triggered Messages
    bookingDetailPage.validateTriggeredMessages('✅ Pre Check-in Completed', 'Guest')
    bookingDetailPage.validateTriggeredMessages('✅ Pre Check-in Completed', 'Host')
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
})
