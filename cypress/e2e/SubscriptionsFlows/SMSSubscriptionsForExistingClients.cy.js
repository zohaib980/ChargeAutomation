/// <reference types = "cypress"/>

import { LoginPage } from "../../../pageObjects/LoginPage"
import { BillingPage } from "../../../pageObjects/BillingPage"

const loginPage = new LoginPage
const billingPage = new BillingPage

describe('SMS Subscription Flows for Existing_Clients', { retries: 0 }, () => {

    const loginEmail = Cypress.config('users').user2.username
    const loginPassword = Cypress.config('users').user2.password

    beforeEach(() => {
        cy.visit('/')
        loginPage.happyLogin(loginEmail, loginPassword)
    })

    it('CA_SSUB_01 - Apply and validate 100 Messages $9 SMS Plan on existing client using non-3DS card', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select Valid Credit card
        billingPage.selectdefaultPaymentMethod('4242424242424242')
        //Current AdOns Subscription
        billingPage.getCurrentAddOn().then(currentAddOn => {
            cy.wrap(currentAddOn).as('currentAddOn')
        })
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        //SMS plan Subscription 
        let desiredPlan = '$9'
        cy.get('@currentAddOn').then(currentPlan => {
            billingPage.smsPlanSubscription(currentPlan, desiredPlan, 'SMS plan subscribed successfully')
        })
        //Validate Subscribed SMS Plan
        billingPage.ValidateSubscribedSMSPlan(desiredPlan)

        billingPage.gotoBillingDetail()
        //Validate Current sms plan on billing
        billingPage.getCurrentAddOn().then(currentAddOn => {
            expect(currentAddOn).to.include(desiredPlan)
        })
    })
    it('CA_sSUB_02 - Apply and validate 500 Messages $29 SMS Plan on existing client using non-3DS card', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select Valid Credit card
        billingPage.selectdefaultPaymentMethod('4242424242424242')
        //Current AdOns Subscription
        billingPage.getCurrentAddOn().then(currentAddOn => {
            cy.wrap(currentAddOn).as('currentAddOn')
        })
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        //SMS plan Subscription 
        let desiredPlan = '$29'
        cy.get('@currentAddOn').then(currentPlan => {
            billingPage.smsPlanSubscription(currentPlan, desiredPlan, 'SMS plan subscribed successfully')
        })
        //Validate Subscribed SMS Plan
        billingPage.ValidateSubscribedSMSPlan(desiredPlan)

        billingPage.gotoBillingDetail()
        //Validate Current sms plan on billing
        billingPage.getCurrentAddOn().then(currentAddOn => {
            expect(currentAddOn).to.include(desiredPlan)
        })
    })
    it('CA_SSUB_03 - Apply and validate 2000 Messages $99 SMS Plan on existing client using non-3DS card', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select Valid Credit card
        billingPage.selectdefaultPaymentMethod('4242424242424242')
        //Current AdOns Subscription
        billingPage.getCurrentAddOn().then(currentAddOn => {
            cy.wrap(currentAddOn).as('currentAddOn')
        })
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        //SMS plan Subscription 
        let desiredPlan = '$99'
        cy.get('@currentAddOn').then(currentPlan => {
            billingPage.smsPlanSubscription(currentPlan, desiredPlan, 'SMS plan subscribed successfully')
        })
        //Validate Subscribed SMS Plan
        billingPage.ValidateSubscribedSMSPlan(desiredPlan)

        billingPage.gotoBillingDetail()
        //Validate Current sms plan on billing
        billingPage.getCurrentAddOn().then(currentAddOn => {
            expect(currentAddOn).to.include(desiredPlan)
        })
    })
    it('CA_SSUB_04 - Apply and validate 6000 Messages $199 SMS Plan on existing client using non-3DS card', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select Valid Credit card
        billingPage.selectdefaultPaymentMethod('4242424242424242')
        //Current AdOns Subscription
        billingPage.getCurrentAddOn().then(currentAddOn => {
            cy.wrap(currentAddOn).as('currentAddOn')
        })
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        //SMS plan Subscription 
        let desiredPlan = '$99'
        cy.get('@currentAddOn').then(currentPlan => {
            billingPage.smsPlanSubscription(currentPlan, desiredPlan, 'SMS plan subscribed successfully')
        })
        //Validate Subscribed SMS Plan
        billingPage.ValidateSubscribedSMSPlan(desiredPlan)

        billingPage.gotoBillingDetail()
        //Validate Current sms plan on billing
        billingPage.getCurrentAddOn().then(currentAddOn => {
            expect(currentAddOn).to.include(desiredPlan)
        })
    })
    xit('CA_SSUB_05 - Client Try to subscribe a SMS plan using declined non-3DS card', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select declined Credit card
        billingPage.selectdefaultPaymentMethod('4000000000000341')
        //Current AdOns Subscription
        billingPage.getCurrentAddOn().then(currentAddOn => {
            cy.wrap(currentAddOn).as('currentAddOn')
        })
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        //SMS plan Subscription 
        cy.get('@currentAddOn').then(currentPlan => {
            if (currentPlan.includes('($99)')) {
                let desiredPlan = '$29'
                billingPage.smsPlanSubscription(currentPlan, desiredPlan, 'Your card was declined')
                billingPage.verifyCardModal(desiredPlan) //New card detail modal appears
            }
            else {
                let desiredPlan = '$99'
                billingPage.smsPlanSubscription(currentPlan, desiredPlan, 'Your card was declined')
                billingPage.verifyCardModal(desiredPlan) //New card detail modal appears
            }

            //Validate Subscribed SMS Plan
            //billingPage.ValidateSubscribedSMSPlan(currentPlan) //plan will not be changed as declined card is attached

            billingPage.gotoBillingDetail()
            //Validate Current sms plan on billing
            billingPage.getCurrentAddOn().then(currentAddOn => {
                expect(currentAddOn).to.include(currentPlan)
            })
        })
    })
    it('CA_SSUB_06 - Apply and validate any new SMS Plan on existing client using 3DS2 card', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select default Credit card
        billingPage.selectdefaultPaymentMethod('4000000000003220') //3DS2 card
        //Current AdOns Subscription
        billingPage.getCurrentAddOn().then(currentAddOn => {
            cy.wrap(currentAddOn).as('currentAddOn')
        })
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        //SMS plan Subscription 
        cy.get('@currentAddOn').then(currentPlan => {
            if (currentPlan.includes('($99)')) {
                let desiredPlan = '$29'
                billingPage.smsPlanSubscriptionAPI("price_1KGS4rKh4TiALV2u9eB2fBwb") //'$29' plan
            }
            else {
                let desiredPlan = '$99'
                billingPage.smsPlanSubscriptionAPI("price_1KGS6pKh4TiALV2ubtJkL6yN") //'$99' plan
            }
            cy.visit('https://master.chargeautomation.com/client/v2/billing')
            billingPage.gotoBillingDetail()

        })
    })

})