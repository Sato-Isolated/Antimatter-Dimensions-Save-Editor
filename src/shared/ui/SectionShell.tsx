import React from 'react';

export type SectionShellTab = {
  id: string;
  title: string;
  icon?: React.ReactNode;
};

type SectionShellProps = {
  id: string;
  title: string;
  description?: React.ReactNode;
  tabs: SectionShellTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
};

const SectionShell: React.FC<SectionShellProps> = ({
  id,
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  children,
}) => {
  const titleId = `${id}-title`;
  const descriptionId = description ? `${id}-description` : undefined;

  return (
    <div
      className="section-pane active"
      id={id}
      role="region"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <div className="section-content">
        <div className="section-shell-header">
          <h3 id={titleId}>{title}</h3>
          {description ? (
            <p id={descriptionId} className="section-shell-description">
              {description}
            </p>
          ) : null}
        </div>

        <nav className="section-subtabs" aria-label={`${title} sections`}>
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                className={`subtab-button ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                aria-pressed={isActive}
              >
                {tab.icon ? <span aria-hidden="true">{tab.icon}</span> : null}
                {tab.title}
              </button>
            );
          })}
        </nav>

        {children}
      </div>
    </div>
  );
};

export default SectionShell;