const dsl = require("../../../../../../fixtures/tableV2NewDsl.json");
describe("one click binding mongodb datasource", function () {
  before(() => {
    cy.addDsl(dsl);
  });

  it("test connect datasource", () => {
    bindToMongoDBdatasource();
    searchForTableWorking();
    checkTableUpdateIsWorking();
    checkTableInsertIsWorking();
  });

  function searchForTableWorking() {
    cy.wait(1000);
    const rowWithAValidText = "Godzilla vs. Kong";
    //enter a search text
    cy.get(".t--widget-tablewidgetv2 .t--search-input input").type(
      rowWithAValidText,
    );
    cy.wait(1000);
    // check if the table rows are present for the given search entry
    cy.get(
      '.t--widget-tablewidgetv2 [role="rowgroup"] [role="button"]',
    ).contains(rowWithAValidText);
  }

  function checkTableUpdateIsWorking() {
    cy.editTableCell(0, 0);
    //update the first value of the row
    const enteredSomeValue = "123";
    cy.enterTableCellValue(0, 0, enteredSomeValue);
    cy.wait(1000);

    cy.saveTableCellValue(0, 0);
    //commit that update
    cy.saveTableRow(12, 0);

    cy.wait(1000);
    // check if the updated value is present
    cy.readTableV2data(0, 0).then((cellData) => {
      expect(cellData).to.equal(enteredSomeValue);
    });
  }

  function checkTableInsertIsWorking() {
    //clear input
    cy.get(".t--widget-tablewidgetv2 .t--search-input input").clear();

    //lets create a new row and check to see the insert operation is working
    cy.get(".t--add-new-row").click();
    cy.get(".tableWrap .new-row").should("exist");
    const someUUID = Cypress._.random(0, 1e6);

    const someText = "new row " + someUUID;
    cy.enterTableCellValue(7, 0, someText);

    cy.saveTableCellValue(7, 0);
    // save a row with some random text
    cy.get(".t--widget-tablewidgetv2 button")
      .contains("Save row")
      .click({ force: true });

    cy.wait(5000);

    //search the table for a row having the text used to create a new row
    cy.get(".t--widget-tablewidgetv2 .t--search-input input").type(someText);
    cy.wait(1000);

    //check if that row is present
    cy.get(
      '.t--widget-tablewidgetv2 [role="rowgroup"] [role="button"]',
    ).contains(someText);
  }

  function bindToMongoDBdatasource() {
    cy.openPropertyPane("tablewidgetv2");

    //select a mongoDB datasource
    const datasource = "Movies (1)";
    cy.get(".t--property-control-tabledata").click();
    cy.get('[role="option"]').contains(datasource).click();
    cy.wait(1000);

    const table = "movies";

    // select a table within the datasource
    cy.get(".t--one-click-binding-table-selector input").click().wait(1000);

    cy.get('.t--one-click-binding-table-selector--table[role="option"]')
      .contains(table, { timeout: 20000 })
      .click({ force: true });

    const searchableColumn = "title";

    cy.get(".t--one-click-binding-column-searchableColumn input").click();
    //configure the search by column
    cy.get(
      '.t--one-click-binding-column-searchableColumn--column[role="option"]',
    )
      .contains(searchableColumn)
      .click();

    cy.get("button").contains("CONNECT DATA").click();
    cy.wait(1000);
  }
});
