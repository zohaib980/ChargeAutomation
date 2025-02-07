/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"
import { Dashboard } from "../../../pageObjects/Dashboard"
import { GuidebookPage } from "../../../pageObjects/GuidebookPage"
import { ReuseableCode } from "../../support/ReuseableCode"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const bookingDetailPage = new BookingDetailPage
const dashboard = new Dashboard
const guidebookPage = new GuidebookPage
const reuseableCode = new ReuseableCode

describe('Validate Access Code on Booking listing page', function () {

    const loginEmail = Cypress.config('users').user1.username
    const loginPassword = Cypress.config('users').user1.password
    const propertyName = 'New Property'
    const bSource = 'Direct'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    })
    it('CA_BL_05 > Client can add Access Code in a new booking', () => {
        const accessCode = 'ACC6582625'
        bookingPage.goToBookingPage()
        bookingPage.addNewBookingAndValidate(propertyName, bSource, adults, child) //Add new booking
        bookingPage.addAccessCode(0, accessCode) //index, accessCode
        bookingPage.expandBooking(0)
        bookingPage.validateAccessCode(accessCode)
        //Validate on Booking detail page
        bookingPage.goToBookingDetail(0) //first booking
        bookingDetailPage.verifyAccessCode(accessCode)
    })
   
})