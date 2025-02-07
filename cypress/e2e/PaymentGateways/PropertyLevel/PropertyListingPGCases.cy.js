/// <reference types ="cypress" />

import { LoginPage } from "../../../../pageObjects/LoginPage"
import { ReuseableCode } from "../../../support/ReuseableCode"
import { PaymentGateway } from "../../../../pageObjects/PaymentGateway"
import { PropertiesPage } from "../../../../pageObjects/PropertiesPage"

const loginPage = new LoginPage
const reuseableCode = new ReuseableCode
const paymentGateway = new PaymentGateway
const propertiesPage = new PropertiesPage

describe('Payment Gateways settings on Property listing page', () => {
    const loginEmail = Cypress.config('users').user3.username
    const loginPassword = Cypress.config('users').user3.password
    const propName = 'New Property 3'

    beforeEach(() => {
        loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_PGP_23 - Client can apply the custom PG (Stripe) settings at property level on listing page', () => {
        propertiesPage.goToProperties()
        //Expand Property
        propertiesPage.expandProperty(propName)
        //Enable Custom PG option at property
        propertiesPage.enablePGPerPropertySettingsOnListing()
        //Select Payment Gateway
        propertiesPage.clickEditOnPGListing()
        paymentGateway.selectPaymentGateway('Stripe')
        propertiesPage.connectToStripe()
    })
    it('CA_PGP_24 - Client can apply the custom PG (Authorize.Net) settings at property level on listing page', () => {
        propertiesPage.goToProperties()
        //Expand Property
        propertiesPage.expandProperty(propName)
        //Enable Custom PG option at property
        propertiesPage.enablePGPerPropertySettingsOnListing()
        //Select Payment Gateway
        propertiesPage.clickEditOnPGListing()
        paymentGateway.selectPaymentGateway('Authorize.Net')
        //Add PG creds
        const apiLoginID = '6sBv2PL2P'
        const transactionKey = '5T3edKsu935B5BYL'
        const signatureKey = '915764E28A82589EBEC542B69AF87F3D526EADEB903641324602A3676933CD8055D7CC095ADCB15FE1864C4918B11780C89E674C1C9B777A8AA0279563B0ACFE'
        const cvvStatus = 1
        const zipCodeStatus = 1
        const billingAddStatus = 1
        paymentGateway.connectToAuthorizeNet(apiLoginID, transactionKey, signatureKey, cvvStatus, zipCodeStatus, billingAddStatus)
        propertiesPage.clickSaveOnPGListing()
        paymentGateway.validateToast('Payment Gateway Updated Successfully')
    })
    it('CA_PGP_25 - Client can apply the Global PG settings at property level on listing page', () => {
        propertiesPage.goToProperties()
        //Expand Property
        propertiesPage.expandProperty(propName)
        //Enable Global PG option at property
        propertiesPage.enablePGGlobalSettingsOnListing()
    })
})