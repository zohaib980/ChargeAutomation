/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage"
import { ReuseableCode } from "../../../support/ReuseableCode"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('PayFast Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_PGG_19 - Connect to PayFast PG on Global level', () => {
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('PayFast')
        //Add PG creds
        const merchantID = '10035503'
        const merchantKey = 'f0ijaep7xcbx7'
        const salthPassphrase = 'abcabcabc123123'
        paymentGateway.connectToPayfast(merchantID, merchantKey, salthPassphrase)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    it('CA_PGG_20 - Booking with non-3DS success Card (Global level) - PayFast', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 0) //0 days afterCurrentDate4
        bookingPage.validateReservationChgStatus('Overdue')
        /*
        //Update the RC to make it overdue
        bookingPage.expandBooking(0)
        bookingPage.updateScheduledDate('Reservation Charge', null)
        cy.verifyToast('Due date has been updated successfully')
        */
        bookingPage.addCCOnNewBookingPayFast('Accept') 
        bookingPage.expandBooking(0)
        bookingPage.validateStatus('Reservation Charge', 'Verifying')
    })
    it('CA_PGG_21 - Booking with non-3DS declined Card (Global level) - PayFast', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 0) //0 days afterCurrentDate
        bookingPage.addCCOnNewBookingPayFast('Decline') //4000 to 5000 usd amount will declined the payment
        cy.get('#guest_credit_card_modal_close').should('be.visible').click() //close
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment method not found')
    })
})