/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage"
import { ReuseableCode } from "../../../support/ReuseableCode"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('Auth.net Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_PGG_09 - Connect to Authorize.net PG on Global level', () => {
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Authorize.Net')
        //Add PG creds
        const apiLoginID = '6sBv2PL2P'
        const transactionKey = '5T3edKsu935B5BYL'
        const signatureKey = '915764E28A82589EBEC542B69AF87F3D526EADEB903641324602A3676933CD8055D7CC095ADCB15FE1864C4918B11780C89E674C1C9B777A8AA0279563B0ACFE'
        const cvvStatus = 1
        const zipCodeStatus = 1
        const billingAddStatus = 1
        paymentGateway.connectToAuthorizeNet(apiLoginID, transactionKey, signatureKey, cvvStatus, zipCodeStatus, billingAddStatus)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    it('CA_PGG_10 - Booking with non-3DS success Card (Global level) - Authorize.net', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBookingAuthNet('4111111111111111')
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
    it('CA_PGG_11 - Booking with non-3DS declined Card (Global level) - Authorize.net', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBookingAuthNet('4111111111111111', null, '46282') //card, guestName, postalCode
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('This transaction has been declined')
    })
})