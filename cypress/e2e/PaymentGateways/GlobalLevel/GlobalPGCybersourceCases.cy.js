/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage"
import { ReuseableCode } from "../../../support/ReuseableCode"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"
const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('Cybersource Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    xit('CA_PGG_12 - Connect to Cybersource PG on Global level', () => {
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Cybersource')
        //Add PG creds
        const merchantID = 'testrest'
        const profileID = '93B32398-AD51-4CC2-A682-EA3E93614EB1'
        const apiKeyID = '08c94330-f618-42a3-b09d-e1e43be5efda'
        const sharedSecretKey = 'yBJxy6LjM2TmcPGu+GaJrHtkke25fPpUX+UY6/L/1tE='
        const threeDS = 1 //enable
        paymentGateway.connectToCybersource(merchantID, profileID, apiKeyID, sharedSecretKey, threeDS)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGG_13 - Booking with non-3DS success Card (Global level) - Cybersource', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBookingCybersource('4111111111111111')
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
    xit('CA_PGG_14 - Booking with non-3DS declined Card (Global level) - Cybersource', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBookingCybersource('4010057022666555')
        cy.verifyToast('One or more fields have a validation error')
        cy.get('#guest_credit_card_modal_close').should('be.visible').click() //close
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment method not found')
    })
})