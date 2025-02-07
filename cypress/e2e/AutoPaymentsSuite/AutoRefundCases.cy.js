/// <reference types ="cypress" />

import { AutoPayments } from "../../../pageObjects/AutoPayments"
import { LoginPage } from "../../../pageObjects/LoginPage"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { ReuseableCode } from "../../support/ReuseableCode"

const loginPage = new LoginPage
const autoPayments = new AutoPayments
const bookingPage = new BookingPage
const reuseableCode = new ReuseableCode

describe('Autopayment (Reservation Auto Refund cases) Settings Functionalities', () => {

    const loginEmail = Cypress.config('users').user2.username
    const loginPassword = Cypress.config('users').user2.password

    let bSource = 'Direct'
    let propertyName = 'QA Test Property'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_AP_25 - Validate Reservation Auto Refund functionality on a booking source using Anytime after booking', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Disable CC Validation
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.disableCCValidation(bSource)
        //Enable Reservation Payment
        autoPayments.clickEditBS(bSource) //Edit BS
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '0' //Collect When: Immediately
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '0' //When to authorize? Immediately before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable Reservation Auto Refund
        autoPayments.clickEditBS(bSource) //Edit BS
        let toggleStatus = 1  // 1st toggle OR 2nd Toggle 
        let refundTime = '0' //anytime After booking 0
        autoPayments.enableAutoRefund(bSource, toggleStatus, refundTime)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Overdue')
        bookingPage.validateSDStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Overdue')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Add a Credit Card on new booking
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        bookingPage.validateStatus('Reservation Charge', 'Paid')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Cancel the booking
        bookingPage.changeBookingStatus('0')  //Cancelled

        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Paid')
        bookingPage.validateStatus('Refund', 'Approval Required')
        bookingPage.validateStatus('Security Deposit', 'Voided')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Refund', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Approve Transaction
        bookingPage.approveTransaction('Refund')
        cy.url().should('include', 'v2/booking-detail') //Validate the Url
        bookingPage.goToBookingPage()
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateStatus('Refund', 'Overdue', 'Refunded')
    })
    it('CA_AP_26 - Validate Reservation Auto Refund functionality on a booking source using Anytime before checkin', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Disable CC Validation
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.disableCCValidation(bSource)
        //Enable Reservation Payment
        autoPayments.clickEditBS(bSource) //Edit BS
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '0' //Collect When: Immediately
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '0' //When to authorize? Immediately before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable Reservation Auto Refund
        autoPayments.clickEditBS(bSource) //Edit BS
        let toggleStatus = 2  // 1st toggle OR 2nd Toggle 
        let refundTime = '0' //anytime After booking 0
        autoPayments.enableAutoRefund(bSource, toggleStatus, refundTime)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        cy.wait(5000)
        bookingPage.validateReservationChgStatus('Overdue')
        cy.reload()
        bookingPage.validateSDStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Overdue')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Add a Credit Card on new booking
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        bookingPage.validateStatus('Reservation Charge', 'Paid')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Cancel the booking
        bookingPage.changeBookingStatus('0')  //Cancelled
        cy.wait(4000).reload()
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Paid')
        bookingPage.validateStatus('Refund', 'Approval Required')
        bookingPage.validateStatus('Security Deposit', 'Voided')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Refund', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Approve Transaction
        bookingPage.approveTransaction('Refund')
        cy.url().should('include', 'v2/booking-detail') //Validate the Url
        bookingPage.goToBookingPage()
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateStatus('Refund', 'Overdue', 'Refunded')
    })
    it('CA_AP_27 - Validate Reservation Auto Refund functionality on a booking source using 2 Hours after booking', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Disable CC Validation
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.disableCCValidation(bSource)
        //Enable Reservation Payment
        autoPayments.clickEditBS(bSource) //Edit BS
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '0' //Collect When: Immediately
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '0' //When to authorize? Immediately before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable Reservation Auto Refund
        autoPayments.clickEditBS(bSource) //Edit BS
        let toggleStatus = 1  // 1st toggle OR 2nd Toggle 
        let refundTime = '7200' //within 2 hours after booking
        let cancelfee = '10' //10%
        let cancelWithin = '0' //if cancelled within > anytime
        let flatfee = '5' //Flat fee
        autoPayments.enableAutoRefund(bSource, toggleStatus, refundTime, cancelfee, cancelWithin, flatfee)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        cy.wait(5000)
        bookingPage.validateReservationChgStatus('Overdue')
        cy.reload()
        bookingPage.validateSDStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Overdue')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Add a Credit Card on new booking
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        bookingPage.validateStatus('Reservation Charge', 'Paid')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Cancel the booking
        bookingPage.changeBookingStatus('0')  //Cancelled

        cy.log('After booking cancellation A full refund entry is created against Reservation Charge with status approval required (as we are canceling the booking within 2 hours)')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Paid')
        bookingPage.validateStatus('Refund', 'Approval Required')
        bookingPage.validateStatus('Security Deposit', 'Voided')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Refund', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Approve Transaction
        bookingPage.approveTransaction('Refund')
        cy.url().should('include', 'v2/booking-detail') //Validate the Url
        bookingPage.goToBookingPage()
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateStatus('Refund', 'Overdue', 'Refunded')
    })
    it('CA_AP_28 - Validate Reservation Auto Refund functionality on a booking source using 5 days before chcekin', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Disable CC Validation
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.disableCCValidation(bSource)
        //Enable Reservation Payment
        autoPayments.clickEditBS(bSource) //Edit BS
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '0' //Collect When: Immediately
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '0' //When to authorize? Immediately before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable Reservation Auto Refund
        autoPayments.clickEditBS(bSource) //Edit BS
        let toggleStatus = 2  // 1st toggle OR 2nd Toggle 
        let refundTime = '432000' //more then 5 days 
        let cancelfee = '10' //10%
        let cancelWithin = '432000' //if cancelled within > 5 Days
        let flatfee = '5' //Flat fee
        autoPayments.enableAutoRefund(bSource, toggleStatus, refundTime, cancelfee, cancelWithin, flatfee)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        cy.wait(5000)
        bookingPage.validateReservationChgStatus('Overdue')
        cy.reload()
        bookingPage.validateSDStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Overdue')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Add a Credit Card on new booking
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        bookingPage.validateStatus('Reservation Charge', 'Paid')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Cancel the booking
        bookingPage.changeBookingStatus('0')  //Cancelled

        cy.log('On booking cancellation A refund entry is created after deducting charges as per applied settings')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Paid')
        bookingPage.validateStatus('Refund', 'Approval Required')
        bookingPage.validateStatus('Security Deposit', 'Voided')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Refund', '85.00')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Approve Transaction
        bookingPage.approveTransaction('Refund')
        cy.url().should('include', 'v2/booking-detail') //Validate the Url
        bookingPage.goToBookingPage()
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateStatus('Refund', 'Overdue', 'Refunded')
    })
    it('CA_AP_29 - Validate Reservation Auto Refund functionality on a booking source (both toggles are disabled) 10% Cancelation fee within 5 Days and flat fee 5', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Disable CC Validation
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.disableCCValidation(bSource)
        //Enable Reservation Payment
        autoPayments.clickEditBS(bSource) //Edit BS
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '0' //Collect When: Immediately
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '0' //When to authorize? Immediately before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable Reservation Auto Refund
        autoPayments.clickEditBS(bSource) //Edit BS
        let toggleStatus = 0 // both toggles are off
        let refundTime = '' //not applicable as both toggles are disabled 
        let cancelfee = '10' //10%
        let cancelWithin = '432000' //if cancelled within > 5 Days
        let flatfee = '5' //Flat fee
        autoPayments.enableAutoRefund(bSource, toggleStatus, refundTime, cancelfee, cancelWithin, flatfee)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        cy.wait(5000)
        bookingPage.validateReservationChgStatus('Overdue')
        cy.reload()
        bookingPage.validateSDStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Overdue')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Add a Credit Card on new booking
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        bookingPage.validateStatus('Reservation Charge', 'Paid')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Cancel the booking
        bookingPage.changeBookingStatus('0')  //Cancelled

        cy.log('On booking cancellation refund entry is created after deducting charges as per applied settings')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Paid')
        bookingPage.validateStatus('Refund', 'Approval Required')
        bookingPage.validateStatus('Security Deposit', 'Voided')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        bookingPage.valiateTrxAmount('Refund', '85.00')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Approve Transaction
        bookingPage.approveTransaction('Refund')
        cy.url().should('include', 'v2/booking-detail') //Validate the Url
        bookingPage.goToBookingPage()
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateStatus('Refund', 'Overdue', 'Refunded')
    })
    it('CA_AP_30 - Validate Reservation Auto Refund functionality on a booking source (both toggles are disabled) add multiple cancellation fees', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Enable Reservation Auto Refund
        autoPayments.clickEditBS(bSource) //Edit BS
        let toggleStatus = 0 // both toggles are off
        let refundTime = '' //not applicable as both toggles are disabled 
        let cancelfee = '10' //10%
        let cancelWithin = '432000' //if cancelled within > 5 Days
        let flatfee = '5' //Flat fee
        autoPayments.enableAutoRefund(bSource, toggleStatus, refundTime, cancelfee, cancelWithin, flatfee)

        //Add cancellation Fee option
        autoPayments.clickEditBS(bSource) //Edit BS
        // addCancellationOption(index, bSource, cancelfee, cancelWithin, flatfee)
        autoPayments.addCancellationFee(1, bSource, '8', '518400', '5') // 8% if cancelled within 6 Days
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.addCancellationFee(2, bSource, '5', '604800', '5') // 5% if cancelled within 7 Days
        //Delete cancellation Fee option
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.deleteCancellationFee(1, bSource)  //(index, bSource)
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.deleteCancellationFee(1, bSource)  //(index, bSource)

        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)
    })
})
