/// <reference types ="Cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn
const bookingDetailPage = new BookingDetailPage

describe('Complete PreCheckin link test Scripts in Steps', function () {

    beforeEach(() => {
        cy.visit('/')
        loginPage.happyLogin('', '') //Login to portal
        onlineCheckinSettings.applyBasicInfoOriginalSettings() //Apply basic setting
    })
    it('CA_PCW_01 > Validate pre-checkin welcome page', function () {
        
        const propName = 'Waqas DHA'
        bookingPage.addNewBookingAndValidate(propName, 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        //Validate newly created booking detail with pre-checkin welcome page
        bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => {
            cy.wrap(href).as('precheckinlink') // Alias precheckinlink using cy.wrap()
          })
          // Here we will copy and Visit the Pre Check-In process after logout from the portal
          bookingDetailPage.goToBookingDetailPage(propName) // Visit the booking detail page of first booking
          bookingDetailPage.getBookingID().then(text => {
            cy.wrap(text).as('bookingID')         // Alias bookingID using cy.wrap()
          })
          bookingDetailPage.getBookingSource().then(text => {
            cy.wrap(text).as('bookingSource')     // Alias bookingSource using cy.wrap()
          })
          bookingDetailPage.getCheckinDate().then(text => {
            cy.wrap(text).as('checkInDate')       // Alias checkInDate using cy.wrap()
          })
          bookingDetailPage.getCheckOutDate().then(text => {
            cy.wrap(text).as('checkOutDate')      // Alias checkOutDate using cy.wrap()
          })
          bookingDetailPage.getFullName().then(text => {
            cy.wrap(text).as('fullName')          // Alias fullName using cy.wrap()
          })
          bookingDetailPage.getGuestEmail().then(text => {
            cy.wrap(text).as('email')             // Alias email using cy.wrap()
          })
          bookingDetailPage.getTrxAmount().then(text => {
            cy.wrap(text).as('TrxAmount')         // Alias TrxAmount using cy.wrap()
          })
          // User will logout from the portal and will open CheckIn link
          loginPage.logout()
          cy.get('@precheckinlink').then(precheckinlink => {
            cy.visit(precheckinlink)
          })
          cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
          cy.wait(2000)
      
          //Welcome Page On Precheckin
          cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').wait(5000)
          cy.get('@bookingID').then(bookingID => {
            preCheckIn.validateReferenceNo(bookingID) // Validate Reference Number
          })
          cy.get('@bookingSource').then(bookingSource => {
            preCheckIn.validateSourceType(bookingSource) // Validate Soruce type
          })
          cy.get('@TrxAmount').then(TrxAmount => {
            preCheckIn.validateTxAmount(TrxAmount) // Validate Amount  
          })
          cy.get('@checkInDate').then(checkInDate => {
            preCheckIn.validateCheckinDate(checkInDate) // Validate check In date
          })
          cy.get('@checkOutDate').then(checkOutDate => {
            preCheckIn.validateCheckoutDate(checkOutDate) // Validate CheckOut Date    
          })
          preCheckIn.clickSaveContinue() //Save & Continue
          cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
          cy.wait(3000)
      
          cy.get('@fullName').then(fullName => {
            preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
          })
          cy.get('@email').then(email => {
            preCheckIn.validateEmail(email)             //Validate email
          })
    })

    it('CA_PCW_02 > Validate basic info page field level validations and prefilled fields', () => {
        const propName = 'Waqas DHA'
        bookingPage.addNewBookingAndValidate(propName, 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        //Validate newly created booking detail with pre-checkin welcome page
        bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => {
            cy.wrap(href).as('precheckinlink') // Alias precheckinlink using cy.wrap()
          })
          // Here we will copy and Visit the Pre Check-In process after logout from the portal
          bookingDetailPage.goToBookingDetailPage(propName) // Visit the booking detail page of first booking
          bookingDetailPage.getBookingID().then(text => {
            cy.wrap(text).as('bookingID')         // Alias bookingID using cy.wrap()
          })
          bookingDetailPage.getBookingSource().then(text => {
            cy.wrap(text).as('bookingSource')     // Alias bookingSource using cy.wrap()
          })
          bookingDetailPage.getCheckinDate().then(text => {
            cy.wrap(text).as('checkInDate')       // Alias checkInDate using cy.wrap()
          })
          bookingDetailPage.getCheckOutDate().then(text => {
            cy.wrap(text).as('checkOutDate')      // Alias checkOutDate using cy.wrap()
          })
          bookingDetailPage.getFullName().then(text => {
            cy.wrap(text).as('fullName')          // Alias fullName using cy.wrap()
          })
          bookingDetailPage.getGuestEmail().then(text => {
            cy.wrap(text).as('email')             // Alias email using cy.wrap()
          })
          bookingDetailPage.getTrxAmount().then(text => {
            cy.wrap(text).as('TrxAmount')         // Alias TrxAmount using cy.wrap()
          })
          // User will logout from the portal and will open CheckIn link
          loginPage.logout()
          cy.get('@precheckinlink').then(precheckinlink => {
            cy.visit(precheckinlink)
          })
          cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
          cy.wait(2000)
      
          //Welcome Page On Precheckin
          cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').wait(5000)
          cy.get('@bookingID').then(bookingID => {
            preCheckIn.validateReferenceNo(bookingID) // Validate Reference Number
          })
          cy.get('@bookingSource').then(bookingSource => {
            preCheckIn.validateSourceType(bookingSource) // Validate Soruce type
          })
          cy.get('@TrxAmount').then(TrxAmount => {
            preCheckIn.validateTxAmount(TrxAmount) // Validate Amount  
          })
          cy.get('@checkInDate').then(checkInDate => {
            preCheckIn.validateCheckinDate(checkInDate) // Validate check In date
          })
          cy.get('@checkOutDate').then(checkOutDate => {
            preCheckIn.validateCheckoutDate(checkOutDate) // Validate CheckOut Date    
          })
          preCheckIn.clickSaveContinue() //Save & Continue
          cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
          cy.wait(3000)
      
          cy.get('@fullName').then(fullName => {
            preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
          })
          cy.get('@email').then(email => {
            preCheckIn.validateEmail(email)             //Validate email
          })
        preCheckIn.addAndValidateBasicInfo() //Add and validate basic info
    })

    it('CA_PCW_03 > Validate the questionnier step', () => {
        const propName = 'Waqas DHA'
        bookingPage.addNewBookingAndValidate(propName, 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        //Validate newly created booking detail with pre-checkin welcome page
        bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => {
            cy.wrap(href).as('precheckinlink') // Alias precheckinlink using cy.wrap()
          })
          // Here we will copy and Visit the Pre Check-In process after logout from the portal
          bookingDetailPage.goToBookingDetailPage(propName) // Visit the booking detail page of first booking
          bookingDetailPage.getBookingID().then(text => {
            cy.wrap(text).as('bookingID')         // Alias bookingID using cy.wrap()
          })
          bookingDetailPage.getBookingSource().then(text => {
            cy.wrap(text).as('bookingSource')     // Alias bookingSource using cy.wrap()
          })
          bookingDetailPage.getCheckinDate().then(text => {
            cy.wrap(text).as('checkInDate')       // Alias checkInDate using cy.wrap()
          })
          bookingDetailPage.getCheckOutDate().then(text => {
            cy.wrap(text).as('checkOutDate')      // Alias checkOutDate using cy.wrap()
          })
          bookingDetailPage.getFullName().then(text => {
            cy.wrap(text).as('fullName')          // Alias fullName using cy.wrap()
          })
          bookingDetailPage.getGuestEmail().then(text => {
            cy.wrap(text).as('email')             // Alias email using cy.wrap()
          })
          bookingDetailPage.getTrxAmount().then(text => {
            cy.wrap(text).as('TrxAmount')         // Alias TrxAmount using cy.wrap()
          })
          // User will logout from the portal and will open CheckIn link
          loginPage.logout()
          cy.get('@precheckinlink').then(precheckinlink => {
            cy.visit(precheckinlink)
          })
          cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
          cy.wait(2000)
      
          //Welcome Page On Precheckin
          cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').wait(5000)
          cy.get('@bookingID').then(bookingID => {
            preCheckIn.validateReferenceNo(bookingID) // Validate Reference Number
          })
          cy.get('@bookingSource').then(bookingSource => {
            preCheckIn.validateSourceType(bookingSource) // Validate Soruce type
          })
          cy.get('@TrxAmount').then(TrxAmount => {
            preCheckIn.validateTxAmount(TrxAmount) // Validate Amount  
          })
          cy.get('@checkInDate').then(checkInDate => {
            preCheckIn.validateCheckinDate(checkInDate) // Validate check In date
          })
          cy.get('@checkOutDate').then(checkOutDate => {
            preCheckIn.validateCheckoutDate(checkOutDate) // Validate CheckOut Date    
          })
          preCheckIn.clickSaveContinue() //Save & Continue
          cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
          cy.wait(3000)
      
          cy.get('@fullName').then(fullName => {
            preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
          })
          cy.get('@email').then(email => {
            preCheckIn.validateEmail(email)             //Validate email
          })
        preCheckIn.addBasicInfo() //Add basic info and move to questionnarie tab
        preCheckIn.fillAndValidatePreCheckinQuestionnier() //fill all questionnarie fields and move to Arrival Tab
    })

    it('CA_PCW_04 > Validate the arrival step', () => {
        const propName = 'Waqas DHA'
        bookingPage.addNewBookingAndValidate(propName, 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        //Validate newly created booking detail with pre-checkin welcome page
        bookingDetailPage.getPrecheckinLinkOnFirstBooking().then(href => {
            cy.wrap(href).as('precheckinlink') // Alias precheckinlink using cy.wrap()
          })
          // Here we will copy and Visit the Pre Check-In process after logout from the portal
          bookingDetailPage.goToBookingDetailPage(propName) // Visit the booking detail page of first booking
          bookingDetailPage.getBookingID().then(text => {
            cy.wrap(text).as('bookingID')         // Alias bookingID using cy.wrap()
          })
          bookingDetailPage.getBookingSource().then(text => {
            cy.wrap(text).as('bookingSource')     // Alias bookingSource using cy.wrap()
          })
          bookingDetailPage.getCheckinDate().then(text => {
            cy.wrap(text).as('checkInDate')       // Alias checkInDate using cy.wrap()
          })
          bookingDetailPage.getCheckOutDate().then(text => {
            cy.wrap(text).as('checkOutDate')      // Alias checkOutDate using cy.wrap()
          })
          bookingDetailPage.getFullName().then(text => {
            cy.wrap(text).as('fullName')          // Alias fullName using cy.wrap()
          })
          bookingDetailPage.getGuestEmail().then(text => {
            cy.wrap(text).as('email')             // Alias email using cy.wrap()
          })
          bookingDetailPage.getTrxAmount().then(text => {
            cy.wrap(text).as('TrxAmount')         // Alias TrxAmount using cy.wrap()
          })
          // User will logout from the portal and will open CheckIn link
          loginPage.logout()
          cy.get('@precheckinlink').then(precheckinlink => {
            cy.visit(precheckinlink)
          })
          cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
          cy.wait(2000)
      
          //Welcome Page On Precheckin
          cy.get('.welcome-guest-header > .mb-0').should('contain', 'Welcome').wait(5000)
          cy.get('@bookingID').then(bookingID => {
            preCheckIn.validateReferenceNo(bookingID) // Validate Reference Number
          })
          cy.get('@bookingSource').then(bookingSource => {
            preCheckIn.validateSourceType(bookingSource) // Validate Soruce type
          })
          cy.get('@TrxAmount').then(TrxAmount => {
            preCheckIn.validateTxAmount(TrxAmount) // Validate Amount  
          })
          cy.get('@checkInDate').then(checkInDate => {
            preCheckIn.validateCheckinDate(checkInDate) // Validate check In date
          })
          cy.get('@checkOutDate').then(checkOutDate => {
            preCheckIn.validateCheckoutDate(checkOutDate) // Validate CheckOut Date    
          })
          preCheckIn.clickSaveContinue() //Save & Continue
          cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
          cy.wait(3000)
      
          cy.get('@fullName').then(fullName => {
            preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
          })
          cy.get('@email').then(email => {
            preCheckIn.validateEmail(email)             //Validate email
          })
        preCheckIn.addBasicInfo() //Add basic info and move to questionnarie tab
        preCheckIn.fillAndValidatePreCheckinQuestionnier() //fill all questionnarie fields and move to Arrival Tab
        preCheckIn.fillAndValidatePreCheckinArrival() //Set arrival method 
    })

    it('CA_PCW_05 > Validate the upload Id card and Credit Card Validation', () => {
        
        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
    })

    it('CA_PCW_06 > Validate the upload Driving License and Credit Card Validation', () => {
        
        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateDrivingDoc() //Add and validate Driving License & Credit card
    })
    it('CA_PCW_07 > Validate Add new Guest functionality', () => {
        
        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
        preCheckIn.takeSelfy() //Add selfy and Move to guest tab
        preCheckIn.addValidateNewGuest() //Add Guest and Validate the changes
    })
    it('CA_PCW_08 > Validate Delete Guest functionality', () => {
        
        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
        preCheckIn.takeSelfy() //Add selfy and click Save & Continue
        preCheckIn.deleteGuest() //First Add and then delete a new guest
    })
    it('CA_PCW_09 > Validate share link for Guest Registration functionality', () => {

        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
        preCheckIn.takeSelfy() //Add selfy and click Save & Continue
        preCheckIn.goToGuestShareLink() //Go to the guest share link of First Incomplete Guest
        preCheckIn.guestRegistration('Waqas DHA') //Fill the guest Registration form and save changes
    })
    it('CA_PCW_10 > Validate share link Guest Registration validations', () => {
        
        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
        preCheckIn.takeSelfy() //Add selfy and click Save & Continue
        preCheckIn.goToGuestShareLink() //Go to the guest share link of First Incomplete Guest
        preCheckIn.guestRegValidations('Waqas DHA') //Validate Guest registration modal fields and add guest data and save changes
    })
    it('CA_PCW_11 > Validate Add guest detail functionality', () => {

        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
        preCheckIn.takeSelfy() //Add selfy and click Save & Continue
        preCheckIn.editGuestDetail('Adult') //Add guest details in First incomplete guest and save changes
    })
    it('CA_PCW_12 > Validate Add Guest detail form validation', () => {

        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
        preCheckIn.takeSelfy() //Add selfy and click Save & Continue
        preCheckIn.addValidateNewGuest() //Add and Validate new guest

    })
    it('CA_PCW_13 > Validate Edit Guest detail functionality', () => {
        
        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
        preCheckIn.takeSelfy() //Add selfy and click Save & Continue
        preCheckIn.editGuestDetail('Adult') //Edit guest details in First incomplete guest and save changes

    })
    it('CA_PCW_14 > Validate change Main guest functionality', () => {
        
        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
        preCheckIn.takeSelfy() //Add selfy and click Save & Continue
        preCheckIn.editGuestDetail('Adult') //Edit guest details in First incomplete guest and save changes
        preCheckIn.setAsMainGuest() //Set the 2nd Complete status guest as Main Guest and save changes
    })
    it('CA_PCW_15 > Validate add on services', () => {
        
        onlineCheckinSettings.applyCollectIdLicenseOriginalSettings() //apply Collect Id license settings
        bookingPage.addNewBookingAndValidate('Waqas DHA', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
        preCheckIn.goToDocVerification() //Get the pre-checkin link and navigate the user to Doc VERIFICATION Tab
        preCheckIn.addAndValidateIdCard() //Add and validate ID & Credit cards
        preCheckIn.takeSelfy() //Add selfy and click Save & Continue
        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').wait(3000).click({ force: true }) //Click Save & Continue to Skip the guest tab
        preCheckIn.validateAllAddOnServices() 
    })

})