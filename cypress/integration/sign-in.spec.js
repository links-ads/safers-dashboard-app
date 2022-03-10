/* eslint-disable no-undef */

import { getSession } from '../../src/helpers/authHelper';

const username = 'mmb.221177@gmail.com';
const password = '123456';
// describe('The Home Page', () => {
//   it('successfully loads', () => {
//     cy.visit('http://localhost:3000/')
//   })
// })
describe('Sign in in', () => {
  it('Logn in user', () => {
    cy.visit('http://localhost:3000/auth/sign-in');
  
    cy.get('[data-testid="sign-in-email"]')
      .type(username);
    cy.get('[data-testid="sign-in-email"]').should('have.value', username);
    cy.get('[data-testid="sign-in-password"]')
      .type(password);
    cy.get('[data-testid="sign-in-password"]').should('have.value', password);

    cy.get('[data-testid="signInButton"]')
      .click();
  
    //we should be redirected to /dashboard
   
      // cy.url().should('include', '/dashboard')
   

    // our auth cookie should be present
    const sessionCookie = getSession();
    // expect(sessionCookie).to.not.equal(null);
  
    // cy.location('pathname').should('eq', '/dashboard')
  });
});