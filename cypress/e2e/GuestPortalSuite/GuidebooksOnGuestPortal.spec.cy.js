/// <reference types ="cypress" />

import { LoginPage } from "../../../pageObjects/LoginPage"
import { OnlineCheckinSettings } from "../../../pageObjects/OnlineCheckinSettings"
import { BookingPage } from "../../../pageObjects/BookingPage"
import { PreCheckIn } from "../../../pageObjects/PreCheckIn"
import { BookingDetailPage } from "../../../pageObjects/BookingDetailPage"
import { ReuseableCode } from "../../support/ReuseableCode"
import { GuidebookPage } from "../../../pageObjects/GuidebookPage"
import { Dashboard } from "../../../pageObjects/Dashboard"
import { Guestportal } from "../../../pageObjects/Guestportal"
import { PropertiesPage } from "../../../pageObjects/PropertiesPage"

const loginPage = new LoginPage
const onlineCheckinSettings = new OnlineCheckinSettings
const bookingPage = new BookingPage
const preCheckIn = new PreCheckIn
const bookingDetailPage = new BookingDetailPage
const reuseableCode = new ReuseableCode
const guidebookPage = new GuidebookPage
const dashboard = new Dashboard
const guestportal = new Guestportal
const propertiesPage = new PropertiesPage

describe('Guest Portal Test Cases', () => {

  const loginEmail = Cypress.config('users').user1.username
  const loginPassword = Cypress.config('users').user1.password
  const propName = 'Test Property1'
  const companyName = 'CA'
  const bSource = 'NewBS'
  const guestAddress = '768 G4 Block Road, Block G4 Block G 4 Phase 2 Johar Town, Lahore, Pakistan';
  const postalCode = '54000';

  beforeEach(() => {
    loginPage.happyLogin(loginEmail, loginPassword) //Login to portal
  })
  //Guidebooks On Guest Portal
  it('CA_CAGP_06 > Verify all guidebooks are showing on guest portal as per conditions', { retries: 1 }, () => {
    guidebookPage.goToGuidebook()
    //Disable Guidebook for a property
    guidebookPage.disableGuideBookForProperty('Guidebook 1', propName)

    const adult = reuseableCode.getRandomNumber(1, 7)
    const child = reuseableCode.getRandomNumber(0, 7)
    bookingPage.addNewBookingAndValidate(propName, bSource, adult, child) //Create a new booking and validate (1Adult,0Child)

    bookingPage.getGuestPortalLinkOnBooking(0) //as an alias from first booking
    cy.get('@guestPortalLink').then(guestPortalLink => {
      bookingPage.visitGuestPortalAsClient(guestPortalLink)
    })

    cy.get('#property_guide_book_tab').should('be.visible') //Instructions Heading
    cy.get('[data-target="#property_guide_book_detail_model"]').should('be.visible').and('not.contain.text', 'Guidebook 1') //Guidebook 1 should not be shown

    cy.visit('/client/v2/guide-books')
    guidebookPage.goToGuidebook()
    //Enable Guidebook for a property
    guidebookPage.enableGuideBookForProperty('Guidebook 1', propName)
    cy.get('@guestPortalLink').then(guestPortalLink => {
      bookingPage.visitGuestPortalAsClient(guestPortalLink)
    })
    cy.get('#property_guide_book_tab').should('be.visible') //Instructions Heading
    cy.get('[data-target="#property_guide_book_detail_model"]').should('be.visible').and('contain.text', 'Guidebook 1') //Guidebook 1 should be shown
  })
})
