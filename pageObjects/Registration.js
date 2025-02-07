
/// <reference types= "cypress"/>

import { LoginPage } from '../pageObjects/LoginPage'

const loginPage = new LoginPage

export class Registration {
    goToRegistration() {
        cy.visit('/register')
        /*
        cy.get('[class="intro white-text"]').should('be.visible').and('contain.text', 'Streamline check-ins, maximize upsells, elevate every stay')
        cy.get('[class="white-text"]').should('contain.text', "Automate your credit card charging process for all your bookings. For hotels, B&B's, holiday homes, vacation rentals, hostels, agencies.")
        cy.get('.register-button').eq(0).should('be.visible').and('contain.text', 'Log In')
        cy.get('.register-button').eq(1).should('be.visible').and('contain.text', 'Signup').click()
        */
        cy.url().should('include', '/register')
        cy.get('h2').should('be.visible').and('contain.text', 'Signup')
    }
    newRegistration(clientName, companyName, phoneNo, clientEmail, clientPassword, planType) {
        //Signup page
        cy.get('.signup-area__guest-text').should('be.visible').and('contain.text', 'Are you a Guest?')
        cy.get('.signup-area__guest-btn').should('be.visible').and('contain.text', 'Click Here') //Click Here
        cy.get('.signup-upper').should('be.visible').and('contain.text', 'Signup').and('contain.text', 'Please fill in this form to create an account')
        cy.get('.inner-left').should('contain.text', 'Online Check-in').and('contain.text', 'Payment Automation').and('contain.text', 'Chargeback Protection')
            .and('contain.text', 'Upsell').and('contain.text', 'Smart Guidebook')

        //Fill up Signup form
        cy.get('[placeholder="Full Name"]').should('have.attr', 'placeholder', 'Full Name').type(clientName)
        cy.get('[placeholder="Company Name"]').should('have.attr', 'placeholder', 'Company Name').type(companyName)
        cy.get('[placeholder="(201) 555-0123"]').should('have.attr', 'placeholder', '(201) 555-0123').type('+92' + phoneNo)
        cy.get('[placeholder="Email"]').should('have.attr', 'placeholder', 'Email').type(clientEmail)
        cy.get('[id="password"]').should('exist').type(clientPassword)
        cy.get('[id="password-confirm"]').should('exist').type(clientPassword)
        cy.get('[placeholder="Current Property Management System (PMS)"]').should('exist') //PMS field
        cy.get('.total_properties input').should('be.visible') //Number of Properties field
        cy.get('.agree-link').should('contain.text', 'I agree to the').and('contain.text', 'Terms and Conditions')
        cy.get('[name="agree"]').check({ force: true }) //Checkbox
        cy.get('.form-footer-link').should('contain.text', 'Already have an account?').and('contain.text', 'Log In')
        cy.get('[id="signupbtn"]').should('be.visible').and('contain.value', 'Get Started') // GET STARTED

        // First, make a GET request to the page to get the CSRF token
        cy.request('GET', '/register').then((response) => {

            const html = response.body;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const csrfToken = doc.querySelector('meta[name="csrf-token"]').getAttribute('content');

            expect(csrfToken).to.exist;

            // Use the CSRF token in the POST request
            cy.request({
                method: 'POST',
                url: '/register',
                headers: {
                    'content-type': 'application/json',
                    'x-csrf-token': csrfToken,  // Use the retrieved CSRF token here
                    'x-requested-with': 'XMLHttpRequest',
                    'x-xsrf-token': csrfToken  // Use the retrieved CSRF token here
                },
                referrer: '/register',
                referrerPolicy: 'strict-origin-when-cross-origin',
                body: {
                    "name": clientName,
                    "companyname": companyName,
                    "phone": "+92" + phoneNo,
                    "email": clientEmail,
                    "code": "",
                    "current_pms": "",
                    "isAutomationTesting": true,
                    "password_confirmation": clientPassword,
                    "password": clientPassword,
                    "agree": true,
                    "client_ip": "",
                    "timezone": "Asia/Karachi",
                    "country": null,
                    "number_of_properties": "2",
                    "error_status": {
                        "name": false,
                        "companyname": false,
                        "phone": false,
                        "email": false,
                        "code": false,
                        "current_pms": false,
                        "recaptchaToken": false,
                        "password_confirmation": false,
                        "password": false,
                        "agree": false,
                        "number_of_properties": false
                    },
                    "error_message": {
                        "name": "",
                        "companyname": "",
                        "phone": "",
                        "email": "",
                        "code": "",
                        "current_pms": "",
                        "recaptchaToken": "",
                        "password_confirmation": "",
                        "password": "",
                        "agree": "",
                        "number_of_properties": ""
                    },
                    "billing_plan_type": planType
                }
            }).then((response) => {
                expect(response.status).to.eq(200)
                cy.log(response.body)
            })
        })
    }

    goToGuerrillaMail(clientEmail) {
        cy.visit('https://www.guerrillamail.com/inbox').wait(3000)
        cy.get('[title="Click to Edit"]').should('be.visible').click().wait(1000)
        cy.get('[class="editable button edit-in-progress"]').should('be.visible').type(clientEmail).wait(2000)
        cy.get('[class="save button small"]').should('be.visible').should('contain.text', 'Set').click().wait(2000) //set
    }
    verifyGuerrillaMail(clientEmail, maxAttempts, count = 1) {
        if (count > maxAttempts) {
            console.log('Max retries reached. No email is received for new user registration')
            console.log('Trying to get the verification link from DB')
            this.verifyEmailFromDb(clientEmail)
            return
        }

        cy.log('Try Count: ' + count)
        cy.get('.mail_row').contains('ChargeAutomation: Verify Your Email Address')
            .if().then((email) => {
                cy.wrap(email).click()
                cy.get('a[href*=".chargeautomation.com/securelink/"]').should('be.visible').and('contain.text', 'Verify Now').then($link => {
                    // Get the href attribute of the link
                    const href = $link.attr('href')
                    cy.log('Navigating to:', href)
                    cy.visit(href) // Verify link
                    cy.url().should('include', '/login')
                    cy.get('.alert').should('be.visible').and('contain.text', 'Verified Successfully')
                })
            })
            .else().then(() => {
                cy.wait(11000)
                this.verifyGuerrillaMail(clientEmail, maxAttempts, count + 1)
            })
    }
    /*
    verifyNewUserByEmail(maxRetries, clientEmail, retryCount = 0) {
        cy.get('#ifinbox').then($iframe => {
            const $body = $iframe.contents().find('body')
            if (!$body.text().includes('ChargeAutomation: Verify Your Email Address') && (retryCount < parseInt(maxRetries))) {
                retryCount++
                cy.log('Retry Count: '+ retryCount)
                cy.get('#refresh').should('be.visible').click() //Refresh the mail box
                cy.wait(5000)
                this.verifyNewUserByEmail(maxRetries, clientEmail, retryCount) // Recursively call the function to check again
            } else if (retryCount >= parseInt(maxRetries)) {
                throw new Error('Max retries reached. No email is received for new user registration')
            } else {
                cy.get('#ifinbox').then($iframe => { // Find email and click
                    const $body = $iframe.contents().find('body')
                    cy.wrap($body).find('.lms').contains('ChargeAutomation: Verify Your Email Address').should('be.visible').click()
                })
                cy.wait(3000)
                cy.get('#ifmail').then($iframe => {
                    const $body = $iframe.contents().find('body')
                    cy.wrap($body).find('#mail [href*="/securelink/"]').should('contain.text', 'Verify Now').then($link => {
                        // Get the href attribute of the link
                        const href = $link.attr('href')
                        cy.log('Navigating to:', href)
                        cy.visit(href); // Verify link
                        cy.url().should('include', '/login')
                        cy.get('.alert').should('be.visible').and('contain.text', 'Verified Successfully')
                    })
                })
            }
        })
    }
    */
    goToYopmail(clientEmail) {
        cy.visit('https://yopmail.com/')
        cy.get('.titinput').should('be.visible').and('contain.text', 'Type the Email name of your choice')
        cy.wait(4000)
        cy.get('[placeholder="Enter your inbox here"]').should('exist').clear().type(clientEmail)
        cy.wait(5000)
        cy.get('[title="Check Inbox @yopmail.com"]').should('be.visible').click({ force: true })
        cy.get('.wminbox').should('be.visible').wait(3000)
    }
    verifyYopmailEmail(clientEmail, maxAttempts, count = 1) {
        if (count > maxAttempts) {
            console.log('Max retries reached. No email is received for new user registration')
            console.log('Trying to get the verification link from DB')
            this.verifyEmailFromDb(clientEmail)
            return
        }

        cy.log('Try Count: ' + count)
        cy.getIframeBody('iframe[name="ifinbox"]').then(body => {
            if (!body.text().includes('ChargeAutomation: Verify Your Email Address')) { // Email not found
                cy.log('Email not found. Retrying...')
                cy.get('button#refresh').should('be.visible').click() // Refresh
                cy.wait(7000) // Wait before retrying
                this.verifyYopmailEmail(clientEmail, maxAttempts, count + 1) // Retry
            } else { // Email found
                cy.getIframeBody('iframe[name="ifmail"]').then(mailBody => {
                    cy.wrap(mailBody)
                        .find('a[href*=".chargeautomation.com/securelink/"]')
                        .should('be.visible')
                        .and('contain.text', 'Verify Now')
                        .then($link => {
                            const href = $link.attr('href')
                            cy.log('Navigating to:', href)
                            cy.visit(href) // Visit the verification link
                            cy.url().should('include', '/login')
                            cy.get('.alert').should('be.visible').and('contain.text', 'Verified Successfully')
                        })
                })
            }
        })
    }

    verifyEmailFromDb(clientEmail) {
        const query = `SELECT * FROM jobs WHERE payload LIKE '%Welcome To ChargeAutomation%' AND payload LIKE '%${clientEmail}%';`
        cy.task('queryDb', query).then(response => {
            // Check if the response is null or empty
            if (!response || response.length === 0) {
                throw new Error('No matching records found in the database.')
            }

            cy.log(response)
            response.forEach(item => {
                const payload = JSON.parse(item.payload)
                const command = payload.data.command
                cy.log(command) // Add logging to inspect the command

                // Define a flexible regex to extract the dynamic link
                const urlMatch = command.match(/https:\/\/[a-zA-Z0-9]+\.chargeautomation\.com\/securelink\/[a-zA-Z0-9]+/)

                if (urlMatch && urlMatch.length > 0) {
                    const dynamicLink = urlMatch[0]
                    cy.log(dynamicLink) // Log the extracted dynamic link
                    cy.visit(dynamicLink)
                    cy.url().should('include', '/login')
                    cy.get('.alert').should('be.visible').and('contain.text', 'Verified Successfully')
                } else {
                    throw new Error('Dynamic link not found in the payload')
                }
            })
        })
    }
    verifyEmailFromSMTP(clientEmail, maxAttempts = 10, count = 1) {
        if (count > maxAttempts) {
            cy.log('Max retries reached. No email is received for new user registration');
            cy.log('Trying to get the verification link from the database');
            this.verifyEmailFromDb(clientEmail);
            return;
        }

        const baseUrl = Cypress.config('baseUrl');
        const smtpBaseUrl = baseUrl.replace('https://', 'https://smtp-');
        cy.visit(`${smtpBaseUrl}?page=0&pageSize=100`, {
            auth: {
                username: 'admin',
                password: 'ca##smtp',
            }
        });

        cy.log(`Try Count: ${count}`);
        cy.get('.MuiCardContent-root').should('not.contain.text', 'Inbox is empty'); // Inbox should not be empty

        cy.get('body').then($body => {
            const emailRowSelector = `[data-field="toAddress"]:contains(${clientEmail})`;

            if ($body.find(emailRowSelector).length > 0) {
                cy.log('Email found!');
                cy.get(emailRowSelector)
                    .contains(clientEmail)
                    .parents('[role="row"]')
                    .should('exist')
                    .click();

                // Email Content
                cy.get('[id="content-tabpanel-html"]').contains('Welcome To ChargeAutomation').should('be.visible'); // Welcome message
                cy.get('tr td [href*="chargeautomation.com/securelink/"]')
                    .should('contain.text', 'Verify Now')
                    .invoke('attr', 'href')
                    .then(href => {
                        cy.log(`Navigating to: ${href}`);
                        cy.visit(href); // Visit the verification link
                        cy.url().should('include', '/login');
                        cy.get('.alert').should('be.visible').and('contain.text', 'Verified Successfully');
                    });
            } else {
                cy.log('Email not found. Retrying...');
                cy.reload();
                cy.wait(2000); // Wait before retrying
                this.verifyEmailFromSMTP(clientEmail, maxAttempts, count + 1); // Retry
            }
        });
    }

    deleteUserAccount(accountId) {

        cy.task('queryDb', `DELETE FROM user_account_additional_infos WHERE user_account_id = ${accountId}`).then(response => {
            expect([0, 1]).to.include(response.affectedRows) //effected rows are either 1 or 0
        })
        // Delete user account
        cy.task('queryDb', `DELETE FROM user_accounts WHERE id = ${accountId}`).then(response => {
            expect(response.affectedRows).to.equal(1) // Ensure one row was deleted
        })

        // Confirm deletion with a follow-up SELECT query
        cy.task('queryDb', `SELECT * FROM user_accounts WHERE id = ${accountId}`).then((rows) => {
            expect(rows.length).to.equal(0) // Ensure no rows are returned
        })
        /*
        cy.request('GET', '/delete-account/' + accountId).then((response) => {
            expect(response.body).to.eq('Done')
        })
        */
    }
}
