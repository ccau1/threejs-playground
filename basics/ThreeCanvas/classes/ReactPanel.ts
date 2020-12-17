import Panel from "./baseClasses/Panel";
import World from "./World";

interface ReactPanelConstructor {
  _id: string;
  visible?: boolean;
  render: React.FunctionComponent<{ world: World }>;
  worldTargets?: WorldTargets;
}

export default class ReactPanel extends Panel {
  constructor({ _id, render, visible }: ReactPanelConstructor) {
    super({ _id, render, visible });
  }
}
