/// <reference types = "cypress"/>

import { LoginPage } from "../../../pageObjects/LoginPage"
import { BillingPage } from "../../../pageObjects/BillingPage"
import { PropertiesPage } from "../../../pageObjects/PropertiesPage"
import { RentalsPage } from "../../../pageObjects/RentalsPage"
import { Dashboard } from "../../../pageObjects/Dashboard"

const loginPage = new LoginPage
const billingPage = new BillingPage
const propertiesPage = new PropertiesPage
const rentalsPage = new RentalsPage
const dashboard = new Dashboard

describe('Subscription Flows for Existing_Clients', { retries: 0 }, () => {

    const loginEmail = Cypress.config('users').user2.username
    const loginPassword = Cypress.config('users').user2.password

    beforeEach(() => {
        cy.visit('/')
        loginPage.happyLogin(loginEmail, loginPassword)
    })

    it('CA_SUB_01 - Validate update subscription for existing client when the charge is successful for monthly Essentials subscription', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select Valid Credit card
        billingPage.selectdefaultPaymentMethod('4242424242424242')
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()
        //Get plan Price
        billingPage.getPlanPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectMonthlyPlan('essentials')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'monthly')
                })
            })
        })
        //Click Start Plan
        billingPage.clickStartPlan('essentials', 'monthly')
        billingPage.validateToastMsg('Subscription plan updated successfully')
        //Validate applied plan
        billingPage.validateAppliedPlan('essentials')
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //Get current plan
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.be.eq('Essentials Monthly')
        })

    })
    it('CA_SUB_02 - Validate update subscription for existing client when the charge is successful for monthly Professional subscription', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select Valid Credit card
        billingPage.selectdefaultPaymentMethod('4242424242424242')
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()
        //Get plan Price
        billingPage.getPlanPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectMonthlyPlan('professional')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'monthly')
                })
            })
        })
        //Click Start Plan
        billingPage.clickStartPlan('professional', 'monthly')
        billingPage.validateToastMsg('Subscription plan updated successfully')
        //Validate applied plan on Subscription Plan tab
        billingPage.validateAppliedPlan('professional')
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //Get current plan from billing detail tab
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.be.eq('Professional Monthly')
        })

    })
    it('CA_SUB_03 - Validate update subscription for existing client when the charge is successful for Annually Essentials subscription', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select Valid Credit card
        billingPage.selectdefaultPaymentMethod('4242424242424242')
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillAnnually()
        //Get plan Price
        billingPage.getPlanPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectAnnualPlan('essentials')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'yearly')
                })
            })
        })
        //Click Start Plan
        billingPage.clickStartPlan('essentials', 'yearly')
        billingPage.validateToastMsg('Subscription plan updated successfully')
        //Validate applied plan
        billingPage.validateAppliedPlan('essentials')
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //Get current plan
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.be.eq('Essentials Yearly')
        })

    })
    it('CA_SUB_04 - Validate update subscription for existing client when the charge is successful for Annually Professional subscription', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select Valid Credit card
        billingPage.selectdefaultPaymentMethod('4242424242424242')
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillAnnually()
        //Get plan Price
        billingPage.getPlanPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectAnnualPlan('professional')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'yearly')
                })
            })
        })
        //Click Start Plan
        billingPage.clickStartPlan('professional', 'yearly')
        billingPage.validateToastMsg('Subscription plan updated successfully')
        //Validate applied plan
        billingPage.validateAppliedPlan('professional')
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //Get current plan
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.be.eq('Professional Yearly')
        })

    })
    it('CA_SUB_05 - Validate that existing client can anytime switch to basic plan', () => {
        //Go to billing page
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(currentPlan => {
            if (currentPlan === 'Basic') {
                cy.log('Client is already on Basic plan')
            }
            else {
                //Go to Subscription Plans
                billingPage.gotoSubscriptionPlans()
                //Switch to Basic
                billingPage.switchToBasic()
                //Go to Billing Detail
                billingPage.gotoBillingDetail()
                //validate Activated subscription
                billingPage.getActiveSubscription().then(activePlan => {
                    expect(activePlan).to.eq("Basic")
                })
            }
        })


    })
    it('CA_SUB_06 - Validate update subscription for existing client when the charge is unsuccessful for monthly Essentials subscription', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()
        //Get plan Price
        billingPage.getPlanPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectMonthlyPlan('essentials')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'monthly')
                })
            })
        })
        //Add a declined card
        billingPage.addCConSubscModal('4000000000000002') //non-3Ds declined card
        //Click Start Plan
        billingPage.clickStartPlan('essentials', 'monthly')
        billingPage.validateToastMsg('Your card was declined')
        billingPage.closeSubscModal()
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //validate Activated subscription
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.eq('Basic')
        })

    })
    it('CA_SUB_07 - Validate update subscription for existing client when the charge is unsuccessful for monthly Professional subscription', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()
        //Get plan Price
        billingPage.getPlanPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectMonthlyPlan('professional')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'monthly')
                })
            })
        })
        //Add a declined card
        billingPage.addCConSubscModal('4000000000000002') //non-3Ds declined card
        //Click Start Plan
        billingPage.clickStartPlan('professional', 'monthly')
        billingPage.validateToastMsg('Your card was declined')
        billingPage.closeSubscModal()
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //validate Activated subscription
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.eq('Basic')
        })

    })
    it('CA_SUB_08 - Validate update subscription for existing client when the charge is unsuccessful for Annually Essentials subscription', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillAnnually()
        //Get plan Price
        billingPage.getPlanPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectAnnualPlan('essentials')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'yearly')
                })
            })
        })
        //Add a declined card
        billingPage.addCConSubscModal('4000000000000002') //non-3DS declined card
        //Click Start Plan
        billingPage.clickStartPlan('essentials', 'yearly')
        billingPage.validateToastMsg('Your card was declined')
        billingPage.closeSubscModal()
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //validate Activated subscription
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.eq("Basic")
        })

    })
    it('CA_SUB_09 - Validate update subscription for existing client when the charge is unsuccessful for Annually Professional subscription', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillAnnually()
        //Get plan Price
        billingPage.getPlanPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectAnnualPlan('professional')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'yearly')
                })
            })
        })
        //Add a declined card
        billingPage.addCConSubscModal('4000000000000002') //non-3DS declined card
        //Click Start Plan
        billingPage.clickStartPlan('professional', 'yearly')
        billingPage.validateToastMsg('Your card was declined')
        billingPage.closeSubscModal()
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //validate Activated subscription
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.eq('Basic')
        })
    })
    //3DS and non 3DS cards flows
    it('CA_SUB_10 - Add new non-3DS valid credit card on Payment modal and subscribe to Monthly Essentials', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()
        //Get plan Price
        billingPage.getPlanPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectMonthlyPlan('essentials')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'monthly')
                })
            })
        })
        //Add a new card
        billingPage.addCConSubscModal('5555555555554444') //non-3DS valid card
        //Click Start Plan
        billingPage.clickStartPlan('essentials', 'monthly')
        billingPage.validateToastMsg('Subscription plan updated successfully')
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //validate Activated subscription
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.eq('Essentials Monthly')
        })
        billingPage.validateDefaultPaymentMethod('5555555555554444')
        //Now delete the newly added method from Stripe
        billingPage.deletePaymentMethodOnStripe('5555555555554444')
    })
    it('CA_SUB_11 - Add new 3DS1 valid credit card on Payment modal and subscribe to Monthly Professional', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()
        //Get plan Price
        billingPage.getPlanPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectMonthlyPlan('professional')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'monthly')
                })
            })
        })
        //Add a new card
        billingPage.addCConSubscModal('4000000000003055') //3DS1 valid card
        //Click Start Plan
        billingPage.clickStartPlan('professional', 'monthly')
        billingPage.validateToastMsg('Subscription plan updated successfully')
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //validate Activated subscription
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.eq('Professional Monthly')
        })
        billingPage.validateDefaultPaymentMethod('4000000000003055')
        //Now delete the newly added method from Stripe
        billingPage.deletePaymentMethodOnStripe('4000000000003055')
    })
    it('CA_SUB_12 - Add new 3DS2 valid credit card on Payment modal and subscribe to Yearly Essentials on approving 3DS', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillAnnually()
        //Get plan Price
        billingPage.getPlanPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectAnnualPlan('essentials')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'yearly')
                })
            })
        })
        //Add a new card
        billingPage.addCConSubscModal('4000000000003220') //3DS1 valid card
        //Click Start Plan
        billingPage.clickStartPlan('essentials', 'yearly')
        cy.get('.toast-message').then(($el) => {
            if ($el.text().includes('Please approve pending transactions.')) {
                billingPage.validateToastMsg('Please approve pending transactions.')
                // Approve 3DS
                billingPage.approve3DS();
            }
        })

        billingPage.validateToastMsg('Subscription plan updated successfully')
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //validate Activated subscription
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.eq('Essentials Yearly')
        })
        billingPage.validateDefaultPaymentMethod('4000000000003220')
        //Now delete the newly added method from Stripe
        billingPage.deletePaymentMethodOnStripe('4000000000003220')
    })
    it('CA_SUB_13 - Add new 3DS2 valid credit card on Payment modal and subscribe to Yearly Essentials on failing 3DS', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillAnnually()
        //Get plan Price
        billingPage.getPlanPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectAnnualPlan('essentials')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'yearly')
                })
            })
        })
        //Add a new card
        billingPage.addCConSubscModal('4000000000003220') //3DS2 valid card
        //Click Start Plan
        billingPage.clickStartPlan('essentials', 'yearly')
        cy.get('.toast-message').then(($el) => {
            if ($el.text().includes('Please approve pending transactions.')) { //if payment goes in 3ds verification we fail it
                billingPage.validateToastMsg('Please approve pending transactions.')
                //Fail3DS
                billingPage.fail3DS()
                billingPage.validateToastMsg('We are unable to authenticate your payment method. Please choose a different payment method and try again')
                billingPage.closeSubscModal()
            } else {
                billingPage.validateToastMsg('Subscription plan updated successfully')  //else payment will be processed without 3DS
            }
        })

        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        billingPage.validateDefaultPaymentMethod('4000000000003220')
        //Now delete the newly added method from Stripe
        billingPage.deletePaymentMethodOnStripe('4000000000003220')
    })
    //Add & Remove rentals flows
    it('CA_SUB_14 - Add & Remove rentals on Monthly Essentials plan and validate rental price', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select Valid Credit card
        billingPage.selectdefaultPaymentMethod('4242424242424242')
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillMonthly()
        //Get plan Price
        billingPage.getPlanPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('essentials').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectMonthlyPlan('essentials')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'monthly')
                })
            })
        })
        //Click Start Plan
        billingPage.clickStartPlan('essentials', 'monthly')
        billingPage.validateToastMsg('Subscription plan updated successfully')
        //Validate applied plan
        billingPage.validateAppliedPlan('essentials')
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //Get current plan
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.be.eq('Essentials Monthly')
        })
        //Add Rentals On plan Subscription
        cy.get('@perRentalPrice').then(perRentalPrice => {
            billingPage.addRentalsOnPlan(1, perRentalPrice, 'Essentials Monthly')
        })
        //Remove Rentals on subscribed plan
        billingPage.removeRentalOnPlan('1')

    })
    it('CA_SUB_15 - Add & Remove rentals on Yearly Professional plan and validate rental price', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Select Valid Credit card
        billingPage.selectdefaultPaymentMethod('4242424242424242')
        //Go to Subscription Plans
        billingPage.gotoSubscriptionPlans()
        billingPage.selectBillAnnually()
        //Get plan Price
        billingPage.getPlanPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPrice = text.match(/\d+/)[0];
            let planPrice = parseInt(numericPrice);
            cy.log(planPrice)
            cy.wrap(planPrice).as('planPrice')
        })
        //Per room price
        billingPage.getPerRentalPrice('professional').then(text => {
            // Extract the numeric value from the text content
            const numericPer = text.match(/\d+\.\d+/)[0];
            let perRentalPrice = parseFloat(numericPer)
            cy.log(perRentalPrice)
            cy.wrap(perRentalPrice).as('perRentalPrice')
        })
        //Select Plan
        //If it is the current plan, then system will change to Basic and then apply the desired one
        billingPage.selectAnnualPlan('professional')
        //Rental count
        billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
        //Validate Estimated Charged Amount
        cy.get('@planPrice').then(planPrice => {
            cy.get('@perRentalPrice').then(perRentalPrice => {
                cy.get('@rentalCount').then(rentalCount => {
                    billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'yearly')
                })
            })
        })
        //Click Start Plan
        billingPage.clickStartPlan('professional', 'yearly')
        billingPage.validateToastMsg('Subscription plan updated successfully')
        //Validate applied plan
        billingPage.validateAppliedPlan('professional')
        //Go to Billing Detail
        billingPage.gotoBillingDetail()
        //Get current plan
        billingPage.getActiveSubscription().then(activePlan => {
            expect(activePlan).to.be.eq('Professional Yearly')
        })
        //Add Rentals On plan Subscription
        cy.get('@perRentalPrice').then(perRentalPrice => {
            billingPage.addRentalsOnPlan(2, perRentalPrice, 'Professional Yearly')
        })
        //Remove Rentals on subscribed plan
        billingPage.removeRentalOnPlan('2')

    })
    it('CA_SUB_16 - Add a rental on property detail and validate the count on billing page', () => {
        //Go to billing page
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(currentPlan => {
            if (currentPlan === 'Basic') { //will switch to other plan 
                cy.log('Client is on Basic plan')
                //Select Valid Credit card
                billingPage.selectdefaultPaymentMethod('4242424242424242')
                //Go to Subscription Plans
                billingPage.gotoSubscriptionPlans()
                billingPage.selectBillMonthly()
                //Get plan Price
                billingPage.getPlanPrice('essentials').then(text => {
                    // Extract the numeric value from the text content
                    const numericPrice = text.match(/\d+/)[0];
                    let planPrice = parseInt(numericPrice);
                    cy.log(planPrice)
                    cy.wrap(planPrice).as('planPrice')
                })
                //Per room price
                billingPage.getPerRentalPrice('essentials').then(text => {
                    // Extract the numeric value from the text content
                    const numericPer = text.match(/\d+\.\d+/)[0];
                    let perRentalPrice = parseFloat(numericPer)
                    cy.log(perRentalPrice)
                    cy.wrap(perRentalPrice).as('perRentalPrice')
                })
                //Select Plan
                //If it is the current plan, then system will change to Basic and then apply the desired one
                billingPage.selectMonthlyPlan('essentials')
                //Rental count
                billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
                //Validate Estimated Charged Amount
                cy.get('@planPrice').then(planPrice => {
                    cy.get('@perRentalPrice').then(perRentalPrice => {
                        cy.get('@rentalCount').then(rentalCount => {
                            billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'monthly')
                        })
                    })
                })
                //Click Start Plan
                billingPage.clickStartPlan('essentials', 'monthly')
                billingPage.validateToastMsg('Subscription plan updated successfully')
                //Validate applied plan
                billingPage.validateAppliedPlan('essentials')
                //Go to Billing Detail
                billingPage.gotoBillingDetail()
                //Get current plan
                billingPage.getActiveSubscription().then(activePlan => {
                    expect(activePlan).to.be.eq('Essentials Monthly')
                })
            }
            //Go to billing page
            //billingPage.gotoBilling()
            billingPage.getRentalCountonPlan().then(rentalCount => { cy.wrap(rentalCount).as('oldRentalCount') })
            //Go to Property page
            propertiesPage.goToProperties()
            //Go to rental
            propertiesPage.goToRentals(1) //first property rentals
            //Add a new rental
            rentalsPage.addRental()
            //Go to billing page
            billingPage.gotoBilling()
            //Get and validate new Rental count
            billingPage.getRentalCountonPlan().then(newRentalCount => {
                cy.get('@oldRentalCount').then(oldRentalCount => {
                    expect(parseInt(newRentalCount)).to.be.eq(parseInt(oldRentalCount) + 1)
                })
            })

        })

    })
    it('CA_SUB_17 - Validate that on removing a rental from property the client can decrement the rental count on billing page', () => {
        //Go to billing page
        billingPage.gotoBilling()
        billingPage.getActiveSubscription().then(currentPlan => {
            if (currentPlan === 'Basic') { //will switch to other plan 
                cy.log('Client is on Basic plan')
                //Select Valid Credit card
                billingPage.selectdefaultPaymentMethod('4242424242424242')
                //Go to Subscription Plans
                billingPage.gotoSubscriptionPlans()
                billingPage.selectBillMonthly()
                //Get plan Price
                billingPage.getPlanPrice('essentials').then(text => {
                    // Extract the numeric value from the text content
                    const numericPrice = text.match(/\d+/)[0];
                    let planPrice = parseInt(numericPrice);
                    cy.log(planPrice)
                    cy.wrap(planPrice).as('planPrice')
                })
                //Per room price
                billingPage.getPerRentalPrice('essentials').then(text => {
                    // Extract the numeric value from the text content
                    const numericPer = text.match(/\d+\.\d+/)[0];
                    let perRentalPrice = parseFloat(numericPer)
                    cy.log(perRentalPrice)
                    cy.wrap(perRentalPrice).as('perRentalPrice')
                })
                //Select Plan
                //If it is the current plan, then system will change to Basic and then apply the desired one
                billingPage.selectMonthlyPlan('essentials')
                //Rental count
                billingPage.getRentalCount().then(rentalCount => { cy.wrap(rentalCount).as('rentalCount') })
                //Validate Estimated Charged Amount
                cy.get('@planPrice').then(planPrice => {
                    cy.get('@perRentalPrice').then(perRentalPrice => {
                        cy.get('@rentalCount').then(rentalCount => {
                            billingPage.validateEstimatedChargedAmount(planPrice, perRentalPrice, rentalCount, 'monthly')
                        })
                    })
                })
                //Click Start Plan
                billingPage.clickStartPlan('essentials', 'monthly')
                billingPage.validateToastMsg('Subscription plan updated successfully')
                //Validate applied plan
                billingPage.validateAppliedPlan('essentials')
                //Go to Billing Detail
                billingPage.gotoBillingDetail()
                //Get current plan
                billingPage.getActiveSubscription().then(activePlan => {
                    expect(activePlan).to.be.eq('Essentials Monthly')
                })
            }
            //Go to billing page
            //billingPage.gotoBilling()
            billingPage.getRentalCountonPlan().then(rentalCount => { cy.wrap(rentalCount).as('oldRentalCount') })
            //Go to Property page
            propertiesPage.goToProperties()
            //Go to rental
            propertiesPage.goToRentals(1) //first property rentals
            //Add a new rental
            rentalsPage.removeRental()
            //Go to billing page
            billingPage.gotoBilling()
            //Get and validate new Rental count
            billingPage.getRentalCountonPlan().then(newRentalCount => {
                cy.get('@oldRentalCount').then(oldRentalCount => {
                    expect(parseInt(newRentalCount)).to.be.eq(parseInt(oldRentalCount))
                })
            })

            //Remove Rentals on subscribed plan
            billingPage.removeRentalOnPlan('1')
            billingPage.getRentalCountonPlan().then(newRentalCount => {
                cy.get('@oldRentalCount').then(oldRentalCount => {
                    expect(parseInt(newRentalCount)).to.be.eq(parseInt(oldRentalCount) - 1)
                })
            })
        })

    })
    it('CA_SUB_18 - Validate Transaction History Table on billing page', () => {
        //Go to billing page
        billingPage.gotoBilling()
        //Validate colummn name on Transaction History
        billingPage.validateColumnOnTransactionHistory()
        cy.get('.b-invoce-view > span').should('exist').click() //Expand the Load more
        cy.get('.tran-his-body ul').then($elements => {
            let count = $elements.length;
            cy.log('Transactions Count: ', count); // Logging the count to ensure it's correct
            for (let i = 0; i < 10; i++) { // it will iterate 10 records in the table
                billingPage.getPaymentStatus(i).then(paymentStatus => {
                    cy.log(paymentStatus)
                    //"Amount Due" - "Amount Paid" = "Amount Remaining"
                    billingPage.getAmountDue(i).then(amountDue => {
                        billingPage.getAmountPaid(i).then(amountPaid => {
                            billingPage.getAmountRemaining(i).then(amountRemaining => {
                                expect(parseFloat(amountRemaining)).to.be.eq(parseFloat(amountDue) - parseFloat(amountPaid))
                            })
                        })
                    })
                    if (paymentStatus.includes('Paid')) { //if invoice is paid
                        billingPage.validatePayNowStatus(i, 'Paid') //should be disabled
                        // "Amount Due" = "Amount Paid" and "Amount Remaining" will be 0.00
                        billingPage.getAmountDue(i).then(amountDue => {
                            billingPage.getAmountPaid(i).then(amountPaid => {
                                billingPage.getAmountRemaining(i).then(amountRemaining => {
                                    expect(parseFloat(amountDue)).to.be.eq(parseFloat(amountPaid))
                                    expect(amountRemaining).to.be.eq('0.00')
                                })
                            })
                        })
                    } else if (paymentStatus.includes('Void')) { //if invoice is Void
                        billingPage.validatePayNowStatus(i, 'Void') //should be disabled
                        // "Amount Due" = "Amount Remaining" and "Amount Paid" = 0.00
                        billingPage.getAmountDue(i).then(amountDue => {
                            billingPage.getAmountPaid(i).then(amountPaid => {
                                billingPage.getAmountRemaining(i).then(amountRemaining => {
                                    expect(parseFloat(amountDue)).to.be.eq(parseFloat(amountRemaining))
                                    expect(amountPaid).to.be.eq('0.00')
                                })
                            })
                        })
                    } else if (paymentStatus.includes('Open')) { //if invoice is Open
                        billingPage.validatePayNowStatus(i, 'Open') //should be enabled
                        // "Amount Due" = "Amount Remaining"  and "Amount Paid" = 0.00
                        billingPage.getAmountDue(i).then(amountDue => {
                            billingPage.getAmountPaid(i).then(amountPaid => {
                                billingPage.getAmountRemaining(i).then(amountRemaining => {
                                    expect(parseFloat(amountDue)).to.be.eq(parseFloat(amountRemaining))
                                    expect(amountPaid).to.be.eq('0.00')
                                })
                            })
                        })
                    }
                    else {
                        throw new Error('Payment status is not valid')
                    }

                })
            }
        })
    })
   

})