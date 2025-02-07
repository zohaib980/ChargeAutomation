/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"
import { PropertiesPage } from "../../../pageObjects/PropertiesPage"
import { GuidebookPage } from "../../../pageObjects/GuidebookPage"
import { Dashboard } from "../../../pageObjects/Dashboard"
import { ReuseableCode } from "../../support/ReuseableCode"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn
const bookingDetailPage = new BookingDetailPage
const propertiesPage = new PropertiesPage
const guidebookPage = new GuidebookPage
const dashboard = new Dashboard
const reuseableCode = new ReuseableCode

describe('PreCheckin - Other Precheckin Test cases', function () {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Waqas DHA'
  const bSource = 'Direct'

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
    onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
  })
  it('CA_CPCT_09 > Validate If user try to complete the Pre CheckIn process without filling All Guest detail above 18. They will be able to complete it but Pre checkin will be considered incomplete', () => {
    onlineCheckinSettings.allGuestOver18WithAll()
    onlineCheckinSettings.enableAllToggles()
    guidebookPage.goToGuidebook()
    guidebookPage.enableGuideBook('Test Property1 Guide') //Enable the Test Property1 Guide
    //Open Edit Profile
    dashboard.openProfileModal()
    dashboard.selectPropertyNameBrand() //Select Property Name & Brand
    dashboard.saveProfileChanges()

    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    //Here 1st adult status is completed and 2nd is incomplete
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.get('.col-sm-9 > .translate').should('contain', 'Guest(s) details missing!') //On precheckin welcome page, an error shows as 2nd guest data is incomplete
    cy.get('.col-sm-3 > .btn > .translate').should('have.text', 'Update Now') //update now button 

    loginPage.happyLogin(loginEmail, loginPassword)
    bookingPage.validatePrecheckinStatusAsIncomplete() //Validate that the new booking status is incomplete
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it('CA_CPCT_10 > Validate If user try to complete the Pre CheckIn process without filling all Guest detail (Adult, Children and Babies). They will be able to complete it but Pre checkin will be considered incomplete', () => {
    onlineCheckinSettings.selectWhenAllGuestRequired()
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addAndValidateIdCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    //Here 1st adult status is completed and 2nd is incomplete
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Save & Continue (Navigate to AddOns Tab)
    preCheckIn.allAddOnServices() //Select all Addons and proceed to Credit card tab
    preCheckIn.addCreditCardInfo() //Add credit card and process the payment, redirects to Signature Validation
    preCheckIn.addAndValidateSignature() //Add Signature and Save the changes
    cy.get('.col-sm-9 > .translate').should('contain', 'Guest(s) details missing!') //On precheckin welcome page, an error shows as 2nd guest data is incomplete
    cy.get('.col-sm-3 > .btn > .translate').should('have.text', 'Update Now') //update now button

    loginPage.happyLogin(loginEmail, loginPassword)
    bookingPage.validatePrecheckinStatusAsIncomplete() //Validate that the new booking status is incomplete
    onlineCheckinSettings.applyBasicInfoOriginalSettings()
  })
  it("CA_CPCT_11 > If Who is required to upload the document? is selected to 'All guests' then all guests need to upload ID based on basic info settings who will complete pre-checkin", () => {
    onlineCheckinSettings.allGuestOver18UploadID()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source')
    bookingPage.addNewBookingAndValidate(propName, bSource, 2, 1) //Create a new booking and validate (2Adult, 1Child)
    preCheckIn.goToDocVerification(bSource) //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
    preCheckIn.addIDAndCreditCard() //Upload ID card and Credit Card and navigate to SELFY Tab
    preCheckIn.takeSelfy() //Take selfy and proceed to Guest tab
    preCheckIn.editGuestDetailAddIDCard('Adult') //Add guest and ID detail in 1st incomplete Adult
    //apply previous settings
    loginPage.happyLogin(loginEmail, loginPassword)
    onlineCheckinSettings.applyCollectIdLicenseOriginalSettings()
  })
})