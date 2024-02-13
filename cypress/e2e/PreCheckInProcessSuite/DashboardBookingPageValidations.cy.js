/// <reference types ="Cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { Dashboard } from "../../../pageObjects/Dashboard"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const dashboard = new Dashboard
const preCheckIn = new PreCheckIn

describe('Dashboard & Booking page Validation Scenarios', function () {

    beforeEach(() => {
        cy.visit('/')
        loginPage.happyLogin('', '') //Login to portal
        
    })
    it('CA_DBV_01 > Validate CC and document count on booking under Upcoming arrival at dashboard', function () {
        onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
        //Add a new booking in future date
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1)
        //Go to dashboard
        dashboard.goToDashboard()
        //Add a new CC in upcoming booking
        dashboard.addNewCCinUpcomingBooking(0) //Index of booking from top
        cy.reload()
        //Validate the Credit Card Count on booking
        bookingPage.validateCCCountOnBooking(0) //Index of booking from top
        //Upload documents in upcomming booking
        dashboard.uploadDocInUpcomingBooking(0) //Index of booking from top
        cy.reload()
        //Validate Document count on booking
        bookingPage.validateDocCountOnBooking(0) //Index of booking from top
        
    })
    it('CA_DBV_02 > Validate CC and document count on all bookings at bookings listing page', function () {
        
        //Go to Booking Page
        bookingPage.goToBookingPage()
        cy.get('.booking-card').then(($ele)=>{
        var count = $ele.length //total bookings on a page
           for(var i=0; i<count; i++)
            {
                bookingPage.validateCCCountOnBooking(i) //Validate the Credit Card Count on booking
                bookingPage.validateDocCountOnBooking(i) //Validate Document count on booking
            }
        })
    })
    it('CA_DBV_03 > Validate when Client accessing the Pre-checkin and Guest Portal links', function(){
       
        //Create a booking and make pre-checkin completed
        cy.log('Create a booking and make pre-checkin completed!')
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 1, 0) //Create a new booking and validate (1Adult, 0Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
        preCheckIn.takeSelfy() //Take selfy and proceed to Guest Detail Tab
        cy.wait(3000)
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
        preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
        preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
        preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
        cy.visit('/')
        loginPage.happyLogin('automation9462@gmail.com', 'Boring321') //Login to portal Again
        bookingPage.validatePrecheckInStatusAsCompleted() //Confirm the Pre-checkin Status of first Booking
     
        //A client accessing the “Pre Checkin” IF Pre checkin Completed: Direct to Guest Portal
        bookingPage.clientCompletedPrecheckinGuestPortal()

        //A client accessing the “Pre Checkin” IF Pre checkin InComplete: Direct to Pre checkin page to last incomplete step in Pre checkin 
        // also The client should have “Admin View Mode” and “Live Mode” 
        bookingPage.clientIncompletePrecheckinToLastStep()
        
        //A client accessing the “Guest Portal” link while in session, IF Pre checkin Completed: Direct to Guest Portal
        bookingPage.clientGuestPortalCompletePrecheckin()
        
        //A client accessing the “Guest Portal” link while in session, IF Pre checkin Incomplete: Direct to Guest Portal
        // (Modal alert to inform client) (You are only able to access this page because you are an admin. Your guests will not be able to access this page until they complete Pre check-in)
        bookingPage.clientGuestPortalIncompletePrecheckin()
    })
    it('CA_DBV_04 > Validate when Guest accessing the Pre-checkin and Guest Portal links', function(){
        
        //Guest accessing the “Pre Checkin” link IF Pre checkin Completed: Direct to Guest Portal
        bookingPage.guestCompletePrecheckinToGuestPortal()
        
        //Guest accessing the “Pre Checkin” IF Pre checkin InComplete: Direct to Pre checkin page to last incomplete step in Pre checkin 
        bookingPage.guestIncompletePrecheckinToLastStep()
        
        //Guest accessing the “Guest Portal” link while in session, IF Pre checkin Completed: Direct to Guest Portal
        bookingPage.guestGuestPortalPrecheckinCompleted()

        //Guest accessing the “Guest Portal” link while in session, IF Pre checkin Incomplete: Direct to Pre checkin page to last incomplete step in Pre checkin
        bookingPage.guestGuestPortalPrecheckinIncomplete()
    })
})