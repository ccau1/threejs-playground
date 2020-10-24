import React from "react";
import TouchTrackerContext from "./contexts/TouchTrackerContext";

interface WorldContextsProps {
  children?: ChildrenElement;
}

export default ({ children }: WorldContextsProps) => {
  return (
    // provide all context providers here
    <TouchTrackerContext.Provider>{children}</TouchTrackerContext.Provider>
  );
};
