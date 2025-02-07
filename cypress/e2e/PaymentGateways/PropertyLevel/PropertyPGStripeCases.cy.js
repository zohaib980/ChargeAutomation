/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage"
import { ReuseableCode } from "../../../support/ReuseableCode"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"
import { PropertiesPage } from "../../../../pageObjects/PropertiesPage"
import { BookingPage } from "../../../../pageObjects/BookingPage"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const propertiesPage = new PropertiesPage
const bookingPage = new BookingPage

describe('Stripe Payment Gateways Cases at Property level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password
    const propertyName = 'New Property 3'
    let bSource = 'Direct'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_PGP_04 - Connect to Stripe PG on Property level', () => {
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propertyName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Stripe')
        propertiesPage.connectToStripe()
    })
    it('CA_PGP_05 - Booking with Successful Payment (Property level PG) - Stripe', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
    it('CA_PGP_06 - Booking with Failed Payment (Property level PG) - Stripe', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBooking('4000000000000002')
        cy.verifyToast('Your card was declined')
        cy.get('#guest_credit_card_modal_close').should('be.visible').click() //close
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment method not found')
    })
    it('CA_PGP_07 - Booking with 3DS/3DS2 Authentication (Property level PG) - Stripe', () => {
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        bookingPage.addCCOnNewBooking('4000000000003220') //3ds card
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Guest needs to authenticate')
    })
})