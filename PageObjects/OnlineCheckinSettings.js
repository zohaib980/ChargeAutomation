

export class OnlineCheckinSettings {

  goToBasicInfoSettings() {
    cy.xpath("(//a[@id='navbarDropdown'])[4]").click() //Setting nav
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Precheckin
    cy.get('.page-title').should('contain.text','Online Check-In') //Validate Page Heading
    cy.scrollTo('top')
    cy.wait(2000)
    //Click on Collect Basic info setting icon
    cy.get('#edit-guest-exp2').click().wait(2000).then(()=>
    {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
      .if('visible')
      .else().then(()=>{
        cy.get('#edit-guest-exp2').click()
      })
    })

    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Basic Information From Guest(s)']")
      .should('contain', 'Collect Basic Information From Guest(s)') //Validate the heading
  }
  applyBasicInfoOriginalSettings() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest1'] span").should('contain', 'All Guests (Adult, Children and Babies)')
    cy.get('#pGuest1').click({ force: true }) //Click on All Guests (Adult, Children and Babies)
    cy.get("label[for='whenConsideredCompleted0'] span").should('contain', 'When primary guest completes it')
    cy.get('#whenConsideredCompleted0').click() //Click on When primary guest completes it
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  setArrivalByMethod(method) {
    this.enableCollectArrivaltimeToggle()
    cy.get('.page-title').should('contain.text','Online Check-In') //Validate Page Heading
    cy.scrollTo('top')
    cy.wait(2000)
    //Click to open the "Collect Arrival time/method" modal
    cy.get('#edit-guest-exp3').click().wait(2000).then(()=>
    {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
      .if('visible')
      .else().then(()=>{
        cy.get('#edit-guest-exp3').click()
      })
    })

    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Arrival time & arrival method']").should('contain', 'Collect Arrival time & arrival method')//Validate heading
    cy.get('#accordion-online-checkin-sources-section > .card-body > .multiselect > .multiselect__tags').type('{backspace}').wait(1000).type(method + '{enter}') //clear and Add new method
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  applyCollectIdLicenseOriginalSettings() {
    cy.xpath("(//a[@id='navbarDropdown'])[4]").click()
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true })
    cy.scrollTo('top')
    //Collect Passport ID of guest
    cy.get('#edit-guest-exp5').click().wait(2000).then(()=>
    {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
      .if('visible')
      .else().then(()=>{
        cy.get('#edit-guest-exp5').click()
      })
    })
    
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']").should('contain', 'Collect Passport/ID of Guest')
    cy.get("#ver-doc-types17").then(checkbox => {
      if (!checkbox.is(':checked')) {
        cy.get("#ver-doc-types17").check() //Check Driver License
      }
    })
    cy.get("#ver-doc-types19").then(checkbox => {
      if (!checkbox.is(':checked')) {
        cy.get("#ver-doc-types19").check() //Check ID Card
      }
    })
    cy.get("label[for='ver-doc-types18'] span").should('contain', 'Passport')
    cy.get("#ver-doc-types18").then(checkbox => {
      if (checkbox.is(':checked')) {
        cy.get("#ver-doc-types18").uncheck() //Uncheck Passport
      }
    })
    cy.xpath("//span[normalize-space()='Only Primary Guest']").should('contain', 'Only Primary Guest')
    cy.xpath("(//input[@id='whoIsRequiredIdentity3'])[1]").click({ force: true }) //Select "Only Primary Guest" option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  selectLicenseAndIDcard() {
    this.enableGuestPassportIDToggle()
    cy.get('#edit-guest-exp5').click().wait(2000).then(()=>
    {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
      .if('visible')
      .else().then(()=>{
        cy.get('#edit-guest-exp5').click()
      })
    })
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']").should('contain', 'Collect Passport/ID of Guest') //Validate heading
    cy.xpath("//label[@for='ver-doc-types19']//span[1]").should('contain', "Driver's License")
    cy.get('#ver-doc-types19').should('exist').check({force:true}) // enable Driver's License
    cy.get("label[for='ver-doc-types18'] span").should('contain', 'Passport')
    cy.get("#ver-doc-types18").should('exist').check({force:true}) //Check passport option
    cy.get('[id="accordion-online-checkin-basic-detailscheckbox"] [class="multiselect__tags"]').should('exist').type('{backspace}{backspace}') //Clear added passport list
    cy.get("#ver-doc-types18").should('exist').uncheck({force:true}) //Uncheck passport option
    cy.xpath("//span[normalize-space()='ID Card']").should('contain', 'ID Card')
    cy.get("#ver-doc-types17").should('exist').check({force:true})  //Enable ID option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  selectPassportOnly() {
    this.enableGuestPassportIDToggle()
    //Open "Collect Passport/ID of Guest" modal
    cy.get('#edit-guest-exp5').click().wait(2000).then(()=>
    {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
      .if('visible')
      .else().then(()=>{
        cy.get('#edit-guest-exp5').click()
      })
    })
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']").should('contain', 'Collect Passport/ID of Guest') //Validate heading
    cy.xpath("//label[@for='ver-doc-types19']//span[1]").should('contain', "Driver's License")
    cy.get('#ver-doc-types19').should('exist').uncheck() // Disable Driver's License
    cy.get("label[for='ver-doc-types18'] span").should('contain', 'Passport')
    cy.get("#ver-doc-types18").should('exist').check() //enable passport option
    cy.xpath("//span[normalize-space()='ID Card']").should('contain', 'ID Card')
    cy.get("#ver-doc-types17").should('exist').uncheck()  //Unckeck ID option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  setPassportExemptedCountry(country) {
    cy.get("#edit-guest-exp5").click() //Open "Collect Passport/ID of Guest" modal
    cy.wait(2000)
    cy.get(':nth-child(2) > .multiselect > .multiselect__tags').should('exist').type('{backspace}').wait(1000).type(country + '{enter}') //Select country
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  removePassportExemptedCountry() {
    cy.get("#edit-guest-exp5").click().wait(2000).click() //Open "Collect Passport/ID of Guest" modal
    cy.wait(2000)
    cy.get(':nth-child(2) > .multiselect > .multiselect__tags').should('exist').type('{backspace}{backspace}{backspace}').wait(1000)
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  setDocInstructions(){
    cy.xpath("(//a[@id='navbarDropdown'])[4]").click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('contain.text','Online Check-In') //Validate Page Heading
    cy.scrollTo('top')
    cy.wait(2000)
    cy.get("#edit-guest-exp5").click().wait(2000).click() //Open "Collect Passport/ID of Guest" modal
    cy.wait(1000)
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']").should('contain', 'Collect Passport/ID of Guest') //Validate heading
    cy.get("textarea[placeholder='Leave blank if you do not have any special instruction']").clear().type("Please Upload Your Valid Document here...") //Add instructions
    cy.xpath("(//input[@id='whoIsRequiredIdentity3'])[1]").click( {force: true} ) //Select Only Primary Guest option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  removeDocInstructions(){
    cy.xpath("(//a[@id='navbarDropdown'])[4]").click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('contain.text','Online Check-In') //Validate Page Heading
    cy.scrollTo('top')
    cy.wait(2000)
    cy.get("#edit-guest-exp5").click().wait(2000).click() //Open "Collect Passport/ID of Guest" modal
    cy.wait(1000)
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']").should('contain', 'Collect Passport/ID of Guest') //Validate heading
    cy.get("textarea[placeholder='Leave blank if you do not have any special instruction']").clear() //clear instructions
    cy.xpath("(//input[@id='whoIsRequiredIdentity3'])[1]").click( {force: true} ) //Select Only Primary Guest option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  applySelectOnlyPrimaryGuestSettings() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest0'] span").should('contain', 'Only Primary Guest') //Only Primary Guest
    cy.get("#pGuest0").click() //Select Only Primary Guest
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  adultChildrenBabiesWithPrimaryGuest() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest1'] span").should('contain', 'All Guests (Adult, Children and Babies)')
    cy.get("#pGuest1").click({ force: true })
    cy.get("label[for='whenConsideredCompleted0'] span").should('contain', 'When primary guest completes it')
    cy.get("a[class='btn btn-success btn-sm px-3']").click()
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  adultChildrenBabiesWithAllRequiredGuest() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest1'] span").should('contain', 'All Guests (Adult, Children and Babies)')
    cy.get("#pGuest1").click({ force: true }) //select "All Guests (Adult, Children and Babies)" option
    cy.get("label[for='whenConsideredCompleted1'] span").should('contain', 'When all required guests complete it') //Validate option
    cy.get('input[id="whenConsideredCompleted1"]').click() //Select "When all required guests complete it" option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  allGuestOver18WithPrimary() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest2'] span").should('contain', 'All Guests (Over 18)')
    cy.get('#pGuest2').click({ force: true }) //All guest over 18
    cy.get('[id="whenConsideredCompleted0"]').click({ force: true }) //When primary guest completes it
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //save button
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  allGuestOver18WithAll() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest2'] span").should('contain', 'All Guests (Over 18)')
    cy.get('#pGuest2').click({ force: true }) //All guest over 18
    cy.get("label[for='whenConsideredCompleted1'] span").should('contain', 'When all required guests complete it')
    cy.get('#whenConsideredCompleted1').click({ force: true })
    cy.get("a[class='btn btn-success btn-sm px-3']").click()
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  selectWhenAllGuestRequired() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest1'] span").should('contain', 'All Guests (Adult, Children and Babies)')
    cy.get("#pGuest1").click({ force: true })
    cy.get("label[for='whenConsideredCompleted1'] span").should('contain', 'When all required guests complete it')
    cy.get("#whenConsideredCompleted1").click()
    cy.get("a[class='btn btn-success btn-sm px-3']").click()
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  allGuestOver18UploadID() {
    cy.xpath("(//a[@id='navbarDropdown'])[4]").click()
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true })
    cy.get('.page-title').should('contain.text','Online Check-In') //Validate Page Heading
    cy.scrollTo('top')
    cy.get("#edit-guest-exp5").click({ force: true }).wait(2000)
    cy.get("#edit-guest-exp5").click({ force: true })
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']")
      .should('contain', 'Collect Passport/ID of Guest')
    cy.get("#ver-doc-types17").then(checkbox => {
      if (!checkbox.is(':checked')) {
        cy.get("#ver-doc-types17").check()
      }
    })
    cy.get("#ver-doc-types19").then(checkbox => {
      if (checkbox.is(':checked')) {
        cy.get("#ver-doc-types19").uncheck()
      }
    })
    cy.get("label[for='ver-doc-types18'] span").should('contain', 'Passport')
    cy.get("#ver-doc-types18").then(checkbox => {
      if (checkbox.is(':checked')) {
        cy.get("#ver-doc-types18").uncheck()
      }
    })
    cy.xpath("//span[normalize-space()='All Guests (Over 18)']").should('contain', 'All Guests (Over 18)')
    cy.xpath("(//input[@id='whoIsRequiredIdentity3'])[2]").click({ force: true })
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  checkAllCollectBasicDetailCheckboxes() {
    this.goToBasicInfoSettings()
    cy.wait(2000)
    cy.xpath("//span[normalize-space()='Full Name']").should('contain', 'Full Name')
    cy.get("li:nth-child(1) label:nth-child(1) input:nth-child(1)").should('exist').check() //Check if not checked
    cy.xpath("//span[normalize-space()='Phone Number']").should('contain', 'Phone Number')
    cy.get("li:nth-child(2) label:nth-child(1) input:nth-child(1)").should('exist').check() //Check if not checked
    cy.xpath("//span[normalize-space()='Date of Birth']").should('contain', 'Date of Birth')
    cy.get("li:nth-child(3) label:nth-child(1) input:nth-child(1)").should('exist').check() //Check if not checked
    cy.xpath("//span[normalize-space()='Nationality']").should('contain', 'Nationality')
    cy.get("li:nth-child(4) label:nth-child(1) input:nth-child(1)").should('exist').check() //Check if not checked
    cy.xpath("//span[normalize-space()='Email Address']").should('contain', 'Email Address')
    cy.get("li:nth-child(5) label:nth-child(1) input:nth-child(1)").should('exist').check() //Check if not checked
    cy.xpath("//span[normalize-space()='Gender']").should('contain', 'Gender')
    cy.get("li:nth-child(6) label:nth-child(1) input:nth-child(1)").should('exist').check() //Check if not checked
    cy.xpath("//span[normalize-space()='Address']").should('contain', 'Address')
    cy.get("li:nth-child(7) label:nth-child(1) input:nth-child(1)").should('exist').check() //Check if not checked
    cy.xpath("//span[normalize-space()='Zip Code']").should('contain', 'Zip Code')
    cy.get("li:nth-child(8) label:nth-child(1) input:nth-child(1)").should('exist').check() //Check if not checked
    cy.xpath("//span[normalize-space()='Adults & Children']").should('contain', 'Adults & Children')
    cy.get("li:nth-child(9) label:nth-child(1) input:nth-child(1)").should('exist').check() //Check if not checked
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  uncheckAllCollectBasicDetailCheckboxes() {
    this.goToBasicInfoSettings()
    cy.wait(2000)
    cy.xpath("//span[normalize-space()='Full Name']").should('contain', 'Full Name')
    cy.get("li:nth-child(1) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Phone Number']").should('contain', 'Phone Number')
    cy.get("li:nth-child(2) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Date of Birth']").should('contain', 'Date of Birth')
    cy.get("li:nth-child(3) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Nationality']").should('contain', 'Nationality')
    cy.get("li:nth-child(4) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Email Address']").should('contain', 'Email Address')
    cy.get("li:nth-child(5) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Gender']").should('contain', 'Gender')
    cy.get("li:nth-child(6) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Address']").should('contain', 'Address')
    cy.get("li:nth-child(7) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Zip Code']").should('contain', 'Zip Code')
    cy.get("li:nth-child(8) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Adults & Children']").should('contain', 'Adults & Children')
    cy.get("li:nth-child(9) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  selectLimitedBookingSource() {
    this.goToBasicInfoSettings()
    cy.wait(2000)
    cy.xpath("//span[normalize-space()='Full Name']").should('contain', 'Full Name')
    cy.get("li:nth-child(1) label:nth-child(1) input:nth-child(1)").should('exist').check()
    cy.xpath("//span[normalize-space()='Phone Number']").should('contain', 'Phone Number')
    cy.get("li:nth-child(2) label:nth-child(1) input:nth-child(1)").should('exist').check()
    cy.xpath("//span[normalize-space()='Email Address']").should('contain', 'Email Address')
    cy.get("li:nth-child(5) label:nth-child(1) input:nth-child(1)").should('exist').check()
    cy.xpath("//span[normalize-space()='Adults & Children']").should('contain', 'Adults & Children')
    cy.get("li:nth-child(9) label:nth-child(1) input:nth-child(1)").should('exist').check()
    cy.xpath("//span[normalize-space()='Date of Birth']").should('contain', 'Date of Birth')
    cy.get("li:nth-child(3) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Nationality']").should('contain', 'Nationality')
    cy.get("li:nth-child(4) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Gender']").should('contain', 'Gender')
    cy.get("li:nth-child(6) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Address']").should('contain', 'Address')
    cy.get("li:nth-child(7) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()
    cy.xpath("//span[normalize-space()='Zip Code']").should('contain', 'Zip Code')
    cy.get("li:nth-child(8) label:nth-child(1) input:nth-child(1)").should('exist').uncheck()

    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }

  //Setting sources
  setCollectPassportIDofGuestSource(bookingSource) {
    this.enableGuestPassportIDToggle()
    cy.get('#edit-guest-exp5').click().wait(2000).then(()=>
    {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
      .if('visible')
      .else().then(()=>{
        cy.get('#edit-guest-exp5').click()
      })
    })
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']").should('contain', 'Collect Passport/ID of Guest') //modal heading
    
    cy.get("#accordion-online-checkin-sources-section > .card-body > .multiselect > .multiselect__tags")
      .type('{backspace}').wait(1000).type(bookingSource + '{enter}') //set booking source
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  setCollectCreditCardScanofGuestSource(bookingSource){
    cy.xpath("(//a[@id='navbarDropdown'])[4]").click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('contain.text','Online Check-In') //Validate Page Heading
    cy.scrollTo('top')
    //Open "Collect Credit Card Scan of Guest" modal
    cy.get('#edit-guest-exp6').click().wait(2000).then(()=>
    {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
      .if('visible')
      .else().then(()=>{
        cy.get('#edit-guest-exp6').click()
      })
    })
    cy.get("#accordion-online-checkin-sources-section > .card-body > .multiselect > .multiselect__tags").type('{backspace}').wait(1000).type(bookingSource+'{enter}')
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  setCollectDigitalSignatureSource(bookingSource){
    cy.xpath("(//a[@id='navbarDropdown'])[4]").click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('contain.text','Online Check-In') //Validate Page Heading
    cy.scrollTo('top')
    //Open "Collect digital signature" modal
    cy.get('#edit-guest-exp9').click().wait(2000).then(()=>
    {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
      .if('visible')
      .else().then(()=>{
        cy.get('#edit-guest-exp9').click()
      })
    })
    
    cy.get("#accordion-online-checkin-sources-section > .card-body > .multiselect > .multiselect__tags").type('{backspace}').wait(1000).type(bookingSource+'{enter}')
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  setTermsConditionSource(bookingSource){
    cy.xpath("(//a[@id='navbarDropdown'])[4]").click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('contain.text','Online Check-In') //Validate Page Heading
    cy.scrollTo('top')
    //Open "Collect Acceptance of Terms & Conditions" modal
    cy.get(':nth-child(9) > .toggle-card-content > .row > .col-12 > .mb-0 > .edit-guest-exp > .fas').click().wait(2000).then(()=>
    {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
      .if('visible')
      .else().then(()=>{
        cy.get(':nth-child(9) > .toggle-card-content > .row > .col-12 > .mb-0 > .edit-guest-exp > .fas').click()
      })
    })
    cy.get("#accordion-online-checkin-sources-section > .card-body > .multiselect > .multiselect__tags").type('{backspace}').wait(1000).type(bookingSource+'{enter}')
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
  }
  setAllBookingSource()
  {
    cy.xpath("(//a[@id='navbarDropdown'])[4]").click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('contain.text','Online Check-In') //Validate Page Heading
    cy.scrollTo('top')
    //Select all options sequentialy and set Booking source as AllBookingSource
    var count = 11
    for (let i=0; i<count; i++)
    {
    cy.get('[id*="edit-guest-exp"][class*="cursor-pointer"]').eq(i).click('right').wait(2000).then(()=>
    {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
      .if('visible')
      .else().then(()=>{
        cy.get('[id*="edit-guest-exp"][class*="cursor-pointer"]').eq(i).click('right') //if modal not open click again
      })
      //Type AllBookingSource
      cy.get('.ge-select-bs [class="multiselect__tags"]').should('exist').type('{backspace}').wait(1000).type('All Booking Source'+'{enter}')
      cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully.') //Success toast
    })
    }

  }


  //Enable/Disable toggles
  goToOnlineCheckinSettings()
  {
    cy.xpath("(//a[@id='navbarDropdown'])[4]").click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin option
    cy.get('.page-title').should('contain.text','Online Check-In') //Validate Page Heading
    cy.scrollTo('top').wait(2000)
  }
  enableAllToggles()
  {
    this.enableCollectBasicInfoToggle()
    this.enableCollectArrivaltimeToggle()
    this.enableGuestPassportIDToggle()
    this.enableCreditCardScanOfGuestToggle()
    this.enableSelfiePictureToggle()
    this.enableOfferAddonUpsellsToggle()
    this.enableCollectDigitalSignatureToggle()
    this.enableCollectAcceptanceTermsConditionToggle()
  }
  disableAllToggle(){
    this.disableCollectBasicInfoToggle()
    this.disableCollectArrivaltimeToggle()
    this.disableGuestPassportIDToggle()
    this.disableCreditCardScanOfGuestToggle()
    this.disableSelfiePictureToggle()
    this.disableOfferAddonUpsellsToggle()
    this.disableCollectDigitalSignatureToggle()
    this.disableCollectAcceptanceTermsConditionToggle()
  }
  enableCollectBasicInfoToggle() {
    cy.wait(1000)
    cy.get('input[name="Collect Basic Information From Guest(s)"][value="0"]').if().should('exist').then(() => {
      cy.get(':nth-child(2) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is disabled then enable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully') //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  disableCollectBasicInfoToggle() {
    cy.wait(1000)
    cy.get('input[name="Collect Basic Information From Guest(s)"][value="1"]').if().should('exist').then(() => {
      cy.get(':nth-child(2) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is enabled then disable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully').wait(2000) //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    }) 
  }
  enableCollectArrivaltimeToggle() {
    cy.wait(1000)
    cy.get('input[name="Collect Arrival time & arrival method"][value="0"]').if().should('exist').then(() => {
      cy.get(':nth-child(3) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is disbaled then enable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully') //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  disableCollectArrivaltimeToggle() {
    cy.wait(1000)
    cy.get('input[name="Collect Arrival time & arrival method"][value="1"]').if().should('exist').then(() => {
      cy.get(':nth-child(3) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is enabled then disable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully').wait(2000) //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  enableGuestPassportIDToggle() {
    cy.wait(1000)
    cy.get('input[name="Collect Passport/ID of Guest"][value="0"]').if().should('exist').then(() => {
      cy.get(':nth-child(4) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is disabled then enable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully') //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  disableGuestPassportIDToggle() {
    cy.wait(1000)
    cy.get('input[name="Collect Passport/ID of Guest"][value="1"]').if().should('exist').then(() => {
      cy.get(':nth-child(4) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is enabled then disable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully') //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }  
  enableCreditCardScanOfGuestToggle() {
    cy.wait(1000)
    cy.get(':nth-child(5) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').should('exist')
    cy.get('input[name="Collect Credit Card Scan of Guest"][value="0"]').if().should('exist').then(() => {
      cy.get(':nth-child(5) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is disabled then enable it
      cy.wait(1000)
      cy.get('button[class="swal2-confirm swal2-styled"]').should('exist').click() //Proceed button
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully') //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  disableCreditCardScanOfGuestToggle() {
    cy.wait(1000)
    cy.get(':nth-child(5) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').should('exist')
    cy.get('input[name="Collect Credit Card Scan of Guest"][value="1"]').if().should('exist').then(() => {
      cy.get(':nth-child(5) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is enabled then disable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully') //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  enableSelfiePictureToggle() {
    cy.wait(1000)
    cy.get(':nth-child(6) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').should('exist')
    cy.get('input[name="Collect Selfie Picture"][value="0"]').if().should('exist').then(() => {
      cy.get(':nth-child(6) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is disabled then enable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully') //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  disableSelfiePictureToggle() {
    cy.wait(1000)
    cy.get(':nth-child(6) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').should('exist')
    cy.get('input[name="Collect Selfie Picture"][value="1"]').if().should('exist').then(() => {
      cy.get(':nth-child(6) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is enabled then disable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully') //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  enableOfferAddonUpsellsToggle() {
    cy.wait(1000)
    cy.get(':nth-child(7) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').should('exist')
    cy.get('input[name="Offer Add-on Upsells"][value="0"]').if().should('exist').then(() => {
      cy.get(':nth-child(7) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is disabled then enable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully') //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  disableOfferAddonUpsellsToggle() {
    cy.wait(1000)
    cy.get(':nth-child(7) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').should('exist')
    cy.get('input[name="Offer Add-on Upsells"][value="1"]').if().should('exist').then(() => {
      cy.get(':nth-child(7) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is enabled then disable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully').wait(1000)//toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  enableCollectDigitalSignatureToggle() {
    cy.wait(1000)
    cy.get(':nth-child(8) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').should('exist')
    cy.get('input[name="Collect Digital Signature"][value="0"]').if().should('exist').then(() => {
      cy.get(':nth-child(8) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is disabled then enable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully').wait(1000) //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  disableCollectDigitalSignatureToggle() {
    cy.wait(1000)
    cy.get(':nth-child(8) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').should('exist')
    cy.get('input[name="Collect Digital Signature"][value="1"]').if().should('exist').then(() => {
      cy.get(':nth-child(8) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is enabled then disable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully').wait(1000)//toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  enableCollectAcceptanceTermsConditionToggle() {
    cy.wait(1000)
    cy.get(':nth-child(9) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').should('exist')
    cy.get('input[name="Collect Acceptance of Terms & Conditions"][value="0"]').if().should('exist').then(() => {
      cy.get(':nth-child(9) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is disabled then enable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully').wait(1000) //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  disableCollectAcceptanceTermsConditionToggle() {
    cy.wait(1000)
    cy.get(':nth-child(9) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').should('exist')
    cy.get('input[name="Collect Acceptance of Terms & Conditions"][value="1"]').if().should('exist').then(() => {
      cy.get(':nth-child(9) > .toggle-card-content > .row > .col-12 > .checkbox-toggle > .checkbox-label').click() //If toggle is enabled then disable it
      cy.get('.toast-message').should('contain.text', 'Data has been saved successfully').wait(1000) //toast will be shown on save changes
      cy.get('.toast-message').should('not.exist') //wait until toast disappears
    })
  }
  
  

}