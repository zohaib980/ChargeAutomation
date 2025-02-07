/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage.js"
import { ReuseableCode } from "../../../support/ReuseableCode.js"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"
import { BookingPage } from "../../../../pageObjects/BookingPage.js"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const bookingPage = new BookingPage

describe('Connect Payment Gateways at global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })

    it('CA_PGG_22 - Connect to Tilopay PG on Global level', () => {
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Tilopay')
        //Add PG creds
        const apiKey = '6040-2807-3716-8626-3386'
        const apiUser = '3aOwCF'
        const apiPassword = 'i2QA7b'
        paymentGateway.connectToTilopay(apiKey, apiUser, apiPassword)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    it('CA_PGG_23 - Connect to Mercado Pago PG on Global level', () => {
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Mercado Pago')
        //Add PG creds
        const publicKey = 'TEST-51d2f00f-6639-4415-9d70-dcac64fa08eb'
        const accessToken = 'TEST-730287212646084-013102-47cbe01f5b2a6d750a1242b520b1baf1-1296601521'
        const currency = 'USD'
        paymentGateway.connectToMercadoPago(publicKey, accessToken, currency)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGG_24 - Connect to eWAY PG on Global level', () => {  //PCI PG
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('eWAY')
        //Add PG creds
        const apiKey = '60CF3CqPP1MgCdYKz1L25R3Q6WqYTd62gQ+x2Sl4xh/4bvCI9owaSSwEiM6vS2ko7hfXmz'
        const password = 'H6KMbodo'
        paymentGateway.connectToeWAY(apiKey, password)
        paymentGateway.clickContinue()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGG_25 - Connect to NMI PG on Global level', () => { //PCI PG 
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