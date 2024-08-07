/// <reference types ="cypress" />

import { AutoPayments } from "../../../pageObjects/AutoPayments"
import { LoginPage } from "../../../pageObjects/LoginPage"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { ReuseableCode } from "../../support/ReuseableCode"

const loginPage = new LoginPage
const autoPayments = new AutoPayments
const bookingPage = new BookingPage
const reuseableCode = new ReuseableCode

describe('Create, Delete & Copy Booking Source Cases', () => {

    const loginEmail = Cypress.config('users').user1.username
    const loginPassword = Cypress.config('users').user1.password

    let bSource = 'Direct'
    let propertyName = 'QA Test Property'

    beforeEach(() => {
        cy.visit('/')
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_AP_31 - Create a new Booking Source', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Create Booking source
        let BSname = 'testingBS'
        autoPayments.createBookingSource(BSname)
        autoPayments.validateToastMsg('Booking source added successfully')
        //Validate created BS
        autoPayments.validateSelectedSettingsOnBS(BSname)
        autoPayments.getBookingSourceStatus(BSname)
        //Delete BS
        autoPayments.clickEditBS(BSname) //Edit BS
        autoPayments.deleteBookingSource()
        autoPayments.validateToastMsg('Booking source deleted successfully')

    })
    it('CA_AP_32 - Delete a newly created Booking Source not used in any booking', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Create Booking source
        let BSname = 'testingBS'
        autoPayments.createBookingSource(BSname)
        autoPayments.validateToastMsg('Booking source added successfully')
        //Validate created BS
        autoPayments.validateSelectedSettingsOnBS(BSname)
        autoPayments.getBookingSourceStatus(BSname)
        //Delete BS
        autoPayments.clickEditBS(BSname) //Edit BS
        autoPayments.deleteBookingSource()
        autoPayments.validateToastMsg('Booking source deleted successfully')
    })
    it('CA_AP_33 - Delete a Booking Source already have created bookings', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Create Booking source
        let BSname = 'TestBS'
        //Validate created BS
        autoPayments.validateSelectedSettingsOnBS(BSname)
        autoPayments.getBookingSourceStatus(BSname)
        //Delete BS
        autoPayments.clickEditBS(BSname) //Edit BS
        autoPayments.deleteBookingSource()
        autoPayments.validateToastMsg('Booking source cannot be deleted, because there are some bookings for this booking source.')
    })
    it('CA_AP_34 - Validate "Copy Settings To" functionality on Autopayments', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        let newBS = 'abcBS'
        let OldBS = 'Direct'
        //Validate Old BS
        autoPayments.validateSelectedSettingsOnBS(OldBS)
        autoPayments.getBookingSourceStatus(OldBS)
        //Create new BS = abcBS
        autoPayments.createBookingSource(newBS) //abcBS
        autoPayments.validateToastMsg('Booking source added successfully')
        //Copy AP Settings from oldBS to newBS
        autoPayments.copyAPSettings(OldBS, newBS)
        //Validate Applied settings 
        autoPayments.validateAppliedAPSettings(OldBS, newBS)
        //Delete abcBS
        autoPayments.clickEditBS(newBS) //Edit BS
        autoPayments.deleteBookingSource()
        autoPayments.validateToastMsg('Booking source deleted successfully')
    })
    it('CA_AP_35 - Validate search and Select/deselect BS options on Copy Booking Source Setting modal', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //select a BS for Copy AP Settings
        autoPayments.clickEditBS(bSource)
        autoPayments.selectBSOnCopyAPSettings('TestBS')
        //deselect a BS for Copy AP Settings
        autoPayments.deselectBSOnCopyAPSettings('TestBS')

    })
    it('CA_AP_36 - Create a new Booking Source using previously created BS name', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        let OldBS = 'Direct'
        //Create new BS using previously created BS's name
        autoPayments.createBookingSource(OldBS) //abcBS
        autoPayments.validateToastMsg('The Booking Source has already been taken.')
    })
    it('CA_AP_37 - Validate tooltip messages on autopayment settings', () => {

        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Validate help-link tooltip
        autoPayments.validateHelpLinkTooltip()

        autoPayments.clickEditBS(bSource)
        //Validate Credit card Validation tooltips
        autoPayments.validateCCValidationTooltip()

        //Validate Reservation Payment tooltips
        autoPayments.validateReservationTooltip()

        //Validate Security Deposit tooltips
        autoPayments.validateSDTooltip()

        //Validate Reservation Auto Refund tooltips
        autoPayments.validateAutoRefundTooltip()

    })
    it('CA_AP_38 - Validate booking status created using disabled Autopayment rule', () => {
        let bSource = 'TestBS'
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        autoPayments.disableBookingSource(bSource) //Disable the booking Source
        bookingPage.goToBookingPage()
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.addNewBookingAndValidate(propertyName, bSource, adults, child)
        bookingPage.validateReservationChgStatus('Not Enabled')
        //Validate tooltip message
        bookingPage.validateRCTooltipMsg('Booking was created before Autopayment was enabled for '+bSource)
    })
    it('CA_AP_39 - Validate that If RC is disabled on enabled BS than on creating a new booking the RC status will be "not enabled"', () => {
        let bSource = 'TestBS'
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Enable CC Validation
        autoPayments.clickEditBS(bSource) //Edit BS
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150' //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        //Disable RC
        autoPayments.clickEditBS(bSource)
        autoPayments.disableReservationPayment(bSource)
        //Enable Security Deposit
        autoPayments.clickEditBS(bSource)
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '0' //When to authorize? Immediately before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable BS and create a booking
        autoPayments.enableBookingSource(bSource) //Enable the booking Source
        bookingPage.goToBookingPage()
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Not Enabled')
        bookingPage.validateSDStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        bookingPage.validateStatus('Security Deposit', 'Scheduled')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Authorization', '150')
        bookingPage.valiateTrxAmount('Security Deposit', '200')
        //Validate tooltip message
        bookingPage.validateRCTooltipMsg('Reservation auto payment collection is not enabled for '+bSource)
    })
    it('CA_AP_40 - Validate that If RC is disabled and SD is applied as per % of booking than SD amount should be applied correctly', () => {
        let bSource = 'TestBS'
        autoPayments.gotoAutopayments()
        autoPayments.validateWarningPopup() //Warning popup
        //Enable CC Validation
        autoPayments.clickEditBS(bSource) //Edit BS
        let cc_amountType = '1' //How much to authorize? Fixed amount
        let cc_Amount = '150' //CC amount to charge
        let cc_authTime = '0' //When to authorize? Immediately
        autoPayments.enableCCValidation(bSource, cc_amountType, cc_Amount, cc_authTime)
        //Disable RC
        autoPayments.clickEditBS(bSource)
        autoPayments.disableReservationPayment(bSource)
        //Enable Security Deposit
        autoPayments.clickEditBS(bSource)
        let sd_amountType = '2' //How much to authorize? %age of booking
        let sd_Amount = '60'  //SD amount to charge 60%
        let sd_authTime = '259200' //When to authorize? 3 days before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Enable BS and create a booking
        autoPayments.enableBookingSource(bSource) //Enable the booking Source
        bookingPage.goToBookingPage()
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Not Enabled')
        bookingPage.validateSDStatus('Overdue')
        bookingPage.expandBooking(0) //expand first booking
        //Validate status
        bookingPage.validateStatus('Authorization', 'Overdue')
        bookingPage.validateStatus('Security Deposit', 'Overdue')
        //Validate trx Amount
        bookingPage.valiateTrxAmount('Authorization', '150')
        bookingPage.valiateTrxAmount('Security Deposit', '60')
        //Validate tooltip message
        bookingPage.validateRCTooltipMsg('Reservation auto payment collection is not enabled for '+bSource)
    })

})
