export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  route: string;
  active?: boolean;
  hasSubmenu?: boolean;
}

export interface UserProfile {
  name?: string;
  email: string;
  role: string;
}

export const SIDEBAR_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', iconName: 'LayoutDashboard', route: '/dashboard' },
  { id: 'users', label: 'Users', iconName: 'Users', route: '/users' },
  { id: 'system-params', label: 'System Params', iconName: 'Settings', route: '/system-params' },
  { id: 'builders', label: 'Builders', iconName: 'Building2', route: '/builders' },
  { id: 'location-authority', label: 'Location Authority', iconName: 'MapPin', route: '/location-authority' },
  { id: 'projects', label: 'Projects', iconName: 'FolderKanban', route: '/projects', active: true },
  { id: 'trending-projects', label: 'Trending Projects', iconName: 'TrendingUp', route: '/trending-projects' },
  { id: 'profile-types', label: 'Profile Types', iconName: 'UserCheck', route: '/profile-types' },
  { id: 'domain-categories', label: 'Domain & Categories', iconName: 'Shapes', route: '/domain-categories' },
  { id: 'roles', label: 'Roles', iconName: 'Shield', route: '/roles' },
  { id: 'enterprise-creation', label: 'Enterprise Creation', iconName: 'Landmark', route: '/enterprise-creation' },
  { id: 'modules', label: 'Modules', iconName: 'Boxes', route: '/modules' },
  { id: 'podcasts', label: 'Podcasts', iconName: 'Mic', route: '/podcasts' },
  { id: 'lms', label: 'LMS', iconName: 'GraduationCap', route: '/lms', hasSubmenu: true },
];

export const CURRENT_USER: UserProfile = {
  email: 'admin@gmail.com',
  role: 'GUEST',
};

export const BREADCRUMBS: string[] = ['Dashboard', 'Projects', 'Create'];
