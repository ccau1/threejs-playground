import React from 'react';
import WorldCanvas from './WorldCanvas';
import ThreeCanvasContexts from './ThreeCanvasContexts';

export default () => {
  return (
    <ThreeCanvasContexts>
      <WorldCanvas />
    </ThreeCanvasContexts>
  )
}