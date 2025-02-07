import { Dashboard } from "./Dashboard"

const dashboard = new Dashboard

export class LoginPage {

    happyLogin(email, password) {
        
        sessionStorage.clear()
        cy.clearAllCookies({ log: true })
        cy.clearAllLocalStorage('your item', { log: true })
        cy.clearAllSessionStorage()
        this.exceptionError()
        
        cy.visit('/login')
        //cy.get("a[href*='.chargeautomation.com/login']").click()
        cy.get('.signup-upper h2').should('contain.text', 'Log In').and('be.visible')
        cy.get('.signup-upper > p').should('have.text', 'Welcome back to ChargeAutomation').and('be.visible')
        cy.get('.loading-label').should('not.exist') //loader should be disappear 
        cy.get('.email label').should('be.visible').and('contain.text', 'Email') //label
        cy.get("input[name='email']").should('be.visible').type(email)
        cy.get('.lock label').should('be.visible').and('contain.text', 'Password') //label
        cy.get("input[name='password']").should('be.visible').type(password, { force: true })

        cy.get('[href="/password-reset"]').should('be.visible').and('contain.text', 'Forgot Password?') //Forgot Password?
        cy.get('.remember-login').should('be.visible').and('contain.text', 'Remember Me') //Remeber Me 
        cy.get('.remember-login [name="remember"]').should('exist') //checkbox Remeber Me

        cy.get('[class="form-footer-link"]').should('be.visible').and('contain.text', 'Do not have an account yet?')
        cy.get('[class="form-footer-link"] [href="/register"]').should('be.visible').and('contain.text', 'Signup') //Signup link

        cy.get('#loginbtn').should('be.visible').and('contain.value', 'Log In').click({ force: true }) //Log In
        cy.get('.loading-label').should('not.exist') //loader should be disappear 

        //OTP Verification
        cy.get('h3').should('be.visible').and('contain.text', 'A code has been emailed to you')
        cy.get('h2').should('be.visible').and('contain.text', 'Hello ')
        cy.get('[style="opacity: 0.8 !important;"]').eq(0).should('be.visible').and('contain.text', 'Please check your inbox (' + email + ') for confirmation code')
        cy.get('[id="ResendEmailBtn"]').should('be.visible').and('contain.text', 'Resend Email')
        cy.get('[style="opacity: 0.8 !important;"]').eq(1).should('be.visible').and('contain.text', '↩ Back to Login')
        cy.get('[class="m-login__account-msg"]').should('be.visible').and('contain.text', 'Powered by')
        cy.get('[href*="https://chargeautomation.com/"]').eq(0).should('be.visible').and('contain.text', 'ChargeAutomation')
        cy.get('[href*="https://chargeautomation.com/contact-us"]').eq(0).should('be.visible').and('contain.text', 'Contact')

        cy.task('queryDb', "SELECT otp FROM users WHERE email='"+email+"';").then((result) => {
            const otp = result[0].otp.toString()
            cy.get('input[id="otp1"]').type(otp[0])
            cy.get('input[id="otp2"]').type(otp[1])
            cy.get('input[id="otp3"]').type(otp[2])
            cy.get('input[id="otp4"]').type(otp[3])
            cy.get('input[id="otp5"]').type(otp[4])
            cy.get('input[id="otp6"]').type(otp[5])
            
            cy.get('[id="ContinueBtn"]').should('be.visible').and('contain.text','Sign in').click() //Sign in
            //cy.get('.toast').should('contain.text','Authentication successful! Redirecting to your dashboard...')
            cy.get('.page-title').should('be.visible')
            cy.get('.loading-label').should('not.exist') //loader should be disappear
        })
        return
    }
    exceptionError() {
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
        })
    }
    Login() {
        cy.get("a[href*='.chargeautomation.com/login']").should('have.text', 'Log In').click()
        cy.get('.signup-upper > p').should('have.text', 'Welcome back to ChargeAutomation')
        cy.url().should('include', '/login')
    }
    logout() {
        cy.get('[id="dropdownMenuButton"]').click({ force: true }) //Profile icon
        cy.get('[class="dropdown-item text-danger"]').should('contain.text', 'Logout').click({ force: true }) //Logout
        //cy.get('#intro_section_text_1').should('have.text', 'Streamline check-ins, maximize upsells, elevate every stay') //Validate Logout
        cy.get('.signup-part h2').should('be.visible').and('contain.text', 'Log In')
    }

}