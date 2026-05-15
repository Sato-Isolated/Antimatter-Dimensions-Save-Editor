export type WorkspaceView = 'structured' | 'json' | 'settings';

export type WorkspaceViewDefinition = {
  id: WorkspaceView;
  label: string;
  iconClassName: string;
};

export const workspaceViews: WorkspaceViewDefinition[] = [
  { id: 'structured', label: 'Structured', iconClassName: 'fa fa-th-large' },
  { id: 'json', label: 'JSON', iconClassName: 'fa fa-code' },
  { id: 'settings', label: 'Preferences', iconClassName: 'fa fa-cog' },
];
