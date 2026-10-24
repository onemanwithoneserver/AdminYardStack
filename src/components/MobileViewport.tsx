import { forwardRef, type HTMLAttributes, type ReactNode, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export interface MobileViewportProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isMobile?: boolean;
}

const MobileViewport = forwardRef<HTMLDivElement, MobileViewportProps>(
  ({ children, isMobile = false, className = "", ...props }, forwardedRef) => {
    const location = useLocation();
    const internalRef = useRef<HTMLDivElement>(null);

    const setRef = (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    const mobileInnerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.scrollTo(0, 0);
      }
      if (mobileInnerRef.current) {
        mobileInnerRef.current.scrollTo(0, 0);
      }
    }, [location.pathname]);

    if (!isMobile) {
      return (
        <div
          ref={setRef}
          role="main"
          aria-label="Desktop Viewport"
          className={`h-full w-full overflow-y-auto scrollbar-hide flex flex-col bg-transparent @container transition-all ${className}`}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        role="region"
        aria-label="Mobile Preview Environment"
        className="flex items-center justify-center h-full w-full overflow-hidden box-border bg-slate-900/10 dark:bg-black/40 p-2 sm:p-4 md:p-6 transition-all"
      >
        <div
          ref={setRef}
          role="region"
          aria-label="Mobile Device Simulator"
          className={`
            relative shrink-0 overflow-hidden bg-white dark:bg-[#070b14]
            w-full h-full md:max-w-[420px] md:h-[min(100%,880px)]
            md:rounded-[42px] md:border-[10px] md:border-slate-800 dark:md:border-slate-900
            md:shadow-2xl md:ring-1 md:ring-white/20
            flex flex-col transition-all duration-300 ease-out
            ${className}
          `}
          {...props}
        >
          {/* Hardware Dynamic Island Notch (visible on md+) */}
          <div className="hidden md:flex absolute top-2.5 left-1/2 -translate-x-1/2 z-50 h-5 w-24 bg-black rounded-full items-center justify-end px-2.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-slate-950 border border-slate-800" />
          </div>

          <div
            ref={mobileInnerRef}
            className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col @container"
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

MobileViewport.displayName = "MobileViewport";
export default MobileViewport;
