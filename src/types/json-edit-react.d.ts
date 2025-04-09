declare module 'json-edit-react' {
  import { ReactNode } from 'react';

  interface KeyBinding {
    key: string;
    modifiers?: {
      shift?: boolean;
      alt?: boolean;
      ctrl?: boolean;
      meta?: boolean;
    }
  }

  interface KeyBindings {
    toggleNode?: KeyBinding;
    editNode?: KeyBinding;
    addNode?: KeyBinding;
    deleteNode?: KeyBinding;
    copyValue?: KeyBinding;
    cancelEdit?: KeyBinding;
    submitEdit?: KeyBinding;
    submitLongEdit?: KeyBinding;
    [key: string]: KeyBinding | undefined;
  }

  export interface JsonEditorProps {
    // Required props
    data: any;
    
    // State management
    setData?: (data: any) => void;
    onUpdate?: (path: string, value: any, previousValue: any) => boolean | void | any;
    onChange?: (path: string, value: string, isValid: boolean) => boolean | void;
    onError?: (error: string, path: string) => void;
    
    // Editing permissions
    enableClipboard?: boolean;
    enableAdd?: boolean;
    enableEdit?: boolean;
    enableDelete?: boolean;
    restrictEdit?: (path: string, value: any) => boolean;
    restrictDelete?: (path: string, value: any) => boolean;
    restrictAdd?: (path: string) => boolean;
    viewOnly?: boolean;
    
    // Display options
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    collapse?: (path: string, value: any) => boolean;
    collapseAnimationTime?: number;
    showCollectionCount?: boolean;
    displayObjectSize?: boolean;
    displayDataTypes?: boolean;
    rootName?: string;
    rootFontSize?: string;
    theme?: any;
    hideRoot?: boolean;
    
    // Custom components
    customNodes?: any[];
    customText?: (path: string, value: any) => ReactNode;
    customButtons?: any[];
    
    // Search and filtering
    search?: string;
    filter?: (path: string, value: any, original?: any) => boolean;
    
    // JSON Schema
    schema?: any;
    schemaOptions?: any;
    
    // Advanced options
    keySort?: (a: string, b: string) => number;
    keyLimit?: number;
    allowedTypes?: string[];
    newKeyPrefix?: string;
    defaultValue?: (path: string, key: string) => any;
    defaultCollectionType?: 'object' | 'array';
    defaultAddKeyLocation?: 'top' | 'bottom';
    
    // Drag and drop
    enableDragDrop?: boolean;
    
    // External control
    events?: any;
    
    // Keyboard customization
    keyBindings?: KeyBindings;
    
    // Formatting
    jsonParse?: (text: string) => any;
    jsonStringify?: (value: any, space?: string | number) => string;
    
    // Other
    id?: string;
    unquoteKeys?: boolean;
  }

  export interface Theme {
    base00: string;
    base01: string;
    base02: string;
    base03: string;
    base04: string;
    base05: string;
    base06: string;
    base07: string;
    base08: string;
    base09: string;
    base0A: string;
    base0B: string;
    base0C: string;
    base0D: string;
    base0E: string;
    base0F: string;
  }

  // Built-in themes
  export const themes: {
    monokai: Theme;
    ocean: Theme;
    github: Theme;
    chalk: Theme;
    twilight: Theme;
  };

  // Main component
  export const JsonEditor: React.FC<JsonEditorProps>;

  // Helper functions
  export function createTheme(theme: Record<string, string>): Theme;
  export function mergeTheme(baseTheme: Theme, overrides: Partial<Theme>): Theme;
  export function getFlatDataFromPath(data: any, path: string): any;
  export function updateFlatDataFromPath(data: any, path: string, value: any): any;
} 