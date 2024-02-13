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

describe('Test Online CheckIn Settings Functionalities', () => {

  beforeEach(() => {
    cy.visit('/')
    loginPage.happyLogin('', '')
  })
  //Collect Basic Information From Guest 
  it('CA_CBIFG_01 > Collect Basic Information From Guest: Validate When user has Checked all the checkboxes of Collect Basic Detail', () => {
    onlineCheckinSettings.checkAllCollectBasicDetailCheckboxes()
    onlineCheckinSettings.enableAllToggles()
    onlineCheckinSettings.setAllBookingSource()
    const propName = 'QA Test Property'
    bookingPage.addNewBookingAndValidate(propName, 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    
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
    preCheckIn.clickSaveContinue()                //Save & Continue
    //Basic Info
    cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
    cy.wait(3000)

    cy.get('@fullName').then(fullName => {
      preCheckIn.validateFullNameOnWelcome(fullName)  //Validate Full Name
    })
    cy.get('@email').then(email => {
      preCheckIn.validateEmail(email)             //Validate email
    })
    preCheckIn.addBasicInfo() //Add basic info
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION') //Validate ARRIVAL Tab 
  })
  it('CA_CBIFG_02 > Collect Basic Information From Guest: Validate when Collect Basic Information From Guest(s) toggle is disable', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableCollectBasicInfoToggle()
    const propName = 'QA Test Property'
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
    preCheckIn.clickSaveContinue()                //Save & Continue
    
    //Directed to Arrival tab as Basic Info Toggle is OFF
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION') //Validate ARRIVAL Tab Heading
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableCollectBasicInfoToggle() //Revert the settings
  })
  it("CA_CBIFG_03 > Collect Basic Information From Guest: Validate If all items are disabled from collect basic details section then this section will also be disabled and will not show on pre-checkin", () => {
    onlineCheckinSettings.uncheckAllCollectBasicDetailCheckboxes()
    const propName = 'QA Test Property'
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
    preCheckIn.clickSaveContinue()                //Save & Continue
    
    //Directed to Arrival tab as Basic Info options are disabled
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION') //Validate ARRIVAL Tab Heading
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.checkAllCollectBasicDetailCheckboxes() //Revert the settings
  })
  it("CA_CBIFG_04 > Collect Basic Information From Guest: Validate Collect Basic Information From will show only for selected booking source from the list", () => {
    onlineCheckinSettings.selectLimitedBookingSource()
    bookingPage.addNewBookingAndValidate('QA Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    cy.get('.page-title.translate').should('contain', 'Bookings').wait(2000)
    cy.xpath("(//i[@class='fas fa-ellipsis-h'])[2]")
      .click({ force: true })
      cy.get('.show [href*="chargeautomation.com/pre-checkin"]') //Wrap the precheckin link
      .then(($button) => {
        const link = $button.attr('href');
        cy.wrap(link).as('myLink');
        cy.log(link)
        // Go to the first booking detail page
        cy.get('[class*="show"] [href*="/client/v2/booking-detail"]')
          .invoke("removeAttr", "target", { force: true })
          .click({ force: true })
        cy.wait(3000)
        // Here we will get the FullName and Save into Variable
        cy.xpath('(//input[@id="6"])[1]')
          .invoke('val')
          .then((text) => {
            const fName = text;
            cy.wrap(fName).should('eq', fName)
            // Here we will get the Email and Save into Variable
            cy.xpath('(//input[@id="1"])[1]')
              .invoke('val')
              .then((text) => {
                const emailText = text;
                cy.wrap(emailText).should('eq', emailText)
                // User will logout from the portal and will open CheckIn link
                loginPage.logout()
                cy.visit(link)
                cy.wait(4000)
                cy.get('.text-md > span').should('contain', 'Please start Pre Check-in')
                cy.wait(4000)
                // Validate Soruce type
                cy.get('.gp-property-dl > :nth-child(2) > .notranslate')
                  .then(($sour) => {
                    const sourceType = $sour.text().trim()
                    cy.wrap(sourceType).should('eq', sourceType)
                  })
                cy.wait(3000)
                cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
                cy.get('h4 > .translate').should('contain', 'CONTACT INFORMATION')
                cy.wait(3000)
                //Here we will validate Full Name and Email entered during Booking
                cy.xpath('(//input[@id="6"])[1]')
                  .invoke('val')
                  .then((text) => {
                    const fullName = text;
                    cy.wrap(fullName).should('eq', fName)
                    cy.xpath('(//input[@id="1"])[1]')
                      .invoke('val')
                      .then((text) => {
                        const emailAddress = text;
                        cy.wrap(emailAddress).should('eq', emailText)
                        cy.get("label[for='2'] span[class='translate']").should('contain', 'Phone Number')
                        cy.get('.iti__selected-flag').click()
                        cy.get('#iti-0__item-pk').contains('Pakistan (‫پاکستان‬‎)').type('{enter}3047557094')
                        cy.wait(3000)
                        cy.get("h4[data-test='basicguestTitle'] span[class='translate']").should('contain', 'GUESTS')
                        cy.get("label[for='guestAdults'] span[class='translate']").should('contain', 'Adults')
                        cy.get('#guestAdults').invoke('val')
                          .then((text) => {
                            const adults = text;
                            cy.wrap(adults).should('eq', '2')
                          })
                        cy.get("label[for='guestChildren'] span[class='translate']").should('contain', 'Children (2-17 years)')
                        cy.get('[data-test="basicChildrenInput"]').invoke('val')
                          .then((text) => {
                            const child = text;
                            cy.wrap(child).should('eq', '1')
                          })
                        cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
                        cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION')
                        cy.visit('/')
                        loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
                        onlineCheckinSettings.checkAllCollectBasicDetailCheckboxes() //Revert the settings
                      })
                  })
              })
          })
      })
  })
  //Collect Arrival time & arrival method
  it("CA_CITG_01 > Collect Arrival time & arrival method: If Collect Arrival time & Arrival Method is OFF then it will not show on pre-checkin", () => {
    onlineCheckinSettings.checkAllCollectBasicDetailCheckboxes() 
    onlineCheckinSettings.disableCollectArrivaltimeToggle() 
    onlineCheckinSettings.enableGuestPassportIDToggle()
    bookingPage.addNewBookingAndValidate('QA Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Here Arrival Method option is OFF user will be directed to VERIFICATION tab
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload copy of valid Driver License') //Validate the heading
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableCollectArrivaltimeToggle() //Revert the settings
  })
  it("CA_CITG_02 > Collect Arrival time & arrival method: If Booking's channel of Arrival source is not matching with selected booking source then this section will not show", () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setArrivalByMethod('Direct') //Set arrival by method
    bookingPage.addNewBookingAndValidate('QA Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    // As the arrival source is mismatch Hence Arrival Tab will not be shown, user will be on VERIFICATION tab
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload copy of valid Driver License') //Validate the heading
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setArrivalByMethod('All Booking Source') //Revert the settings
  })
  it('CA_CITG_03 > Collect Arrival time & arrival method: Default "Estimate Arrival Time" should be 16:00 property "Standard Check-In" If available', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setArrivalByMethod('All Booking Source')
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000) //Validate Heading
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time')
    cy.get("#standard_check_in_time").should('contain', '4:00')
  })
  //Collect Passport/ID of Guest
  it('CA_CPIG_01 > Collect Passport/ID of Guest: Validate If Collect Passport/ID of Guest section is OFF then it will not show on pre-checkin', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableGuestPassportIDToggle()
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL TAB
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    //On VERIFICATION tab only DRIVING License option will be shown
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload copy of valid Driver License').wait(1000) 
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableGuestPassportIDToggle() //Revert the settings
  })
  it('CA_CPIG_02 > Collect Passport/ID of Guest: Validate If Collect Passport/ID of Guest section Bookings channel is not matching with selected booking source then this section will not show', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('Direct')
    onlineCheckinSettings.enableGuestPassportIDToggle()
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL TAB
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    //On VERIFICATION tab only DRIVING License option will be shown as the Booking Source is different
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload copy of valid Driver License').wait(1000) 
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source') //Revert the settings
  })
  it('CA_CPIG_03 > Collect Passport/ID of Guest: If Select acceptable identification types is Drivers License or ID Card then front and back document will appear', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setArrivalByMethod('All Booking Source')
    onlineCheckinSettings.selectLicenseAndIDcard()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source')
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL TAB
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Contine
    //On VERIFICATION tab 
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload copy of valid Driver License')
    cy.get('[for="drivers_license"]').should('contain', "Driver's License")
    cy.get('[for="id_card"]').should('contain', 'ID Card')
    cy.get('.doc-wrap > :nth-child(2) > div > .btn').should('contain', "Upload Driver's License Front")
    cy.get(':nth-child(3) > div > .btn').should('contain', "Upload Driver's License Back")
    cy.get('#id_card').should('not.be.checked').click({ force: true }).wait(2000)
    cy.xpath('//label[normalize-space()="Upload ID Card Front"]').should('contain', 'Upload ID Card Front')
    cy.xpath('//label[normalize-space()="Upload ID Card Back"]').should('contain', 'Upload ID Card Back')
  })
  it('CA_CPIG_04 > Collect Passport/ID of Guest: If Select acceptable identification types is passport then it will show single file upload option', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setArrivalByMethod('All Booking Source')
    onlineCheckinSettings.selectPassportOnly()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source')
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL Tab
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //Validate VERIFICATION tab, shows only passport option to upload
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload copy of valid Driver License')
    cy.get("label[for='passport_file'] span span[class='notranslate']").should('contain', 'Upload Passport')
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.selectLicenseAndIDcard() //Revert the settings
  })
  it('CA_CPIG_05 > Collect Passport/ID of Guest: If passport is select for upload and guest nationality belongs to excluded nationality then this section will not show or passport upload option will not show', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setArrivalByMethod('All Booking Source')
    onlineCheckinSettings.selectPassportOnly() //Enable toggle and select only passport option
    onlineCheckinSettings.setPassportExemptedCountry('Pakistan') //Set exempted country
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL Tab
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //VERIFICATION tab
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload copy of valid Driver License')
    cy.wait(3000)
    const cardImage = 'Images/visaCard.png'
    cy.get("#credit_card_file")
      .attachFile(cardImage)
    cy.wait(5000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true })
    cy.get('div[class="gp-box gp-box-of-inner-pages"] p:nth-child(1)').should('have.text', 'Take a selfie to authenticate your identity')
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableGuestPassportIDToggle()
    onlineCheckinSettings.removePassportExemptedCountry() //Revert the settings
  })
  it('CA_CPIG_06 > Collect Passport/ID of Guest: Validate Document upload instructions should be visible on the pre-checkin', () => {
    onlineCheckinSettings.setDocInstructions() 
    onlineCheckinSettings.setArrivalByMethod('All Booking Source')
    onlineCheckinSettings.enableGuestPassportIDToggle()
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL Tab
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //VERIFICATION Tab
    cy.get("div[class='form-section-title'] h4").should('contain', 'Upload copy of valid Driver License')
    cy.wait(3000)
    cy.get("div[class='document-instruction'] span[class='translate']").should('have.text', 'Document Upload Instructions')
    cy.get("pre[class='translate']").should('contain', 'Please Upload Your Valid Document here...')
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.removeDocInstructions() //Revert the settings
  })
  //"Collect Credit Card Scan of Guest" 
  it('CA_CGCC_01 > "Collect Credit Card Scan of Guest": This section will be mandatory and guest will not move without uploading document', () => {
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableGuestPassportIDToggle()
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL Tab
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //On VERIFICATION Tab, Only Credit card will be required as "Guest ID/Passport" toggle is OFF
    cy.get("p[class='upload-title'] span[class='translate']").should('contain', 'CREDIT CARD') //CREDIT CARD title
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }).wait(2000) //Save & Continue
    cy.get("small[class='form-text text-danger my-0'] span[class='translate']").should('contain', 'Credit card is required.') //Validate error
    const cardImage = 'Images/visaCard.png'
    cy.get("#credit_card_file").attachFile(cardImage) //Upload credit card
    cy.wait(5000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    cy.get('div[class="gp-box gp-box-of-inner-pages"] p:nth-child(1)').should('have.text', 'Take a selfie to authenticate your identity') //SELFY Tab
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableGuestPassportIDToggle() //Revert the settings
  })
  it('CA_CGCC_02 > "Collect Credit Card Scan of Guest": If Bookings channel is not matching with selected booking source then this section will not show', () => {
    onlineCheckinSettings.setCollectCreditCardScanofGuestSource('Direct')
    onlineCheckinSettings.disableGuestPassportIDToggle()
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL Tab
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //As the booking source is different VERIFICATION Tab will not tbe shown
    cy.get('div[class="gp-box gp-box-of-inner-pages"] p:nth-child(1)').should('have.text', 'Take a selfie to authenticate your identity') //SELFY Tab
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.setCollectCreditCardScanofGuestSource('All Booking Source')
    onlineCheckinSettings.enableCreditCardScanOfGuestToggle()
    onlineCheckinSettings.enableGuestPassportIDToggle() //Revert the settings
  })
  //Collect Digital Signature
  it('CA_CDS_01 > Collect Digital Signature: If this section is OFF then it will not show on pre-checkin',()=>{
    onlineCheckinSettings.setCollectDigitalSignatureSource('All Booking Source')
    onlineCheckinSettings.adultChildrenBabiesWithPrimaryGuest()
    onlineCheckinSettings.disableCollectDigitalSignatureToggle()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source')
    onlineCheckinSettings.selectLicenseAndIDcard()
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL Tab
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //VERIFICATION Tab
    preCheckIn.addIDAndCreditCard() //Add ID and Credit card
    preCheckIn.takeSelfy() 
    //Guest Detail Tab
    cy.get('.form-section-title h4').should('contain.text','Guest Details') //Validate heading
    cy.wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //AddOns Services
    cy.get('h3[class="lead fw-500 mb-0 header-with-checkbox"]').should('contain.text','Available Add-on Services') //Validate Heading
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //Credit Card
    preCheckIn.addCreditCardInfo()
    //On Summary Screen Signature section will not be shown
    cy.get('div[id="signaturePad-wrapper"] canvas').should('not.exist') //Validate that Canvas Exist
    
  })
  it('CA_CDS_02 > Collect Digital Signature: If Bookings channel is not matching with selected booking source then this section will not show',()=>{
    onlineCheckinSettings.setCollectDigitalSignatureSource('Direct')
    onlineCheckinSettings.enableCollectDigitalSignatureToggle()
    onlineCheckinSettings.adultChildrenBabiesWithPrimaryGuest()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source')
    onlineCheckinSettings.selectLicenseAndIDcard()
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL Tab
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //VERIFICATION Tab
    preCheckIn.addIDAndCreditCard() //Add ID and Credit card
    preCheckIn.takeSelfy() 
    //Guest Detail Tab
    cy.get('.form-section-title h4').should('contain.text','Guest Details') //Validate heading
    cy.wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //AddOns Services
    cy.get('h3[class="lead fw-500 mb-0 header-with-checkbox"]').should('contain.text','Available Add-on Services') //Validate Heading
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //Credit Card
    preCheckIn.addCreditCardInfo()
    //On Summary Screen Signature section will not be shown as booking source is different
    cy.get('div[id="signaturePad-wrapper"] canvas').should('not.exist').wait(1000) //Validate that Canvas Exist
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.setCollectDigitalSignatureSource('All Booking Source')  //Revert the settings
  })
  it('CA_CDS_03 > Collect Digital Signature: This section will be mandatory and guest will not move without signing document',()=>{
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.setCollectPassportIDofGuestSource('All Booking Source')
    onlineCheckinSettings.setCollectDigitalSignatureSource('All Booking Source') 
    onlineCheckinSettings.enableCollectDigitalSignatureToggle()
    onlineCheckinSettings.adultChildrenBabiesWithPrimaryGuest()
    onlineCheckinSettings.selectLicenseAndIDcard()
    onlineCheckinSettings.enableCollectAcceptanceTermsConditionToggle()
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    preCheckIn.addBasicInfo() //Add basic info and click next
    //Validate ARRIVAL Tab
    cy.get('div[class="form-section-title mb-2"] h4').should('have.text', 'ARRIVAL INFORMATION').wait(3000)
    cy.get('label[for="standard_check_in_time"]').should('have.text', 'Estimate Arrival Time').wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //VERIFICATION Tab
    preCheckIn.addIDAndCreditCard() //Add ID and Credit card
    preCheckIn.takeSelfy() 
    //Guest Detail Tab
    cy.get('.form-section-title h4').should('contain.text','Guest Details') //Validate heading
    cy.wait(3000)
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //AddOns Services
    cy.get('h3[class="lead fw-500 mb-0 header-with-checkbox"]').should('contain.text','Available Add-on Services') //Validate Heading
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    //Credit Card
    preCheckIn.addCreditCardInfo()
    //On Summary Screen user not save wihout adding Signature
    cy.get('div[id="signaturePad-wrapper"] canvas').should('exist') //Validate that Canvas Exist
    cy.get('[id="customCheck2"]').should('exist').check({force:true}) //Check terms & conditions
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible').click({ force: true }) //Save & Continue
    cy.get('.toast-message').should('contain.text','Digital Signature is required').wait(1000) //Error will be shown as signatures are missing
  })
  //Terms and Conditions
  it('CA_TC_001 > Terms and Conditions: If this section is OFF then terms and conditions checkbox will not show on pre-checkin', ()=>{
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    //As all toggles are OFF user will be directed to Credit card tab
    preCheckIn.addCreditCardInfo()
    //On Summary Screen validate the heading
    cy.get('.page-title > .translate').should('contain.text','Your Summary')
    cy.get('[id="customCheck2"]').should('not.exist') //terms & conditions check will not be shown
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible') //Save & Continue
    
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.enableAllToggles() //revert the settings
  })
  it('CA_TC_002 > Terms and Conditions: If Property source is not matching with selected booking property then this section will not show', ()=>{
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.enableCollectAcceptanceTermsConditionToggle()
    onlineCheckinSettings.setTermsConditionSource('Direct')
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    //As all toggles are OFF user will be directed to Credit card tab
    preCheckIn.addCreditCardInfo()
    //On Summary Screen validate the heading
    cy.get('.page-title > .translate').should('contain.text','Your Summary')
    cy.get('[id="customCheck2"]').should('not.exist') //Terms & conditions check will not be shown
    cy.get('[data-test="precheckinSaveBtnOne"]').should('be.visible') //Save & Continue
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.setTermsConditionSource('All Booking Source')
    onlineCheckinSettings.enableAllToggles()
  })
  it('CA_TC_003 > Terms and Conditions: This section will be mandatory and guest will not move without signing document', ()=>{
    onlineCheckinSettings.goToOnlineCheckinSettings()
    onlineCheckinSettings.disableAllToggle()
    onlineCheckinSettings.enableCollectAcceptanceTermsConditionToggle()
    bookingPage.addNewBookingAndValidate('Test Property', 'TEST_PMS_NO_PMS', 2, 1) //Create a new booking and validate (2Adult,1Child)
    preCheckIn.goToBasicInfoTab() //Get and visit the precheckin link navigate to Basic info
    //As all toggles are OFF user will be directed to Credit card tab
    preCheckIn.addCreditCardInfo()
    //On Summary Screen validate the heading
    cy.get('.page-title > .translate').should('contain.text','Your Summary')
    cy.get('[id="customCheck2"]').should('exist') //Terms & conditions check will be shown
    cy.get('[data-test="precheckinSaveBtn"]').should('not.be.enabled')//Save & Continue
    cy.visit('/')
    loginPage.happyLogin('automationca2@yopmail.com', 'Boring321')
    onlineCheckinSettings.setTermsConditionSource('All Booking Source')
    onlineCheckinSettings.enableAllToggles()
  })

})

