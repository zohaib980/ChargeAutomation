/// <reference types ="cypress" />

import { AutoPayments } from "../../../pageObjects/AutoPayments"
import { LoginPage } from "../../../pageObjects/LoginPage"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { ReuseableCode } from "../../support/ReuseableCode"

const loginPage = new LoginPage
const autoPayments = new AutoPayments
const bookingPage = new BookingPage
const reuseableCode = new ReuseableCode

describe('Autopayment (Security Deposit) Settings Functionalities', () => {

    const loginEmail = Cypress.config('users').user2.username
    const loginPassword = Cypress.config('users').user2.password

    let bSource = 'Direct'
    let propertyName = 'QA Test Property'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_AP_19 - Validate Security Deposit functionality on a booking source using Fixed Amount appylying Immediately before checkin', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150'  //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Reservation Payment
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '86400' //Collect When: After 1 day
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
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
        bookingPage.validateSDStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '200')

    })
    it('CA_AP_20 - Validate Security Deposit functionality on a booking source using Fixed Amount appylying 3 days before checkin and Chargeback Protection enabled', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150'  //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Reservation Payment
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '86400' //Collect When: After 1 day
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '259200' //When to authorize? 3 days before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable ChargeBack Protection on Security Deposit
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.enableProtectionOnSecurityDeposit(bSource)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.validateSDStatus('Overdue')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        bookingPage.validateStatus('Security Deposit', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '200')

        //Add a Credit Card on new booking
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        //Validate 3DS authentication toast
        cy.verifyToast('This card is protected with 3DS authentication, please authenticate your transaction')
        //Validate status
        bookingPage.validateStatus('Authorization', 'Authorized')
        bookingPage.validateStatus('Security Deposit', 'Awaiting Approval')

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.disableProtectionOnSecurityDeposit(bSource)

    })
    it('CA_AP_21 - Validate Security Deposit functionality on a booking source using 70% of booking and appylying immediately before checkin', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150'  //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Reservation Payment
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '86400' //Collect When: After 1 day
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '2' //How much to authorize? %age of booking
        let sd_Amount = '70'  //SD amount to charge 70%
        let sd_authTime = '0' //When to authorize? Immediately before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.validateSDStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '70')

    })
    it('CA_AP_22 - Validate Security Deposit functionality on a booking source using % of booking and appylying 3 days before checkin', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150'  //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Reservation Payment
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '86400' //Collect When: After 1 day
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '2' //How much to authorize? %age of booking
        let sd_Amount = '100'  //SD amount to charge 100%
        let sd_authTime = '259200' //When to authorize? 3 days before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.validateSDStatus('Overdue')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        bookingPage.validateStatus('Security Deposit', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '100')

    })
    it('CA_AP_23 - Validate Security Deposit functionality on a booking source using First Night and appylying Immediately before checkin', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150'  //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Reservation Payment
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '86400' //Collect When: After 1 day
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '3' //How much to authorize? First Night
        let sd_Amount = '100'  //SD amount to charge will not apply here
        let sd_authTime = '0' //When to authorize? Immediately
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.validateSDStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '20.00')

    })
    it('CA_AP_24 - Validate Security Deposit functionality on a booking source using First Night and appylying 4 days before checkin', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150'  //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Reservation Payment
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '86400' //Collect When: After 1 day
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '3' //How much to authorize? First Night
        let sd_Amount = '100'  //SD amount to charge will not apply here
        let sd_authTime = '345600' //When to authorize? 4 days before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.validateSDStatus('Overdue')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        bookingPage.validateStatus('Security Deposit', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '20.00')

    })
})
