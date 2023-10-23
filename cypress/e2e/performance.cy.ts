/// <reference types="cypress" />

describe('performance spec', () => {
    it('passes', () => {
        /**
         * Login
         */
        cy.visit('/');
        cy.wait(2000);
        cy.get('#goto-login').should('be.visible').click();
        cy.wait(1000);
        cy.get('#email').should('be.visible').type('cypress@user.com');
        cy.wait(1000);
        cy.get('#password').should('be.visible').type('test123');
        cy.wait(1000);
        cy.get('#login button').should('be.visible').click();
        cy.wait(3000);

        /**
         * Progress
         */
        cy.visit('/progress');
        cy.wait(5000);
        // select gym
        cy.get('#gyms').select('Boulder Olymp');
        cy.wait(5000);
        cy.get('.minus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.minus-button').click({multiple: true});
        cy.wait(2000);
        cy.get('.plus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.plus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.plus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.plus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.plus-button').click({multiple: true});
        cy.wait(2000);
        // switch gym
        cy.get('#gyms').select('Rocklands');
        cy.wait(5000);
        cy.get('.minus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.minus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.plus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.plus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.plus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.plus-button').click({multiple: true});
        cy.wait(1000);
        cy.get('.plus-button').click({multiple: true});
        cy.wait(2000);
    })
})