
beforeEach(async () => {
    await cy.request("DELETE", "http://localhost:5000/e2e/", {});
  });

describe('Test top recommendations page', () => {
    it('Find top recommendations', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Top').click();
        cy.visit('http://localhost:3000/top')
    })
})