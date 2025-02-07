

export class OnlineCheckinSettings {
  applyNotifyGuestToCompletePrecheckin(duration, whenToapply) {
    cy.get('h5#edit-guest-exp1').click().wait(2000).then(() => {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('h5#edit-guest-exp1').click()
        })
    })
    cy.get('.show h5.modal-title').eq(1).should('be.visible').and('contain.text', 'Notify Guest To Complete Pre-Arrival')
    cy.get('.show .card-wrap h5').eq(0).should('be.visible').and('contain.text', 'Notify Guest to complete Pre-Arrival')
    cy.get('[class="custom-select-arrow form-control"]').eq(0).should('be.visible').select(duration) //Immediately
    cy.get('[class="custom-select-arrow form-control"]').eq(1).should('be.visible').select(whenToapply) //After Booking
    cy.get('#via-email').check().should('be.checked')
    cy.get('.show .btn-success').eq(1).should('contain.text', 'Save').click()
    cy.verifyToast('Data has been saved successfully')
  }
  goToBasicInfoSettings() {
    cy.get('[class="nav-item dropdown settings_dropdown"] [id="navbarDropdown"]').should('be.visible').click() //setting nav
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Precheckin
    cy.get('.page-title').should('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.scrollTo('top')
    cy.wait(2000)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    //Click on Collect Basic info setting icon
    cy.get('#edit-guest-exp2').click().wait(2000).then(() => {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('#edit-guest-exp2').click()
        })
    })

    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Basic Information From Guest(s)']")
      .should('contain', 'Collect Basic Information From Guest(s)').and('be.visible') //Validate the heading
  }
  applyBasicInfoOriginalSettings() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest1'] span").should('contain', 'All Guests (Adult, Children and Babies)').and('be.visible')
    cy.get('#pGuest1').click({ force: true }) //Click on All Guests (Adult, Children and Babies)
    cy.get("label[for='whenConsideredCompleted0'] span").should('contain', 'When primary guest completes it')
    cy.get('#whenConsideredCompleted0').click() //Click on When primary guest completes it
    cy.get("a[class='btn btn-success btn-sm px-3']").and('be.visible').click() //Save
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.verifyToast('Data has been saved successfully')
  }
  applyCollectIdLicenseOriginalSettings() {
    cy.get('[class="nav-item dropdown settings_dropdown"] [id="navbarDropdown"]').should('be.visible').click()
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true })
    cy.scrollTo('top')
    //Collect Passport ID of guest
    cy.get('#edit-guest-exp5').click().wait(2000).then(() => {
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('#edit-guest-exp5').click()
          cy.get('.loading-label').should('not.exist') //loader should be disappear
        })
    })

    cy.get('[id="guest-experience-more"].show [class="modal-title"]').contains('Collect Passport/ID of Guest').should('be.visible')
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
    cy.get('[id="guest-experience-more"].show [for="whoIsRequiredIdentity22"]').should('contain.text', 'Only Primary Guest').and('be.visible')
    cy.get('[id="guest-experience-more"].show [id="whoIsRequiredIdentity22"]').should('exist').click({ force: true }) //Select "Only Primary Guest" option
    cy.get("a[class='btn btn-success btn-sm px-3']").should('contain.text', 'Save').click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  selectLicenseAndIDcard() {
    this.enableGuestPassportIDToggle()
    cy.get('#edit-guest-exp5').click().wait(2000).then(() => {
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('#edit-guest-exp5').click()
          cy.get('.loading-label').should('not.exist') //loader should be disappear
        })
    })
    cy.get(`[id="guest-experience-more"].show h5[class='modal-title']`).eq(0).should('contain.text', 'Collect Passport/ID of Guest').and('be.visible') //Validate heading
    cy.get('[id="guest-experience-more"].show [for="ver-doc-types19"]').should('contain.text', "Driver's License")
    cy.get('#ver-doc-types19').should('exist').check({ force: true }) // enable Driver's License
    cy.get('[id="guest-experience-more"].show [for="ver-doc-types18"]').should('contain.text', 'Passport')
    cy.get("#ver-doc-types18").should('exist').check({ force: true }) //Check passport option
    cy.get('[id="guest-experience-more"].show input[placeholder="Search country"]').should('exist').type('{backspace}{backspace}', {force:true}) //Clear added passport list
    cy.get("#ver-doc-types18").should('exist').uncheck({ force: true }) //Uncheck passport option
    cy.get('[id="guest-experience-more"].show [for="ver-doc-types17"]').should('contain.text', 'ID Card')
    cy.get("#ver-doc-types17").should('exist').check({ force: true })  //Enable ID option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  selectPassportOnly() {
    this.enableGuestPassportIDToggle()
    //Open "Collect Passport/ID of Guest" modal
    cy.get('#edit-guest-exp5').click().wait(2000).then(() => {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('#edit-guest-exp5').click().wait(1000)
        })
    })
    cy.get(`[id="guest-experience-more"].show h5[class='modal-title']`).eq(0).should('contain.text', 'Collect Passport/ID of Guest').and('be.visible') //Validate heading
    cy.get('[id="guest-experience-more"].show [for="ver-doc-types19"]').should('contain.text', "Driver's License")
    cy.get('#ver-doc-types19').should('exist').uncheck({ force: true }) // Disable Driver's License
    cy.get('[id="guest-experience-more"].show [for="ver-doc-types18"]').should('contain.text', 'Passport')
    cy.get("#ver-doc-types18").should('exist').check({ force: true }) //Enable passport option
    cy.get('[id="guest-experience-more"].show input[placeholder="Search country"]').should('exist').type('{backspace}{backspace}', {force:true}) //Clear added passport list
    cy.get('[id="guest-experience-more"].show [for="ver-doc-types17"]').should('contain.text', 'ID Card')
    cy.get("#ver-doc-types17").should('exist').uncheck({ force: true })  //uncheck ID option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  setPassportExemptedCountry(country) {
    cy.get("#edit-guest-exp5").click() //Open "Collect Passport/ID of Guest" modal
    cy.wait(2000)
    cy.get(':nth-child(2) > .multiselect > .multiselect__tags').should('exist').type('{backspace}').wait(1000).type(country + '{enter}') //Select country
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  removePassportExemptedCountry() {
    cy.get("#edit-guest-exp5").click().wait(2000).click() //Open "Collect Passport/ID of Guest" modal
    cy.wait(2000)
    cy.get(':nth-child(2) > .multiselect > .multiselect__tags').should('exist').type('{backspace}{backspace}{backspace}').wait(1000)
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  setDocInstructions() {
    cy.get('[class="nav-item dropdown settings_dropdown"] [id="navbarDropdown"]').should('be.visible').click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.scrollTo('top')
    cy.wait(2000)
    cy.get("#edit-guest-exp5").click().wait(2000).click() //Open "Collect Passport/ID of Guest" modal
    cy.wait(1000)
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']").should('contain', 'Collect Passport/ID of Guest') //Validate heading
    cy.get("textarea[placeholder='Leave blank if you do not have any special instruction']").clear().type("Please Upload Your Valid Document here...") //Add instructions
    cy.get('[id="whoIsRequiredIdentity22"]').should('exist').click({ force: true }) //Select Only Primary Guest option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  removeDocInstructions() {
    cy.get('[class="nav-item dropdown settings_dropdown"] [id="navbarDropdown"]').should('be.visible').click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.scrollTo('top')
    cy.wait(2000)
    cy.get("#edit-guest-exp5").click().wait(2000).click() //Open "Collect Passport/ID of Guest" modal
    cy.wait(1000)
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']").should('contain', 'Collect Passport/ID of Guest') //Validate heading
    cy.get("textarea[placeholder='Leave blank if you do not have any special instruction']").clear() //clear instructions
    cy.get('[id="whoIsRequiredIdentity22"]').should('exist').click({ force: true }) //Select Only Primary Guest option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  applySelectOnlyPrimaryGuestSettings() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest0'] span").should('contain', 'Only Primary Guest') //Only Primary Guest
    cy.get("#pGuest0").click() //Select Only Primary Guest
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.verifyToast('Data has been saved successfully')
  }
  adultChildrenBabiesWithPrimaryGuest() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest1'] span").should('contain', 'All Guests (Adult, Children and Babies)')
    cy.get("#pGuest1").click({ force: true })
    cy.get("label[for='whenConsideredCompleted0'] span").should('contain', 'When primary guest completes it')
    cy.get("a[class='btn btn-success btn-sm px-3']").click()
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.verifyToast('Data has been saved successfully')
  }
  adultChildrenBabiesWithAllRequiredGuest() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest1'] span").should('contain', 'All Guests (Adult, Children and Babies)')
    cy.get("#pGuest1").click({ force: true }) //select "All Guests (Adult, Children and Babies)" option
    cy.get("label[for='whenConsideredCompleted1'] span").should('contain', 'When all required guests complete it') //Validate option
    cy.get('input[id="whenConsideredCompleted1"]').click() //Select "When all required guests complete it" option
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.verifyToast('Data has been saved successfully')
  }
  allGuestOver18WithPrimary() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest2'] span").should('contain', 'All Guests (Over 18)')
    cy.get('#pGuest2').click({ force: true }) //All guest over 18
    cy.get('[id="whenConsideredCompleted0"]').click({ force: true }) //When primary guest completes it
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //save button
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.verifyToast('Data has been saved successfully')
  }
  allGuestOver18WithAll() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest2'] span").should('contain', 'All Guests (Over 18)')
    cy.get('#pGuest2').click({ force: true }) //All guest over 18
    cy.get("label[for='whenConsideredCompleted1'] span").should('contain', 'When all required guests complete it')
    cy.get('#whenConsideredCompleted1').click({ force: true })
    cy.get("a[class='btn btn-success btn-sm px-3']").click()
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.verifyToast('Data has been saved successfully')
  }
  selectWhenAllGuestRequired() {
    this.goToBasicInfoSettings()
    cy.get("label[for='pGuest1'] span").should('contain', 'All Guests (Adult, Children and Babies)')
    cy.get("#pGuest1").click({ force: true })
    cy.get("label[for='whenConsideredCompleted1'] span").should('contain', 'When all required guests complete it')
    cy.get("#whenConsideredCompleted1").click()
    cy.get("a[class='btn btn-success btn-sm px-3']").click()
    cy.get("button[class='swal2-confirm swal2-styled']").if().contains('button', 'New Bookings Only').click()
    cy.verifyToast('Data has been saved successfully')
  }
  allGuestOver18UploadID() {
    /*
    cy.get('[class="nav-item dropdown settings_dropdown"] [id="navbarDropdown"]').should('be.visible').click() //Settings Nav
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    cy.get('.page-title').should('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.scrollTo('top')
    cy.get("#edit-guest-exp5").click({ force: true }).wait(2000)
    cy.get("#edit-guest-exp5").click({ force: true })
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']")
      .should('contain', 'Collect Passport/ID of Guest')
*/

    cy.get('[class="nav-item dropdown settings_dropdown"] [id="navbarDropdown"]').should('be.visible').click() //Settings Nav
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    cy.get('.page-title').should('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.scrollTo('top')
    //Collect Passport ID of guest
    cy.get('#edit-guest-exp5').click().wait(2000).then(() => {
      cy.get('.loading-label').should('not.exist') //loader should be disappear
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('#edit-guest-exp5').click()
          cy.get('.loading-label').should('not.exist') //loader should be disappear
        })
    })

    cy.get('[id="guest-experience-more"].show [class="modal-title"]').contains('Collect Passport/ID of Guest').should('be.visible')
    
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
    cy.get('.show [for="whoIsRequiredIdentity24"] span').should('exist').and('contain.text', 'All Guests (Over 18)')
    cy.get('.show [id="whoIsRequiredIdentity24"]').should('exist').click({ force: true })
    cy.get("a[class='btn btn-success btn-sm px-3']").should('contain.text', 'Save').click() //Save button
    cy.verifyToast('Data has been saved successfully')
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
    cy.verifyToast('Data has been saved successfully')
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
    cy.verifyToast('Data has been saved successfully')
  }

  //Setting booking sources
  setCollectPassportIDofGuestSource(bookingSource) {
    this.enableGuestPassportIDToggle()
    cy.get('#edit-guest-exp5').click().wait(2000).then(() => {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('#edit-guest-exp5').click()
          cy.get("a[class='btn btn-success btn-sm px-3']").should('be.visible')
        })
    })
    cy.xpath("//h5[@class='modal-title'][normalize-space()='Collect Passport/ID of Guest']").should('contain', 'Collect Passport/ID of Guest') //modal heading

    cy.get('.show [aria-expanded="false"][data-target="#accordion-online-checkin-sources-section"]')
      .if().should('contain.text', 'Attach Booking Sources').click() //click heading tab if not expanded
    cy.get('.show .multiselect_input_container').scrollIntoView().should('be.visible').click() //BS dropdown

    cy.get('.show .multiselect_dropdown_container--selected .selectDeselect').if().should('be.visible').click() //Unselect all
    if (bookingSource === 'All Booking Source') {
      cy.get('.show .multiselect_dropdown_container--unselected .selectDeselect').should('be.visible').click() //Select all BS
      cy.get('#accordion-online-checkin-sources-heading > .booking-accordion-title').should('contain.text', 'Attach Booking Sources').click() //heading tab
    }
    else {
      cy.get('[id="accordion-online-checkin-sources-section"] .list_item').contains(bookingSource).should('exist').parents('.list_item').find('input[type="checkbox"]').check({ force: true }) //select the BS
      cy.get('#accordion-online-checkin-sources-heading > .booking-accordion-title').should('contain.text', 'Attach Booking Sources').click() //heading tab
    }
    cy.get("a[class='btn btn-success btn-sm px-3']").should('be.visible').click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  setCollectCreditCardScanofGuestSource(bookingSource) {
    cy.get('[class="nav-item dropdown settings_dropdown"] [id="navbarDropdown"]').should('be.visible').click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.scrollTo('top')
    //Open "Collect Credit Card Scan of Guest" modal
    cy.get('#edit-guest-exp6').click().wait(2000).then(() => {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('#edit-guest-exp6').click()
          cy.get("a[class='btn btn-success btn-sm px-3']").should('be.visible') //save button
        })
    })

    cy.get('.show [aria-expanded="false"][data-target="#accordion-online-checkin-sources-section"]')
      .if().should('contain.text', 'Attach Booking Sources').click() //click heading tab if not expanded
    cy.get('.show .multiselect_input_container').scrollIntoView().should('be.visible').click() //BS dropdown

    cy.get('.show .multiselect_dropdown_container--selected .selectDeselect').if().should('be.visible').click() //Unselect all
    if (bookingSource === 'All Booking Source') {
      cy.get('.show .multiselect_dropdown_container--unselected .selectDeselect').should('be.visible').click() //Select all BS
      cy.get('#accordion-online-checkin-sources-heading > .booking-accordion-title').should('contain.text', 'Attach Booking Sources').click() //heading tab
    }
    else {
      cy.get('[id="accordion-online-checkin-sources-section"] .list_item').contains(bookingSource).should('exist').parents('.list_item').find('input[type="checkbox"]').check({ force: true }) //select the BS
      cy.get('#accordion-online-checkin-sources-heading > .booking-accordion-title').should('contain.text', 'Attach Booking Sources').click() //heading tab
    }
    cy.get("a[class='btn btn-success btn-sm px-3']").should('be.visible').click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  setArrivalBySource(bookingSource) {
    this.enableCollectArrivaltimeToggle()
    cy.get('.page-title').should('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.scrollTo('top')
    cy.wait(2000)
    //Click to open the "Collect Arrival time/method" modal
    cy.get('#edit-guest-exp3').click().wait(2000).then(() => {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('#edit-guest-exp3').click()
          cy.get("a[class='btn btn-success btn-sm px-3']").should('be.visible') //Save button on popup
        })
    })

    cy.get('.show [aria-expanded="false"][data-target="#accordion-online-checkin-sources-section"]')
      .if().should('contain.text', 'Attach Booking Sources').click() //click heading tab if not expanded
    cy.get('.show .multiselect_input_container').scrollIntoView().should('be.visible').click() //BS dropdown

    cy.get('.show .multiselect_dropdown_container--selected .selectDeselect').if().should('be.visible').click() //Unselect all

    if (bookingSource === 'All Booking Source') {
      cy.get('.show .multiselect_dropdown_container--unselected .selectDeselect').should('be.visible').click() //Select all BS
      cy.get('#accordion-online-checkin-sources-heading > .booking-accordion-title').should('contain.text', 'Attach Booking Sources').click() //heading tab
    }
    else {
      cy.get('[id="accordion-online-checkin-sources-section"] .list_item').contains(bookingSource).should('exist').parents('.list_item').find('input[type="checkbox"]').check({ force: true }) //select the BS
      cy.get('#accordion-online-checkin-sources-heading > .booking-accordion-title').should('contain.text', 'Attach Booking Sources').click() //heading tab
    }

    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  setCollectDigitalSignatureSource(bookingSource) {
    cy.get('[class="nav-item dropdown settings_dropdown"] [id="navbarDropdown"]').should('be.visible').click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.scrollTo('top')
    //Open "Collect digital signature" modal
    cy.get('#edit-guest-exp9').click().wait(2000).then(() => {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('#edit-guest-exp9').click()
          cy.get("a[class='btn btn-success btn-sm px-3']").should('be.visible')
        })
    })
    cy.get('.show [aria-expanded="false"][data-target="#accordion-online-checkin-sources-section"]')
      .if().should('contain.text', 'Attach Booking Sources').click() //click heading tab if not expanded
    cy.get('.show .multiselect_input_container').scrollIntoView().should('be.visible').click() //BS dropdown

    cy.get('.show .multiselect_dropdown_container--selected .selectDeselect').if().should('be.visible').click() //Unselect all
    if (bookingSource === 'All Booking Source') {
      cy.get('.show .multiselect_dropdown_container--unselected .selectDeselect').should('be.visible').click() //Select all BS
      cy.get('#accordion-online-checkin-sources-heading > .booking-accordion-title').should('contain.text', 'Attach Booking Sources').click() //heading tab
    }
    else {
      cy.get('[id="accordion-online-checkin-sources-section"] .list_item').contains(bookingSource).should('exist').parents('.list_item').find('input[type="checkbox"]').check({ force: true }) //select the BS
      cy.get('#accordion-online-checkin-sources-heading > .booking-accordion-title').should('contain.text', 'Attach Booking Sources').click() //heading tab
    }
    cy.get("a[class='btn btn-success btn-sm px-3']").should('be.visible').click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  setTermsConditionSource(bookingSource) {
    cy.get('[class="nav-item dropdown settings_dropdown"] [id="navbarDropdown"]').should('be.visible').click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    //cy.get(":nth-child(4) > .main-item").click({ force: true }) //Online Checkin
    cy.get('.page-title').should('be.visible').and('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.scrollTo('top')
    cy.get('h5[id="edit-guest-exp10"]').should('be.visible').and('contain.text', 'Collect Acceptance of Rental Agreement')
    //Open "Collect Acceptance of Rental Agreement" modal
    cy.get('div[id="edit-guest-exp10"]').should('be.visible').click().wait(2000).then(() => {
      cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
        .if('visible')
        .else().then(() => {
          cy.get('div[id="edit-guest-exp10"]').should('be.visible').click()
          cy.get("a[class='btn btn-success btn-sm px-3']").should('be.visible') //Save button on popup
        })
    })
    cy.get('[id="guest-experience-more"] h5.modal-title').contains('Collect Acceptance of Rental Agreement').should('be.visible')
    cy.get('.show [aria-expanded="false"][data-target="#accordion-online-checkin-sources-section"]')
      .if().should('contain.text', 'Attach Booking Sources').click() //click heading tab if not expanded
    cy.get('.show .multiselect_input_container').scrollIntoView().should('be.visible').click() //BS dropdown

    cy.get('.show .multiselect_dropdown_container--selected .selectDeselect').if().should('be.visible').click() //Unselect all
    if (bookingSource === 'All Booking Source') {
      cy.get('.show .multiselect_dropdown_container--unselected .selectDeselect').should('be.visible').click() //Select all BS
      cy.get('#accordion-online-checkin-sources-heading > .booking-accordion-title').should('contain.text', 'Attach Booking Sources').click() //heading tab
    }
    else {
      cy.get('[id="accordion-online-checkin-sources-section"] .list_item').contains(bookingSource).should('exist').parents('.list_item').find('input[type="checkbox"]').check({ force: true }) //select the BS
      cy.get('#accordion-online-checkin-sources-heading > .booking-accordion-title').should('contain.text', 'Attach Booking Sources').click() //heading tab
    }
    cy.get("a[class='btn btn-success btn-sm px-3']").click() //Save button
    cy.verifyToast('Data has been saved successfully')
  }
  setAllBookingSource() {
    cy.get('[class="nav-item dropdown settings_dropdown"] [id="navbarDropdown"]').should('be.visible').click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    cy.get('.page-title').should('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.scrollTo('top')
    //Select all options sequentialy and set Booking source as AllBookingSource
    var count = 10
    for (let i = 1; i < count; i++) {
      cy.get('[id*="edit-guest-exp"][class*="cursor-pointer"]').eq(i).click('right').wait(2000).then(() => {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get("a[class='btn btn-success btn-sm px-3']") //Save button on popup
          .if('visible')
          .else().then(() => {
            cy.get('[id*="edit-guest-exp"][class*="cursor-pointer"]').eq(i).click('right') //if modal not open click again
            cy.get("a[class='btn btn-success btn-sm px-3']").should('be.visible') //Save button on popup
          })
        //SelectAll BookingSources
        cy.get('.show .multiselect_dropdown_container--unselected .selectDeselect')
          .if().should('contain.text', 'Select All').click({ force: true })

        cy.get("a[class='btn btn-success btn-sm px-3']").should('exist').click() //Save button
        cy.verifyToast('Data has been saved successfully')
      })
    }
  }

  //Enable/Disable toggles
  goToOnlineCheckinSettings() {
    cy.get('.settings_dropdown #navbarDropdown').should('be.visible').click() //Setting tab
    cy.get('[href*="/online-check-in#online-check-in"]').click({ force: true }) //Online Precheckin
    cy.get('h1.page-title').should('be.visible').and('contain.text', 'Build Your Guest Journey') //Validate Page Heading
    cy.get('[data-target="#qrModal"]').should('be.visible').and('contain.text', 'QR Code')
    cy.get('.page-header .u-sub-color').should('be.visible').and('contain.text', 'View and edit guest experience setting')
    cy.scrollTo('top').wait(2000)
  }
  enableAllToggles() {
    this.enableCollectBasicInfoToggle()
    this.enableCollectArrivaltimeToggle()
    this.enableGuestPassportIDToggle()
    this.enableCreditCardScanOfGuestToggle()
    this.enableSelfiePictureToggle()
    this.enableOfferAddonUpsellsToggle()
    this.enableCollectDigitalSignatureToggle()
    this.enableCollectAcceptanceTermsConditionToggle()
  }
  disableAllToggle() {
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
    cy.get('h5[id="edit-guest-exp2"]').should('be.visible').and('contain.text', 'Collect Basic Information From Guest(s)')
    cy.get('input[name="Collect Basic Information From Guest(s)"][value="0"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true })  //If toggle is disabled then enable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  disableCollectBasicInfoToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp2"]').should('be.visible').and('contain.text', 'Collect Basic Information From Guest(s)')
    cy.get('input[name="Collect Basic Information From Guest(s)"][value="1"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true }) //If toggle is enabled then disable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  enableCollectArrivaltimeToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp3"]').should('be.visible').and('contain.text', 'Collect Arrival time & arrival method')
    cy.get('input[name="Collect Arrival time & arrival method"][value="0"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true })  //If toggle is disbaled then enable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  disableCollectArrivaltimeToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp3"]').should('be.visible').and('contain.text', 'Collect Arrival time & arrival method')
    cy.get('input[name="Collect Arrival time & arrival method"][value="1"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true }) //If toggle is enabled then disable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  enableGuestPassportIDToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp5"]').should('be.visible').and('contain.text', 'Collect Passport/ID of Guest')
    cy.get('input[name="Collect Passport/ID of Guest"][value="0"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true }) //If toggle is disabled then enable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  disableGuestPassportIDToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp5"]').should('be.visible').and('contain.text', 'Collect Passport/ID of Guest')
    cy.get('input[name="Collect Passport/ID of Guest"][value="1"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true })  //If toggle is enabled then disable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  enableCreditCardScanOfGuestToggle() {
    cy.wait(1000)
    cy.get('.loading-label').should('not.exist') //loader should be disappear
    cy.get('h5[id="edit-guest-exp6"]').should('be.visible').and('contain.text', 'Collect Credit Card Scan of Guest')
    cy.get('input[name="Collect Credit Card Scan of Guest"][value="0"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true })  //If toggle is disabled then enable it
      cy.get('.view-edit-title').should('be.visible').and('contain.text', 'Not Recommended')
      cy.get('.view-edit-desc').should('be.visible').and('contain.text', 'Collecting credit card scan might seem intrusive.')
        .and('contain.text', 'We recommend using Chargeback protection instead')
      cy.get('button[class="swal2-confirm swal2-styled"]').should('be.visible').and('contain.text', 'Proceed').click() //Proceed button
      cy.verifyToast('Data has been saved successfully')
    })
  }
  disableCreditCardScanOfGuestToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp6"]').should('be.visible').and('contain.text', 'Collect Credit Card Scan of Guest')
    cy.get('input[name="Collect Credit Card Scan of Guest"][value="1"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true }) //If toggle is enabled then disable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  enableSelfiePictureToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp7"]').should('be.visible').and('contain.text', 'Collect Selfie Picture')
    cy.get('input[name="Collect Selfie Picture"][value="0"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true }) //If toggle is disabled then enable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  disableSelfiePictureToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp7"]').should('be.visible').and('contain.text', 'Collect Selfie Picture')
    cy.get('input[name="Collect Selfie Picture"][value="1"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true }) //If toggle is enabled then disable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  enableOfferAddonUpsellsToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp8"]').should('be.visible').and('contain.text', 'Offer Add-on Upsells')
    cy.get('input[name="Offer Add-on Upsells"][value="0"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true }) //If toggle is disabled then enable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  disableOfferAddonUpsellsToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp8"]').should('be.visible').and('contain.text', 'Offer Add-on Upsells')
    cy.get('input[name="Offer Add-on Upsells"][value="1"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true })  //If toggle is enabled then disable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  enableCollectDigitalSignatureToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp9"]').should('be.visible').and('contain.text', 'Collect Digital Signature')
    cy.get('input[name="Collect Digital Signature"][value="0"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true })  //If toggle is disabled then enable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  disableCollectDigitalSignatureToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp9"]').should('be.visible').and('contain.text', 'Collect Digital Signature')
    cy.get('input[name="Collect Digital Signature"][value="1"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true }) //If toggle is enabled then disable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  enableCollectAcceptanceTermsConditionToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp10"]').should('be.visible').and('contain.text', 'Collect Acceptance of Rental Agreement')
    cy.get('input[name="Collect Acceptance of Rental Agreement"][value="0"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true }) //If toggle is disabled then enable it
      cy.verifyToast('Data has been saved successfully')
    })
  }
  disableCollectAcceptanceTermsConditionToggle() {
    cy.wait(1000)
    cy.get('h5[id="edit-guest-exp10"]').should('be.visible').and('contain.text', 'Collect Acceptance of Rental Agreement')
    cy.get('input[name="Collect Acceptance of Rental Agreement"][value="1"]').if().should('exist').then((checkbox) => {
      cy.wrap(checkbox).click({ force: true }) //If toggle is enabled then disable it
      cy.verifyToast('Data has been saved successfully')
    })
  }



}