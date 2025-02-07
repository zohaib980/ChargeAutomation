/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage.js"
import { ReuseableCode } from "../../../support/ReuseableCode.js"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway.js"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('WorldPayWPG Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })

    xit('CA_PGG_26 - Connect to WorldPayWPG PG on Global level', () => { //PCI PG
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('WorldPayWPG')
        //Add PG creds
        const merchantCode = 'THEFINERDWE1M1'
        const XMLAPIUsername = 'THEFINERDWE1M1'
        const XMLPassword = 'RzHT3VNw'
        const threeDS = 1
        const billingAddStatus = 1
        paymentGateway.connectWorldPayWPG(merchantCode, XMLAPIUsername, XMLPassword, threeDS, billingAddStatus)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGG_27 - Booking with non-3DS success Card (Global level) - WorldPayWPG', () => { //PCI PG
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        cy.get('@firstName').then(guestName => {
            cy.get('@guestEmail').then(guestEmail => {
                bookingPage.addCCOnNewBookingWorldPayWPG('4111111111111111', guestEmail, guestName) //valid non-3ds card
            })
        })
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
    xit('CA_PGG_28 - Booking with non-3DS declined Card (Global level) - WorldPayWPG', () => { //PCI PG
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        cy.get('@firstName').then(guestName => {
            cy.get('@guestEmail').then(guestEmail => {
                bookingPage.addCCOnNewBookingWorldPayWPG('4000001000000034', guestEmail, guestName)
            })
        })
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Invalid payment details : Card number not recognised')
    })
})