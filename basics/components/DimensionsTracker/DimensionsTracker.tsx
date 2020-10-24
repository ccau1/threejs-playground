import React, { useEffect } from "react";
import { View } from "react-native"
import { useDimensions } from "../../@hooks/web"
import { ReactElementSize } from "../../@hooks/web/useDimensions";

interface DimensionsTrackerProps {
  onResize?: (dimensions: ReactElementSize) => void;
}

export default ({onResize}: DimensionsTrackerProps) => {
  const [dimensionsRef, dimensions] = useDimensions();

  useEffect(() => {
    if (dimensions) {
      onResize?.(dimensions);
    }
  }, [dimensions]);

  return (
    <View ref={dimensionsRef}
    style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}
    pointerEvents="box-none" />
  )
}