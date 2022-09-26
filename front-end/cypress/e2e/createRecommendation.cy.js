import {faker} from '@faker-js/faker';

beforeEach(async () => {
  await cy.request("DELETE", "http://localhost:5000/e2e/", {});
});

describe('Test creating a recommendation', () => {
  it('Create correct recommendtion', () => {
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
    cy.url().should("equal", "http://localhost:3000/");
  });
  it('Try to create recommendation with repeated name', () => {
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

    cy.get('[data-cy="name"]').type(newRecommendation.name);
    cy.get('[data-cy="url"]').type(newRecommendation.url);
    cy.get('[data-cy="submit"]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Error creating recommendation!');
    })
  });
  it('Try to create recommendation with empty inputs', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy="submit"]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Error creating recommendation!');
    })
  })
})


