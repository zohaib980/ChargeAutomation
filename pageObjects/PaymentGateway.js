export class PaymentGateway {
    gotoGlobalPGSelection() {
        cy.get('.settings_dropdown #navbarDropdown').should('be.visible').click() //settings icon
        cy.get('.dropdown-item[href*="/v2/pmsintegration"]').should('exist').click({ force: true }) //Gateway connection
        cy.get('.page-title').should('be.visible').and('contain.text', 'Account Setup') //heading
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.active .setup-title').should('contain.text', '1. Payment Gateway')
        cy.get('.setup-page-title').should('contain.text', 'Connect to your Payment Gateway')
        cy.get('[class="form-group mb-0"]').should('contain.text', 'Payment Gateway')
    }
    validatePGInfo() {
        cy.get('.account-setup-pms').should('be.visible').and('contain.text', 'What can I do by connecting?').and('contain.text', 'You can schedule, create and send payment requests with one click.')
            .and('contain.text', 'Does ChargeAutomation collect my funds?').and('contain.text', 'No, ChargeAutomation uses your connected payment gateway, so you are in control of your funds at all time.')
            .and('contain.text', 'How secure it is?').and('contain.text', 'We are PCI compliant, and we do not store credit card data.')
            .and('contain.text', 'Questions?').and('contain.text', 'Feel free to').and('contain.text', 'speak with an expert')
            .and('contain.text', 'or visit our').and('contain.text', 'FAQ')
    }
    selectPaymentGateway(PG) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('#pms-selector').should('be.visible').click()
        cy.get('[placeholder="Type a Payment Gateway"]').should('be.visible').and('be.enabled').clear().type(PG)
        cy.get('.custom-dropdown-selector-list .option__desc').contains(PG).click().wait(1000) //select PG
        cy.get('[aria-describedby="swal2-html-container"]').if().then(() => {
            cy.get('#swal2-html-container .view-edit-title').should('contain.text', 'By switching your Payment Gateway, Guests will be required to enter their card details again. Transactions will not be attempted on existing card(s).').and('be.visible')
            cy.get('.swal2-confirm').should('contain.text', 'I understand').click().wait(1000) //I understand
        })
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        if (PG == 'Stripe') {
            cy.get('img[src*="/stripe_new.png"]').should('be.visible') //logo
            cy.get('.stripeblock').should('be.visible').then(ele => { //Connect button
                const text = ele.text()
                expect(text).to.match(/Connect To Stripe|Connected To Stripe/)
            })
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'Authorize.Net') {
            cy.get('img[src*="/authorize_new.png"]').should('be.visible') //logo
            cy.get('label[title="API Login ID"]').should('contain.text', 'API Login ID') //API Login ID
            cy.get('[id="merchant_login_id"]').should('be.visible') // input
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'http://help.chargeautomation.com/en/articles/6166266-authorize-net-chargeautomation').and('contain.text', 'Need help?')
            cy.get('label[title="Transaction Key"]').should('contain.text', 'Transaction Key') //Transaction Key
            cy.get('[id="merchant_transaction_key"]').should('be.visible') //input
            cy.get('label[for="signature_key"]').should('contain.text', 'Signature Key') //Signature Key
            cy.get('[id="signature_key"]').should('be.visible') //input

            cy.get('[for="collect_ccv"]').should('contain.text', 'CCV Required') //CCV Required
            cy.get('[name="collect_ccv"]').should('exist') //CCV Required checkbox
            cy.get('[for="collect_zip"]').should('contain.text', 'Collect Zip Code') //Collect Zip Code
            cy.get('input[name="collect_zip"]').should('exist') //Collect Zip Code checkbox
            cy.get('[for="collect_billing_address"]').should('contain.text', 'Collect Billing Address') //Collect Billing Address
            cy.get('#collect_billing_address').should('exist')// Collect Billing Address checkbox
        }
        else if (PG == 'Redsys') {
            cy.get('img[src*="/redsys.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'http://help.chargeautomation.com/en/articles/6354460-redsys-chargeautomation')
            cy.get('label[for="merchant_code"]').should('contain.text', 'Merchant Code (FUC)') //Merchant Code (FUC)
            cy.get('[id="merchant_code"]').should('be.visible') //input
            cy.get('[for="signature_key"]').should('contain.text', 'Merchant Key') //Merchant Key
            cy.get('[id="signature_key"]').should('be.visible') //input
            cy.get('[for="terminal"]').should('contain.text', 'Terminal Number') //Terminal Number
            cy.get('[id="terminal"]').should('be.visible') //input
        }
        else if (PG == 'Elavon') {
            cy.get('img[src*="/elavon_new.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'http://help.chargeautomation.com/en/articles/6078626-elavon-chargeautomation')
            cy.get('label[for="MerchantID"]').should('contain.text', 'Merchant ID') //Merchant ID
            cy.get('input[placeholder="Merchant ID"]').should('exist') //input
            cy.get('label[title="Shared Secret"]').should('contain.text', 'Shared Secret') //Shared Secret
            cy.get('input[placeholder="Shared secret"]').should('exist') //input
            cy.get('label[title="Account"]').should('contain.text', 'Account') //Account
            cy.get('input[id="Account"]').should('exist') //input
            cy.get('label[title="Rebate PWD"]').should('contain.text', 'Rebate PWD') //Rebate PWD
            cy.get('[placeholder="Rebate pwd"]').should('exist') //input
        }
        else if (PG == 'FirstData') {
            cy.get('img[src*="/first_data.png"]').should('be.visible') //logo
            cy.get('label[for="APIKey"]').should('contain.text', 'API Key') //API Key
            cy.get('#APIKey').should('exist') //input
            cy.get('label[for="Token"]').should('contain.text', 'Token') //Token
            cy.get('[placeholder="Token"]').should('exist') //input
            cy.get('label[title="API Secret"]').should('contain.text', 'API Secret') //API Secret
            cy.get('#APISecret').should('exist') //input
        }
        else if (PG == 'ElavonConvergePay') {
            cy.get('img[src*="/elavon_new.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/8345963-elavon-converge-pay-chargeautomation')
            cy.get('label[title="SSL Merchant ID"]').should('contain.text', 'SSL Merchant ID') //SSL Merchant ID
            cy.get('input[placeholder="Ssl merchant ID"]').should('be.visible') // input
            cy.get('label[title="SSL User ID"]').should('contain.text', 'SSL User ID') //SSL User ID
            cy.get('input[placeholder="Ssl user ID"]').should('exist') //input
            cy.get('label[title="SSLPIN"]').should('contain.text', 'SSLPIN') //SSLPIN
            cy.get('input[name="SSLPIN"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'Adyen') {
            cy.get('img[src*="/adyen_new.png"]').should('be.visible') //logo
            cy.get('label[title="Merchant Account"]').should('contain.text', 'Merchant Account') //Merchant Account
            cy.get('input[id="MerchantAccount"]').should('be.visible') // input
            cy.get('label[for="Username"]').should('contain.text', 'Username') //Username
            cy.get('input[placeholder="Username"]').should('exist') //input
            cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
            cy.get('input[name="Password"]').should('exist') //input
            cy.get('label[title="Version"]').should('contain.text', 'Version') //Version
            cy.get('input[placeholder="Version"]').should('be.visible') //input
            cy.get('label[title="Random"]').should('contain.text', 'Random') //Random
            cy.get('input[placeholder="Random"]').should('be.visible') //input
            cy.get('label[title="Company Name"]').should('contain.text', 'Company Name') //Company Name
            cy.get('input[id="CompanyName"]').should('exist') //input
            cy.get('label[title="CAVV Algorithm"]').should('contain.text', 'CAVV Algorithm') //CAVV Algorithm
            cy.get('input[name="CAVVAlgorithm"]').should('be.visible') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'Shift4') {
            cy.get('img[src*="/shift4.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/8056132-shift4-charge-automation')
            cy.get('label[title="Clerk ID"]').should('contain.text', 'Clerk ID') //Clerk ID
            cy.get('input[name="ClerkID"]').should('be.visible') // input
            cy.get('label[title="Access Token"]').should('contain.text', 'Access Token') //Access Token
            cy.get('input[id="AccessToken"]').should('exist') //input
            cy.get('label[title="Interface Name"]').should('contain.text', 'Interface Name') //Interface Name
            cy.get('input[id="InterfaceName"]').should('exist') //input
            cy.get('label[title="Interface Version"]').should('contain.text', 'Interface Version') //Interface Version
            cy.get('input[id="InterfaceVersion"]').should('be.visible') //input
            cy.get('label[title="Company Name"]').should('contain.text', 'Company Name') //Company Name
            cy.get('input[id="CompanyName"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'BAC Credomatic') {
            cy.get('img[src*="/bac.png"]').should('be.visible') //logo
            cy.get('label[title="Username"]').should('contain.text', 'Username') //Username
            cy.get('input[name="Username"]').should('be.visible') // input
            cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
            cy.get('input[id="Password"]').should('exist') //input
            cy.get('label[title="Terminal ID"]').should('contain.text', 'Terminal ID') //Terminal ID
            cy.get('input[id="TerminalID"]').should('exist') //input
        }
        else if (PG == 'Borgun') {
            cy.get('img[src*="/borgun.png"]').should('be.visible') //logo
            cy.get('label[title="Private Key"]').should('contain.text', 'Private Key') //Private Key
            cy.get('input[name="PrivateKey"]').should('be.visible') // input
        }
        else if (PG == 'BorgunBGateway') {
            cy.get('img[src*="/borgun.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/8179810-borgun-b-gateway-chargeautomation')
            cy.get('label[title="Username"]').should('contain.text', 'Username') //Username
            cy.get('input[id="Username"]').should('be.visible') // input
            cy.get('label[for="Password"]').should('contain.text', 'Password') //Password
            cy.get('input[placeholder="Password"]').should('exist') //input
            cy.get('label[title="Version"]').should('contain.text', 'Version') //Version
            cy.get('input[name="Version"]').should('exist') //input
            cy.get('label[title="Processor"]').should('contain.text', 'Processor') //Processor
            cy.get('input[placeholder="Processor"]').should('be.visible') //input
            cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
            cy.get('input[placeholder="Merchant ID"]').should('be.visible') //input
            cy.get('label[title="Terminal ID"]').should('contain.text', 'Terminal ID') //Terminal ID
            cy.get('input[id="TerminalID"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'CardNet') {
            cy.get('img[src*="/card-net.png"]').should('be.visible') //logo
            cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
            cy.get('input[name="MerchantID"]').should('be.visible') // input
            cy.get('label[title="Terminal ID"]').should('contain.text', 'Terminal ID') //Terminal ID
            cy.get('input[name="TerminalID"]').should('be.visible') // input
        }
        else if (PG == 'CardStream') {
            cy.get('img[src*="/cardstream.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/9273246-cardstream-chargeautomation')
            cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
            cy.get('input[placeholder="Merchant ID"]').should('be.visible') //input
            cy.get('label[title="Signature Key"]').should('contain.text', 'Signature Key') //Signature Key
            cy.get('input[id="SignatureKey"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'Cybersource') {
            cy.get('img[src*="/cybersource.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'http://help.chargeautomation.com/en/articles/6078731-cybersource-chargeautomation')
            cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
            cy.get('[id="merchant_id"]').should('be.visible') //input
            cy.get('label[for="profile_id"]').should('contain.text', 'Profile ID') //Profile ID
            cy.get('[id="profile_id"]').should('be.visible') //input
            cy.get('label[title="Api key ID"]').should('contain.text', 'Api Key ID') //Api key ID
            cy.get('[id="api_key_id"]').should('be.visible') //input
            cy.get('label[title="Shared secret key"]').should('contain.text', 'Shared Secret Key') //Shared secret key
            cy.get('[id="shared_secret_key"]').should('be.visible') //input

            //cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'eWAY') {
            cy.get('img[src*="/eway.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'http://help.chargeautomation.com/en/articles/6478439-eway-chargeautomation')
            cy.get('label[title="API Key"]').should('contain.text', 'API Key') //API Key
            cy.get('[id="APIKey"]').should('be.visible') //input
            cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
            cy.get('[id="Password"]').should('be.visible') //input
        }
        else if (PG == 'Heartland') {
            cy.get('img[src*="/heartland.png"]').should('be.visible') //logo
            cy.get('label[title="Public Key"]').should('contain.text', 'Public Key') //Public Key
            cy.get('input[placeholder="Public key"]').should('be.visible') //input
            cy.get('label[title="Secret Key"]').should('contain.text', 'Secret Key') //Secret Key
            cy.get('input[id="SecretKey"]').should('exist') //input
            cy.get('label[title="Developer ID"]').should('contain.text', 'Developer ID') //Developer ID
            cy.get('input[id="DeveloperID"]').should('exist') //input
            cy.get('label[title="Version Number"]').should('contain.text', 'Version Number') //Version Number
            cy.get('input[id="VersionNumber"]').should('exist') //input
            cy.get('label[title="Certi Mode"]').should('contain.text', 'Certi Mode') //Certi Mode
            cy.get('input[id="CertiMode"]').should('exist') //input
        }
        else if (PG == 'Mercado Pago') {
            cy.get('img[src*="/mercadopago.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/8546678-mercado-pago-chargeautomation')
            cy.get('label[title="Public Key"]').should('contain.text', 'Public Key') //Public Key
            cy.get('[id="public_key"]').should('be.visible') //input
            cy.get('label[title="Access Token"]').should('contain.text', 'Access Token') //Access Token
            cy.get('[id="access_token"]').should('be.visible') //input

            cy.get('#convert_tran_currency_dropdown_toggle').should('exist')
            cy.get('.currency-wrapper .checkbox-toggle.checkbox-choice').should('be.visible').and('contain.text', 'Convert all payments to this currency')
            cy.get('.currency-wrapper [id="currency-selector"]').should('be.visible').click() //currency dropdown
            cy.get('.currency-wrapper [id*="custom-dropdown-select-option_box-"]').should('be.visible')
                .and('contain.text', 'Popular Currencies').and('contain.text', 'All Currencies')
        }
        else if (PG == 'Moneris') {
            cy.get('img[src*="/moneris-logo.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/8609892-moneris-chargeautomation')

            cy.get('label[title="Store ID"]').should('contain.text', 'Store ID') //Store ID
            cy.get('[id="StoreID"]').should('be.visible') //input
            cy.get('label[title="API Token"]').should('contain.text', 'API Token') //API Token
            cy.get('[id="APIToken"]').should('be.visible') //input
            cy.get('[id="ProcessingCountry"]').should('be.visible')
                .find('option')
                .then(options => {
                    const actual = [...options].map(o => o.textContent.trim())
                    expect(actual).to.include('Canada')
                    expect(actual).to.include('United States')
                })

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'NMI') {
            cy.get('img[src*="/nmi.png"]').should('be.visible') //logo

            cy.get('label[title="Username"]').should('contain.text', 'Username') //Username
            cy.get('[id="Username"]').should('be.visible') //input
            cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
            cy.get('[id="Password"]').should('be.visible') //input

            cy.get('[for="collect_billing_address"]').should('be.visible').and('contain.text', 'Collect Billing Address')
            cy.get('input[id="collect_billing_address"]').should('exist').check()
            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'NomuPay') {
            cy.get('img[src*="/nomupay.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/9792722-nomupay-chargeautomation')

            cy.get('label[title="Processing Account ID"]').should('contain.text', 'Processing Account ID') //Processing Account ID
            cy.get('input[placeholder="Processing account ID"]').should('be.visible') //input
            cy.get('label[title="KID"]').should('contain.text', 'KID') //KID
            cy.get('input[id="KID"]').should('exist') //input
            cy.get('label[title="Shared Key"]').should('contain.text', 'Shared Key') //Shared Key
            cy.get('input[id="SharedKey"]').should('exist') //input
            cy.get('label[title="Region"]').should('contain.text', 'Region') //Region
            cy.get('[id="Region"]').should('be.visible') //input
            cy.get('#Region')
                .children('option')
                .should(($options) => {
                    expect($options.eq(0)).to.contain.text('Select Region')  // First option
                    expect($options.eq(1)).to.contain.text('APAC')
                    expect($options.eq(2)).to.contain.text('Turkey')
                    expect($options.eq(3)).to.contain.text('Europe')
                })
            cy.get('label[title="Card Currency"]').should('contain.text', 'Card Currency') //Card Currency
            cy.get('[id="CardCurrency"]').should('be.visible')
            cy.get('#CardCurrency')
                .children('option')
                .should(($options) => {
                    expect($options.eq(0)).to.contain.text('Select Card Currency')  // First option
                    expect($options.eq(1)).to.contain.text('US Dollar (USD)')
                    expect($options.eq(2)).to.contain.text('United Arab Emirates Dirham (AED)')
                    expect($options.eq(3)).to.contain.text('Afghan Afghani (AFN)')
                    expect($options.eq(4)).to.contain.text('Albanian Lek (ALL)')
                    expect($options.eq(5)).to.contain.text('Armenian Dram (AMD)')
                    expect($options.eq(6)).to.contain.text('Netherlands Antillean guilder (ANG)')
                    expect($options.eq(7)).to.contain.text('Angolan Kwanza (AOA)')
                    expect($options.eq(8)).to.contain.text('Argentine Peso (ARS)')
                    expect($options.eq(9)).to.contain.text('Australian Dollar (AUD)')
                    expect($options.eq(10)).to.contain.text('Aruban Florin (AWG)')
                    expect($options.eq(11)).to.contain.text('Azerbaijani Manat (AZN)')
                    expect($options.eq(12)).to.contain.text('Bosnia-Herzegovina Convertible Mark (BAM)')
                    expect($options.eq(13)).to.contain.text('Barbadian dollar (BBD)')
                    expect($options.eq(14)).to.contain.text('Bangladeshi Taka (BDT)')
                    expect($options.eq(15)).to.contain.text('Bulgarian Lev (BGN)')
                    expect($options.eq(16)).to.contain.text('Burundian Franc (BIF)')
                    expect($options.eq(17)).to.contain.text('Bermudian dollar (BMD)')
                    expect($options.eq(18)).to.contain.text('Brunei Dollar (BND)')
                    expect($options.eq(19)).to.contain.text('Bolivian Boliviano (BOB)')
                    expect($options.eq(20)).to.contain.text('Brazilian Real (BRL)')
                    expect($options.eq(21)).to.contain.text('Bahamian dollar (BSD)')
                    expect($options.eq(22)).to.contain.text('Botswanan Pula (BWP)')
                })
            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'Nuvei') {
            cy.get('img[src*="/nuvei.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/8532417-nuvei-safecharge-chargeautomation')

            cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
            cy.get('input[placeholder="Merchant ID"]').should('be.visible') //input
            cy.get('label[title="Merchant Site ID"]').should('contain.text', 'Merchant Site ID') //Merchant Site ID
            cy.get('input[id="MerchantSiteID"]').should('exist') //input
            cy.get('label[title="Secret Key"]').should('contain.text', 'Secret Key') //Secret Key
            cy.get('input[id="SecretKey"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'PayFast') {
            cy.get('img[src*="/payfast.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/8588760-payfast-chargeautomation')

            cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
            cy.get('[id="merchant_id"]').should('be.visible') //input
            cy.get('label[title="Merchant Key"]').should('contain.text', 'Merchant Key') //Merchant Key
            cy.get('[id="merchant_key"]').should('be.visible') //input
            cy.get('label[title="Salt Passphrase"]').should('contain.text', 'Salt Passphrase') //Salt Passphrase
            cy.get('[id="salt_passphrase"]').should('be.visible') //input

            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'PayGate') {
            //cy.get('img[src*="/paygate.png"]').should('be.visible') //logo

            cy.get('label[title="Pay Gate ID"]').should('contain.text', 'Pay Gate ID') //Pay Gate ID
            cy.get('input[id="PayGateID"]').should('be.visible') //input
            cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
            cy.get('input[id="Password"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'PayPal Business') {
            cy.get('img[src*="/paypal.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/8578686-paypal-business-chargeautomation')

            cy.get('label[title="Client ID"]').should('contain.text', 'Client ID') //Client ID
            cy.get('[id="ClientID"]').should('be.visible') //input
            cy.get('label[title="Client Secret"]').should('contain.text', 'Client Secret') //Client Secret
            cy.get('[id="ClientSecret"]').should('exist') //input
        }
        else if (PG == 'PayPalPaymentsPro') {
            cy.get('img[src*="/paypal_new.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'http://help.chargeautomation.com/en/articles/6083507-paypalpaymentspro-chargeautomation')

            cy.get('label[title="Username"]').should('contain.text', 'Username') //Username
            cy.get('input[id="Username"]').should('be.visible') //input
            cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
            cy.get('input[id="Password"]').should('exist') //input
            cy.get('label[title="Vendor"]').should('contain.text', 'Vendor') //Vendor
            cy.get('input[id="Vendor"]').should('exist') //input
            cy.get('label[title="Partner"]').should('contain.text', 'Partner') //Partner
            cy.get('input[id="Partner"]').should('exist') //input
        }
        else if (PG == 'PayZen') {
            cy.get('img[src*="/payzen.png"]').should('be.visible') //logo

            cy.get('label[title="API Username"]').should('contain.text', 'API Username') //API Username
            cy.get('input[id="APIUsername"]').should('be.visible') //input
            cy.get('label[title="API Password"]').should('contain.text', 'API Password') //API Password
            cy.get('input[id="APIPassword"]').should('exist') //input
            cy.get('label[title="Capture Delay Days"]').should('contain.text', 'Capture Delay Days') //Capture Delay Days
            cy.get('input[id="CaptureDelayDays"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'PeleCard') {
            cy.get('img[src*="/pelecard.png"]').should('be.visible') //logo

            cy.get('label[title="Terminal Number"]').should('contain.text', 'Terminal Number') //Terminal Number
            cy.get('input[id="TerminalNumber"]').should('be.visible') //input
            cy.get('label[title="Username"]').should('contain.text', 'Username') //Username
            cy.get('input[id="Username"]').should('exist') //input
            cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
            cy.get('input[id="Password"]').should('exist') //input

        }
        else if (PG == 'PesoPay') {
            cy.get('img[src*="/pesopay.png"]').should('be.visible') //logo

            cy.get('label[title="Merchant Id"]').should('contain.text', 'Merchant ID') //Merchant ID
            cy.get('input[id="MerchantId"]').should('be.visible') //input
            cy.get('label[title="Login Id"]').should('contain.text', 'Login ID') //Login ID
            cy.get('input[id="LoginId"]').should('exist') //input
            cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
            cy.get('input[id="Password"]').should('exist') //input
            cy.get('label[title="Secure Hash Secret Key"]').should('contain.text', 'Secure Hash Secret Key') //Secure Hash Secret Key
            cy.get('input[id="SecureHashSecretKey"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'Rapyd (Korta') {
            cy.get('img[src*="/rapyd-logo-red.png"]').should('be.visible') //logo

            cy.get('label[title="Username"]').should('contain.text', 'Username') //Username
            cy.get('input[id="Username"]').should('exist') //input
            cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
            cy.get('input[id="Password"]').should('exist') //input
            cy.get('label[title="Terminal ID"]').should('contain.text', 'Terminal ID') //Terminal ID
            cy.get('input[id="TerminalID"]').should('exist') //input
            cy.get('label[title="Merchant Number"]').should('contain.text', 'Merchant Number') //Merchant Number
            cy.get('input[id="MerchantNumber"]').should('exist') //input
            cy.get('label[title="Language"]').should('contain.text', 'Language') //Language
            cy.get('input[id="Language"]').should('exist') //input
            cy.get('label[title="Original Amount"]').should('contain.text', 'Original Amount') //Original Amount
            cy.get('input[id="OriginalAmount"]').should('exist') //input
            cy.get('label[title="Wait Time"]').should('contain.text', 'Wait Time') //Wait Time
            cy.get('input[id="WaitTime"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'Rapyd Card Payments') {
            cy.get('img[src*="/rapyd-logo-red.png"]').should('be.visible') //logo

            cy.get('label[title="Access Key"]').should('contain.text', 'Access Key') //Access Key
            cy.get('[id="AccessKey"]').should('be.visible') //input
            cy.get('label[title="Secret Key"]').should('contain.text', 'Secret Key') //Secret Key
            cy.get('[id="SecretKey"]').should('be.visible') //input

        }
        else if (PG == 'Tilopay') {
            cy.get('img[src*="/tilopay.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/8525125-tilopay-chargeautomation')

            cy.get('label[title="API Key"]').should('contain.text', 'API Key') //API Key
            cy.get('[id="key"]').should('be.visible') //input
            cy.get('label[title="API User"]').should('contain.text', 'API User') //API User
            cy.get('[id="apiuser"]').should('be.visible') //input
            cy.get('label[title="API Password"]').should('contain.text', 'API Password') //API Password
            cy.get('[id="password"]').should('be.visible') //input

            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'Total processing') {
            cy.get('img[src*="/total_processing_logo.png"]').should('be.visible') //logo

            cy.get('label[title="Entity ID"]').should('contain.text', 'Entity ID') //Entity ID
            cy.get('[id="EntityID"]').should('be.visible') //input

            cy.get('label[title="Access Token"]').should('contain.text', 'Access Token') //accessToken
            cy.get('[id="AccessToken"]').should('be.visible')//input

            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'Windcave') {
            cy.get('img[src*="/windcave.png"]').should('be.visible') //logo

            cy.get('label[title="Username"]').should('contain.text', 'Username') //Username
            cy.get('input[id="Username"]').should('be.visible') //input
            cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
            cy.get('input[id="Password"]').should('exist') //input
            cy.get('label[title="Merchant Reference"]').should('contain.text', 'Merchant Reference') //Merchant Reference
            cy.get('input[id="MerchantReference"]').should('exist') //input
            cy.get('label[title="Enable Add Bill Card"]').should('contain.text', 'Enable Add Bill Card') //Enable Add Bill Card
            cy.get('input[id="EnableAddBillCard"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'WorldLine (IngenicoDirect') {
            cy.get('img[src*="/worldline-logo2.svg"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'https://help.chargeautomation.com/en/articles/8411736-worldline-ingenicodirect-chargeautomation')

            cy.get('label[title="API Key ID"]').should('contain.text', 'API Key ID') //API Key ID
            cy.get('input[id="APIKeyID"]').should('be.visible') //input
            cy.get('label[title="Secret API Key"]').should('contain.text', 'Secret API Key') //Secret API Key
            cy.get('input[id="SecretAPIKey"]').should('exist') //input
            cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
            cy.get('input[id="MerchantID"]').should('exist') //input

            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
        else if (PG == 'WorldPay') {
            cy.get('img[src*="/worldpay_new.png"]').should('be.visible') //logo
            cy.get('[title="Get help with filling up this form"]').should('be.visible')
                .and('contain.text', 'Need help?').and('have.attr', 'href', 'http://help.chargeautomation.com/en/articles/6403884-worldpay-chargeautomation')

            cy.get('label[title="Securenet Id"]').should('contain.text', 'Securenet ID') //Securenet ID
            cy.get('input[id="SecurenetId"]').should('be.visible') //input
            cy.get('label[title="Secure Net Key"]').should('contain.text', 'Secure Net Key') //Secure Net Key
            cy.get('input[id="SecureNetKey"]').should('exist') //input
        }
        else if (PG == 'WorldPayOnline') {
            cy.get('img[src*="/worldpay_new.png"]').should('be.visible') //logo

            cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
            cy.get('input[id="MerchantID"]').should('be.visible') //input
            cy.get('label[title="Service Key"]').should('contain.text', 'Service Key') //Service Key
            cy.get('input[id="ServiceKey"]').should('exist') //input
        }
        else if (PG == 'WorldPayVantiv') {
            cy.get('img[src*="/worldpay_new.png"]').should('be.visible') //logo

            cy.get('label[title="Terminal ID"]').should('contain.text', 'Terminal ID') //Terminal ID
            cy.get('input[id="TerminalID"]').should('be.visible') //input
            cy.get('label[title="Account ID"]').should('contain.text', 'Account ID') //Account ID
            cy.get('input[id="AccountID"]').should('be.visible') //input
            cy.get('label[title="Account Token"]').should('contain.text', 'Account Token') //Account Token
            cy.get('input[id="AccountToken"]').should('be.visible') //input
            cy.get('label[title="Application ID"]').should('contain.text', 'Application ID') //Application ID
            cy.get('input[id="ApplicationID"]').should('be.visible') //input
            cy.get('label[title="Acceptor ID"]').should('contain.text', 'Acceptor ID') //Acceptor ID
            cy.get('input[id="AcceptorID"]').should('be.visible') //input
            cy.get('label[title="Application Name"]').should('contain.text', 'Application Name') //Application Name
            cy.get('input[id="ApplicationName"]').should('be.visible') //input
            cy.get('label[title="Application Version"]').should('contain.text', 'Application Version') //Application Version
            cy.get('input[id="ApplicationVersion"]').should('be.visible') //input

        }
        else if (PG == 'WorldPayWPG') {
            cy.get('img[src*="/worldpay_new.png"]').should('be.visible') //logo

            cy.get('label[title="Merchant Code"]').should('contain.text', 'Merchant Code') //Merchant Code
            cy.get('[id="MerchantCode"]').should('be.visible') //input
            cy.get('label[title="XMLAPI Username"]').should('contain.text', 'XMLAPI Username') //XMLAPI Username
            cy.get('[id="XMLAPIUsername"]').should('be.visible') //input
            cy.get('label[title="XML Password"]').should('contain.text', 'XML Password') //XML Password
            cy.get('[id="XMLPassword"]').should('be.visible') //input

            cy.get('input[id="collect_billing_address"]').should('be.visible').check() //Collect billing address checkbox
            cy.get('label[title="Collect Billing Address"]').should('be.visible').and('contain.text', 'Collect Billing Address') //label
            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
            cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
            cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
        }
    }
    clickContinue() {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.setup-footer .btn-success').should('be.visible').and('contain.text', 'Continue').click() //Contiue
    }
    clickSkip() {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.setup-skip').should('be.visible').and('contain.text', 'Skip').click() //Contiue
    }
    validateToast(msg) {
        cy.get('.toast-text').should('be.visible').and('contain.text', msg).click() //click to disappear
    }
    validateErrorsOnPaymentGateway(PG) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        if (PG == 'Stripe') {
            cy.get('img[src*="/stripe_new.png"]').should('be.visible') //logo
            cy.get('.stripeblock').should('be.visible').and('contain.text', 'Connect To Stripe')
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
        }
        else if (PG == 'Authorize.Net') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Login ID').and('contain.text', 'API Login ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Transaction Key').and('contain.text', 'Transaction Key is required')
        }
        else if (PG == 'Redsys') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant Code (FUC)').and('contain.text', 'Merchant code (FUC) is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Merchant Key').and('contain.text', 'Merchant Key is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Terminal Number').and('contain.text', 'Terminal number is required')
        }
        else if (PG == 'Elavon') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Shared Secret').and('contain.text', 'Shared Secret is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Account').and('contain.text', 'Account is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Rebate PWD').and('contain.text', 'Rebate PWD is required')
        }
        else if (PG == 'FirstData') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Key').and('contain.text', 'API Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Token').and('contain.text', 'Token is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'API Secret').and('contain.text', 'API Secret is required')
        }
        else if (PG == 'ElavonConvergePay') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'SSL Merchant ID').and('contain.text', 'SSL Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'SSL User ID').and('contain.text', 'SSL User ID is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'SSLPIN').and('contain.text', 'SSLPIN is required')
        }
        else if (PG == 'Adyen') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant Account').and('contain.text', 'Merchant Account is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Version').and('contain.text', 'Version is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Random').and('contain.text', 'Random is required')
            cy.get('.has-error').eq(5).should('be.visible').and('contain.text', 'Company Name').and('contain.text', 'Company Name is required')
            cy.get('.has-error').eq(6).should('be.visible').and('contain.text', 'CAVV Algorithm').and('contain.text', 'CAVV Algorithm is required')
        }
        else if (PG == 'Shift4') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Clerk ID').and('contain.text', 'Clerk ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Access Token').and('contain.text', 'Access Token is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Interface Name').and('contain.text', 'Interface Name is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Interface Version').and('contain.text', 'Interface Version is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Company Name').and('contain.text', 'Company Name is required')
        }
        else if (PG == 'BAC Credomatic') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Terminal ID').and('contain.text', 'Terminal ID is required')
        }
        else if (PG == 'Borgun') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Private Key').and('contain.text', 'Private Key is required')
        }
        else if (PG == 'BorgunBGateway') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Version').and('contain.text', 'Version is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Processor').and('contain.text', 'Processor is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(5).should('be.visible').and('contain.text', 'Terminal ID').and('contain.text', 'Terminal ID is required')
        }
        else if (PG == 'CardNet') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Terminal ID ').and('contain.text', 'Terminal ID is required')
        }
        else if (PG == 'CardStream') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Signature Key').and('contain.text', 'Signature Key is required')
        }
        else if (PG == 'Cybersource') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Profile ID').and('contain.text', 'Profile ID is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Api Key ID').and('contain.text', 'Api Key ID is required.')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Shared Secret Key').and('contain.text', 'Shared Secret Key is required')
        }
        else if (PG == 'eWAY') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Key').and('contain.text', 'API Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
        }
        else if (PG == 'Heartland') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Public Key').and('contain.text', 'Public Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Secret Key').and('contain.text', 'Secret Key is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Developer ID').and('contain.text', 'Developer ID is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Version Number').and('contain.text', 'Version Number is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Certi Mode').and('contain.text', 'Certi Mode is required')
        }
        else if (PG == 'Mercado Pago') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Public Key').and('contain.text', 'Public Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Access Token').and('contain.text', 'Access Token is required')
        }
        else if (PG == 'Moneris') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Store ID').and('contain.text', 'Store ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'API Token').and('contain.text', 'API Token is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Processing Country').and('contain.text', 'Processing Country is required')
        }
        else if (PG == 'NMI') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
        }
        else if (PG == 'NomuPay') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Processing Account ID').and('contain.text', 'Processing Account ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'KID').and('contain.text', 'KID is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Shared Key').and('contain.text', 'Shared Key is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Region').and('contain.text', 'Region is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Card Currency').and('contain.text', 'Card Currency is required')
        }
        else if (PG == 'Nuvei') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Merchant Site ID').and('contain.text', 'Merchant Site ID is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Secret Key').and('contain.text', 'Secret Key is required')
        }
        else if (PG == 'PayFast') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Merchant Key').and('contain.text', 'Merchant Key is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Salt Passphrase').and('contain.text', 'Salt Passphrase is required')
        }
        else if (PG == 'PayGate') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Pay Gate ID').and('contain.text', 'Pay Gate ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
        }
        else if (PG == 'PayPal Business') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Client ID').and('contain.text', 'Client ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Client Secret').and('contain.text', 'Client Secret is required')
        }
        else if (PG == 'PayPalPaymentsPro') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Vendor').and('contain.text', 'Vendor is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Partner').and('contain.text', 'Partner is required')
        }
        else if (PG == 'PayZen') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Username').and('contain.text', 'API Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'API Password').and('contain.text', 'API Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Capture Delay Days').and('contain.text', 'Capture Delay Days is required')
        }
        else if (PG == 'PeleCard') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Terminal Number').and('contain.text', 'Terminal Number is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
        }
        else if (PG == 'PesoPay') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant Id is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Login ID').and('contain.text', 'Login Id is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Secure Hash Secret Key').and('contain.text', 'Secure Hash Secret Key is required')
        }
        else if (PG == 'Rapyd (Korta') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Terminal ID').and('contain.text', 'Terminal ID is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Merchant Number').and('contain.text', 'Merchant Number is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Language').and('contain.text', 'Language is required')
            cy.get('.has-error').eq(5).should('be.visible').and('contain.text', 'Original Amount').and('contain.text', 'Original Amount is required')
            cy.get('.has-error').eq(6).should('be.visible').and('contain.text', 'Wait Time').and('contain.text', 'Wait Time is required')
        }
        else if (PG == 'Rapyd Card Payments') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Access Key').and('contain.text', 'Access Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Secret Key').and('contain.text', 'Secret Key is required')
        }
        else if (PG == 'Tilopay') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Key').and('contain.text', 'API Key is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'API User').and('contain.text', 'API User is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'API Password').and('contain.text', 'API Password is required')
        }
        else if (PG == 'Windcave') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Username').and('contain.text', 'Username is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Password').and('contain.text', 'Password is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Merchant Reference').and('contain.text', 'Merchant Reference is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Enable Add Bill Card').and('contain.text', 'Enable Add Bill Card is required')
        }
        else if (PG == 'WorldLine (IngenicoDirect') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'API Key ID').and('contain.text', 'API Key ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Secret API Key').and('contain.text', 'Secret API Key is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
        }
        else if (PG == 'WorldPay') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Securenet ID').and('contain.text', 'Securenet Id is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Secure Net Key').and('contain.text', 'Secure Net Key is required')
        }
        else if (PG == 'WorldPayOnline') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant ID').and('contain.text', 'Merchant ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Service Key').and('contain.text', 'Service Key is required')
        }
        else if (PG == 'WorldPayVantiv') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Terminal ID').and('contain.text', 'Terminal ID is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'Account ID').and('contain.text', 'Account ID is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'Account Token').and('contain.text', 'Account Token is required')
            cy.get('.has-error').eq(3).should('be.visible').and('contain.text', 'Application ID').and('contain.text', 'Application ID is required')
            cy.get('.has-error').eq(4).should('be.visible').and('contain.text', 'Acceptor ID').and('contain.text', 'Acceptor ID is required')
            cy.get('.has-error').eq(5).should('be.visible').and('contain.text', 'Application Name').and('contain.text', 'Application Name is required')
            cy.get('.has-error').eq(6).should('be.visible').and('contain.text', 'Application Version').and('contain.text', 'Application Version is required')

        }
        else if (PG == 'WorldPayWPG') {
            this.validateToast('Payment Gateway not connected. You may skip this step if you wish')
            cy.get('.has-error').eq(0).should('be.visible').and('contain.text', 'Merchant Code').and('contain.text', 'Merchant Code is required')
            cy.get('.has-error').eq(1).should('be.visible').and('contain.text', 'XMLAPI Username').and('contain.text', 'XMLAPI Username is required')
            cy.get('.has-error').eq(2).should('be.visible').and('contain.text', 'XML Password').and('contain.text', 'XML Password is required')
        }
    }
    clickBlueTick() {
        cy.get('.mb-4 .fa-check-circle').if().should('be.visible').then(tick => {
            tick.click()
            cy.get('[class="view-edit-title"]').should('be.visible').and('contain.text', 'Are you sure you want to update the value?')
            cy.get('.swal2-confirm').should('be.visible').and('contain.text', 'Yes').click().wait(300)
        })
    }
    connectToStripe() {
        cy.get('.stripeblock .btn-primary').should('be.visible').click() //Connect to Stripe OR Connected to Stripe
        cy.origin('https://connect.stripe.com/', () => {
            cy.get('button[id="skip-account-app"]').should('be.visible').and('contain.text', 'Skip this form').click()
        })
        cy.url().should('include', '/payment-gateway-connect')
        cy.verifyToast('Successfully connected to Stripe')
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('.stripeblock .btn-primary').should('be.visible').and('contain.text', 'Connected To Stripe')
    }
    connectToAuthorizeNet(apiLoginID, transactionKey, signatureKey, cvvStatus, zipCodeStatus, billingAddStatus) {
        cy.get('.loading-label').should('not.exist') //loader should be disappear
        cy.get('img[src*="/authorize_new.png"]').should('be.visible') //logo
        cy.get('label[title="API Login ID"]').should('contain.text', 'API Login ID') //API Login ID
        cy.get('[id="merchant_login_id"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="merchant_login_id"]').should('be.visible').and('not.be.disabled').type(apiLoginID) // input
        this.clickBlueTick()

        cy.get('label[title="Transaction Key"]').should('contain.text', 'Transaction Key') //Transaction Key
        cy.get('[id="merchant_transaction_key"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="merchant_transaction_key"]').should('be.visible').and('not.be.disabled').type(transactionKey) //input
        this.clickBlueTick()

        cy.get('label[for="signature_key"]').should('contain.text', 'Signature Key') //Signature Key
        cy.get('[id="signature_key"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="signature_key"]').should('be.visible').and('not.be.disabled').type(signatureKey) //input
        this.clickBlueTick()

        cy.get('[for="collect_ccv"]').should('contain.text', 'CCV Required') //CCV Required
        if (cvvStatus == 1) {
            cy.get('[name="collect_ccv"]').should('exist').check() //CCV Required checkbox
        } else if (cvvStatus == 0) {
            cy.get('[name="collect_ccv"]').should('exist').uncheck() //CCV Required checkbox
        }

        cy.get('[for="collect_zip"]').should('contain.text', 'Collect Zip Code') //Collect Zip Code
        if (zipCodeStatus == 1) {
            cy.get('input[name="collect_zip"]').should('exist').check() //Collect Zip Code checkbox
        } else if (zipCodeStatus == 0) {
            cy.get('input[name="collect_zip"]').should('exist').uncheck() //Collect Zip Code checkbox
        }

        cy.get('[for="collect_billing_address"]').should('contain.text', 'Collect Billing Address') //Collect Billing Address
        if (billingAddStatus == 1) {
            cy.get('#collect_billing_address').should('exist').check() // Collect Billing Address checkbox
        } else if (billingAddStatus == 0) {
            cy.get('#collect_billing_address').should('exist').uncheck() // Collect Billing Address checkbox
        }
    }
    connectToCybersource(merchantID, profileID, apiKeyID, sharedSecretKey, threeDS) {
        cy.get('img[src*="/cybersource.png"]').should('be.visible') //logo

        cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
        cy.get('[id="merchant_id"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="merchant_id"]').should('be.visible').type(merchantID) //input

        cy.get('label[for="profile_id"]').should('contain.text', 'Profile ID') //Profile ID
        cy.get('[id="profile_id"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="profile_id"]').should('be.visible').type(profileID) //input

        cy.get('label[title="Api key ID"]').should('contain.text', 'Api Key ID') //Api key ID
        cy.get('[id="api_key_id"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="api_key_id"]').should('be.visible').type(apiKeyID) //input

        cy.get('label[title="Shared secret key"]').should('contain.text', 'Shared Secret Key') //Shared secret key
        cy.get('[id="shared_secret_key"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="shared_secret_key"]').should('be.visible').type(sharedSecretKey) //input
        
        if (threeDS == 1) {
            cy.get('input[id="enable3DS"]').if().should('be.visible').check() //3ds check
        } else if (threeDS == 0) {
            cy.get('input[id="enable3DS"]').if().should('be.visible').uncheck() //3ds check
        }  
        cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
        cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
    }
    connectToRedsys(merchantCode, merchantKey, terminalNumber) {
        cy.get('img[src*="/redsys.png"]').should('be.visible') //logo

        cy.get('label[for="merchant_code"]').should('contain.text', 'Merchant Code (FUC)') //Merchant Code (FUC)
        cy.get('[id="merchant_code"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="merchant_code"]').should('be.visible').type(merchantCode) //input

        cy.get('[for="signature_key"]').should('contain.text', 'Merchant Key') //Merchant Key
        cy.get('[id="signature_key"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="signature_key"]').should('be.visible').type(merchantKey) //input

        cy.get('[for="terminal"]').should('contain.text', 'Terminal Number') //Terminal Number
        cy.get('[id="terminal"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="terminal"]').should('be.visible').type(terminalNumber) //input
    }
    connectToPayfast(merchantID, merchantKey, salthPassphrase) {
        cy.get('img[src*="/payfast.png"]').should('be.visible') //logo

        cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
        cy.get('[id="merchant_id"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="merchant_id"]').should('be.visible').type(merchantID) //input

        cy.get('label[title="Merchant Key"]').should('contain.text', 'Merchant Key') //Merchant Key
        cy.get('[id="merchant_key"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="merchant_key"]').should('be.visible').type(merchantKey) //input

        cy.get('label[title="Salt Passphrase"]').should('contain.text', 'Salt Passphrase') //Salt Passphrase
        cy.get('[id="salt_passphrase"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="salt_passphrase"]').should('be.visible').type(salthPassphrase) //input

        cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
        cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
    }
    connectToTilopay(apiKey, apiUser, apiPassword) {
        cy.get('img[src*="/tilopay.png"]').should('be.visible') //logo

        cy.get('label[title="API Key"]').should('contain.text', 'API Key') //API Key
        cy.get('[id="key"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="key"]').should('be.visible').type(apiKey) //input

        cy.get('label[title="API User"]').should('contain.text', 'API User') //API User
        cy.get('[id="apiuser"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="apiuser"]').should('be.visible').type(apiUser) //input

        cy.get('label[title="API Password"]').should('contain.text', 'API Password') //API Password
        cy.get('[id="password"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="password"]').should('be.visible').type(apiPassword) //input

        cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
        cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
    }
    connectWorldPayWPG(merchantCode, XMLAPIUsername, XMLPassword, threeDS, billingAddStatus) {
        cy.get('img[src*="/worldpay_new.png"]').should('be.visible') //logo

        cy.get('label[title="Merchant Code"]').should('contain.text', 'Merchant Code') //Merchant Code
        cy.get('[id="MerchantCode"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="MerchantCode"]').should('be.visible').type(merchantCode) //input

        cy.get('label[title="XMLAPI Username"]').should('contain.text', 'XMLAPI Username') //XMLAPI Username
        cy.get('[id="XMLAPIUsername"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="XMLAPIUsername"]').should('be.visible').type(XMLAPIUsername) //input

        cy.get('label[title="XML Password"]').should('contain.text', 'XML Password') //XML Password
        cy.get('[id="XMLPassword"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="XMLPassword"]').should('be.visible').type(XMLPassword) //input

        if (threeDS == 1) {
            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check    
        } else if (threeDS = 0) {
            cy.get('input[id="enable3DS"]').should('be.visible').uncheck() //3ds check
        }
        if (billingAddStatus = 1) {
            cy.get('input[id="collect_billing_address"]').should('be.visible').check() //Collect billing address checkbox
        } else if (billingAddStatus = 0) {
            cy.get('input[id="collect_billing_address"]').should('be.visible').uncheck() //Collect billing address checkbox
        }
        cy.get('label[title="Collect Billing Address"]').should('be.visible').and('contain.text', 'Collect Billing Address') //label

        cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
        cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
    }
    connectPaypalBusiness(clientID, clientSecret) {
        cy.get('img[src*="/paypal.png"]').should('be.visible') //logo

        cy.get('label[title="Client ID"]').should('contain.text', 'Client ID') //Client ID
        cy.get('[id="ClientID"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="ClientID"]').should('be.visible').type(clientID) //input

        cy.get('label[title="Client Secret"]').should('contain.text', 'Client Secret') //Client Secret
        cy.get('[id="ClientSecret"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="ClientSecret"]').should('be.visible').type(clientSecret) //input
    }
    connectToMercadoPago(publicKey, accessToken, currency = null) {
        cy.get('img[src*="/mercadopago.png"]').should('be.visible') //logo

        cy.get('label[title="Public Key"]').should('contain.text', 'Public Key') //Public Key
        cy.get('[id="public_key"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="public_key"]').should('be.visible').type(publicKey) //input

        cy.get('label[title="Access Token"]').should('contain.text', 'Access Token') //Access Token
        cy.get('[id="access_token"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="access_token"]').should('be.visible').type(accessToken) //input

        if (currency == null) {
            cy.get('#convert_tran_currency_dropdown_toggle').should('exist').uncheck({ force: true }) //disable the toggle
        } else {
            cy.get('#convert_tran_currency_dropdown_toggle').should('exist').check({ force: true }) //enable the currency toggle
            cy.get('.currency-wrapper [id="currency-selector"]').should('be.visible').click() //currency dropdown
            cy.get('.custom-dropdown-selector-list .option__desc').contains(currency).should('exist').click()
        }
        cy.get('.currency-wrapper .checkbox-toggle.checkbox-choice').should('be.visible').and('contain.text', 'Convert all payments to this currency')
    }
    connectToMoneris(storeID, apiToken, country, threeDS) {
        cy.get('img[src*="/moneris-logo.png"]').should('be.visible') //logo

        cy.get('label[title="Store ID"]').should('contain.text', 'Store ID') //Store ID
        cy.get('[id="StoreID"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="StoreID"]').should('be.visible').type(storeID) //input

        cy.get('label[title="API Token"]').should('contain.text', 'API Token') //API Token
        cy.get('[id="APIToken"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="APIToken"]').should('be.visible').type(apiToken) //input

        cy.get('[id="ProcessingCountry"]').should('be.visible').select(country)

        if (threeDS == 1) {
            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
        } else if (threeDS == 0) {
            cy.get('input[id="enable3DS"]').should('be.visible').uncheck() //3ds check
        }
        cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
        cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
    }
    connectToRapydCardPayments(accessKey, secretKey) {
        cy.get('img[src*="/rapyd-logo-red.png"]').should('be.visible') //logo

        cy.get('label[title="Access Key"]').should('contain.text', 'Access Key') //Access Key
        cy.get('[id="AccessKey"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="AccessKey"]').should('be.visible').type(accessKey) //input

        cy.get('label[title="Secret Key"]').should('contain.text', 'Secret Key') //Secret Key
        cy.get('[id="SecretKey"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="SecretKey"]').should('be.visible').type(secretKey) //input

    }
    connectToeWAY(apiKey, password) {
        cy.get('img[src*="/eway.png"]').should('be.visible') //logo

        cy.get('label[title="API Key"]').should('contain.text', 'API Key') //API Key
        cy.get('[id="APIKey"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="APIKey"]').should('be.visible').type(apiKey) //input

        cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
        cy.get('[id="Password"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="Password"]').should('be.visible').type(password) //input
    }
    connectToNMI(username, password, billingAddStatus, threeDS) {
        cy.get('img[src*="/nmi.png"]').should('be.visible') //logo

        cy.get('label[title="Username"]').should('contain.text', 'Username') //Username
        cy.get('[id="Username"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="Username"]').should('be.visible').type(username) //input

        cy.get('label[title="Password"]').should('contain.text', 'Password') //Password
        cy.get('[id="Password"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="Password"]').should('be.visible').type(password) //input

        if (billingAddStatus == 1) {
            cy.get('input[id="collect_billing_address"]').should('exist').check()
        } else if (billingAddStatus == 0) {
            cy.get('input[id="collect_billing_address"]').should('exist').uncheck()
        }
        cy.get('[for="collect_billing_address"]').should('be.visible').and('contain.text', 'Collect Billing Address')
        if (threeDS == 1) {
            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
        } else if (threeDS == 0) {
            cy.get('input[id="enable3DS"]').should('be.visible').uncheck() //3ds check
        }

        cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
        cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
    }
    connectToTotalProcessing(entityID, accessToken, threeDS) {
        cy.get('img[src*="/total_processing_logo.png"]').should('be.visible') //logo

        cy.get('label[title="Entity ID"]').should('contain.text', 'Entity ID') //Entity ID
        cy.get('[id="EntityID"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="EntityID"]').should('be.visible').type(entityID) //input

        cy.get('label[title="Access Token"]').should('contain.text', 'Access Token') //accessToken
        cy.get('[id="AccessToken"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="AccessToken"]').should('be.visible').type(accessToken) //input


        if (threeDS == 1) {
            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
        } else if (threeDS == 0) {
            cy.get('input[id="enable3DS"]').should('be.visible').uncheck() //3ds check
        }

        cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
        cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
    }
    connectToNuvei(merchantID, merchantSiteID, secretKey, threeDS) {
        cy.get('[src*="/nuvei.png"]').should('be.visible') //logo

        cy.get('label[title="Merchant ID"]').should('contain.text', 'Merchant ID') //Merchant ID
        cy.get('[id="MerchantID"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="MerchantID"]').should('be.visible').type(merchantID) //input

        cy.get('label[title="Merchant Site ID"]').should('contain.text', 'Merchant Site ID') //Merchant Site ID
        cy.get('[id="MerchantSiteID"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="MerchantSiteID"]').should('be.visible').type(merchantSiteID) //input

        cy.get('label[title="Secret Key"]').should('contain.text', 'Secret Key') //Secret Key
        cy.get('[id="SecretKey"] .fa-pencil-alt').if().click() //pencil icon
        cy.get('[id="SecretKey"]').should('be.visible').type(secretKey) //input

        if (threeDS == 1) {
            cy.get('input[id="enable3DS"]').should('be.visible').check() //3ds check
        } else if (threeDS == 0) {
            cy.get('input[id="enable3DS"]').should('be.visible').uncheck() //3ds check
        }

        cy.get('[for="pg_chargeback_protection"]').should('be.visible').and('contain.text', 'Chargeback Protection Included for')
        cy.get('.badge.badge-success').should('exist').and('contain.text', 'FREE')
    }
}