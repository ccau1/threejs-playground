import { ThemeContext } from "@components/native/ThemeProvider";
import { useContext, useState, useLayoutEffect } from "react";
import { Dimensions } from "react-native";

const useCurrentBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState("md");
  const { theme } = useContext(ThemeContext);

  const onWindowResize = (ev: {
    window?: { width: number; height: number };
    screen: { width: number; height: number };
  }) => {
    const { width } = ev.window || ev.screen;

    const { breakpoints } = theme;
    let currentBp = "";
    for (let i = Object.keys(breakpoints).length; i >= 0; i--) {
      if (width > Object.values(breakpoints)[i]) {
        currentBp = Object.keys(breakpoints)[i];
        break;
      }
    }

    setCurrentBreakpoint(currentBp);
  };

  useLayoutEffect(() => {
    onWindowResize({
      screen: { width: window.innerWidth, height: window.innerHeight },
    });
    Dimensions.addEventListener("change", onWindowResize);
    return () => Dimensions.removeEventListener("change", onWindowResize);
  }, []);

  return currentBreakpoint;
};

export default useCurrentBreakpoint;
