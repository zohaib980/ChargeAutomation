/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage.js"
import { ReuseableCode } from "../../../support/ReuseableCode.js"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway.js"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('Nuvei Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    xit('CA_PGG_41 - Connect to Nuvei PG on Global level', () => { //PCI PG
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Nuvei')
        //Add PG creds
        const merchantID = '3285725357924628305'
        const merchantSiteID = '257648'
        const secretKey = '3aakLcAr3A8yBHeSxNl7ogrXghWHehsiCBFlWqfkYZKrLeLKA8nMdMP2IoBsQPWK'
        const threeDS = 1
        paymentGateway.connectToNuvei(merchantID, merchantSiteID, secretKey, threeDS)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGG_42 - Booking with non-3DS success Card (Global level) - Nuvei', () => { //PCI PG
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        cy.get('@firstName').then(guestName => {
            cy.get('@guestEmail').then(guestEmail => {
                bookingPage.addCCOnNewBookingNuveiPG('4111111111111111', guestEmail, guestName) //valid non-3ds card
            })
        })
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Payment successfully charged')
    })
    xit('CA_PGG_43 - Booking with non-3DS declined Card (Global level) - Nuvei', () => { //PCI PG
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, 4) //4 days afterCurrentDate
        cy.get('@firstName').then(guestName => {
            cy.get('@guestEmail').then(guestEmail => {
                bookingPage.addCCOnNewBookingNuveiPG('4008370896662369', guestEmail, guestName) //Declined card
            })
        })
        cy.verifyToast('Card added successfully')
        //cy.get('#guest_credit_card_modal_close').should('be.visible').click() //close
        bookingPage.expandBooking(0)
        bookingPage.clickChargeNow('Reservation Charge')
        cy.verifyToast('Rejected , see GatewayResult Code+Description .  Decline Code: 0 -1')
    })
})