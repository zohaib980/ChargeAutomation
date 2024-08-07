import { Dashboard } from "./Dashboard"

const dashboard = new Dashboard

export class LoginPage{
    
    happyLogin(userName, password){
        sessionStorage.clear()
        cy.clearAllCookies({ log: true })
        cy.clearAllLocalStorage('your item', { log: true })
        cy.clearAllSessionStorage()
        this.exceptionError()
        cy.get("a[href*='.chargeautomation.com/login']").click()
        cy.get('.signup-upper > p').should('have.text', 'Welcome back to ChargeAutomation')
        cy.get("input[name='email']").should('be.visible').type(userName)
        cy.get("input[name='password']").should('be.visible').type(password, { force: true })
        cy.get("#loginbtn").should('be.visible').click({force: true })
        cy.get('.page-title').should('be.visible').should('contain.text', 'Welcome')
        cy.url().should('include', '/dashboard')
        return
    }
    simpleLogin(userName, password){
        cy.get("a[href*='.chargeautomation.com/login']").click()
        cy.get('.signup-upper > p').should('have.text', 'Welcome back to ChargeAutomation')
        cy.get("input[name='email']").should('be.visible').type(userName)
        cy.get("input[name='password']").should('be.visible').type(password, { force: true })
        cy.get("#loginbtn").should('be.visible').click({force: true })
        cy.get('.page-title').should('be.visible')
    }
    exceptionError(){
        Cypress.on('uncaught:exception', (err, runnable) => {
            // returning false here prevents Cypress from
            // failing the test
            return false
          })
    }
    Login(){
        cy.get("a[href*='.chargeautomation.com/login']").should('have.text', 'Log In').click()
        cy.get('.signup-upper > p').should('have.text', 'Welcome back to ChargeAutomation')
        cy.url().should('include', '/login')
    }
    logout(){
        cy.get('[id="dropdownMenuButton"]').click() //Profile icon
        cy.get('[class="dropdown-item text-danger"]').should('contain.text','Logout').click() //Logout
        cy.wait(4000)
        cy.get('#intro_section_text_1').should('have.text', 'Powerful Payment Processing') //Validate Logout
    }
        
}