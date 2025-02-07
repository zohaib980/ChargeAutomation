/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage"
import { ReuseableCode } from "../../../support/ReuseableCode"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"
import { PropertiesPage } from "../../../../pageObjects/PropertiesPage"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const propertiesPage = new PropertiesPage

describe('Validate Payment Gateways list and form validations on each PG at property level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password
    const propName = 'New Property 3'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })

    it('CA_PGP_01 - Verify that users can select any of the listed payment gateway at property level', () => {

        //Go to properties
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Stripe')
        paymentGateway.selectPaymentGateway('Authorize.Net')
        paymentGateway.selectPaymentGateway('Redsys')
        paymentGateway.selectPaymentGateway('Elavon')
        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('FirstData')
        paymentGateway.selectPaymentGateway('ElavonConvergePay')
        paymentGateway.selectPaymentGateway('Adyen')
        paymentGateway.selectPaymentGateway('Shift4')
        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('BAC Credomatic')
        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('Borgun')
        paymentGateway.selectPaymentGateway('BorgunBGateway')
        paymentGateway.selectPaymentGateway('CardNet')
        paymentGateway.selectPaymentGateway('CardStream')
        paymentGateway.selectPaymentGateway('Cybersource')
        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('eWAY')
        paymentGateway.selectPaymentGateway('Heartland')
        paymentGateway.selectPaymentGateway('Mercado Pago')
        paymentGateway.selectPaymentGateway('Moneris')
        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('NMI')
        paymentGateway.selectPaymentGateway('NomuPay')
        paymentGateway.selectPaymentGateway('Nuvei')
        paymentGateway.selectPaymentGateway('PayFast')
        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('PayGate')
        paymentGateway.selectPaymentGateway('PayPal Business')
        paymentGateway.selectPaymentGateway('PayPalPaymentsPro')
        paymentGateway.selectPaymentGateway('PayZen')
        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('PeleCard')
        paymentGateway.selectPaymentGateway('PesoPay')
        paymentGateway.selectPaymentGateway('Rapyd (Korta')
        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('Rapyd Card Payments')
        paymentGateway.selectPaymentGateway('Tilopay')
        paymentGateway.selectPaymentGateway('Windcave')
        paymentGateway.selectPaymentGateway('WorldLine (IngenicoDirect')
        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('WorldPay')
        paymentGateway.selectPaymentGateway('WorldPayOnline')
        paymentGateway.selectPaymentGateway('WorldPayVantiv')
        paymentGateway.selectPaymentGateway('WorldPayWPG')
    })
    it('CA_PGP_02 - Verify the error validations on all payment gateways settings at property level', () => {
        //Go to properties
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Stripe')
        propertiesPage.connectToStripe()

        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Stripe')
        cy.get('.stripeblock').should('be.visible').then(ele => {
            const buttonText = ele.text().trim()
            if (buttonText.includes('Connected To Stripe')) {
                cy.log('Stripe is already connected!')
            } else if (buttonText.includes('Connect To Stripe')) {
                propertiesPage.clickSave()
                propertiesPage.validateErrorsOnPaymentGateway('Stripe')
            }
        })

        paymentGateway.selectPaymentGateway('Authorize.Net')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Authorize.Net')

        paymentGateway.selectPaymentGateway('Redsys')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Redsys')

        paymentGateway.selectPaymentGateway('Elavon')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Elavon')

        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('FirstData')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('FirstData')

        paymentGateway.selectPaymentGateway('ElavonConvergePay')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('ElavonConvergePay')

        paymentGateway.selectPaymentGateway('Adyen')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Adyen')

        paymentGateway.selectPaymentGateway('Shift4')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Shift4')

        paymentGateway.selectPaymentGateway('BAC Credomatic')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('BAC Credomatic')

        paymentGateway.selectPaymentGateway('Borgun')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Borgun')

        paymentGateway.selectPaymentGateway('BorgunBGateway')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('BorgunBGateway')

        paymentGateway.selectPaymentGateway('CardNet')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('CardNet')

        paymentGateway.selectPaymentGateway('CardStream')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('CardStream')

        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('Cybersource')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Cybersource')

        paymentGateway.selectPaymentGateway('eWAY')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('eWAY')

        paymentGateway.selectPaymentGateway('Heartland')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Heartland')

        paymentGateway.selectPaymentGateway('Mercado Pago')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Mercado Pago')

        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('Moneris')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Moneris')

        paymentGateway.selectPaymentGateway('NMI')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('NMI')

        paymentGateway.selectPaymentGateway('NomuPay')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('NomuPay')

        paymentGateway.selectPaymentGateway('Nuvei')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Nuvei')

        paymentGateway.selectPaymentGateway('PayFast')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('PayFast')

        paymentGateway.selectPaymentGateway('PayGate')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('PayGate')

        paymentGateway.selectPaymentGateway('PayPal Business')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('PayPal Business')

        paymentGateway.selectPaymentGateway('PayPalPaymentsPro')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('PayPalPaymentsPro')

        paymentGateway.selectPaymentGateway('PayZen')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('PayZen')

        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('PeleCard')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('PeleCard')

        paymentGateway.selectPaymentGateway('PesoPay')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('PesoPay')

        paymentGateway.selectPaymentGateway('Rapyd (Korta')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Rapyd (Korta')

        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('Rapyd Card Payments')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Rapyd Card Payments')

        paymentGateway.selectPaymentGateway('Tilopay')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Tilopay')

        paymentGateway.selectPaymentGateway('Windcave')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('Windcave')

        paymentGateway.selectPaymentGateway('WorldLine (IngenicoDirect')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('WorldLine (IngenicoDirect')

        cy.reload()
        propertiesPage.enablePGSettingOnProperty()
        paymentGateway.selectPaymentGateway('WorldPay')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('WorldPay')

        paymentGateway.selectPaymentGateway('WorldPayOnline')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('WorldPayOnline')

        paymentGateway.selectPaymentGateway('WorldPayVantiv')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('WorldPayVantiv')

        paymentGateway.selectPaymentGateway('WorldPayWPG')
        propertiesPage.clickSave()
        propertiesPage.validateErrorsOnPaymentGateway('WorldPayWPG')
    })
    it('CA_PGP_03 - A client can update the payment gateway (PG) settings to the global level for a property at any time', () => {
        //Go to properties
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        cy.get('[id="pms-selector"]').should('be.visible').invoke('text').then(selectedPG => {
            if (!selectedPG.includes('Authorize.Net')) {
                paymentGateway.selectPaymentGateway('Authorize.Net')
                //Add PG creds
                const apiLoginID = '6sBv2PL2P'
                const transactionKey = '5T3edKsu935B5BYL'
                const signatureKey = '915764E28A82589EBEC542B69AF87F3D526EADEB903641324602A3676933CD8055D7CC095ADCB15FE1864C4918B11780C89E674C1C9B777A8AA0279563B0ACFE'
                const cvvStatus = 1
                const zipCodeStatus = 1
                const billingAddStatus = 1
                paymentGateway.connectToAuthorizeNet(apiLoginID, transactionKey, signatureKey, cvvStatus, zipCodeStatus, billingAddStatus)
                propertiesPage.clickSave()
                paymentGateway.validateToast('Payment Gateway Updated Successfully')
            }
        })

        //Go to properties
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        propertiesPage.enableGlobalSettingOnProperty()
    })
})