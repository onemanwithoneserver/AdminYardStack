import { TabControlsDesktop } from './desktop';
import { TabControlsMobile } from './mobile';
import type { ProjectTabItem } from './data';

export { TabControlsDesktop } from './desktop';
export { TabControlsMobile } from './mobile';
export { PROJECT_TABS, type ProjectTabItem } from './data';

export interface TabControlsProps {
  mode?: 'desktop' | 'mobile';
  activeTabId?: string;
  onTabChange?: (tab: ProjectTabItem) => void;
  onReset?: () => void;
  onSave?: () => void;
}

export function TabControls({
  mode = 'desktop',
  activeTabId = '01',
  onTabChange,
  onReset,
  onSave,
}: TabControlsProps) {
  if (mode === 'mobile') {
    return (
      <TabControlsMobile
        activeTabId={activeTabId}
        onTabChange={onTabChange}
        onReset={onReset}
        onSave={onSave}
      />
    );
  }

  return (
    <TabControlsDesktop
      activeTabId={activeTabId}
      onTabChange={onTabChange}
      onReset={onReset}
      onSave={onSave}
    />
  );
}

export default TabControls;
