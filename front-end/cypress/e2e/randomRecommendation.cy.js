
beforeEach(async () => {
    await cy.request("DELETE", "http://localhost:5000/e2e/", {});
  });

describe('Test random recommendation page', () => {
    it('Get a random recommendation', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Random').click();
        cy.visit('http://localhost:3000/random')
    })
})