import {faker} from '@faker-js/faker';

beforeEach(async () => {
    await cy.request("DELETE", "http://localhost:5000/e2e/", {});
  });

describe('Test top recommendations page', () => {
    it('Find top recommendations', () => {
        const newRecommendation = {
            name: faker.random.alpha(10),
            url: "https://www.youtube.com/watch?v=mNEUkkoUoIA"
        }
        cy.visit('http://localhost:3000');
        cy.get('[data-cy="name"]').type(newRecommendation.name);
        cy.get('[data-cy="url"]').type(newRecommendation.url);
        cy.intercept("POST", "http://localhost:5000/recommendations").as("create");
        cy.get('[data-cy="submit"]').click();
        cy.wait("@create");

        cy.visit('http://localhost:3000');
        cy.contains('Top').click();
        cy.visit('http://localhost:3000/top');
        cy.contains('No recommendations yet! Create your own :)').should('not.exist');

        cy.contains('Home').click();
        cy.url().should("equal", 'http://localhost:3000/');
    })
})