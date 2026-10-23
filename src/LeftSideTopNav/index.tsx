import type { ReactNode } from 'react';
import { DesktopNav } from './desktop';
import { MobileNav } from './mobile';
import type { NavItem } from './data';

export { DesktopNav } from './desktop';
export { MobileNav } from './mobile';
export type { NavItem, UserProfile } from './data';
export { SIDEBAR_ITEMS, CURRENT_USER, BREADCRUMBS } from './data';

export interface LeftSideTopNavProps {
  children?: ReactNode;
  mode?: 'desktop' | 'mobile';
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  onLogout?: () => void;
}

export function LeftSideTopNav({
  children,
  mode = 'desktop',
  activeItem = 'projects',
  onItemClick,
  onLogout,
}: LeftSideTopNavProps) {
  if (mode === 'mobile') {
    return (
      <MobileNav
        activeItem={activeItem}
        onItemClick={onItemClick}
        onLogout={onLogout}
      >
        {children}
      </MobileNav>
    );
  }

  return (
    <DesktopNav
      activeItem={activeItem}
      onItemClick={onItemClick}
      onLogout={onLogout}
    >
      {children}
    </DesktopNav>
  );
}

export default LeftSideTopNav;
