/// <reference types = "cypress"/>

import { AutoPayments } from "../../../pageObjects/AutoPayments.js"
import { LoginPage } from "../../../pageObjects/LoginPage.js"
import { BookingPage } from "../../../pageObjects/BookingPage.js"
import { ReuseableCode } from "../../support/ReuseableCode.js"

const loginPage = new LoginPage
const autoPayments = new AutoPayments
const bookingPage = new BookingPage
const reuseableCode = new ReuseableCode

describe('Additional Charges on Booking Listing Test Cases Using Scheduled Charge', () => {

    const loginEmail = Cypress.config('users').user2.username
    const loginPassword = Cypress.config('users').user2.password

    let bSource = 'Direct'
    let propertyName = 'QA Test Property'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_CACH_12 > On booking listing, Create an AC using “Scheduled Charge” and process it by clicking Charge Now and on non-3DS card', () => {
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
        bookingPage.addDescriptionOnAC('Scheduled Charge Using Non-3DS Card')

        //Select Scheduled time
        bookingPage.selectScheduledTime(1, 23, 59) //dayAfterToday, hour, min
        //Click Scheduled Charge
        bookingPage.clickScheduleChargeOnAc()
        //Validate the toast
        cy.formatedCurrentDate(1, 1).then(formattedDate => { //type, daysToAdd
            cy.verifyToast(`Payment Link will be sent  on ${formattedDate} 11:59pm`)
        })

        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 will be sent to the guest on ')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Scheduled')
        //Add CC on booking
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        //Process AC using ChargeNow
        bookingPage.clickChargeNow('Additional Charges')
        cy.verifyToast('Payment successfully charged')

        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00 on card ending with **4242')
        bookingPage.validateACTrxStatus('Paid')

    })
    it('CA_CACH_13 > On booking listing, Create an AC using “Scheduled Charge” and process it by clicking Charge Now and on 3DS card', () => {
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
        bookingPage.addDescriptionOnAC('Scheduled Charge Using 3DS Card')
        //Select Scheduled time
        bookingPage.selectScheduledTime(1, 23, 59) //dayAfterToday, hour, min
        //Click Scheduled Charge
        bookingPage.clickScheduleChargeOnAc()
        //Validate the toast
        cy.formatedCurrentDate(1, 1).then(formattedDate => { //type, daysToAdd
            cy.verifyToast(`Payment Link will be sent  on ${formattedDate} 11:59pm`)
        })

        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 will be sent to the guest on ')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Scheduled')
        //Add CC on booking
        bookingPage.addCCOnNewBooking('4000000000003220')
        cy.verifyToast('Card added successfully')
        cy.verifyToast('This card is protected with 3DS authentication, please authenticate your transaction')
        //Process AC using ChargeNow
        bookingPage.clickChargeNow('Additional Charges')
        cy.verifyToast('Guest needs to authenticate')
        bookingPage.validateACTrxStatus('Awaiting Approval')
        bookingPage.validateBookingLog('Additional Charges', 'Authentication email sent to the cardholder for the payment of CA$16.00 on card ending with **3220')
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
    it('CA_CACH_14 > On booking listing, Client should be able to increase the amount of the Scheduled Additional Charge', () => {
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
        bookingPage.addDescriptionOnAC('Increase the amount of the Scheduled Additional Charge')
        //Select Scheduled time
        bookingPage.selectScheduledTime(1, 23, 59) //dayAfterToday, hour, min
        //Click Scheduled Charge
        bookingPage.clickScheduleChargeOnAc()

        cy.formatedCurrentDate(1, 1).then(formattedDate => {  //type, daysToAdd
            cy.verifyToast(`Payment Link will be sent  on ${formattedDate} 11:59pm`)
        })

        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 will be sent to the guest on ')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Scheduled')
        //Update scheduled on AC
        bookingPage.updateACAmount('23') //UpdatedAmount
        cy.get('@oldAmount').then(oldAmount => {
            bookingPage.validateBookingLog('Additional Charges', `Amount set to CA$23.00  previous amount was  ${oldAmount}`)
        })

        //Add CC on booking
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        //Process AC using ChargeNow
        bookingPage.clickChargeNow('Additional Charges')
        cy.verifyToast('Payment successfully charged')

        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$23.00 on card ending with **4242')
        bookingPage.validateACTrxStatus('Paid')

    })
    it('CA_CACH_15 > On booking listing, On booking listing, Client should be able to udpdate the date of a scheduled additional charge to max of checkin + 3 days', () => {
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
        bookingPage.addDescriptionOnAC('Update the Scheduled date of Additional Charge')
        //Select Scheduled time
        bookingPage.selectScheduledTime(1, 23, 59) //dayAfterToday, hour, min
        //Click Scheduled Charge
        bookingPage.clickScheduleChargeOnAc()

        cy.formatedCurrentDate(1, 1).then(formattedDate => {  //type, daysToAdd
            cy.verifyToast(`Payment Link will be sent  on ${formattedDate} 11:59pm`)
        })

        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 will be sent to the guest on ')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Scheduled')
        //Update scheduled on AC
        bookingPage.updateScheduledDate('Additional Charges', 3) //Number of days after checkinDate
        cy.formatedCurrentDate(2, 1).then(oldDate => { //type, daysToAdd
            cy.formatedCurrentDate(2, 3).then(updatedDate => { //type, daysToAdd
                bookingPage.validateBookingLog('Additional Charges', `Due Date updated from ${oldDate} to ${updatedDate}`)
            })
        })
        //Add CC on booking
        bookingPage.addCCOnNewBooking('4242424242424242')
        cy.verifyToast('Card added successfully')
        //Process AC using ChargeNow
        bookingPage.clickChargeNow('Additional Charges')
        cy.verifyToast('Payment successfully charged')

        bookingPage.validateBookingLog('Additional Charges', 'Payment of CA$16.00 on card ending with **4242')
        bookingPage.validateACTrxStatus('Paid')

    })
    it('CA_CACH_16 > On booking listing, When scheduled date of an Additional scheduled charge (having no CC on booking) triggered it should updated to overdue', () => {
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
        bookingPage.addDescriptionOnAC('Additional scheduled charge Overdue')
        //Select Scheduled time
        cy.getCurrentHour().then(hour => {
            cy.getCurrentMinute().then(min => {
                //Select Scheduled time
                const updatedMin = min + 1
                bookingPage.selectScheduledTime(0, hour, updatedMin) //daysafterToday, hour, min
                //Click Scheduled Charge
                bookingPage.clickScheduleChargeOnAc()
                cy.formatedCurrentDate(1).then(formattedDate => {
                    cy.formatTime(hour, min + 1).then(formattedTime => {
                        cy.verifyToast(`Payment Link will be sent  on ${formattedDate} ${formattedTime}`)
                    })
                })
            })
        })

        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 will be sent to the guest on ')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Scheduled')
        cy.wait(60000) //1 min
        cy.reload()
        bookingPage.expandBooking(0) //expand first booking
        bookingPage.validateACTrxStatus('Overdue') //should be overdue as no card on booking
    })
    it('CA_CACH_17 > On booking listing, All types of Additional charges (Paid, Scheduled, Pending) should be added in payment summary', () => {
        let adults = reuseableCode.getRandomNumber(1, 7)
        let child = reuseableCode.getRandomNumber(0, 7)
        bookingPage.goToBookingPage()
        bookingPage.addBookingInFutureDate(propertyName, bSource, adults, child, '2')
        bookingPage.validateReservationChgStatus('Scheduled')
        bookingPage.expandBooking(0) //expand first booking

        //Create an Additional Charge (Scheduled)
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('16')
        bookingPage.addDescriptionOnAC('Additional Charge (Scheduled)')
        //Select Scheduled time
        bookingPage.selectScheduledTime(1, 23, 59)  //daysafterToday, hour, min
        //Click Scheduled Charge
        bookingPage.clickScheduleChargeOnAc()
        cy.formatedCurrentDate(1, 1).then(formattedDate => { //type, daysToAdd
            cy.verifyToast(`Payment Link will be sent  on ${formattedDate} 11:59pm`)
        })
        bookingPage.validateBookingLog('Additional Charges', 'Charge request of CA$16 will be sent to the guest on ')
        //Validate AC transaction status
        bookingPage.validateACTrxStatus('Scheduled')

        //Create an Additional Charge (Pending)
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('17')
        bookingPage.addDescriptionOnAC('Additional Charge (Pending)')
        //Click Send payment link
        bookingPage.clickSendPaymentLinkOnAC()
        cy.verifyToast('Payment Link Sent Successfully')
        cy.get('.activelog-desc').should('contain.text', 'Charge request of CA$17 sent to the guest')
        //Validate AC transaction status
        cy.get('.grid-item-title').contains('CA$17').parents('.grid-item-content').find('.badge').should('contain.text', 'Pending')

        //Create an Additional Charge (Paid)
        bookingPage.openAdditionalChargeModal()
        //Add Amount and Description
        bookingPage.addAmountOnAC('18')
        bookingPage.addDescriptionOnAC('Additional Charge (Paid)')
        //Click Charge Now
        bookingPage.clickChargeNowOnACModal()
        bookingPage.addCConAdditionalCharge('4242424242424242')
        cy.verifyToast('Payment Successfully Charged')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        //Validate booking log
        cy.get('.activelog-desc').should('contain.text', 'Payment of CA$18.00 on card ending with **4242')
        //Validate AC transaction status
        cy.get('.grid-item-title').contains('CA$18').parents('.grid-item-content').find('.badge').should('contain.text', 'Paid')

        //Validate the Payment summary
        cy.get('.payment-table .card-inset-table:nth-child(2) tr').eq(0).should('be.visible').and('contain.text', 'CA$51.00')
        cy.get('.payment-table .card-inset-table:nth-child(2) tr').eq(1).should('be.visible').and('contain.text', 'Additional Charge (Pending)').and('contain.text', 'CA$17.00')
        cy.get('.payment-table .card-inset-table:nth-child(2) tr').eq(2).should('be.visible').and('contain.text', 'Additional Charge (Paid)').and('contain.text', 'CA$18.00')
        cy.get('.payment-table .card-inset-table:nth-child(2) tr').eq(3).should('be.visible').and('contain.text', 'Additional Charge (Scheduled)').and('contain.text', 'CA$16.00')

    })
})