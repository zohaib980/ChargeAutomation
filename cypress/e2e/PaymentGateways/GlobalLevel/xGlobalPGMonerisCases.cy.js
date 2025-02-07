/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage.js"
import { ReuseableCode } from "../../../support/ReuseableCode.js"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway.js"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('Moneris Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })

    xit('CA_PGG_32 - Connect to Moneris PG on Global level', () => { //PCI PG
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Moneris')
        //Add PG creds
        const storeID = 'store1'
        const apiToken = 'yesguy1'
        const country = 'CA'
        const threeDS = 1
        paymentGateway.connectToMoneris(storeID, apiToken, country, threeDS)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGG_33 - Booking with non-3DS success Card (Global level) - Moneris', () => { //PCI PG
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        cy.get('@firstName').then(guestName => {
            cy.get('@guestEmail').then(guestEmail => {
                bookingPage.addCCOnNewBookingMonerisPG('5454545454545454', guestEmail, guestName) //valid non-3ds card
            })
        })
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
    xit('CA_PGG_34 - Booking with non-3DS Declined Card (Global level) - Moneris', () => { //PCI PG
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        cy.get('@firstName').then(guestName => {
            cy.get('@guestEmail').then(guestEmail => {
                bookingPage.addCCOnNewBookingMonerisPG('5405903043090336', guestEmail, guestName) //Declined card
            })
        })
        cy.verifyToast('Card added successfully')
        //cy.get('#guest_credit_card_modal_close').should('be.visible').click() //close
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Operation failed!!!. WITHDRAWAL COUNT EXCEEDED               = Code: 492')
    })
})