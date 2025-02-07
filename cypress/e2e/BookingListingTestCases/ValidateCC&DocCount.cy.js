/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { Dashboard } from "../../../pageObjects/Dashboard"
import { GuidebookPage } from "../../../pageObjects/GuidebookPage"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const dashboard = new Dashboard
const guidebookPage = new GuidebookPage

describe('Validate CC and Documents count tags on booking listing and Dashbaord Upcoming bookings', function () {

    const loginEmail = Cypress.config('users').user1.username
    const loginPassword = Cypress.config('users').user1.password
    const propName = 'Waqas DHA'
    const bSource = 'Direct'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    })
    it('CA_DBV_01 > Validate CC and document count on booking under Upcoming arrival at dashboard', function () {
        onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
        guidebookPage.goToGuidebook()
        guidebookPage.enableGuideBook('Test Property1 Guide') //Enable the Test Property1 Guide
        //Open Edit Profile
        dashboard.openProfileModal()
        dashboard.selectPropertyNameBrand() //Select Property Name & Brand
        dashboard.saveProfileChanges()
        //Add a new booking in future date
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propName, bSource, 2, 1, '2')

        //Go to dashboard
        dashboard.goToDashboard()
        //Add a new CC in upcoming booking
        dashboard.addNewCCinUpcomingBooking(0)
        cy.reload()
        bookingPage.validateCCCountOnBooking(0) //Validate the Credit Card Count on booking
        //Upload documents in upcomming booking
        dashboard.uploadDocInUpcomingBooking(0)
        cy.reload()
        bookingPage.validateDocCountOnBooking(0)  //Validate Document count on booking

    })
    it('CA_DBV_02 > Validate CC and document count on all bookings at bookings listing page', function () {

        //Go to Booking Page
        bookingPage.goToBookingPage()
        cy.get('.booking-card').then(($ele) => {
            var count = $ele.length //total bookings on a page
            for (var i = 0; i < count; i++) {
                bookingPage.validateCCCountOnBooking(i) //Validate the Credit Card Count on booking
                bookingPage.validateDocCountOnBooking(i) //Validate Document count on booking
            }
        })
    })
})