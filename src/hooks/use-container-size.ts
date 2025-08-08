import { useState, useEffect, useRef } from 'react';

// This hook returns the width and height of a referenced element.
// It uses a ResizeObserver to efficiently update the dimensions when the element resizes.
export const useContainerSize = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);
    });

    resizeObserver.observe(element);

    // Cleanup observer on component unmount
    return () => resizeObserver.disconnect();
  }, []);

  return { ref, width, height };
};
