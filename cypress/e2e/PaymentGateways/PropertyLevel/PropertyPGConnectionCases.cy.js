/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage"
import { ReuseableCode } from "../../../support/ReuseableCode"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"
import { PropertiesPage } from "../../../../pageObjects/PropertiesPage"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const propertiesPage = new PropertiesPage

describe('Connect Payment Gateways at Property level', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password
    const propName = 'New Property 3'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    xit('CA_PGP_11 - Connect to Cybersource PG on Property level', () => { //CONNECTION ERROR
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Cybersource')
        //Add PG creds
        const merchantID = 'testrest'
        const profileID = '93B32398-AD51-4CC2-A682-EA3E93614EB1'
        const apiKeyID = '08c94330-f618-42a3-b09d-e1e43be5efda'
        const sharedSecretKey = 'yBJxy6LjM2TmcPGu+GaJrHtkke25fPpUX+UY6/L/1tE='
        const threeDS = 1 //enable
        paymentGateway.connectToCybersource(merchantID, profileID, apiKeyID, sharedSecretKey, threeDS)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    it('CA_PGP_12 - Connect to Redsys PG on Property level', () => {
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Redsys')
        //Add PG creds
        const merchantCode = '999008881'
        const merchantKey = 'sq7HjrUOBfKmC576ILgskD5srU870gJ7'
        const terminalNumber = '001'
        paymentGateway.connectToRedsys(merchantCode, merchantKey, terminalNumber)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    it('CA_PGP_13 - Connect to PayFast PG on Property level', () => {
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('PayFast')
        //Add PG creds
        const merchantID = '10035503'
        const merchantKey = 'f0ijaep7xcbx7'
        const salthPassphrase = 'abcabcabc123123'
        paymentGateway.connectToPayfast(merchantID, merchantKey, salthPassphrase)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    it('CA_PGP_14 - Connect to Tilopay PG on Property level', () => {
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Tilopay')
        //Add PG creds
        const apiKey = '6040-2807-3716-8626-3386'
        const apiUser = '3aOwCF'
        const apiPassword = 'i2QA7b'
        paymentGateway.connectToTilopay(apiKey, apiUser, apiPassword)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGP_15 - Connect to WorldPayWPG PG on Property level', () => { //PCI PG
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('WorldPayWPG')
        //Add PG creds
        const merchantCode = '6040-2807-3716-8626-3386'
        const XMLAPIUsername = '3aOwCF'
        const XMLPassword = 'i2QA7b'
        const threeDS = 1
        const billingAddStatus = 1
        paymentGateway.connectWorldPayWPG(merchantCode, XMLAPIUsername, XMLPassword, threeDS, billingAddStatus)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGP_16 - Connect to PayPal Business PG on Property level', () => { //PCI PG
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('PayPal Business')
        //Add PG creds
        const clientID = 'AWi8du_ZDr3TY66eMwBtdDMy8-NtKLU3neKUsi-Xhj7lj_AnEI56F5FCiltaCMswJqMi6zo1t2tLvp7B'
        const clientSecret = 'EFisCPYI--mgZluS1xG4Bly9R-lPcJMdXu2hcsoT5kpUNV2sE_87oObNnBVT14GlgZQlmxZInX2TgNb7'
        paymentGateway.connectPaypalBusiness(clientID, clientSecret)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    it('CA_PGP_17 - Connect to Mercado Pago PG on Property level', () => {
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Mercado Pago')
        //Add PG creds
        const publicKey = 'TEST-51d2f00f-6639-4415-9d70-dcac64fa08eb'
        const accessToken = 'TEST-730287212646084-013102-47cbe01f5b2a6d750a1242b520b1baf1-1296601521'
        const currency = 'USD'
        paymentGateway.connectToMercadoPago(publicKey, accessToken, currency)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGP_18 - Connect to Moneris PG on Property level', () => { //PCI PG
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Moneris')
        //Add PG creds
        const storeID = 'monca08311'
        const apiToken = 'ErEsI9K9aY1y5iuy3UZh'
        const country = 'CA'
        const threeDS = 1
        paymentGateway.connectToMoneris(storeID, apiToken, country, threeDS)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGP_19 - Connect to Rapyd Card Payments PG on Property level', () => { //PCI PG
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Rapyd Card Payments')
        //Add PG creds
        const accessKey = 'rak_EA494AA6CE11003F88CA'
        const secretKey = 'rsk_e285655b7e370108986357999a4a5e23174f31307835386bb6771bc091feeeec187f3c8cbba8038c'
        paymentGateway.connectToRapydCardPayments(accessKey, secretKey)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGP_20 - Connect to eWAY PG on Property level', () => { //PCI PG
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('eWAY')
        //Add PG creds
        const apiKey = '60CF3CqPP1MgCdYKz1L25R3Q6WqYTd62gQ+x2Sl4xh/4bvCI9owaSSwEiM6vS2ko7hfXmz'
        const password = 'H6KMbodo'
        paymentGateway.connectToeWAY(apiKey, password)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGP_21 - Connect to NMI PG on Property level', () => { //PCI PG
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('NMI')
        //Add PG creds
        const username = 'success@chargeautomation.com'
        const password = '@bcd@bcd'
        const billingAddStatus = 1
        const threeDS = 1
        paymentGateway.connectToNMI(username, password, billingAddStatus, threeDS)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    xit('CA_PGP_22 - Connect to Total Processing PG on Property level', () => { //PCI PG
        propertiesPage.goToProperties()
        //Edit Property
        propertiesPage.editProperty(propName)
        //Enable PG option at property
        propertiesPage.enablePGSettingOnProperty()
        //Select Payment Gateway
        paymentGateway.selectPaymentGateway('Total processing')
        //Add PG creds
        const entityID = '8ac7a4ca9295d06c01929613c8f1003b'
        const accessToken = 'OGFjN2E0Y2E5Mjk1ZDA2YzAxOTI5NjEzYzc3ZTAwMzl8TTM0dT14RXBlUmdnOmJNaSNGNEc='
        const threeDS = 1
        paymentGateway.connectToTotalProcessing(entityID, accessToken, threeDS)
        propertiesPage.clickSave()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
})