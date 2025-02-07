/// <reference types = "cypress"/>

import { AutoPayments } from "../../../pageObjects/AutoPayments.js"
import { LoginPage } from "../../../pageObjects/LoginPage.js"
import { BookingPage } from "../../../pageObjects/BookingPage.js"
import { ReuseableCode } from "../../support/ReuseableCode.js"

const loginPage = new LoginPage
const autoPayments = new AutoPayments
const bookingPage = new BookingPage
const reuseableCode = new ReuseableCode

describe('Additional Charges on Booking Listing Test Cases Using Send Payment Link', () => {

    const loginEmail = Cypress.config('users').user2.username
    const loginPassword = Cypress.config('users').user2.password

    let bSource = 'Direct'
    let propertyName = 'QA Test Property'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_CACH_18 > On booking listing, Create an AC using “Send Payment link” and process it using valid non-3DS card', () => {
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Create an Additional Charge
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('16')
        bookingPage.addDescriptionOnAC('Test Descp')
        //Click Send payment link
        bookingPage.clickSendPaymentLinkOnAC()
        cy.verifyToast('Payment Link Sent Successfully')
        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 sent to the guest')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Pending')
        //Copy link URL
        bookingPage.visitCopyLinkURLOnAdditionalCharge()
        //Process AC on copied URL using non-3ds card
        bookingPage.processACOnCopiedURL('Pending', 'CA$16.00', '4242424242424242')
        cy.verifyToast('Card added successfully')
        cy.get('.payment-submission h3').should('be.visible').and('contain.text', 'Your submission was successful')

        cy.visit('/client/v2/bookings')
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00 on card ending with **4242')
        bookingPage.validateACTrxStatus('Paid')

    })
    it('CA_CACH_19 > On booking listing, Create an AC using “Send Payment link” after enabling Chargeback Protection and process it using valid CC', () => {
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Create an Additional Charge
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('16')
        bookingPage.addDescriptionOnAC('Test Descp')
        bookingPage.enableChargebackOnAC()
        //Click Send payment link
        bookingPage.clickSendPaymentLinkOnAC()
        cy.verifyToast('Payment Link Sent Successfully')
        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 sent to the guest')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Pending')
        bookingPage.validateChargebackStatusOnAC('pending') //Sheild icon status on AC
        //Copy link URL
        bookingPage.visitCopyLinkURLOnAdditionalCharge()
        //Process AC on copied URL using non-3ds card
        bookingPage.processACOnCopiedURL('Pending', 'CA$16.00', '4242424242424242')
        cy.verifyToast('Please verify your card information')
        cy.get('.modal-title').should('be.visible').and('contain.text', 'Verify 3D secure card').wait(10000)
        cy.reload()
        cy.get('.payment-submission h3').should('be.visible').and('contain.text', 'Your submission was successful')

        cy.visit('/client/v2/bookings')
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00 on card ending with **4242')
        bookingPage.validateACTrxStatus('Paid')
        bookingPage.validateChargebackStatusOnAC('applied') //Sheild icon status on AC
    })
    it('CA_CACH_20 > On booking listing, Create an AC using “Send Payment link” and process it by clicking Charge Now and on non-3DS card', () => {
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0) //expand first booking
        //Create an Additional Charge
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('16')
        bookingPage.addDescriptionOnAC('Test Descp')
        //Click Send payment link
        bookingPage.clickSendPaymentLinkOnAC()
        cy.verifyToast('Payment Link Sent Successfully')
        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 sent to the guest')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Pending')
        //Process AC using ChargeNow
        bookingPage.clickChargeNow('Additional Charges')
        cy.verifyToast('Payment successfully charged')

        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00 on card ending with **4242')
        bookingPage.validateACTrxStatus('Paid')

    })
    it('CA_CACH_21 > On booking listing, Create an AC using “Send Payment link” and process it by clicking Charge Now and on 3DS card', () => {
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.addCCOnNewBooking('4000000000003220') //add a 3ds card on booking
        cy.verifyToast('Card added successfully')
        bookingPage.expandBooking(0) //expand first booking
        //Create an Additional Charge
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('16')
        bookingPage.addDescriptionOnAC('Test Descp')
        //Click Send payment link
        bookingPage.clickSendPaymentLinkOnAC()
        cy.verifyToast('Payment Link Sent Successfully')
        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 sent to the guest')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Pending')
        //Process AC using ChargeNow
        bookingPage.clickChargeNow('Additional Charges')
        cy.verifyToast('Guest needs to authenticate')
        bookingPage.validateACTrxStatus('Awaiting Approval')
        bookingPage.validateBookingLog('Additional Charges', 'Authentication email sent to the cardholder for the payment of CA$16.00 on card ending with **3220')
        /*
        bookingPage.getAuthlinkOnAdditionalCharge()
        //Approve 3DS on Stripe
        bookingPage.approve3DSOnStripe()
        cy.visit('/client/v2/bookings')
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00 on card ending with **3220')
        bookingPage.validateACTrxStatus('Paid')
        */
    })
    it('CA_CACH_22 > On booking listing, Create an AC using “Send Payment link” and verify that when client try to process it without adding a CC it shows an error', () => {
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Create an Additional Charge
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('16')
        bookingPage.addDescriptionOnAC('Test Descp')
        //Click Send payment link
        bookingPage.clickSendPaymentLinkOnAC()
        cy.verifyToast('Payment Link Sent Successfully')
        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 sent to the guest')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Pending')
        //Process AC using ChargeNow
        bookingPage.clickChargeNow('Additional Charges')
        cy.verifyToast('Payment method not found')
        bookingPage.validateACTrxStatus('Pending')
    })
})