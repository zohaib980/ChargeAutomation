/// <reference types ="cypress" />


import { LoginPage } from "../../../../pageObjects/LoginPage"
import { ReuseableCode } from "../../../support/ReuseableCode"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway

describe('Validate Payment Gateways list and form validations on each PG at Global level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_PGG_01 - Verify that users can select any of the listed payment gateway at global level', () => {

        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info

        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Stripe')
        paymentGateway.selectPaymentGateway('Authorize.Net')
        paymentGateway.selectPaymentGateway('Redsys')
        paymentGateway.selectPaymentGateway('Elavon')
        cy.reload()
        paymentGateway.selectPaymentGateway('FirstData')
        paymentGateway.selectPaymentGateway('ElavonConvergePay')
        paymentGateway.selectPaymentGateway('Adyen')
        paymentGateway.selectPaymentGateway('Shift4')
        cy.reload()
        paymentGateway.selectPaymentGateway('BAC Credomatic')
        paymentGateway.selectPaymentGateway('Borgun')
        paymentGateway.selectPaymentGateway('BorgunBGateway')
        paymentGateway.selectPaymentGateway('CardNet')
        cy.reload()
        paymentGateway.selectPaymentGateway('CardStream')
        paymentGateway.selectPaymentGateway('Cybersource')
        paymentGateway.selectPaymentGateway('eWAY')
        paymentGateway.selectPaymentGateway('Heartland')
        cy.reload()
        paymentGateway.selectPaymentGateway('Mercado Pago')
        paymentGateway.selectPaymentGateway('Moneris')
        //paymentGateway.selectPaymentGateway('NMI')
        paymentGateway.selectPaymentGateway('NomuPay')
        paymentGateway.selectPaymentGateway('Nuvei')
        cy.reload()
        paymentGateway.selectPaymentGateway('PayFast')
        paymentGateway.selectPaymentGateway('PayGate')
        paymentGateway.selectPaymentGateway('PayPal Business')
        paymentGateway.selectPaymentGateway('PayPalPaymentsPro')
        cy.reload()
        paymentGateway.selectPaymentGateway('PayZen')
        paymentGateway.selectPaymentGateway('PeleCard')
        paymentGateway.selectPaymentGateway('PesoPay')
        paymentGateway.selectPaymentGateway('Rapyd (Korta')
        cy.reload()
        paymentGateway.selectPaymentGateway('Rapyd Card Payments')
        paymentGateway.selectPaymentGateway('Tilopay')
        paymentGateway.selectPaymentGateway('Windcave')
        paymentGateway.selectPaymentGateway('WorldLine (IngenicoDirect')
        cy.reload()
        paymentGateway.selectPaymentGateway('WorldPay')
        paymentGateway.selectPaymentGateway('WorldPayOnline')
        paymentGateway.selectPaymentGateway('WorldPayVantiv')
        paymentGateway.selectPaymentGateway('WorldPayWPG')
    })
    it('CA_PGG_02 - Verify the error validations on all payment gateways settings at global level', () => {
        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Stripe')
        paymentGateway.connectToStripe()

        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Stripe')
        cy.get('.stripeblock').should('be.visible').then(ele => {
            const buttonText = ele.text().trim()
            if (buttonText.includes('Connected To Stripe')) {
                cy.log('Stripe is already connected!')
            } else if (buttonText.includes('Connect To Stripe')) {
                paymentGateway.clickContinue()
                paymentGateway.validateErrorsOnPaymentGateway('Stripe')
            }
        })
        
        paymentGateway.selectPaymentGateway('Authorize.Net')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Authorize.Net')

        paymentGateway.selectPaymentGateway('Redsys')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Redsys')

        paymentGateway.selectPaymentGateway('Elavon')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Elavon')

        cy.reload()
        paymentGateway.selectPaymentGateway('FirstData')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('FirstData')

        paymentGateway.selectPaymentGateway('ElavonConvergePay')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('ElavonConvergePay')

        paymentGateway.selectPaymentGateway('Adyen')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Adyen')

        paymentGateway.selectPaymentGateway('Shift4')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Shift4')

        paymentGateway.selectPaymentGateway('BAC Credomatic')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('BAC Credomatic')

        cy.reload()
        paymentGateway.selectPaymentGateway('Borgun')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Borgun')

        paymentGateway.selectPaymentGateway('BorgunBGateway')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('BorgunBGateway')

        paymentGateway.selectPaymentGateway('CardNet')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('CardNet')

        paymentGateway.selectPaymentGateway('CardStream')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('CardStream')

        paymentGateway.selectPaymentGateway('Cybersource')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Cybersource')

        paymentGateway.selectPaymentGateway('eWAY')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('eWAY')

        paymentGateway.selectPaymentGateway('Heartland')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Heartland')

        cy.reload()
        paymentGateway.selectPaymentGateway('Mercado Pago')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Mercado Pago')

        paymentGateway.selectPaymentGateway('Moneris')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Moneris')
        
        paymentGateway.selectPaymentGateway('NMI')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('NMI')
       
        paymentGateway.selectPaymentGateway('NomuPay')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('NomuPay')

        paymentGateway.selectPaymentGateway('Nuvei')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Nuvei')

        cy.reload()
        paymentGateway.selectPaymentGateway('PayFast')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('PayFast')

        paymentGateway.selectPaymentGateway('PayGate')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('PayGate')

        paymentGateway.selectPaymentGateway('PayPal Business')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('PayPal Business')

        paymentGateway.selectPaymentGateway('PayPalPaymentsPro')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('PayPalPaymentsPro')

        cy.reload()
        paymentGateway.selectPaymentGateway('PayZen')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('PayZen')

        paymentGateway.selectPaymentGateway('PeleCard')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('PeleCard')

        cy.reload()
        paymentGateway.selectPaymentGateway('PesoPay')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('PesoPay')

        paymentGateway.selectPaymentGateway('Rapyd (Korta')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Rapyd (Korta')

        cy.reload()
        paymentGateway.selectPaymentGateway('Rapyd Card Payments')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Rapyd Card Payments')

        paymentGateway.selectPaymentGateway('Tilopay')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Tilopay')

        paymentGateway.selectPaymentGateway('Windcave')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('Windcave')

        paymentGateway.selectPaymentGateway('WorldLine (IngenicoDirect')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('WorldLine (IngenicoDirect')

        cy.reload()
        paymentGateway.selectPaymentGateway('WorldPay')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('WorldPay')

        paymentGateway.selectPaymentGateway('WorldPayOnline')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('WorldPayOnline')

        paymentGateway.selectPaymentGateway('WorldPayVantiv')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('WorldPayVantiv')

        paymentGateway.selectPaymentGateway('WorldPayWPG')
        paymentGateway.clickContinue()
        paymentGateway.validateErrorsOnPaymentGateway('WorldPayWPG')
    })
    it('CA_PGG_03 - Verify that users can skip payment gateway setup at global level', () => {

        //Go to PG Selection Page
        paymentGateway.gotoGlobalPGSelection()
        paymentGateway.validatePGInfo() // Account-setup-pms info
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Authorize.Net')
        paymentGateway.clickSkip()
        cy.url().should('include', '/pms-connect')
        cy.get('[href="/client/v2/pms-connect"].active').should('be.visible') //User will be on PMS Connection tab
    })
})