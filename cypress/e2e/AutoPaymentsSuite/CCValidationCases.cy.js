/// <reference types ="cypress" />

import { AutoPayments } from "../../../pageObjects/AutoPayments"
import { LoginPage } from "../../../pageObjects/LoginPage"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { ReuseableCode } from "../../support/ReuseableCode"

const loginPage = new LoginPage
const autoPayments = new AutoPayments
const bookingPage = new BookingPage
const reuseableCode = new ReuseableCode

describe('Autopayment (Credit card Validation) Settings Functionalities', () => {

    const loginEmail = Cypress.config('users').user1.username
    const loginPassword = Cypress.config('users').user1.password

    let bSource = 'Direct'
    let propertyName = 'QA Test Property'

    beforeEach(() => {
        cy.visit('/')
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_AP_01 - Validate the multiple booking sources on Autopayment rules page', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Validate Page Content
        autoPayments.validateHelpLinks()
        //Validate Add booking source
        autoPayments.validateAddBookingSource()
        //Validate Selected Settings on a BS
        let bSource = 'Direct'
        autoPayments.validateSelectedSettingsOnBS(bSource)
        //Validate selected settings on all BS
        autoPayments.validateSelectedSettingsOnAllBS()
        //Validate the BS status
        autoPayments.getBookingSourceStatus(bSource)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)
        cy.wait(2000)
        //Disable a Booking Source
        autoPayments.disableBookingSource(bSource)
    })
    it('CA_AP_02 - Validate that on adding a booking using disabled BS the AP rules will not be applied', () => {
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        //Disable a Booking Source
        autoPayments.disableBookingSource(bSource)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateNullSD() //Validate that SD is not applied on new created booking
        bookingPage.validateReservationChgStatus('Not Enabled')
        bookingPage.expandBooking(0) //expand first booking
        //In Payment Schedule No SD and CC Auth and Reservation is created on first booking booking
        bookingPage.PaymentScheduleNotContain('Security Deposit')
        bookingPage.PaymentScheduleNotContain('Authorization')
        bookingPage.PaymentScheduleNotContain('Reservation Charge')
    })
    it('CA_AP_03 - Validate "CC validation" functionality on a booking source by "Fixed amount" and authorizing it immediately', () => {
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Reservation Payment
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '0' //Collect When: Immediately 0
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource,amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Disable Reservation Payment
        autoPayments.disableReservationPayment(bSource)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150' //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        autoPayments.enableBookingSource(bSource)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Not Enabled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Authorization', '150')
    })
    it('CA_AP_04 - Validate "CC validation" functionality on a booking source by "Fixed amount" and authorizing it after 10 Hours', () => {
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Reservation Payment
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '0' //Collect When: Immediately 0
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource,amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Disable Reservation Payment
        autoPayments.disableReservationPayment(bSource)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150' //CC Amount to charge
        let cc_authTime = '36000' //When to authorize? 10 Hours
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        autoPayments.enableBookingSource(bSource)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Not Enabled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Authorization', '150')
    })
    it('CA_AP_05 - Validate "CC validation" functionality on a booking source by "Percentage of booking" and authorizing it after "Immediately"', () => {
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Reservation Payment
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '100' //100%
        let reservation_authTime = '0' //Collect When: Immediately: 0
        let reservation_chargeOption = '1' //when to charge: after booking: 1
        autoPayments.enableReservationPayment(bSource,amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Disable Reservation Payment
        autoPayments.disableReservationPayment(bSource)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '2' //How much to authorize? Percentage of booking : 2
        let cc_Amount = '100' //100%
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        autoPayments.enableBookingSource(bSource)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Not Enabled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Authorization', '100')
    })
    it('CA_AP_06 - Validate "CC validation" functionality on a booking source by "First Night" and authorizing it after "Immediately"', ()=>{
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Disable Reservation Payment
        autoPayments.disableReservationPayment(bSource)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '3' //How much to authorize? First Night : 3
        let cc_Amount = '100' //will not be applied here as this field is not-visible
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        autoPayments.enableBookingSource(bSource)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Not Enabled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Authorization', '20.00')

    })
    it('CA_AP_07 - Validate "CC validation" functionality on a booking source by "First Night" and authorizing it after "10 Hours"', ()=>{
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Disable Reservation Payment
        autoPayments.disableReservationPayment(bSource)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '3' //How much to authorize? First Night : 3
        let cc_Amount = '100' //will not be applied here as this field is not-visible
        let cc_authTime = '36000' //When to authorize? : 10 Hours
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        autoPayments.enableBookingSource(bSource)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Not Enabled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Authorization', '20.00')

    })
    it('CA_AP_08 - Validate 3DS verification on CC Authorization when "Chargeback protection" option is enabled under "CC validation" on a booking source', () => {
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Disable Reservation Payment
        autoPayments.disableReservationPayment(bSource)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable CC Validation
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150' //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        //Enable ChargeBack Protection on CC validation
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.enableProtectionCCValidation(bSource)
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        autoPayments.enableBookingSource(bSource)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Not Enabled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Authorization', '150')
        //Add a Credit Card on new booking
        bookingPage.addCCOnNewBooking()
        //Validate 3DS authentication toast
        bookingPage.validate3DSAuthenticationToast()
        //Validate status
        bookingPage.validateStatus('Authorization', 'Awaiting Approval')
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.disableProtectionCCValidation(bSource)
    })
    
})
