/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { Dashboard } from "../../../pageObjects/Dashboard"
import { GuidebookPage } from "../../../pageObjects/GuidebookPage"
import { ReuseableCode } from "../../support/ReuseableCode"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const dashboard = new Dashboard
const guidebookPage = new GuidebookPage
const reuseableCode = new ReuseableCode

describe('Validate CC and Documents count tags on booking listing and Dashbaord Upcoming bookings', function () {

    const loginEmail = Cypress.config('users').user1.username
    const loginPassword = Cypress.config('users').user1.password
    const propertyName = 'New Property'
    const bSource = 'Direct'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    })
    it('CA_BL_01 > Search Booking by Booking ID', () => {
        bookingPage.goToBookingPage()
        bookingPage.getBookingID(0).then(bookingID => { //first booking
            cy.log(bookingID)
            bookingPage.searchBooking(bookingID)
            bookingPage.validateSearchResults(bookingID)
        })
    })
    it('CA_BL_02 > Search Booking by Confirmation Code', () => {
        bookingPage.goToBookingPage()
        bookingPage.addNewBookingAndValidate(propertyName, bSource, adults, child)
        bookingPage.addConfirmationCode(0, 'CONF388412') //index, Confirmation Code
        bookingPage.searchBooking('CONF388412')
        bookingPage.validateSearchResults('CONF388412')
    })
    it('CA_BL_03 > Search Booking by Guest Name', () => {
        bookingPage.goToBookingPage()
        bookingPage.addNewBookingAndValidate(propertyName, bSource, adults, child)
        cy.get('@firstName').then(firstName => {
            cy.get('@lastName').then(lastName => {
                const fullName = firstName + ' ' + lastName
                bookingPage.searchBooking(fullName)
                bookingPage.validateSearchResults(fullName)
            })
        })
    })
    xit('CA_BL_04 > Search Booking by Property Name', () => {
        bookingPage.goToBookingPage()
        bookingPage.addNewBookingAndValidate(propertyName, bSource, adults, child)
        bookingPage.searchBooking(propertyName)
        bookingPage.validateSearchResults(propertyName)
    })
})