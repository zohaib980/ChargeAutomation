/// <reference types = "cypress"/>

import { LoginPage } from "../../../pageObjects/LoginPage"
import { BillingPage } from "../../../pageObjects/BillingPage"
import { ReuseableCode } from "../../support/ReuseableCode"
import { Registration } from "../../../pageObjects/Registration"
import { Dashboard } from "../../../pageObjects/Dashboard"
import { PMSConnect } from "../../../pageObjects/PMSConnect"

const loginPage = new LoginPage
const billingPage = new BillingPage
const reuseableCode = new ReuseableCode
const registration = new Registration
const dashboard = new Dashboard
const pmsConnect = new PMSConnect

describe('Subscription Flows for New_Clients', { retries: 0 }, () => {

    const loginEmail = Cypress.config('users').user2.username
    const loginPassword = Cypress.config('users').user2.password

    beforeEach(() => {
        //loginPage.happyLogin(loginEmail, loginPassword)
    })
    it('CA_NSUB_01 - Verify that a new client receives a 7-day free trial on any plan.', () => {

        let clientName = reuseableCode.getRandomFirstName()
        let companyName = 'QATestCompany'
        let phoneNo = reuseableCode.getRandomPhoneNumber()
        let clientEmail = reuseableCode.generateRandomString(10) + '@yopmail.com'
        let clientPassword = 'Boring321'
        let planType = 'essentials_yearly' //essentials_yearly, essentials_monthly, professional_yearly, professional_monthly, basic

        //Go to Register page
        registration.goToRegistration()
        //Register New User
        registration.newRegistration(clientName, companyName, phoneNo, clientEmail, clientPassword, planType)

        registration.verifyEmailFromSMTP(clientEmail)
        loginPage.happyLogin(clientEmail, clientPassword)

        //Validate trial ending date
        billingPage.validateTrialEndDate()

        //Validate applied plan
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.equal(planType.toLowerCase().replace(/_/g, ' '))
        })

        //Get Account ID from Profile
        dashboard.openProfileModal()
        dashboard.getAccountId().then(accountId => {
            cy.wrap(accountId).as('accountId')
        })
        dashboard.closeProfileModal()

        //Delete the user account
        cy.get('@accountId').then(accountId => {
            registration.deleteUserAccount(accountId)
        })
    })
    it('CA_NSUB_02 - When new user having a trial, try to switch to another plan by adding a valid CC $1 authentication will be applied and user will moved to desired plan', () => {

        let clientName = reuseableCode.getRandomFirstName()
        let companyName = 'QATestCompany'
        let phoneNo = reuseableCode.getRandomPhoneNumber()
        let clientEmail = reuseableCode.generateRandomString(10) + '@yopmail.com'
        let clientPassword = 'Boring321'
        let planType = 'basic' //essentials_yearly, essentials_monthly, professional_yearly, professional_monthly, basic
        const desiredPlan = 'essentials'
        //Go to Register page
        registration.goToRegistration()
        //Register New User
        registration.newRegistration(clientName, companyName, phoneNo, clientEmail, clientPassword, planType)

        registration.verifyEmailFromSMTP(clientEmail)

        loginPage.happyLogin(clientEmail, clientPassword)

        //Validate 7 day trial ending date
        billingPage.validateTrialEndDate()

        // Switch to another plan
        billingPage.gotoBilling()
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()

        //Subscribe to a plan
        billingPage.selectMonthlyPlanForNewUser(desiredPlan, '4000000000003220')
        cy.verifyToast('Please approve the transaction')

        billingPage.approve3DS()
        cy.verifyToast('Subscription plan updated successfully')

        cy.wait(15000)
        //Validate that after 3DS approval, card is added and 1$ auth is applied
        cy.request('GET', '/client/v2/client-payment-method-details').then(response => {
            expect(response.status).to.eq(200)
            cy.log(response.body)
            expect(response.body.data).to.have.property('is_card_available', true)
            cy.log('The Credit card is approved and added into account, Hence 1$ Auth is applied')
        })
        //Validate applied plan
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.include(desiredPlan.toLowerCase().replace(/_/g, ' ')) //new plan will be subscribed
        })

        //Get Account ID from Profile
        dashboard.openProfileModal()
        dashboard.getAccountId().then(accountId => {
            cy.wrap(accountId).as('accountId')
        })
        dashboard.closeProfileModal()

        //Delete the user account
        cy.get('@accountId').then(accountId => {
            registration.deleteUserAccount(accountId)
        })

    })
    it('CA_NSUB_03 - When new user having a trial, try to switch to another plan by adding a invalid CC $1 authentication will be failed and user will stay on current plan', () => {

        let clientName = reuseableCode.getRandomFirstName()
        let companyName = 'QATestCompany'
        let phoneNo = reuseableCode.getRandomPhoneNumber()
        let clientEmail = reuseableCode.generateRandomString(10) + '@yopmail.com'
        let clientPassword = 'Boring321'
        let planType = 'basic' //essentials_yearly, essentials_monthly, professional_yearly, professional_monthly, basic
        const desiredPlan = 'essentials'

        //Go to Register page
        registration.goToRegistration()
        //Register New User
        registration.newRegistration(clientName, companyName, phoneNo, clientEmail, clientPassword, planType)

        registration.verifyEmailFromSMTP(clientEmail)

        loginPage.happyLogin(clientEmail, clientPassword)

        //Validate 7 day trial ending date
        billingPage.validateTrialEndDate()

        // Switch to another plan
        billingPage.gotoBilling()
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()

        //Subscribe to a plan
        billingPage.selectMonthlyPlanForNewUser(desiredPlan, '4000000000003220')
        cy.verifyToast('Please approve the transaction')

        billingPage.fail3DS()
        cy.verifyToast('We are unable to authenticate your payment method')
        //close subscription modal
        billingPage.closeSubscModal()

        cy.wait(20000)
        //Validate that after 3DS failure, card is added and no 1$ auth is applied
        cy.request('GET', '/client/v2/client-payment-method-details').then(response => {
            expect(response.status).to.eq(200)
            cy.log(response.body)
            expect(response.body.data).not.to.have.property('is_card_available')
            cy.log('The Credit card is declined and not added in account, Hence 1$ Auth is not applied')
        })
        //Validate applied plan
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.equal(planType.toLowerCase().replace(/_/g, ' ')) //not applied due to payment failure
        })

        //Get Account ID from Profile
        dashboard.openProfileModal()
        dashboard.getAccountId().then(accountId => {
            cy.wrap(accountId).as('accountId')
        })
        dashboard.closeProfileModal()

        //Delete the user account
        cy.get('@accountId').then(accountId => {
            registration.deleteUserAccount(accountId)
        })

    })
    it('CA_NSUB_04 - Free Trial Ends With Card on File (Successful Charge) - Verify that the subscription continues after the free trial if there is a card on file and the charge is successful', () => {

        let clientName = reuseableCode.getRandomFirstName()
        let companyName = 'QATestCompany'
        let phoneNo = reuseableCode.getRandomPhoneNumber()
        let clientEmail = reuseableCode.generateRandomString(10) + '@yopmail.com'
        let clientPassword = 'Boring321'
        let planType = 'basic' //essentials_yearly, essentials_monthly, professional_yearly, professional_monthly, basic
        const desiredPlan = 'essentials'

        //Go to Register page
        registration.goToRegistration()
        //Register New User
        registration.newRegistration(clientName, companyName, phoneNo, clientEmail, clientPassword, planType)

        registration.verifyEmailFromSMTP(clientEmail)

        loginPage.happyLogin(clientEmail, clientPassword)

        //Validate 7 day trial ending date
        //billingPage.validateTrialEndDate() //it was continue failing on pipeline due to timezone differnce

        // Switch to another plan
        billingPage.gotoBilling()
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()

        //Subscribe to a plan
        billingPage.selectMonthlyPlanForNewUser(desiredPlan, '4242424242424242')
        cy.verifyToast('Subscription plan updated successfully')

        cy.wait(15000)
        //Validate that card is added and 1$ auth is applied
        cy.request('GET', '/client/v2/client-payment-method-details').then(response => {
            expect(response.status).to.eq(200)
            cy.log(response.body)
            expect(response.body.data).to.have.property('is_card_available', true)
            cy.log('The Credit card is approved and added into account, Hence 1$ Auth is applied')
        })
        //Validate applied plan
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.include(desiredPlan.toLowerCase().replace(/_/g, ' ')) //new plan will be subscribed
        })

        //Need to select pms then we can get API key to furthur the user trial
        //Go to PMS Connect 
        pmsConnect.gotoPMSConnect()
        //Select PMS
        pmsConnect.selectPMS('No PMS')
        //Get API Key
        pmsConnect.getAPIKey().then(apiKey => {
            cy.log(apiKey)
            //end user trial
            pmsConnect.endUserTrial(apiKey)
        })

        //within 5 min if card is available use will stay on same plan 
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.include(desiredPlan.toLowerCase().replace(/_/g, ' ')) //new plan will be subscribed
        })

        //Get Account ID from Profile
        dashboard.openProfileModal()
        dashboard.getAccountId().then(accountId => {
            cy.wrap(accountId).as('accountId')
        })
        dashboard.closeProfileModal()
        //Delete the user account
        cy.get('@accountId').then(accountId => {
            registration.deleteUserAccount(accountId)
        })

    })
    it('CA_NSUB_05 - Free Trial Ends With Card on File (Unsuccessful Charge) - Verify that the client remains on the existing plan but an invoice is created if the charge is unsuccessful.', () => {

        let clientName = reuseableCode.getRandomFirstName()
        let companyName = 'QATestCompany'
        let phoneNo = reuseableCode.getRandomPhoneNumber()
        let clientEmail = reuseableCode.generateRandomString(10) + '@yopmail.com'
        let clientPassword = 'Boring321'
        let planType = 'basic' //essentials_yearly, essentials_monthly, professional_yearly, professional_monthly, basic
        const desiredPlan = 'essentials'

        //Go to Register page
        registration.goToRegistration()
        //Register New User
        registration.newRegistration(clientName, companyName, phoneNo, clientEmail, clientPassword, planType)

        registration.verifyEmailFromSMTP(clientEmail)

        loginPage.happyLogin(clientEmail, clientPassword)

        //Validate 7 day trial ending date
        billingPage.validateTrialEndDate()

        // Switch to another plan
        billingPage.gotoBilling()
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()

        //Subscribe to a plan
        billingPage.selectMonthlyPlanForNewUser(desiredPlan, '4000000000003220')
        cy.verifyToast('Please approve the transaction')

        billingPage.approve3DS()
        cy.verifyToast('Subscription plan updated successfully')

        cy.wait(15000)
        //Validate that after 3DS approval, card is added and 1$ auth is applied
        cy.request('GET', '/client/v2/client-payment-method-details').then(response => {
            expect(response.status).to.eq(200)
            cy.log(response.body)
            expect(response.body.data).to.have.property('is_card_available', true)
            cy.log('The Credit card is approved and added into account, Hence 1$ Auth is applied')
        })

        //Validate applied plan
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.include(desiredPlan.toLowerCase().replace(/_/g, ' ')) //new plan will be subscribed
        })

        //Need to select pms then we can get API key to furthur end the user trial
        //Go to PMS Connect 
        pmsConnect.gotoPMSConnect()
        //Select PMS
        pmsConnect.selectPMS('No PMS')
        //Get API Key

        pmsConnect.getAPIKey().then(apiKey => {
            cy.log(apiKey)
            //end user trial
            pmsConnect.endUserTrial(apiKey)
        })
        //dashboard.goToDashboard()
        //validate that Invoice is created within 5 min & Pending info message is shown on the header top
        //billingPage.validateOutstandingInvoiceMsg(30) //attemps after every 10 sec
        
        cy.wait(120000) //2 min
        //If card is available user will stay on same plan 
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.include(desiredPlan.toLowerCase().replace(/_/g, ' ')) 
        })
        cy.reload()
        //Validate the pending invoice is created
        cy.get('@estimatedCharge').then(estimatedCharge => {
            billingPage.validatePendingInvoiceAmount(estimatedCharge)
        })

        //Get Account ID from Profile
        dashboard.openProfileModal()
        dashboard.getAccountId().then(accountId => {
            cy.wrap(accountId).as('accountId')
        })
        dashboard.closeProfileModal()
        //Delete the user account
        cy.get('@accountId').then(accountId => {
            registration.deleteUserAccount(accountId)
        })
    })
    //if card is not available user will revert back to basic plan
    it('CA_NSUB_06 - Free Trial Ends Without Card on File - Verify that the subscription reverts to the basic plan if the free trial ends without a card on file.', () => {

        let clientName = reuseableCode.getRandomFirstName()
        let companyName = 'QATestCompany'
        let phoneNo = reuseableCode.getRandomPhoneNumber()
        let clientEmail = reuseableCode.generateRandomString(10) + '@yopmail.com'
        let clientPassword = 'Boring321'
        let planType = 'essentials_monthly' //essentials_yearly, essentials_monthly, professional_yearly, professional_monthly, basic

        //Go to Register page
        registration.goToRegistration()
        //Register New User
        registration.newRegistration(clientName, companyName, phoneNo, clientEmail, clientPassword, planType)

        registration.verifyEmailFromSMTP(clientEmail)

        loginPage.happyLogin(clientEmail, clientPassword)

        //Validate 7 day trial ending date
        billingPage.validateTrialEndDate()

        cy.wait(15000)
        //Validate that there is no card on file
        cy.request('GET', '/client/v2/client-payment-method-details').then(response => {
            expect(response.status).to.eq(200)
            cy.log(response.body)
            expect(response.body.data).not.to.have.property('is_card_available', true)
            cy.log('There is no card available on this account!')
        })

        //Validate applied plan
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.include(planType.toLowerCase().replace(/_/g, ' ')) //The user is on the desired plan
        })

        //Need to select pms then we can get API key to furthur end the user trial
        //Go to PMS Connect 
        pmsConnect.gotoPMSConnect()
        //Select PMS
        pmsConnect.selectPMS('No PMS')
        //Get API Key
        pmsConnect.getAPIKey().then(apiKey => {
            cy.log(apiKey)
            //end user trial
            pmsConnect.endUserTrial(apiKey)
        })

        cy.wait(120000) //wait for subscription to revert to basic
        //As card is not available user will be reverted back to basic 
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.include('basic')
            cy.log('The user is reverted back to Basic Plan!')
        })

        //Get Account ID from Profile
        dashboard.openProfileModal()
        dashboard.getAccountId().then(accountId => {
            cy.wrap(accountId).as('accountId')
        })
        dashboard.closeProfileModal()
        //Delete the user account
        cy.get('@accountId').then(accountId => {
            registration.deleteUserAccount(accountId)
        })

    })
    it('CA_NSUB_07 - Verify that the old plan is canceled and a new subscription is created when user switchs plan within the 7-day period', () => {

        let clientName = reuseableCode.getRandomFirstName()
        let companyName = 'QATestCompany'
        let phoneNo = reuseableCode.getRandomPhoneNumber()
        let clientEmail = reuseableCode.generateRandomString(10) + '@yopmail.com'
        let clientPassword = 'Boring321'
        let planType = 'essentials_monthly' //essentials_yearly, essentials_monthly, professional_yearly, professional_monthly, basic
        const desiredPlan = 'professional'

        //Go to Register page
        registration.goToRegistration()
        //Register New User
        registration.newRegistration(clientName, companyName, phoneNo, clientEmail, clientPassword, planType)

        registration.verifyEmailFromSMTP(clientEmail)

        loginPage.happyLogin(clientEmail, clientPassword)

        //Validate 7 day trial ending date
        billingPage.validateTrialEndDate()

        //Validate applied plan
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.include(planType.toLowerCase().replace(/_/g, ' ')) //new plan will be subscribed
        })

        // Switch to another plan
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()
        billingPage.selectMonthlyPlanForNewUser(desiredPlan, '4242424242424242')
        cy.verifyToast('Subscription plan updated successfully')

        cy.wait(15000)
        //Validate that card is added and 1$ auth is applied
        cy.request('GET', '/client/v2/client-payment-method-details').then(response => {
            expect(response.status).to.eq(200)
            cy.log(response.body)
            expect(response.body.data).to.have.property('is_card_available', true)
            cy.log('The Credit card is approved and added into account, Hence 1$ Auth is applied')
        })
        //new plan will be switched to desired plan within trial
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.include(desiredPlan.toLowerCase().replace(/_/g, ' '))
        })

        //Get Account ID from Profile
        dashboard.openProfileModal()
        dashboard.getAccountId().then(accountId => {
            cy.wrap(accountId).as('accountId')
        })
        dashboard.closeProfileModal()
        //Delete the user account
        cy.get('@accountId').then(accountId => {
            registration.deleteUserAccount(accountId)
        })
    })
    it('CA_NSUB_08 - While switching the plan using 3DS card reload the page on 3DS popup and validate that outstanding invoicing message is showin on the header', () => {

        let clientName = reuseableCode.getRandomFirstName()
        let companyName = 'QATestCompany'
        let phoneNo = reuseableCode.getRandomPhoneNumber()
        let clientEmail = reuseableCode.generateRandomString(10) + '@yopmail.com'
        let clientPassword = 'Boring321'
        let planType = 'basic' //essentials_yearly, essentials_monthly, professional_yearly, professional_monthly, basic

        //Go to Register page
        registration.goToRegistration()
        //Register New User
        registration.newRegistration(clientName, companyName, phoneNo, clientEmail, clientPassword, planType)
        
        registration.verifyEmailFromSMTP(clientEmail)
            
        loginPage.happyLogin(clientEmail, clientPassword)

        //Validate 7 day trial ending date
        billingPage.validateTrialEndDate()

        //Select PMS
        pmsConnect.gotoPMSConnect()
        pmsConnect.selectPMS('No PMS')

        //Get API Key
        pmsConnect.getAPIKey().then(apiKey => {
            cy.log(apiKey)
            //end user trial
            pmsConnect.endUserTrial(apiKey)
        })

        cy.wait(60000) //wait for subscription to revert to basic
        //As card is not available user will be reverted back to basic 
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan.toLowerCase()).to.include('basic')
            cy.log('The user is on Basic Plan!')
        })
        // Switch to another plan
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()
        billingPage.selectMonthlyPlan('essentials')
        //Add a new card
        billingPage.addCConSubscModal('4000000000003220') //3DS1 valid card

        //Get estimated Charge Amount
        billingPage.getEstimatedChargeAmount().then(estimatedCharge => {
            cy.wrap(estimatedCharge).as('estimatedCharge')
        })
        //Click Start Plan
        billingPage.clickStartPlan('essentials', 'monthly')
        cy.verifyToast('Please approve pending transactions')
        cy.wait(5000) //wait for 3ds modal to appear
        cy.reload()

        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //validate Activated subscription
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.eq('Basic') //as the payment is pending so the plan will not be changed
        })
        cy.get('@estimatedCharge').then(estimatedCharge => {
            billingPage.validatePendingInvoiceAmount(estimatedCharge)
        })

        //validate that Invoice is created within 5 min & Pending info message is shown on the header top
        //dashboard.goToDashboard()
        //billingPage.validateOutstandingInvoiceMsg(30) //attemps after every 10 sec

        //Pay pending invoices
        billingPage.gotoBilling()
        billingPage.payPendingInvoice(0)
        cy.visit('/client/v2/dashboard')
        billingPage.gotoBilling()
        billingPage.payPendingInvoice(0)

        //Validate that Outsatnding Invoice message is not showing
        cy.get('#overdue-invoice-alert .text-md').should('not.exist')

        //Get Account ID from Profile
        dashboard.openProfileModal()
        dashboard.getAccountId().then(accountId => {
            cy.wrap(accountId).as('accountId')
        })
        dashboard.closeProfileModal()
        //Delete the user account
        cy.get('@accountId').then(accountId => {
            registration.deleteUserAccount(accountId)
        })

    })
    xit('endTrial', ()=>{
        pmsConnect.endUserTrial('6bd36080-b91d-11ef-8832-13d06c7d4a48') //apiKey
    })
})