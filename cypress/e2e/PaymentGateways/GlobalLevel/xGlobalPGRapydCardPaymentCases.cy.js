/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage.js"
import { ReuseableCode } from "../../../support/ReuseableCode.js"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway.js"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('Rapyd Card Payments Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    xit('CA_PGG_35 - Connect to Rapyd Card Payments PG on Global level', () => { //PCI PG
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Rapyd Card Payments')
        //Add PG creds
        const accessKey = 'rak_EA494AA6CE11003F88CA'
        const secretKey = 'rsk_e285655b7e370108986357999a4a5e23174f31307835386bb6771bc091feeeec187f3c8cbba8038c'
        paymentGateway.connectToRapydCardPayments(accessKey, secretKey)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGG_36 - Booking with non-3DS success Card (Global level) - Rapyd Card Payments', () => { //PCI PG
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        cy.get('@firstName').then(guestName => {
            cy.get('@guestEmail').then(guestEmail => {
                bookingPage.addCCOnNewBookingRepydCardPG('4111111111111111', guestEmail, guestName) //valid non-3ds card
            })
        })
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
    xit('CA_PGG_37 - Booking with non-3DS declined Card (Global level) - Rapyd Card Payments', () => { //PCI PG
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        cy.get('@firstName').then(guestName => {
            cy.get('@guestEmail').then(guestEmail => {
                bookingPage.addCCOnNewBookingRepydCardPG('4111111111111151', guestEmail, guestName) //Declined card
            })
        })
        cy.verifyToast('Please clear error(s)')
        cy.get('#guest_credit_card_modal_close').should('be.visible').click() //close
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment method not found')
    })
})