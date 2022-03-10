/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const username = 'mmb.221177@gmail.com';
const password = 'HelloWorld1';


describe('Sign user up', () => {
  it('Sign up in user', () => {

    // cy.intercept('POST', 'https://safers-dashboard.herokuapp.com/*', { fixture: 'user.json' });
    
    cy.visit('http://localhost:3000/auth/sign-up');
  
    cy.get('[data-testid="sign-up-email"]')
      .type(username);
    cy.get('[data-testid="sign-up-email"]').should('have.value', username);
    cy.get('[data-testid="sign-up-firstName"]')
      .type('test');
    cy.get('[data-testid="sign-up-lastName"]')
      .type('user');
    cy.get('[data-testid="sign-up-password"]')
      .type(password);
    cy.get('[data-testid="sign-up-password"]').should('have.value', password);
    cy.get('[data-testid="sign-up-role"]')
      .select('Decision Maker');
    cy.get('[data-testid="sign-up-org"]')
      .select('HRT');
    cy.get('[data-testid="sign-up-agreeTermsConditions"]')
      .check();
    

    cy.get('[data-testid="signUpButton"]')
      .click();

    // Locate and submit the form
    
    // Verify the app redirected you to the dashboard
    cy.location('pathname', { timeout: 10000 }).should('eq', '/dashboard');
    
    
  });
});