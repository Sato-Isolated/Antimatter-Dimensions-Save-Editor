import { IconType } from 'react-icons';
import { FaCode, FaCog, FaThLarge } from 'react-icons/fa';

export type WorkspaceView = 'structured' | 'json' | 'settings';

export type WorkspaceViewDefinition = {
  id: WorkspaceView;
  label: string;
  Icon: IconType;
};

export const workspaceViews: WorkspaceViewDefinition[] = [
  { id: 'structured', label: 'Structured', Icon: FaThLarge },
  { id: 'json', label: 'JSON', Icon: FaCode },
  { id: 'settings', label: 'Preferences', Icon: FaCog },
];
