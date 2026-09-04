import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'motion/react';

export const StampCursor: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const initialDevicePixelRatio = React.useRef(window.devicePixelRatio || 1);
  const [zoomCompensation, setZoomCompensation] = useState(1);
  const [isStamping, setIsStamping] = useState(false);

  useEffect(() => {
    document.body.classList.add('stamp-cursor-active');
    const updateZoomCompensation = () => {
      const currentDevicePixelRatio = window.devicePixelRatio || 1;
      setZoomCompensation(initialDevicePixelRatio.current / currentDevicePixelRatio);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') {
        cursorX.set(event.clientX);
        cursorY.set(event.clientY);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') setIsStamping(true);
    };
    const handlePointerUp = () => setIsStamping(false);

    updateZoomCompensation();
    window.addEventListener('resize', updateZoomCompensation);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      document.body.classList.remove('stamp-cursor-active');
      window.removeEventListener('resize', updateZoomCompensation);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, []);

  return (
    <motion.div
      className="stamp-cursor"
      style={{
        x: cursorX,
        y: cursorY,
        scale: zoomCompensation * (isStamping ? 0.72 : 1),
      }}
      transition={{
        scale: { duration: 0.08 },
      }}
    >
      <span className="stamp-cursor-base" />
      <span className="stamp-cursor-neck" />
      <span className="stamp-cursor-handle" />
      {isStamping && <span className="stamp-cursor-mark" />}
    </motion.div>
  );
};
