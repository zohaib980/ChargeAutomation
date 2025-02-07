export class PropertiesPage {
    goToProperties() {
        cy.get('.settings_dropdown [id="navbarDropdown"]').should('exist').click() //settings icon
        cy.get('[aria-labelledby="navbarDropdown"] [href*="/properties"]').should('contain.text', 'Properties').click({ force: true }) //Properties
        cy.get('.page-title').should('contain.text', 'Properties') //Validate Heading
        cy.wait(5000)
    }
    enableProperty(propName) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('[class="property-card property-disconnected"] [title="' + propName + '"]').if().parents('[class="for-booking-list-page-only-outer t-b-padding-lg-10"]')
            .find('[class="checkbox-label"]').then(ele => {
                cy.wrap(ele).click({ force: true }) //enable the selected property
                cy.get('.toast-success').should('contain.text', 'Property was updated successfully') //toast
            })
    }
    disableProperty(propName) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('[class="property-card property-connected"] [title="' + propName + '"]').if().parents('[class="for-booking-list-page-only-outer t-b-padding-lg-10"]')
            .find('[class="checkbox-label"]').then(ele => { //disable the selected property
                cy.wrap(ele).click({ force: true })
                //Validate popup
                cy.get('[class="view-edit-title"]').should('contain.text', 'Are you sure you want to disconnect this property? Disconnecting will mean')
                cy.get('.swal2-confirm').should('contain.text', 'Yes, disconnect').click().wait(1000) //Confirm button
                cy.get('.toast-success').should('contain.text', 'Property was updated successfully') //toast
            })
    }
    goToRentals(index) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('[href*="/client/v2/rentals/"]').eq(parseInt(index) - 1).should('be.visible').and('contain.text', 'Rental').invoke('removeAttr', 'target').click()
    }
    getPropertyAddress(propName) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('[class="property-card property-connected"] [title="' + propName + '"]').if().parents('[class="for-booking-list-page-only-outer t-b-padding-lg-10"]')
            .find('#moreMenu').should('be.visible').click() //3dot
        cy.get('.for-booking-list-page-only-outer .show [title="Update Property Info"]').should('contain.text', 'Edit Property').and('be.visible') //Edit Property
            .invoke('attr', 'href').then(url => { cy.visit(url) }) //GO to Edit property 
        cy.url().should('include', '/property/update/')
        cy.get('h1.page-title').should('be.visible').and('contain.text', propName) //heading
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        return cy.get('#update-property-address').should('be.visible').invoke('val').should('not.be.empty') //property address field
    }
    editProperty(propName) {
        cy.get('[title="' + propName + '"]').parents('[class="for-booking-list-page-only-outer t-b-padding-lg-10"]')
            .find('[title="Update Property Info"]').should('contain.text', 'Edit Property').invoke('removeAttr', 'target').click({ force: true })
        cy.get('.left-sidebar ul li').contains('Property Info').should('be.visible')
    }
    expandProperty(propName) {
        cy.get('[title="' + propName + '"]').parents('.property-card')
            .find('[id*="property-collapse-toggler"].collapsed').should('be.visible').click() //expand
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('[class="card-section-title pb-1"]').should('be.visible').and('contain.text', 'Auto Payment')
    }
    enablePGSettingOnProperty() {
        //Go to Property Payment Gateway
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.left-sidebar ul li').contains('Payment Gateway').should('be.visible').click()
        cy.get('.payment-gateway-settings').should('be.visible').and('contain.text', 'Payment Gateway Settings')
        cy.get('.payment-gateway-settings [id="gateway-settings"] [for="pg-settings_0undefined"]').should('be.visible').and('contain.text', 'Use Global Settings')
        cy.get('.payment-gateway-settings [id="gateway-settings"] [for="pg-settings_1undefined"]').should('be.visible').and('contain.text', 'Per Property Settings').click()
        cy.get('.view-edit-title').if().should('contain.text', 'Do you really want to use custom payment gateway settings ?').then(() => {
            cy.get('.swal2-cancel').should('be.visible').and('contain.text', 'No, cancel')
            cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Yes, Custom Settings!').click()
        })
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('[class="form-group mb-0"]').should('be.visible').and('contain.text', 'Payment Gateway')
    }
    enableGlobalSettingOnProperty() {
        //Go to Property Payment Gateway
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.left-sidebar ul li').contains('Payment Gateway').should('be.visible').click()
        cy.get('.payment-gateway-settings').should('be.visible').and('contain.text', 'Payment Gateway Settings')
        cy.get('.payment-gateway-settings [id="gateway-settings"] [for="pg-settings_0undefined"]').should('be.visible').and('contain.text', 'Use Global Settings').click()
        cy.get('.payment-gateway-settings [id="gateway-settings"] [for="pg-settings_1undefined"]').should('be.visible').and('contain.text', 'Per Property Settings')
        cy.get('.view-edit-title').if().should('contain.text', 'Do you really want to use global payment gateway settings ?').then(() => {
            cy.get('.swal2-cancel').should('be.visible').and('contain.text', 'No, cancel')
            cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Yes, Global Settings!').click()
            cy.get('.toast-text').should('be.visible').and('contain.text', 'Payment Gateway Settings Updated')
        })
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.cac-button--primary').should('be.visible').and('have.attr', 'disabled') //Save button
    }
    enablePGPerPropertySettingsOnListing() {
        cy.get('[id="gateway-settings"] .nav-item:nth-child(2) [id*="pg-settings"]').if('not.checked').then(() => {
            cy.get('[id="gateway-settings"] .nav-item:nth-child(2)')
                .should('be.visible').and('contain.text', 'Per Property Settings').click() // Per Property Settings radio
            cy.get('[class="view-edit-title"]').should('be.visible').and('contain.text', 'Are you sure you want to use a custom payment gateway for this property?')
            cy.get('.swal2-cancel').should('be.visible').and('contain.text', 'No, cancel')
            cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Yes, Custom Settings!').click()
            cy.get('.loading-label').should('not.exist') //loader should be disappear
            cy.get('.toast-text').should('contain.text', 'Payment Gateway Settings Updated')
            //cy.verifyToast('Payment Gateway Settings Updated')
        }).else().then(() => {
            cy.log('PG settings at property level is already enabled for this property!')
        })
    }
    enablePGGlobalSettingsOnListing() {
        cy.get('[id="gateway-settings"] .nav-item:nth-child(1) [id*="pg-settings"]').if('not.checked').then(() => {
            cy.get('[id="gateway-settings"] .nav-item:nth-child(1)')
                .should('be.visible').and('contain.text', 'Use Global Settings').click() // Use Global Settings radio
            cy.get('[class="view-edit-title"]').should('be.visible').and('contain.text', 'Are you sure you want to use a global payment gateway for this property?')
            cy.get('.swal2-cancel').should('be.visible').and('contain.text', 'No, cancel')
            cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Yes, Global Settings!').click()
            cy.get('.loading-label').should('not.exist') //loader should be disappear
            cy.get('.toast-text').should('contain.text', 'Payment Gateway Settings Updated')
            //cy.verifyToast('Payment Gateway Settings Updated')
        }).else().then(() => {
            cy.log('PG settings at Global level is already enabled for this property!')
        })
    }
    clickSave() {
        cy.get('.cac-button--primary').should('be.visible').and('contain.text', 'Save').click()
    }
    clickEditOnPGListing() {
        cy.get('[class="box-header hidden-xs"] a[href="javascript:void(0);"]').should('be.visible').and('contain.text', 'Edit').click()
        cy.get('.loading-label').should('not.exist') //loader should be disappear
    }
    clickSaveOnPGListing() {
        cy.get('[class="box-header hidden-xs"] a[href="javascript:void(0);"]').should('be.visible').and('contain.text', 'Save').click()
        cy.get('.loading-label').should('not.exist') //loader should be disappear
    }
    //Gateways Connection
    connectToStripe() {
        cy.get('.stripeblock .btn-primary').should('be.visible').click() //Connect to Stripe OR Connected to Stripe
        cy.origin('https://connect.stripe.com/', () => {
            cy.get('button[id="skip-account-app"]').should('be.visible').and('contain.text', 'Skip this form').click()
        })
        cy.url().should('include', '/properties')
        cy.verifyToast('Successfully connected to Stripe')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
    }
    validateErrorsOnPaymentGateway(PG) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        if (PG == 'Stripe') {
            cy.get('img[src*="/stripe_new.png"]').should('be.visible') //logo
            cy.get('.stripeblock').should('be.visible').and('contain.text', 'Connect To Stripe')
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to Stripe')
        }
        else if (PG == 'Authorize.Net') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Login ID').and('contain.text', 'API Login ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Transaction Key').and('contain.text', 'Transaction Key is required')
        }
        else if (PG == 'Redsys') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant Code (FUC)').and('contain.text', 'Merchant code (FUC) is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Merchant Key').and('contain.text', 'Merchant Key is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Terminal Number').and('contain.text', 'Terminal number is required')
        }
        else if (PG == 'Elavon') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Shared Secret').and('contain.text', 'Shared Secret is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Account').and('contain.text', 'Account is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Rebate PWD').and('contain.text', 'Rebate PWD is required')
        }
        else if (PG == 'FirstData') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Key').and('contain.text', 'API Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Token').and('contain.text', 'Token is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'API Secret').and('contain.text', 'API Secret is required')
        }
        else if (PG == 'ElavonConvergePay') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'SSL Merchant ID').and('contain.text', 'SSL Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'SSL User ID').and('contain.text', 'SSL User ID is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'SSLPIN').and('contain.text', 'SSLPIN is required')
        }
        else if (PG == 'Adyen') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant Account').and('contain.text', 'Merchant Account is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Version').and('contain.text', 'Version is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Random').and('contain.text', 'Random is required')
            cy.get('.has-error').eq(5).should('be.visible').and('contain.text', 'Company Name').and('contain.text', 'Company Name is required')
            cy.get('.has-error').eq(6).should('be.visible').and('contain.text', 'CAVV Algorithm').and('contain.text', 'CAVV Algorithm is required')
        }
        else if (PG == 'Shift4') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Clerk ID').and('contain.text', 'Clerk ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Access Token').and('contain.text', 'Access Token is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Interface Name').and('contain.text', 'Interface Name is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Interface Version').and('contain.text', 'Interface Version is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Company Name').and('contain.text', 'Company Name is required')
        }
        else if (PG == 'BAC Credomatic') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Terminal ID').and('contain.text', 'Terminal ID is required')
        }
        else if (PG == 'Borgun') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Private Key').and('contain.text', 'Private Key is required')
        }
        else if (PG == 'BorgunBGateway') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Version').and('contain.text', 'Version is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Processor').and('contain.text', 'Processor is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(5).should('be.visible').and('contain.text', 'Terminal ID').and('contain.text', 'Terminal ID is required')
        }
        else if (PG == 'CardNet') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Terminal ID ').and('contain.text', 'Terminal ID is required')
        }
        else if (PG == 'CardStream') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Signature Key').and('contain.text', 'Signature Key is required')
        }
        else if (PG == 'Cybersource') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Profile ID').and('contain.text', 'Profile ID is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Api Key ID').and('contain.text', 'Api Key ID is required.')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Shared Secret Key').and('contain.text', 'Shared Secret Key is required')
        }
        else if (PG == 'eWAY') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Key').and('contain.text', 'API Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
        }
        else if (PG == 'Heartland') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Public Key').and('contain.text', 'Public Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Secret Key').and('contain.text', 'Secret Key is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Developer ID').and('contain.text', 'Developer ID is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Version Number').and('contain.text', 'Version Number is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Certi Mode').and('contain.text', 'Certi Mode is required')
        }
        else if (PG == 'Mercado Pago') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Public Key').and('contain.text', 'Public Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Access Token').and('contain.text', 'Access Token is required')
        }
        else if (PG == 'Moneris') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Store ID').and('contain.text', 'Store ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'API Token').and('contain.text', 'API Token is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Processing Country').and('contain.text', 'Processing Country is required')
        }
        else if (PG == 'NMI') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
        }
        else if (PG == 'NomuPay') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Processing Account ID').and('contain.text', 'Processing Account ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'KID').and('contain.text', 'KID is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Shared Key').and('contain.text', 'Shared Key is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Region').and('contain.text', 'Region is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Card Currency').and('contain.text', 'Card Currency is required')
        }
        else if (PG == 'Nuvei') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Merchant Site ID').and('contain.text', 'Merchant Site ID is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Secret Key').and('contain.text', 'Secret Key is required')
        }
        else if (PG == 'PayFast') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Merchant Key').and('contain.text', 'Merchant Key is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Salt Passphrase').and('contain.text', 'Salt Passphrase is required')
        }
        else if (PG == 'PayGate') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Pay Gate ID').and('contain.text', 'Pay Gate ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
        }
        else if (PG == 'PayPal Business') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Client ID').and('contain.text', 'Client ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Client Secret').and('contain.text', 'Client Secret is required')
        }
        else if (PG == 'PayPalPaymentsPro') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Vendor').and('contain.text', 'Vendor is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Partner').and('contain.text', 'Partner is required')
        }
        else if (PG == 'PayZen') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Username').and('contain.text', 'API Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'API Password').and('contain.text', 'API Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Capture Delay Days').and('contain.text', 'Capture Delay Days is required')
        }
        else if (PG == 'PeleCard') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Terminal Number').and('contain.text', 'Terminal Number is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
        }
        else if (PG == 'PesoPay') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant Id is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Login ID').and('contain.text', 'Login Id is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Secure Hash Secret Key').and('contain.text', 'Secure Hash Secret Key is required')
        }
        else if (PG == 'Rapyd (Korta') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Terminal ID').and('contain.text', 'Terminal ID is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Merchant Number').and('contain.text', 'Merchant Number is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Language').and('contain.text', 'Language is required')
            cy.get('.has-error').eq(5).should('be.visible').and('contain.text', 'Original Amount').and('contain.text', 'Original Amount is required')
            cy.get('.has-error').eq(6).should('be.visible').and('contain.text', 'Wait Time').and('contain.text', 'Wait Time is required')
        }
        else if (PG == 'Rapyd Card Payments') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Access Key').and('contain.text', 'Access Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Secret Key').and('contain.text', 'Secret Key is required')
        }
        else if (PG == 'Tilopay') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Key').and('contain.text', 'API Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'API User').and('contain.text', 'API User is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'API Password').and('contain.text', 'API Password is required')
        }
        else if (PG == 'Windcave') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Merchant Reference').and('contain.text', 'Merchant Reference is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Enable Add Bill Card').and('contain.text', 'Enable Add Bill Card is required')
        }
        else if (PG == 'WorldLine (IngenicoDirect') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Key ID').and('contain.text', 'API Key ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Secret API Key').and('contain.text', 'Secret API Key is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
        }
        else if (PG == 'WorldPay') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Securenet ID').and('contain.text', 'Securenet Id is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Secure Net Key').and('contain.text', 'Secure Net Key is required')
        }
        else if (PG == 'WorldPayOnline') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Service Key').and('contain.text', 'Service Key is required')
        }
        else if (PG == 'WorldPayVantiv') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Terminal ID').and('contain.text', 'Terminal ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Account ID').and('contain.text', 'Account ID is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Account Token').and('contain.text', 'Account Token is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Application ID').and('contain.text', 'Application ID is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Acceptor ID').and('contain.text', 'Acceptor ID is required')
            cy.get('.has-error').eq(5).should('be.visible').and('contain.text', 'Application Name').and('contain.text', 'Application Name is required')
            cy.get('.has-error').eq(6).should('be.visible').and('contain.text', 'Application Version').and('contain.text', 'Application Version is required')

        }
        else if (PG == 'WorldPayWPG') {
            cy.get('.toast-text').should('contain.text', 'Please provide the correct credentials to connect to ' + PG).click() //click to disappear
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant Code').and('contain.text', 'Merchant Code is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'XMLAPI Username').and('contain.text', 'XMLAPI Username is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'XML Password').and('contain.text', 'XML Password is required')
        }
    }
}