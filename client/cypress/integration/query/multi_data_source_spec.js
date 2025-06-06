describe("Multi Data Source Selector", () => {
  beforeEach(() => {
    cy.login();
    cy.visit("/queries/new");
  });

  it("keeps order after reload", () => {
    cy.getByTestId("SelectDataSource").click();
    cy.get(".ant-select-item-option").eq(0).click();
    cy.getByTestId("SelectDataSource").click();
    cy.get(".ant-select-item-option").eq(1).click();
    cy.getByTestId("SelectDataSource").click();
    cy.get(".ant-select-item-option").eq(2).click();

    cy.get(".ant-select-selection-item").eq(1).dragBy(-50, 0, true);

    cy.getByTestId("SaveButton").click();
    cy.url().should("match", /\/queries\/(\d+)\/source/);

    cy.get(".ant-select-selection-item").then(items => {
      const order = Cypress._.map(items, el => el.textContent.trim());
      expect(order.length).to.equal(3);
      cy.reload();
      cy.get(".ant-select-selection-item").then(reloaded => {
        const newOrder = Cypress._.map(reloaded, el => el.textContent.trim());
        expect(newOrder).to.deep.equal(order);
      });
    });
  });
});
