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

describe('Validate Access Code on Booking detail page', function () {

    const loginEmail = Cypress.config('users').user1.username
    const loginPassword = Cypress.config('users').user1.password
    const propertyName = 'New Property'
    const bSource = 'Direct'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    })
    it('CA_BDL_01 > Client can add Access Code in booking detail', () => {
        const accessCode = 'ACC8956565'
        bookingPage.goToBookingPage()
        bookingPage.addNewBookingAndValidate(propertyName, bSource, adults, child) //Add new booking
        //Validate on Booking detail page
        bookingPage.goToBookingDetail(0) //first booking
        bookingDetailPage.addAccessCode(accessCode)
        bookingDetailPage.clickSaveChanges()
        cy.verifyToast('Booking Detail is updated')
        cy.reload()
        bookingDetailPage.verifyAccessCode(accessCode)
    })
    it('CA_BDL_02 > Client can update Access Code in booking detail', () => {
        const accessCode = 'ACC8956565'
        const newAccessCode = 'ACCNEW9659666'
        bookingPage.goToBookingPage()
        bookingPage.addNewBookingAndValidate(propertyName, bSource, adults, child) //Add new booking
        //Validate on Booking detail page
        bookingPage.goToBookingDetail(0) //first booking
        bookingDetailPage.addAccessCode(accessCode)
        bookingDetailPage.clickSaveChanges()
        cy.verifyToast('Booking Detail is updated')
        cy.reload()
        bookingDetailPage.verifyAccessCode(accessCode)
        //Update the access code 
        bookingDetailPage.addAccessCode(newAccessCode)
        bookingDetailPage.clickSaveChanges()
        cy.verifyToast('Booking Detail is updated')
        cy.reload()
        bookingDetailPage.verifyAccessCode(newAccessCode)
    })
})