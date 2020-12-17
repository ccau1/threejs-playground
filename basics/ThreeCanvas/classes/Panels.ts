import Panel from "./baseClasses/Panel";

interface PanelsObject {
  [panelId: string]: Panel;
}

export default class Panels {
  _panels: PanelsObject = {};
  constructor() {}

  get panels() {
    return this._panels;
  }

  addPanel(panel: Panel | PanelConstructor) {
    if (panel instanceof Panel) {
      this._panels[panel._id] = panel;
    } else {
      const newPanel = new Panel(panel);
      this._panels[newPanel._id] = newPanel;
    }
  }

  removePanel(panel: string | Panel) {
    const panelId = typeof panel === "string" ? panel : panel._id;
    if (!this._panels[panelId]) {
      throw new Error("panel not found");
    }

    delete this._panels[panelId];
  }
}
