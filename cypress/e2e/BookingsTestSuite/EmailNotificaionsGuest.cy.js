/// <reference types = "cypress"/>

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { TemplateMessages } from "../../../pageObjects/TemplateMessages"
import { AutoPayments } from "../../../pageObjects/AutoPayments"
import { ReuseableCode } from "../../support/ReuseableCode"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const templateMessages = new TemplateMessages
const autoPayments = new AutoPayments
const reuseableCode = new ReuseableCode
const bookingDetailPage = new BookingDetailPage

describe('Guest Email Notifications', function () {

    const loginEmail = Cypress.config('users').user1.username
    const loginPassword = Cypress.config('users').user1.password

    let bSource = 'Direct'
    let propertyName = 'QA Test Property'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    })

    it('CA_EMG_01-02 - If either Payment method or Security deposit email is scheduled to be sent at the same time as Complete your pre checkin email, we will not send both right away We will first send either the payment method or security deposit email', function () {
        onlineCheckinSettings.goToOnlineCheckinSettings()
        //Apply "Notify Guest To Complete Pre-Arrival" settings
        onlineCheckinSettings.applyNotifyGuestToCompletePrecheckin('immediately', 'After Booking')

        //Go to Template messages
        templateMessages.goToTemplateMessages()
        //Apply email settings on Templates
        templateMessages.applyEmailSettingsOnTemplate('Security Deposit Required', 'immediately', 'After booking') // 1 days before checkin
        templateMessages.goToTemplateMessages()
        templateMessages.applyEmailSettingsOnTemplate('Payment Method Required', 'immediately', 'After booking')  // 1 days before checkin
        //Apply autopayment rule
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
        let reservation_chargeOption = '1' //when to charge: after booking 1, Before check-in 2
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '0' //When to authorize? Immediately before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Create a booking
        bookingPage.goToBookingPage()
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '1') //checkin after 1 days
        //Go to booking details
        bookingDetailPage.goToBookingDetailPage(propertyName)
        //Validate triggered Messages
        bookingDetailPage.validateTriggeredMessages('[Action Required] Payment Information Required', 'Guest')
        bookingDetailPage.validateTriggeredMessages('Payment Info Requested', 'Host')
        //Validate untriggered Messages
        bookingDetailPage.validateUntriggeredMessages('[Action Required] Complete Your Pre Check-In')

        console.log('CA_EMG_02 - We will first send either the payment method or security deposit email and then after 2 hours if pre checkin is not completed, we will send reminder email to Complete your pre checkin email.')
        //getBooking ID from URL
        bookingDetailPage.getBookingIDfromURL().then(bookingID => {

            cy.task("queryDb", "SELECT * FROM reminder_jobs WHERE parameters like '[" + bookingID + "%' and job like '%PreCheckinReminderJob';", { timeout: 30000 }).then((response) => {
                cy.log(response)
                response.forEach((item) => {
                    cy.log(`ID: ${item.id}`)
                    cy.log(`Created At: ${item.created_at}`)
                    cy.log(`Dispatch On: ${item.dispatch_on}`)

                    // Get the current time in seconds since the Unix epoch
                    const now = Math.floor(Date.now() / 1000);
                    cy.log(`Current Time: ${now}`);
                    // Calculate the expected time (2 hours later in seconds)
                    const twoHoursLater = now + 2 * 60 * 60 // 2 hours in seconds
                    cy.log(`Expected Time (2 hours later): ${twoHoursLater}`)

                    // Validate that dispatch_on (email will be triggered) is approximately 2 hours later 
                    const diff = item.dispatch_on - twoHoursLater
                    cy.log(`Difference: ${diff} seconds`)
                    const tolerance = 600           //tolerance of ±10 minutes (600 seconds)
                    expect(Math.abs(diff)).to.be.lessThan(tolerance)

                    //Validate Job name
                    cy.log(`Job: ${item.job}`)
                    expect(item.job).to.equal("App\\Jobs\\General\\Reminders\\PreCheckin\\PreCheckinReminderJob")

                    cy.log(`On Queue: ${item.on_queue}`)
                    expect(item.on_queue).to.equal("triggered_reminders")

                    cy.log(`Parameters: ${item.parameters}`)
                    cy.log(`Status: ${item.status}`)
                    expect(item.status).to.be.equal(1)

                    cy.log(`Updated At: ${item.updated_at}`)
                })
            })

        })

    })
    it('CA_EMG_03 - Ensure if Payment method or SD email are not scheduled to go out with Pre checkin email, then they are sent out accordingly and not affected by this change', function () {
        onlineCheckinSettings.goToOnlineCheckinSettings()
        //Apply "Notify Guest To Complete Pre-Arrival" settings
        onlineCheckinSettings.applyNotifyGuestToCompletePrecheckin('immediately', 'After Booking')

        //Go to Template messages
        templateMessages.goToTemplateMessages()
        //Apply email settings on Templates
        templateMessages.applyEmailSettingsOnTemplate('Security Deposit Required', '1', 'Before payment due') // 1 days before checkin
        templateMessages.goToTemplateMessages()
        templateMessages.applyEmailSettingsOnTemplate('Payment Method Required', '1', 'Before payment due')  // 1 days before checkin
        //Apply autopayment rule
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
        let reservation_chargeOption = '2' //when to charge: after booking 1, Before check-in 2
        autoPayments.enableReservationPayment(bSource, amountTypePayment, amountTypePaymentSelect, reservation_authTime, reservation_chargeOption)
        autoPayments.clickEditBS(bSource) //Edit BS
        //Enable Security Deposit
        let sd_amountType = '1' //How much to authorize? Fixed amount
        let sd_Amount = '200'  //SD amount to charge
        let sd_authTime = '0' //When to authorize? Immediately before checkin
        autoPayments.enableSecurityDeposit(bSource, sd_amountType, sd_Amount, sd_authTime)
        //Create a booking
        bookingPage.goToBookingPage()
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '4') //checkin after 4 days
        //Go to booking details
        bookingDetailPage.goToBookingDetailPage(propertyName)
        //Validate triggered Messages
        bookingDetailPage.validateTriggeredMessages('[Action Required] Complete Your Pre Check-In', 'Guest')
        //Validate untriggered Messages
        bookingDetailPage.validateUntriggeredMessages('[Action Required] Payment Information Required')
        bookingDetailPage.validateUntriggeredMessages('Payment Info Requested')

    })

})