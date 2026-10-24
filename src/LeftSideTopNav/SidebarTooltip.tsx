import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { NavItem, SubNavItem } from './data';
import { ChevronRight } from 'lucide-react';

interface SidebarTooltipProps {
  item: NavItem | null;
  targetRect: DOMRect | null;
  isOpen: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onSubItemClick?: (subItem: SubNavItem) => void;
}

export const SidebarTooltip: React.FC<SidebarTooltipProps> = ({
  item,
  targetRect,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onSubItemClick,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen || !item || !targetRect) return null;

  
  const tooltipLeft = targetRect.right + 10;
  const centerY = targetRect.top + targetRect.height / 2;

  
  const hasSubItems = Boolean(item.subItems && item.subItems.length > 0);
  const estimatedHeight = hasSubItems ? 160 : item.description ? 90 : 54;
  const clampedTop = Math.max(16, Math.min(window.innerHeight - estimatedHeight - 16, centerY - estimatedHeight / 2));

  return createPortal(
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'fixed',
        left: `${tooltipLeft}px`,
        top: `${clampedTop}px`,
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
      className="animate-in fade-in-0 zoom-in-95 slide-in-from-left-2 duration-150 ease-out select-none"
    >
      <div className="relative group/tooltip flex items-center">
        
        <div
          className="absolute -left-1.5 w-3 h-3 rotate-45 bg-[#090d16] border-l border-b border-white/20 shadow-md"
          style={{ top: `${Math.max(12, Math.min(estimatedHeight - 20, centerY - clampedTop - 6))}px` }}
        />

        
        <div className="relative min-w-[220px] max-w-[290px] rounded-2xl bg-[#090d16]/95 text-white p-3.5 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/70 ring-1 ring-black/50 overflow-hidden">
          
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />

          
          <div className="flex items-center justify-between gap-3 mb-1">
            <span className="font-bold text-[13px] tracking-wide text-white drop-shadow-xs flex items-center gap-1.5 font-display">
              {item.label}
              {item.badge && (
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                  item.badgeVariant === 'amber'
                    ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                    : 'bg-blue-500/25 text-blue-300 border border-blue-500/40'
                }`}>
                  {item.badge}
                </span>
              )}
            </span>

            {item.shortcut && (
              <kbd className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-md bg-white/10 text-white/80 border border-white/15 shadow-2xs">
                {item.shortcut}
              </kbd>
            )}
          </div>

          
          {item.section && (
            <div className="text-[9px] uppercase font-bold tracking-widest text-blue-400/90 mb-1">
              {item.section}
            </div>
          )}

          
          {item.description && (
            <p className="text-[11px] leading-relaxed text-slate-300/90 font-normal">
              {item.description}
            </p>
          )}

          
          {item.subItems && item.subItems.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Submodules
              </div>
              {item.subItems.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => onSubItemClick?.(sub)}
                  className="w-full flex items-center justify-between px-2 py-1 rounded-lg text-[11px] text-slate-200 hover:text-white hover:bg-white/10 transition-colors text-left cursor-pointer"
                >
                  <span className="truncate">{sub.label}</span>
                  <ChevronRight className="w-3 h-3 text-blue-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SidebarTooltip;
