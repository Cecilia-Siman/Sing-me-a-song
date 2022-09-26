import {faker} from '@faker-js/faker';

beforeEach(async () => {
  await cy.request("DELETE", "http://localhost:5000/e2e/", {});
});

describe('Test upvoting and downvoting post', () => {
    it('Test upvoting', () => {
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

        cy.get('[data-cy="upvote"]').click();
        cy.contains(1);
    });
    it('Test downvoting', () => {
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

        cy.get('[data-cy="downvote"]').click();
        cy.contains(-1);
    });
    it('Delete recommendation downvoted more than 5 times', () => {
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

        for(let i=0; i<6; i++){
            cy.get('[data-cy="downvote"]').click();
        }
        cy.contains('No recommendations yet! Create your own :)');
    })
})