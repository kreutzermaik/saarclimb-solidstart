/// <reference types="cypress" />

describe('performance spec', () => {
    it('passes', () => {
        /**
         * Progress
         */
        cy.visit('/progress');
        cy.wait(3000);
        // Select Gym "Boulder Olymp"
        cy.get('#gyms').select('Boulder Olymp');
        cy.wait(3000);

        for (let i: number = 0; i < 5; i++) {
            cy.get('#button-plus-' + i).click();
            cy.wait(1000);
        }

        cy.wait(3000);

        // Select Gym "Rocklands"
        cy.get('#gyms').select('Rocklands');
        cy.wait(3000);

        for (let i: number = 0; i < 5; i++) {
            cy.get('#button-plus-' + i).click();
            cy.wait(1000);
        }
    })
})