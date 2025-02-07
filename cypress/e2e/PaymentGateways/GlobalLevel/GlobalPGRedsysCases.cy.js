/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage"
import { ReuseableCode } from "../../../support/ReuseableCode"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('Redsys Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })

    it('CA_PGG_16 - Connect to Redsys PG on Global level', () => {
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Redsys')
        //Add PG creds
        const merchantCode = '999008881'
        const merchantKey = 'sq7HjrUOBfKmC576ILgskD5srU870gJ7'
        const terminalNumber = '001'
        paymentGateway.connectToRedsys(merchantCode, merchantKey, terminalNumber)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    it('CA_PGG_17 - Booking with non-3DS success Card (Global level) - Redsys', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBookingRedsys('4117731234567891','1234','123')
        bookingPage.close3DSModalRedsys()
        bookingPage.openAddCCModal()
        bookingPage.clickSaveAndUse()
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
    it('CA_PGG_18 - Booking with non-3DS declined Card (Global level) - Redsys', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBookingRedsys('4548814479727229', '1234','999') //declined card
        bookingPage.close3DSModalRedsys()
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment method not found')
    })
    it('CA_PGG_19 - Booking with valid 3DS card (Global level) - Redsys', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBookingRedsys('4918019199883839','1234','123')
        bookingPage.close3DSModalRedsys()
        bookingPage.openAddCCModal()
        bookingPage.clickSaveAndUse()
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
})