export interface SubNavItem {
  id: string;
  label: string;
  route: string;
  description?: string;
}

export interface NavItem {
  id: string;
  label: string;
  iconName: string;
  route: string;
  active?: boolean;
  hasSubmenu?: boolean;
  section?: 'core' | 'registry' | 'governance' | 'media';
  description?: string;
  shortcut?: string;
  badge?: string;
  badgeVariant?: 'default' | 'success' | 'amber' | 'primary';
  subItems?: SubNavItem[];
}

export interface UserProfile {
  name?: string;
  email: string;
  role: string;
  organization?: string;
  tier?: string;
  status?: string;
  avatarUrl?: string;
}

export interface NavSection {
  id: 'core' | 'registry' | 'governance' | 'media';
  title: string;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'core', title: 'PLATFORM OVERVIEW' },
  { id: 'registry', title: 'PORTFOLIO & ASSETS' },
  { id: 'governance', title: 'ADMIN & GOVERNANCE' },
  { id: 'media', title: 'TRAINING & MEDIA' },
];

export const SIDEBAR_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    iconName: 'LayoutDashboard',
    route: '/dashboard',
    section: 'core',
    description: 'Executive KPI metrics & portfolio summary',
    shortcut: '⌘1',
  },
  {
    id: 'projects',
    label: 'Projects',
    iconName: 'FolderKanban',
    route: '/projects',
    active: true,
    section: 'core',
    description: 'Residential & commercial development listings',
    shortcut: '⌘2',
    badge: '25',
    badgeVariant: 'primary',
  },
  {
    id: 'trending-projects',
    label: 'Trending Projects',
    iconName: 'TrendingUp',
    route: '/trending-projects',
    section: 'core',
    description: 'High-demand developments & market momentum',
    shortcut: '⌘3',
    badge: 'HOT',
    badgeVariant: 'amber',
  },
  {
    id: 'builders',
    label: 'Builders',
    iconName: 'Building2',
    route: '/builders',
    section: 'registry',
    description: 'Developer registry, verified partners & contracts',
    shortcut: '⌘4',
  },
  {
    id: 'location-authority',
    label: 'Location Authority',
    iconName: 'MapPin',
    route: '/location-authority',
    section: 'registry',
    description: 'Geographic zones, master plans & municipal codes',
    shortcut: '⌘5',
  },
  {
    id: 'domain-categories',
    label: 'Domain & Categories',
    iconName: 'Shapes',
    route: '/domain-categories',
    section: 'registry',
    description: 'Property taxonomy, land zones & asset classes',
    shortcut: '⌘6',
  },
  {
    id: 'users',
    label: 'Users',
    iconName: 'Users',
    route: '/users',
    section: 'governance',
    description: 'Stakeholder accounts, brokers & client directory',
    shortcut: '⌘7',
  },
  {
    id: 'roles',
    label: 'Roles',
    iconName: 'Shield',
    route: '/roles',
    section: 'governance',
    description: 'Permission matrices & security access control',
    shortcut: '⌘8',
  },
  {
    id: 'profile-types',
    label: 'Profile Types',
    iconName: 'UserCheck',
    route: '/profile-types',
    section: 'governance',
    description: 'Persona definitions, buyer tiers & verification rules',
    shortcut: '⌘9',
  },
  {
    id: 'system-params',
    label: 'System Params',
    iconName: 'Settings',
    route: '/system-params',
    section: 'governance',
    description: 'Global environmental variables & stack configuration',
  },
  {
    id: 'enterprise-creation',
    label: 'Enterprise Creation',
    iconName: 'Landmark',
    route: '/enterprise-creation',
    section: 'governance',
    description: 'Multi-tenant organization setup & legal entities',
  },
  {
    id: 'modules',
    label: 'Modules',
    iconName: 'Boxes',
    route: '/modules',
    section: 'governance',
    description: 'Micro-frontend packages & marketplace extensions',
  },
  {
    id: 'podcasts',
    label: 'Podcasts',
    iconName: 'Mic',
    route: '/podcasts',
    section: 'media',
    description: 'Audio broadcasts, market insights & interviews',
  },
  {
    id: 'lms',
    label: 'LMS',
    iconName: 'GraduationCap',
    route: '/lms',
    hasSubmenu: true,
    section: 'media',
    description: 'Agent certification & compliance learning system',
    subItems: [
      { id: 'courses', label: 'Certified Courses', route: '/lms/courses', description: 'Mandatory RERA compliance courses' },
      { id: 'assessments', label: 'Skill Assessments', route: '/lms/assessments', description: 'Broker knowledge evaluation' },
      { id: 'analytics', label: 'Learner Analytics', route: '/lms/analytics', description: 'Completion rates & team progress' },
    ],
  },
  {
    id: 'directories',
    label: 'Directories',
    iconName: 'FolderKanban',
    route: '/directories',
    section: 'registry',
    description: 'Corporate records and partner directories',
  },
  {
    id: 'engagement-questions',
    label: 'Engagement Questions',
    iconName: 'Shapes',
    route: '/engagement/questions',
    section: 'media',
    description: 'Community Q&A and interactive questionnaires',
  },
  {
    id: 'gamification',
    label: 'Gamification',
    iconName: 'Sparkles',
    route: '/engagement/gamification',
    section: 'media',
    description: 'Leaderboards, badges & reward tiers',
  },
  {
    id: 'compatibility-check',
    label: 'Compatibility Check',
    iconName: 'Shield',
    route: '/engagement/compatibility',
    section: 'media',
    description: 'Client profile & property matching algorithm',
  },
];

export const CURRENT_USER: UserProfile = {
  name: 'Alexander Vance',
  email: 'admin@gmail.com',
  role: 'guest',
  organization: 'YardStack PropTech Global',
  tier: 'Diamond Partner',
  status: 'Active',
};

export const BREADCRUMBS: string[] = ['Dashboard', 'Projects', 'Create'];
