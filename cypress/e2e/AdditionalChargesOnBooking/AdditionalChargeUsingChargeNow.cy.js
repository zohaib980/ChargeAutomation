/// <reference types = "cypress"/>

import { AutoPayments } from "../../../pageObjects/AutoPayments.js"
import { LoginPage } from "../../../pageObjects/LoginPage.js"
import { BookingPage } from "../../../pageObjects/BookingPage.js"
import { ReuseableCode } from "../../support/ReuseableCode.js"

const loginPage = new LoginPage
const autoPayments = new AutoPayments
const bookingPage = new BookingPage
const reuseableCode = new ReuseableCode

describe('Additional Charges on Booking Listing Test Cases Using Charge Now', () => {

    const loginEmail = Cypress.config('users').user2.username
    const loginPassword = Cypress.config('users').user2.password

    let bSource = 'Direct'
    let propertyName = 'QA Test Property'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_CACH_01 > On booking listing, While creating AC If a client selects 3DS option or attempts to use “Send Payment link” feature then we should make email mandatory', () => {
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150'  //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        //Enable Reservation Payment
        autoPayments.clickEditBS(bSource) //Edit BS
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '0' //Collect When: Immediately 0
        let reservation_chargeOption = '2' //when to charge: Before check-in
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        //Enable Security Deposit
        autoPayments.clickEditBS(bSource) //Edit BS
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '0' //When to authorize? Immediately before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.removeEmailFromBooking(0) //from 1st booking
        bookingPage.expandBooking(0) //expand first booking
        //Create an Additional Charge
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('11')
        bookingPage.addDescriptionOnAC('Test Descp')
        //Enable Chargeback protection
        bookingPage.enableChargebackOnAC()
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4242424242424242')
        cy.verifyToast('Guest email address is required for chargeback protection')
        cy.get('.loading-label').should('not.exist') //loader should be disappear

        //Create an Additional Charge
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('11')
        bookingPage.addDescriptionOnAC('Test Descp')
        //Click Send Payment Link
        bookingPage.clickSendPaymentLinkOnAC()
        cy.verifyToast('Guest email address is required for Payment Request')
        cy.get('.loading-label').should('not.exist') //loader should be disappear

    })
    it('CA_CACH_02 > On booking listing, Create an AC using Charge Now and adding valid non-3DS CC', () => {
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Create an Additional Charge
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('11')
        bookingPage.addDescriptionOnAC('Test Descp')
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4242424242424242')
        cy.verifyToast('Payment Successfully Charged')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        //Validate booking log
        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$11.00 on card ending with **4242')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Paid')
    })
    it('CA_CACH_03 > On booking listing, Create an AC using Charge Now and adding valid 3DS CC', () => {
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
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4000000000003220')

        cy.verifyToast('This card is protected with 3DS, Email has been sent to guest to Authorize and pay this transaction')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        //Validate booking log
        bookingPage.validateBookingLog('Additional Charges', 'Authentication email sent to the cardholder for the payment of CA$16.00 on card ending with **3220')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Awaiting Approval')
        //Get and visit AuthenticationLink from AC
        bookingPage.getAuthlinkOnAdditionalCharge()
        /*
        //Approve 3DS on Stripe
        bookingPage.approve3DSOnStripe()
        cy.visit('/client/v2/bookings')
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00 on card ending with **3220')
        bookingPage.validateACTrxStatus('Paid')
        */
    })
    it('CA_CACH_04 > On booking listing, Create an AC using Charge Now and adding a invalid CC while there is already a CC added on the booking', () => {
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
        bookingPage.addAmountOnAC('11')
        bookingPage.addDescriptionOnAC('Test Descp')
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4000000000000002')
        cy.verifyToast('Your card was declined')
    })
    it('CA_CACH_05 > On booking listing, Create an AC using Charge Now without adding a new CC while there is already a CC added on the booking', () => {
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
        bookingPage.addAmountOnAC('20')
        bookingPage.addDescriptionOnAC('Test Descp')
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('', true) //add no card
        cy.verifyToast('Your card number is incomplete')
        //Payment should not be charged from default card **4242
        cy.get('.activelog-desc').should('not.contain.text', 'Payment of CA$20.00 on card ending with **4242')
    })
    it('CA_CACH_06 > On booking listing, Create an AC using Charge Now and adding valid CC by enabling the Chargeback', () => {
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
        //Enable Chargeback Protection
        bookingPage.enableChargebackOnAC()
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4242424242424242')

        cy.verifyToast('This card is protected with 3DS, Email has been sent to guest to Authorize and pay this transaction')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        //Validate booking log
        bookingPage.validateBookingLog('Additional Charges', 'Authentication email sent to the cardholder for the payment of CA$16.00 on card ending with **4242')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Awaiting Approval')
        //Validate Chargeback protection icon
        bookingPage.validateChargebackStatusOnAC('pending') //'applied' OR 'pending'
        /*
        //Get and visit AuthenticationLink from AC
        bookingPage.getAuthlinkOnAdditionalCharge()
        cy.get('@authLink').then(authLink => {
            cy.visit(authLink)
            cy.wait(3000)
        })
        //cy.verifyToast('Successfully Charged via 3DS')
        cy.visit('/client/v2/bookings')
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00 on card ending with **4242')
        bookingPage.validateACTrxStatus('Paid')
        //Validate Chargeback protection icon
        bookingPage.validateChargebackStatusOnAC('applied') //'applied' OR 'pending'
        */
    })
    it('CA_CACH_07 > On booking listing, Create an AC using Charge Now and adding valid CC by enabling the Chargeback and process it using Charge Now (without 3D)', () => {
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
        //Enable Chargeback Protection
        bookingPage.enableChargebackOnAC()
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4242424242424242')

        cy.verifyToast('This card is protected with 3DS, Email has been sent to guest to Authorize and pay this transaction')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        //Validate booking log
        bookingPage.validateBookingLog('Additional Charges', 'Authentication email sent to the cardholder for the payment of CA$16.00 on card ending with **4242')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Awaiting Approval')
        //Validate Chargeback protection icon
        bookingPage.validateChargebackStatusOnAC('pending') //'applied' OR 'pending'
        //Charge now without 3DS
        bookingPage.chargeNowWithout3DS()
        cy.verifyToast('Payment successfully charged')

        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00 on card ending with **4242 attempted without 3DS')
        bookingPage.validateACTrxStatus('Paid')
    })
    it('CA_CACH_08 > On booking listing, Create an AC using Charge Now and adding valid CC by enabling the Chargeback and Mark as Paid', () => {
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
        //Enable Chargeback Protection
        bookingPage.enableChargebackOnAC()
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4242424242424242')

        cy.verifyToast('This card is protected with 3DS, Email has been sent to guest to Authorize and pay this transaction')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        //Validate booking log
        bookingPage.validateBookingLog('Additional Charges', 'Authentication email sent to the cardholder for the payment of CA$16.00 on card ending with **4242')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Awaiting Approval')
        //Validate Chargeback protection icon
        bookingPage.validateChargebackStatusOnAC('pending') //'applied' OR 'pending'
        //Mark as Paid on AC
        bookingPage.markAsPaidOnAC()
        cy.verifyToast('Successfully Marked as Paid')

        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00')
        bookingPage.validateACTrxStatus('Marked as Paid')
    })
    it('CA_CACH_09 > On booking listing, Create an AC using Charge Now and adding valid CC by enabling the Chargeback and make it void', () => {
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
        //Enable Chargeback Protection
        bookingPage.enableChargebackOnAC()
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4242424242424242')

        cy.verifyToast('This card is protected with 3DS, Email has been sent to guest to Authorize and pay this transaction')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        //Validate booking log
        bookingPage.validateBookingLog('Additional Charges', 'Authentication email sent to the cardholder for the payment of CA$16.00 on card ending with **4242')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Awaiting Approval')
        //Validate Chargeback protection icon
        bookingPage.validateChargebackStatusOnAC('pending') //'applied' OR 'pending'
        //void the additional charge
        bookingPage.markAdditionalChargeAsVoid()
        cy.verifyToast('Successfully Voided')

        cy.get('.activity-log-table td:nth-child(2)').contains('Additional Charges')
            .parents('.activity-log-table tr').should('contain.text', 'Manually Voided') //Actual response
        bookingPage.validateACTrxStatus('Manually Voided')
    })
    it('CA_CACH_10 > On booking listing, Create an AC using Charge Now and process AC using a non-3DS CC and make a full Refund', () => {
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Create an Additional Charge
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('11')
        bookingPage.addDescriptionOnAC('Test Descp')
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4242424242424242')
        cy.verifyToast('Payment Successfully Charged')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        //Validate booking log
        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$11.00 on card ending with **4242')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Paid')
        //Refund
        bookingPage.refundAdditionalCharge('11')
        cy.verifyToast('Payment Refunded Successfully')
        bookingPage.validateBookingLog('Refund', 'Payment of CA$11.00 Successfully Refunded')
        bookingPage.validateStatus('Refund', 'Refunded')
    })
    it('CA_CACH_11 > On booking listing, Create an AC using Charge Now and process AC using a non-3DS CC and make a partial Refund', () => {
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
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4242424242424242')
        cy.verifyToast('Payment Successfully Charged')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        //Validate booking log
        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00 on card ending with **4242')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Paid')
        //Refund
        bookingPage.refundAdditionalCharge('10')
        cy.verifyToast('Payment Refunded Successfully')
        bookingPage.validateBookingLog('Refund', 'Payment of CA$10.00 Successfully Refunded')
        bookingPage.validateStatus('Refund', 'Refunded')
    })
})