import type { ReactNode } from 'react';
import { DesktopNav } from './desktop';
import { MobileNav } from './mobile';
import type { NavItem, UserProfile } from './data';

export { DesktopNav } from './desktop';
export { MobileNav } from './mobile';
export { BrandLogo } from './BrandLogo';
export { TopNav } from './TopNav';
export { SidebarTooltip } from './SidebarTooltip';
export type { NavItem, UserProfile, SubNavItem, NavSection } from './data';
export { SIDEBAR_ITEMS, NAV_SECTIONS, CURRENT_USER, BREADCRUMBS } from './data';

export interface LeftSideTopNavProps {
  children?: ReactNode;
  mode?: 'desktop' | 'mobile';
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  onLogout?: () => void;
  breadcrumbs?: string[];
  onBreadcrumbClick?: (crumb: string) => void;
  user?: UserProfile;
}

export function LeftSideTopNav({
  children,
  mode = 'desktop',
  activeItem = 'projects',
  onItemClick,
  onLogout,
  breadcrumbs,
  onBreadcrumbClick,
  user,
}: LeftSideTopNavProps) {
  if (mode === 'mobile') {
    return (
      <MobileNav
        activeItem={activeItem}
        onItemClick={onItemClick}
        onLogout={onLogout}
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={onBreadcrumbClick}
        user={user}
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
      breadcrumbs={breadcrumbs}
      onBreadcrumbClick={onBreadcrumbClick}
      user={user}
    >
      {children}
    </DesktopNav>
  );
}

export default LeftSideTopNav;
