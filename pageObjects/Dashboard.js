
export class Dashboard {
  goToDashboard() {
    cy.get('.navbar-nav [href*="/dashboard"]').click()
    cy.get('[class="page-title n-dashboard-title"]').should('contain.text', 'Welcome')
  }
  addNewCCinUpcomingBooking(index) {
    cy.get('[id*="add_credit_card_button"]').eq(index).should('exist').click() //The index of the booking from top
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('[id="guest_credit_card_modal"] .modal-title').should('contain.text', 'Guest Credit Card').should('be.visible') //Guest Credit Card
    cy.get('.dot-collision').should('not.exist').wait(3000)
    cy.get('[id*="btn_add_new_guest_card"]').if().should('exist').click().wait(3000) //Add new credit card
    //Add card detail
    /*
    cy.getIframeBody('#card-number-element iframe[name*="__privateStripeFrame"]')
      .find('input[name="cardnumber"]').should('be.visible').type('4242424242424242') //card number
    cy.getIframeBody('#card-expiry-element iframe[name*="__privateStripeFrame"]')
      .find('input[name="exp-date"]').should('be.visible').and('be.enabled').type('1229', { force: true }) // expiry
    cy.getIframeBody('#card-cvc-element iframe[name*="__privateStripeFrame"]')
      .find('input[name="cvc"]').should('be.visible').and('be.enabled').type('123', { force: true })  //cvc
    cy.get('#postal-code').should('be.visible').type('10006') //Postal Code
    */
    cy.get('#card-element').within(() => {
        cy.fillElementsInput('cardNumber', '4242424242424242');
        cy.fillElementsInput('cardExpiry', '1026'); // MMYY
        cy.fillElementsInput('cardCvc', '123');
        cy.fillElementsInput('postalCode', '10006'); 
    })
    cy.wait(2000)
    cy.get('.guest-card-footer [class="btn btn-sm btn-primary px-3"]').if().click() //Save button
    cy.get('[class="modal-dialog modal-dialog-centered"] [class="btn btn-sm btn-primary px-3"]').if().click() //Save & Use
    cy.get('[class="toast toast-success"]').should('contain.text', 'Card') //Success toast
  }
  uploadDocInUpcomingBooking(index) {
    cy.get('.booking-card-info [class="btn btn-xs translate"]:nth-child(2)').eq(index).should('exist').click() //The index of the booking from top
    cy.wait(2000)
    cy.get('[class*="upload-document-wrap"]').eq(0).should('exist').attachFile('Images/idCardFront.png').wait(1000)
    cy.get('[class*="upload-document-wrap"]').eq(1).should('exist').attachFile('Images/idCardBack.png').wait(1000)
    cy.get('[class*="upload-document-wrap"]').eq(2).should('exist').attachFile('Images/visaCard.png').wait(1000)
    cy.get('.modal-footer [class="btn btn-sm btn-primary px-3"]').eq(0).should('contain.text', 'Save').click({ force: true }) //Save changes
    cy.wait(3000)
    cy.get('[class="toast-message"]').if().should('contain.text', 'Image uploaded successfully.') //Success toast
  }
  //Profile
  openProfileModal() {
    cy.get('#dropdownMenuButton').should('exist').click() //Menu icon
    cy.get('.show [data-target="#editFullClient"]').should('contain.text', 'Profile Update').click() //Profile Update
  }
  closeProfileModal(){
    cy.get('#update_client_porfile_modal_close_btn').should('be.visible').click() //close
  }
  getAccountId()
  {
    return cy.get('.profile-accountid strong').should('exist').invoke('text')
  }
  getClientName() {
    return cy.get('#u_name').should('exist').invoke('val')
  }
  getClientEmail() {
    return cy.get('#u_email').should('exist').invoke('val')
  }
  getClientPhone() {
    return cy.get('.updete_full_client_profile_model_left_side [id*="phone-"]').should('exist').invoke('val')
  }
  getClientAddress() {
    return cy.get('#u_address').should('exist').invoke('val')
  }
  getCompanyName() {
    return cy.get('#c_name').should('exist').invoke('val')
  }
  getCompanyEmail() {
    return cy.get('#c_email').should('exist').invoke('val')
  }
  getCompanyPhone() {
    return cy.get('[class*="right_side"] [class="form-group col-12 contact-input"] [id*="phone-"]').should('exist').invoke('val')
  }
  getCompanyAddress() {
    return cy.get('#c_address').should('exist').invoke('val')
  }
  selectPropertyNameBrand() {
    cy.get('[for="propertyName"]').should('contain.text', 'Property Name & Brand') //Option
    cy.get('#propertyName').click() //Select Property Name & Brand
  }
  selectCompanyNameBrand() {
    cy.get('[for="companyName"]').should('contain.text', 'Company Name & Brand') //Option
    cy.get('#companyName').click() //Select Company Name & Brand
  }
  saveProfileChanges() {
    cy.get('.mt-2 [class="btn btn-sm btn-success px-3"]').should('contain.text', 'Save Changes').click() //Save Changes
  }
  checkCCCount(bookingID) {
    cy.get('[class="table-box-check"] div div span').contains(bookingID)
      .parents('.booking-card').find('[id*="add_credit_card_button"]').click()
    cy.get('#guest_credit_card_modal .modal-title').should('contain.text', 'Guest Credit Card') //Validate popup heading
    cy.wait(3000)

    cy.get('#card-element') //this will shown on popup if no card is added yet
      .if().then(() => {
        const numberOfStoreCards = 0 //Number of added cards are 0
        cy.log("Number of cards on popup: " + numberOfStoreCards)
        cy.get('[id="guest_credit_card_modal_close"]').click() //Cancel button
        cy.get('[id*="add_credit_card_button"]').eq(index).invoke('text').then((text) => {
          cy.log(text)
          // Use JavaScript string manipulation to extract the number from the text
          const ccCount = parseInt(text.replace(/\D/g, ''), 10);
          cy.log("The CC Count on the booking: " + ccCount)
          expect(numberOfStoreCards).to.equal(ccCount)
        })
      })
      .else()
      .get('[class="guest-card-wrap"]').its('length').then((count) => { //Count of added CC 
        const numberOfStoreCards = count;
        cy.log("Number of cards on popup: " + numberOfStoreCards)
        cy.get('[id="guest_credit_card_modal_close"]').click() //Close button
        cy.get('[class="table-box-check"] div div span').contains(bookingID)
          .parents('.booking-card').find('[id*="add_credit_card_button"]').invoke('text').then((text) => {
            cy.log(text)
            // Use JavaScript string manipulation to extract the number from the text
            const ccCount = parseInt(text.replace(/\D/g, ''), 10);
            cy.log("The CC Count on the booking: " + ccCount)
            expect(numberOfStoreCards).to.equal(ccCount)
          })
      })
  }
  checkDocCount(bookingID) {
    cy.get('[class="table-box-check"] div div span').contains(bookingID)
      .parents('.booking-card').find('.booking-card-info [class="btn btn-xs translate"]:nth-child(2)').click()
    cy.wait(4000)
    var numberOfUploadedDoc = 0
    cy.get('[class="badge badge-success"]')
      .if().should('exist').its('length').then((count1) => { //Count of uploaded verified documents
        numberOfUploadedDoc = count1;
      })
    cy.get('[class="badge badge-warning"]')
      .if().should('exist').its('length').then((count2) => { //Count of uploaded Pending documents
        numberOfUploadedDoc = numberOfUploadedDoc + count2
        cy.log("Number of Uploaded Documents: " + numberOfUploadedDoc)
      })
    cy.get('[id="closeGuestPopup"]').click().wait(1000) //Close button
    cy.get('[class="table-box-check"] div div span').contains(bookingID)
      .parents('.booking-card').find('.booking-card-info [class="btn btn-xs translate"]:nth-child(2)').invoke('text').then((text) => {
        cy.log(text)
        // Use JavaScript string manipulation to extract the number from the text
        const docCount = parseInt(text.replace(/\D/g, ''), 10);
        cy.log("The Document Count on the booking: " + docCount).wait(1000)
        expect(numberOfUploadedDoc).to.equal(docCount)
      })

  }
}