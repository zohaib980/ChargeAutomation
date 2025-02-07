/// <reference types ="cypress" />

import { AutoPayments } from "../../../pageObjects/AutoPayments"
import { LoginPage } from "../../../pageObjects/LoginPage"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { ReuseableCode } from "../../support/ReuseableCode"

const loginPage = new LoginPage
const autoPayments = new AutoPayments
const bookingPage = new BookingPage
const reuseableCode = new ReuseableCode

describe('Autopayment (Reservation Payment) Settings Functionalities', () => {

    const loginEmail = Cypress.config('users').user2.username
    const loginPassword = Cypress.config('users').user2.password

    let bSource = 'Direct'
    let propertyName = 'QA Test Property'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_AP_09 - Validate Reservation Payment functionality on a booking source using % of Booking Amount appylying Immediately after booking', () => {

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
        let reservation_authTime = '0' //Collect When: Immediately 0
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Overdue')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')

    })
    it('CA_AP_10 - Validate Reservation Payment functionality on a booking source using % of Booking (50%) Amount appylying 3 hours after booking', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Reservation Payment
        let amountTypePayment = '2' //Percentage of booking : 2
        let amountTypePaymentSelect = '50' //50%
        let reservation_authTime = '10800' //Collect When: 3 hours
        let reservation_chargeOption = '1' //when to charge: after booking 
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '50')

    })
    it('CA_AP_11 - Validate Reservation Payment functionality on a booking source using % of Booking (100%) Amount appylying Immediately before checkin in Future day booking', () => {

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
        let reservation_authTime = '0' //Collect When: Immediately 0
        let reservation_chargeOption = '2' //when to charge: Before check-in
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')

    })
    it('CA_AP_12 - Validate Reservation Payment functionality on a booking source using % of Booking (100%) Amount appylying Immediately before checkin in sameday booking', () => {

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
        let reservation_authTime = '0' //Collect When: Immediately 0
        let reservation_chargeOption = '2' //when to charge: Before check-in
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '604800' //When to authorize? 7 days before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.happyAddBooking(propertyName, bSource, adults, child) //Create booking in Checkin date as current date
        cy.log("Reservation Charge' status will be 'scheduled' (if run before 4:00 pm) and 'Overdue' (if run after 4pm) tag will be shown under reservation amount")
        bookingPage.validateReservationChgStatus('Scheduled', 'Overdue')
        bookingPage.validateSDStatus('Overdue')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Scheduled', 'Overdue')
        bookingPage.validateStatus('Security Deposit', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')

    })
    it('CA_AP_13 - Validate Reservation Payment functionality on a booking source using % of Booking (60%) Amount appylying 10 Hours before checkin on future day booking', () => {

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
        let amountTypePaymentSelect = '60' //60%
        let reservation_authTime = '36000' //Collect When: 10 hours
        let reservation_chargeOption = '2' //when to charge: Before check-in
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
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2') //Create booking in Checkin date as future date

        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.validateSDStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue') //on creating a booking in future date on same BS "CC Auth" will be applied
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100') //will be created of full amount as (%age of booking charge + Immediately before checkin) will be on the same day. 

    })
    it('CA_AP_14 - Validate Reservation Payment functionality on a booking source as per First Night Amount appylying Immediately after booking', () => {

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
        let amountTypePayment = '3' //First Night
        let amountTypePaymentSelect = '100' //100% - not applied here
        let reservation_authTime = '0' //Collect When: Immediately 0
        let reservation_chargeOption = '1' //when to charge: after booking
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        //Authorization will not be applied here
        bookingPage.validateStatus('Reservation Charge', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '20.00')

    })
    it('CA_AP_15 - Validate Reservation Payment functionality on a booking source as per First Night Amount appylying 2 days after booking', () => {

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
        let amountTypePayment = '3' //First Night 
        let amountTypePaymentSelect = '100' //100% - not applied here
        let reservation_authTime = '172800' //Collect When: 2 days
        let reservation_chargeOption = '1' //when to charge: after booking
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
        //Authorization will not be applied here
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100') // the RC as per first night and remaining RC combine together and shows as single RC
        bookingPage.valiateTrxAmount('Authorization', '150')
    })
    it('CA_AP_16 - Validate Reservation Payment functionality on a booking source as per First Night Amount Immediately before checkin', () => {

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
        let amountTypePayment = '3' //First Night
        let amountTypePaymentSelect = '100' //100% - not applied here
        let reservation_authTime = '0' //Collect When: Immediately
        let reservation_chargeOption = '2' //when to charge: before checkin
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
        //Authorization will not be applied here
        bookingPage.validateStatus('Reservation Charge', 'Scheduled')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100') // the RC as per first night and remaining RC combine together and shows as single RC
        bookingPage.valiateTrxAmount('Authorization', '150')
    })
    it('CA_AP_17 - Validate Reservation Payment functionality on a booking source as per First Night Amount 5 days before checkin', () => {

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
        let amountTypePayment = '3' //First Night
        let amountTypePaymentSelect = '100' //100% - not applied here
        let reservation_authTime = '432000' //Collect When: 5 days
        let reservation_chargeOption = '2' //when to charge: before checkin
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
        //Authorization will not be applied here
        bookingPage.validateStatus('Reservation Charge', 'Overdue')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '20.00') // the RC as per first night 
        bookingPage.valiateTrxAmount('80.00', 'Reservation Charge') // remaining RC
    })
    it('CA_AP_18 - Validate 3DS verification on Reservation Payment when "Chargeback protection" option is enabled under "Reservation Payment" on a booking source', () => {

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
        let reservation_authTime = '0' //Collect When: Immediately 0
        let reservation_chargeOption = '1' //when to charge: after booking 1
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        //Enable ChargeBack Protection on Reservsation Charge
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.enableProtectionOnReservationPayment(bSource)
        //Enable a Booking Source
        autoPayments.enableBookingSource(bSource)

        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Overdue')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Reservation Charge', '100')
        //Add a Credit Card on new booking
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        //Validate 3DS authentication toast
        cy.verifyToast('This card is protected with 3DS authentication, please authenticate your transaction')
        //Validate status
        bookingPage.validateStatus('Reservation Charge', 'Awaiting Approval')
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.clickEditBS(bSource) //Edit BS
        autoPayments.disableProtectionOnReservationPayment(bSource)
    })
})
