import * as _ from "../../../../support/Objects/ObjectsCore";

const { agHelper, apiPage, entityExplorer, jsEditor, locators, propPane } = _;

describe("Disable JS toggle when Action selector code is not parsable", () => {
  before(() => {
    cy.fixture("buttondsl").then((val: any) => {
      agHelper.AddDsl(val);
    });
    apiPage.CreateApi("Api1", "GET");
    entityExplorer.SelectEntityByName("Button1", "Widgets");
  });

  it("1. Bug 22180", () => {
    const codeSnippet = `{{["UI Building", "Actions", "JS", "Autocomplete", "Widgets", "Pages", "Property Pane", "API Pane", "Query Editor", "Datasources", "ACL", "Login / Signup", "Telemetry", "Deployment"].forEach((label, index) => {
      Api1.run((res, param) => {
        let CritLen = 0;
        let HighLen = 0;
        let LowLen = 0;
        let NoPriLen = 0;
        res.map(issue => {
          let noPriVal = 1;
          issue.labels.map(label => {
            if (label.name === "Critical") {
              CritLen++;
              noPriVal = 0;
            } else if (label.name === "High") {
              HighLen++;
              noPriVal = 0;
            } else if (label.name === "Low") {
              LowLen++;
              noPriVal = 0;
            }
          });
          NoPriLen += noPriVal;
        });
        storeValue("Bug-" + param.index + "", {
          x: param.label,
          critY: CritLen,
          highY: HighLen,
          lowY: LowLen,
          noPriY: NoPriLen
        });
      }, undefined, {
        label: label,
        index: index
      });
      Query1.run((res, param) => {
        let CritLen = 0;
        let HighLen = 0;
        let LowLen = 0;
        let NoPriLen = 0;
        res.map(issue => {
          let noPriVal = 1;
          issue.labels.map(label => {
            if (label.name === "Critical") {
              CritLen++;
              noPriVal = 0;
            } else if (label.name === "High") {
              HighLen++;
              noPriVal = 0;
            } else if (label.name === "Low") {
              LowLen++;
              noPriVal = 0;
            }
          });
          NoPriLen += noPriVal;
        });
        storeValue("Feature-" + param.index, {
          x: param.label,
          critY: CritLen,
          highY: HighLen,
          lowY: LowLen,
          noPriY: NoPriLen
        });
      }, undefined, {
        label: label,
        index: index
      });
    });}}`;

    propPane.EnterJSContext("onClick", codeSnippet);
    agHelper.Sleep(200);
    propPane.AssertJSToggleDisabled("onClick");
  });

  it("2. Bug 22505", () => {
    const codeSnippet = `{{
      showAlert('hi')
      setInterval(() => {console.log('this is an interval')} , 7000, 'id')
      showAlert('hello')
        .then(() => {return Api1.data})
      .then(() => clearInterval('id'))
    }}`;

    propPane.EnterJSContext("onClick", codeSnippet);
    agHelper.Sleep(200);
    propPane.AssertJSToggleDisabled("onClick");
  });

  it("3. Bug 22180", () => {
    const codeSnippet =
      "{{ (function(){ return Promise.race([ Api1.run({ name: 1 }), Api1.run({ name: 2 }) ]).then((res) => { showAlert(Winner: ${res.args.name}) }); })() }}";

    propPane.EnterJSContext("onClick", codeSnippet);
    agHelper.Sleep(200);
    propPane.AssertJSToggleDisabled("onClick");
  });
});
