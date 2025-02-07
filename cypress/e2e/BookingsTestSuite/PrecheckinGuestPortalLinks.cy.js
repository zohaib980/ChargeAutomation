/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn

describe('Validate Precheckin & Guest portal links on Booking Listing & Booking detail Pages', function () {

    const loginEmail = Cypress.config('users').user1.username
    const loginPassword = Cypress.config('users').user1.password
    const propName = 'Waqas DHA'
    const bSource = 'Direct'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    })
    it('CA_PGP_01 > A client accessing the “Pre Checkin” IF Pre checkin Completed: Direct to Guest Portal', function () {
        //A client accessing the “Pre Checkin” IF Pre checkin Completed: Direct to Guest Portal
        //Create a booking and make pre-checkin completed
        cy.log('Create a booking and make pre-checkin completed!')
        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
        onlineCheckinSettings.allGuestOver18WithPrimary()
        onlineCheckinSettings.enableAllToggles()
        onlineCheckinSettings.enableCollectArrivaltimeToggle()
        bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (1Adult, 0Child)
        preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
        preCheckIn.takeSelfy() //Take selfy and proceed to Guest Detail Tab
        cy.get('.form-section-title h4').should('contain.text', 'Guest Details').and('be.visible').wait(2000) //Guest Detail Heading
        preCheckIn.clickSaveContinue()
        preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
        preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
        preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
        //Login to portal Again
        loginPage.happyLogin(loginEmail, loginPassword)
        bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking

        //A client accessing the “Pre Checkin” IF Pre checkin Completed: Direct to Guest Portal
        bookingPage.clientCompletedPrecheckinGuestPortal()
    })
    it('CA_PGP_02 > A client accessing the “Pre Checkin” IF Pre checkin InComplete', function () {
        //A client accessing the “Pre Checkin” IF Pre checkin InComplete: Direct to Pre checkin page to last incomplete step in Pre checkin 
        // also The client should have “Admin View Mode” and “Live Mode” 
        cy.log('A client accessing the “Pre Checkin” IF Pre checkin InComplete: Direct to Pre checkin page to last incomplete step in Pre checkin also The client should have “Admin View Mode” and “Live Mode”')
        cy.visit('/client/v2/bookings')
        bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1)
        bookingPage.clientIncompletePrecheckinToLastStep()
    })
    it('CA_PGP_03 > A client accessing the “Guest Portal” link while in session, IF Pre checkin Completed', function () {
        //A client accessing the “Guest Portal” link while in session, IF Pre checkin Completed: Direct to Guest Portal
        bookingPage.clientGuestPortalCompletePrecheckin()
    })
    it('CA_PGP_04 > A client accessing the “Guest Portal” link while in session, IF Pre checkin Incomplete:', function () {

        //A client accessing the “Guest Portal” link while in session, IF Pre checkin Incomplete: Direct to Guest Portal
        // (Modal alert to inform client) (You are only able to access this page because you are an admin. Your guests will not be able to access this page until they complete Pre check-in)
        bookingPage.clientGuestPortalIncompletePrecheckin()
    })
    it('CA_PGP_05 > Guest accessing the “Pre Checkin” & "Guest portal" links', function () {

        //Guest accessing the “Pre Checkin” link IF Pre checkin Completed: Direct to Guest Portal
        bookingPage.guestCompletePrecheckinToGuestPortal()

        //Guest accessing the “Pre Checkin” IF Pre checkin InComplete: Direct to Pre checkin page to last incomplete step in Pre checkin 
        cy.log('Guest accessing the “Pre Checkin” IF Pre checkin InComplete: Direct to Pre checkin page to last incomplete step in Pre checkin!')

        loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
        bookingPage.goToBookingPage()
        bookingPage.guestIncompletePrecheckinToLastStep()

        //Guest accessing the “Guest Portal” link while in session, IF Pre checkin Completed: Direct to Guest Portal
        cy.log('Guest accessing the “Guest Portal” link while in session, IF Pre checkin Completed: Direct to Guest Portal')

        loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
        bookingPage.goToBookingPage()
        bookingPage.guestToGuestPortalPrecheckinCompleted()

        //Guest accessing the “Guest Portal” link while in session, IF Pre checkin Incomplete: Direct to Pre checkin page to last incomplete step in Pre checkin
        cy.log('Guest accessing the “Guest Portal” link while in session, IF Pre checkin Incomplete: Direct to Pre checkin page to last incomplete step in Pre checkin')

        loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
        bookingPage.goToBookingPage()
        bookingPage.guestToGuestPortalPrecheckinIncomplete()
    })


})