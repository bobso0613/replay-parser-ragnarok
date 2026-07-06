import { TOOLTIP_POSITION } from '@/constants';
import type { TooltipProps } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({
  content,
  children,
  className = '',
  placement = TOOLTIP_POSITION.TOP,
}: TooltipProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const updateTooltipPosition = () => {
    if (!triggerRef.current || !tooltipRef.current) {
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const offset = 8;

    const positionMap: Record<string, React.CSSProperties> = {
      [TOOLTIP_POSITION.TOP]: {
        top: `${triggerRect.top - tooltipRect.height - offset}px`,
        left: `${triggerRect.left + triggerRect.width / 2}px`,
        transform: 'translateX(-50%)',
      },
      [TOOLTIP_POSITION.BOTTOM]: {
        top: `${triggerRect.bottom + offset}px`,
        left: `${triggerRect.left + triggerRect.width / 2}px`,
        transform: 'translateX(-50%)',
      },
      [TOOLTIP_POSITION.LEFT]: {
        top: `${triggerRect.top + triggerRect.height / 2}px`,
        left: `${triggerRect.left - offset}px`,
        transform: 'translate(-100%, -50%)',
      },
      [TOOLTIP_POSITION.RIGHT]: {
        top: `${triggerRect.top + triggerRect.height / 2}px`,
        left: `${triggerRect.right + offset}px`,
        transform: 'translateY(-50%)',
      },
    };

    setTooltipStyle(positionMap[placement] || {});
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      return () => {};
    }

    updateTooltipPosition();

    const handleViewportChange = () => {
      updateTooltipPosition();
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, true);

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange, true);
    };
  }, [isVisible, placement]);

  return (
    <div
      ref={triggerRef}
      className={`inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-help">{children}</div>
      {isVisible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            className="pointer-events-none fixed z-50 whitespace-nowrap rounded-md bg-slate-900 px-3 py-2 text-md text-white scale-95 animate-in fade-in zoom-in-95 duration-150"
            style={tooltipStyle}
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
};

export default React.memo(Tooltip);
