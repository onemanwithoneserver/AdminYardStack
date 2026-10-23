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
          className={`h-full w-full overflow-y-auto scrollbar-hide flex flex-col bg-fare-bg @container transition-base ${className}`}
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
        className="flex items-center justify-center h-full w-full overflow-hidden box-border bg-[#0f172a]/5 md:bg-[#0f172a]/10 md:p-4 lg:p-6 transition-base"
      >
        <div
          ref={setRef}
          role="region"
          aria-label="Mobile Device Simulator"
          className={`
            relative shrink-0 overflow-hidden bg-white
            w-full h-full md:max-w-[430px] md:h-[min(100%,880px)]
            md:rounded-[4px] md:shadow-2xl
            flex flex-col transition-all duration-300 ease-out
            ${className}
          `}
          {...props}
        >
          <div
            ref={mobileInnerRef}
            className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col @container bg-fare-bg"
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
