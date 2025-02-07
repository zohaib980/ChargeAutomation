/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage.js"
import { ReuseableCode } from "../../../support/ReuseableCode.js"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway.js"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('NMI Payment Gateway cases at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    let bSource = 'Direct'
    let propertyName = 'New Property'
    let adults = reuseableCode.getRandomNumber(1, 7)
    let child = reuseableCode.getRandomNumber(0, 7)

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    xit('CA_PGG_16 - Connect to NMI PG on Global level', () => { //PCI PG
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('NMI')
        //Add PG creds
        const username = 'success@chargeautomation.com'
        const password = '@bcd@bcd'
        const billingAddStatus = 1
        const threeDS = 1
        paymentGateway.connectToNMI(username, password, billingAddStatus, threeDS)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
})