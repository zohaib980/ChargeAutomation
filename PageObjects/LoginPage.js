export class LoginPage{
    
    happyLogin(userName, password){
        sessionStorage.clear()
        cy.clearAllCookies({ log: true })
        cy.clearAllLocalStorage('your item', { log: true })
        cy.clearAllSessionStorage()
        this.exceptionError()
        cy.get("a[href='https://master.chargeautomation.com/login']").click()
        cy.get('.signup-upper > p').should('have.text', 'Welcome back to ChargeAutomation')
        cy.get("input[name='email']").type(userName)
        cy.get("input[name='password']").type(password, { force: true })
        cy.get("#loginbtn").click({force: true })
        cy.get('.page-title').should('have.text', 'Welcome Waqas')
        cy.url().should('include', '/dashboard-new')
        return
    }
    exceptionError(){
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
          })
    }
    Login(){
        cy.get('a[href="https://master.chargeautomation.com/login"')
        .should('have.text', 'Log In')
        cy.get("a[href='https://master.chargeautomation.com/login']").click()
        cy.get('.signup-upper > p').should('have.text', 'Welcome back to ChargeAutomation')
        cy.url().should('include', '/login')
    }
    addEmail(emailid){
        cy.get('input[name="email"]').should('have.attr', 'placeholder', 'Email').type(emailid)
    }
    addPassword(pass){
        cy.get('input[name="password"]').should('have.attr', 'placeholder', 'password').type(pass, { force: true })
    }
    clickLoginButton(){
        cy.get(loginElementLocators.LoginPageLocators.login_user).click({force: true })
        cy.get('.page-title').should('have.text', 'Welcome Waqas') //Validate that user on dashbaord
        cy.url().should('include', '/dashboard-new')
    }
    logout(){
        cy.get('[id="dropdownMenuButton"]').click() //Profile icon
        cy.get('[class="dropdown-item text-danger"]').should('contain.text','Logout').click() //Logout
        cy.wait(4000)
        cy.get('#intro_section_text_1').should('have.text', 'Powerful Payment Processing') //Validate Logout
    }
        
}