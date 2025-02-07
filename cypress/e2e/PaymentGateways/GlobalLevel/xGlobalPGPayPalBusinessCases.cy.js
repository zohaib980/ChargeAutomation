/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage.js"
import { ReuseableCode } from "../../../support/ReuseableCode.js"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway.js"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('PayPal Business Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        cy.visit('/')
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    xit('CA_PGG_29 - Connect to PayPal Business PG on Global level', () => { //PCI PG
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('PayPal Business')
        //Add PG creds
        const clientID = 'AWi8du_ZDr3TY66eMwBtdDMy8-NtKLU3neKUsi-Xhj7lj_AnEI56F5FCiltaCMswJqMi6zo1t2tLvp7B'
        const clientSecret = 'EFisCPYI--mgZluS1xG4Bly9R-lPcJMdXu2hcsoT5kpUNV2sE_87oObNnBVT14GlgZQlmxZInX2TgNb7'
        paymentGateway.connectPaypalBusiness(clientID, clientSecret)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGG_30 - Booking with non-3DS success Card (Global level) - PayPal Business', () => { //PCI PG
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        cy.get('@firstName').then(guestName => {
            cy.get('@guestEmail').then(guestEmail => {
                bookingPage.addCCOnNewBookingPaypalBusinessWPG('4111111111111111', guestEmail, guestName) //valid non-3ds card
            })
        })
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
    xit('CA_PGG_31 - Booking with non-3DS declined Card (Global level) - PayPal Business', () => { //PCI PG
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        cy.get('@firstName').then(guestName => {
            cy.get('@guestEmail').then(guestEmail => {
                bookingPage.addCCOnNewBookingPaypalBusinessWPG('4012888888881881', guestEmail, 'CCREJECT-EC') //Declined card
            })
        })
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Rejected. Description: DECLINED')
    })
})