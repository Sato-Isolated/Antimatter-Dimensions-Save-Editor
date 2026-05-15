import React, { useMemo, useRef } from 'react';
import { WorkspaceView, WorkspaceViewDefinition } from './workspaceView';

type WorkspaceViewTabsProps = {
  views: WorkspaceViewDefinition[];
  activeView: WorkspaceView;
  onViewChange: (view: WorkspaceView) => void;
  isJsonDisabled: boolean;
  tabIdForView: (view: WorkspaceView) => string;
  panelIdForView: (view: WorkspaceView) => string;
};

const WorkspaceViewTabs: React.FC<WorkspaceViewTabsProps> = ({
  views,
  activeView,
  onViewChange,
  isJsonDisabled,
  tabIdForView,
  panelIdForView,
}) => {
  const tabRefs = useRef<Record<WorkspaceView, HTMLButtonElement | null>>({
    structured: null,
    json: null,
    settings: null,
  });

  const enabledViews = useMemo(() => {
    return views.filter((view) => !(view.id === 'json' && isJsonDisabled));
  }, [isJsonDisabled, views]);

  const getNextEnabledView = (
    currentView: WorkspaceView,
    direction: 1 | -1,
  ): WorkspaceView => {
    const currentIndex = enabledViews.findIndex((view) => view.id === currentView);
    if (currentIndex < 0 || enabledViews.length === 0) {
      return activeView;
    }

    const nextIndex = (currentIndex + direction + enabledViews.length) % enabledViews.length;
    return enabledViews[nextIndex].id;
  };

  const focusTab = (view: WorkspaceView): void => {
    tabRefs.current[view]?.focus();
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, view: WorkspaceView): void => {
    if (enabledViews.length === 0) {
      return;
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const nextView = getNextEnabledView(view, 1);
      onViewChange(nextView);
      focusTab(nextView);
      return;
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const previousView = getNextEnabledView(view, -1);
      onViewChange(previousView);
      focusTab(previousView);
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      const firstView = enabledViews[0]?.id;
      if (firstView) {
        onViewChange(firstView);
        focusTab(firstView);
      }
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      const lastView = enabledViews[enabledViews.length - 1]?.id;
      if (lastView) {
        onViewChange(lastView);
        focusTab(lastView);
      }
    }
  };

  return (
    <nav className="workspace-view-switcher" aria-label="Workspace views" role="tablist" aria-orientation="horizontal">
      {views.map((view) => {
        const isActive = activeView === view.id;
        const isDisabled = view.id === 'json' && isJsonDisabled;

        return (
          <button
            key={view.id}
            id={tabIdForView(view.id)}
            ref={(element) => {
              tabRefs.current[view.id] = element;
            }}
            type="button"
            className={`tab-button ${isActive ? 'active' : ''}`}
            onClick={() => onViewChange(view.id)}
            onKeyDown={(event) => handleTabKeyDown(event, view.id)}
            disabled={isDisabled}
            role="tab"
            aria-selected={isActive}
            aria-controls={panelIdForView(view.id)}
            tabIndex={isActive ? 0 : -1}
          >
            <i className={view.iconClassName} aria-hidden="true"></i>
            <span>{view.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default WorkspaceViewTabs;
