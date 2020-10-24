import { useIsFocused } from "@react-navigation/native";
import {
  useRef,
  useState,
  useLayoutEffect,
  RefObject,
  useCallback,
} from "react";
import { View, Dimensions, Platform } from "react-native";

export interface ReactElementSize {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  left: number;
  bottom: number;
}

const useDimensions = (): [RefObject<View>, ReactElementSize | null] => {
  const ref = useRef<View>(null);
  const [dimensions, setDimensions] = useState<ReactElementSize | null>(null);

  // define resize function
  const resizeFn = useCallback(() => {
    // FIXME: setTimeout fixes orientation change, but
    // the effect is delayed and can be seen on UI
    setTimeout(() => {
      // retrieve measurement from ref
      ref.current?.measure?.((x, y, width, height, left, top) => {
        // set measurement to state
        setDimensions({
          x,
          y,
          left,
          top,
          width,
          height,
          right: 0,
          bottom: 0,
        });
      });
    }, 100);
  }, [ref.current]);

  useLayoutEffect(() => {
    // fix for android not returning anything
    if (Platform.OS === "android") {
      ref.current?.setNativeProps({ renderToHardwareTextureAndroid: true });
      setTimeout(resizeFn);
    } else {
      setTimeout(resizeFn);
    }

    // resizeObserver.observe(ref.current);
    Dimensions.addEventListener("change", resizeFn);
    return () => {
      // resizeObserver.disconnect();
      Dimensions.removeEventListener("change", resizeFn);
    };
  }, [ref?.current]);

  return [ref, dimensions];
};

export default useDimensions;
