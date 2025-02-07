/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage"
import { ReuseableCode } from "../../../support/ReuseableCode"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"
import { AutoPayments } from "../../../../pageObjects/AutoPayments.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage
const autoPayments = new AutoPayments

describe('Stripe Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_PGG_04 - Connect to Stripe PG on Global level', () => {
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Stripe')
        paymentGateway.connectToStripe()
    })
    it('CA_PGG_05 - Booking with non-3DS success Card (Global level) - Stripe', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
    it('CA_PGG_06 - Booking with non-3DS declined Card (Global level) - Stripe', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBooking('4000000000000002')
        cy.verifyToast('Your card was declined')
        cy.get('#guest_credit_card_modal_close').should('be.visible').click() //close
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment method not found')
    })
    it('CA_PGG_07 - Booking with valid 3DS card (Global level) - Stripe', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate checkin
        bookingPage.addCCOnNewBooking('4000000000003220') //3ds card
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Guest needs to authenticate')
    })
    it('CA_PGG_08 - On Switching the other PG all old payments get aborted (Global level)', () => {
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Stripe')
        paymentGateway.connectToStripe()
        //The user is on Stripe

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Enable Reservation Payment
        autoPayments.clickEditBS(bSource) //Edit BS
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '0' //Collect When: Immediately 0
        let reservation_chargeOption = '2' //when to charge: Before check-in
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)

        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBooking('4000000000003220') //3ds card
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Guest needs to authenticate')
        //Switch the PG to Auth.net
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
        cy.get('.setup-page-title').should('be.visible').and('contain.text','Connect your Property Management System')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        //Try to process the previous booking payments
        bookingPage.goToBookingPage()
        bookingPage.expandBooking(0)
        bookingPage.clickAuthorizeNow('Security Deposit')
        cy.verifyToast('Transactions cannot be attempted because the property is connected to a new Payment Gateway. The guest must provide a new card')
    })
})