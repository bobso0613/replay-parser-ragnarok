import { TOOLTIP_POSITION } from '@/constants';
import type { TooltipProps } from '@/types';
import React, { useRef, useState } from 'react';

const Tooltip = ({
  content,
  children,
  className = '',
  placement = TOOLTIP_POSITION.TOP,
}: TooltipProps) => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  const handleMouseEnter = () => {
    setIsVisible(true);
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const offset = 8; // mb-2 or mt-2 equivalent

      const positionMap: Record<string, React.CSSProperties> = {
        [TOOLTIP_POSITION.TOP]: {
          top: `${rect.top - offset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
        },
        [TOOLTIP_POSITION.BOTTOM]: {
          top: `${rect.bottom + offset}px`,
          left: `${rect.left + rect.width / 2}px`,
          transform: 'translateX(-50%)',
        },
        [TOOLTIP_POSITION.LEFT]: {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.left - offset}px`,
          transform: 'translate(-100%, -50%)',
        },
        [TOOLTIP_POSITION.RIGHT]: {
          top: `${rect.top + rect.height / 2}px`,
          left: `${rect.right + offset}px`,
          transform: 'translateY(-50%)',
        },
      };

      setTooltipStyle(positionMap[placement] || {});
    }
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div
      ref={triggerRef}
      className={`inline-flex ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="cursor-help">{children}</div>
      {isVisible && (
        <div
          className="pointer-events-none fixed z-50 whitespace-nowrap rounded-md bg-slate-900 px-3 py-2 text-md text-white scale-95 animate-in fade-in zoom-in-95 duration-150"
          style={tooltipStyle}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default React.memo(Tooltip);
