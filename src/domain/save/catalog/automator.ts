import { DocumentPath, SaveObject, SaveType, SaveValidationIssue } from '../model';

/**
 * Human-readable Automator data copied from the pinned game source snapshot.
 * The editor deliberately keeps this catalog separate from the game runtime.
 */
export const AUTOMATOR_UPSTREAM_SNAPSHOT = '5409e320cecef96a917cca1dfb68f1f183e499ca';

export type AutomatorCommandCategoryId =
  | 'time-studies'
  | 'event-triggers'
  | 'alter-settings'
  | 'information'
  | 'script-flow';

export interface AutomatorCommandCategoryDefinition {
  readonly id: AutomatorCommandCategoryId;
  readonly label: string;
  readonly description: string;
}

export const automatorCommandCategories: readonly AutomatorCommandCategoryDefinition[] = [
  {
    id: 'time-studies',
    label: 'Time Studies',
    description: 'Load, purchase, or respec Time Study trees and presets.',
  },
  {
    id: 'event-triggers',
    label: 'Event triggers',
    description: 'Start or wait for Infinity, Eternity, Reality, Dilation, and Eternity Challenge events.',
  },
  {
    id: 'alter-settings',
    label: 'Automation settings',
    description: 'Change prestige autobuyers and other unlocked automation while the script runs.',
  },
  {
    id: 'information',
    label: 'Information',
    description: 'Display notifications or leave comments in the script.',
  },
  {
    id: 'script-flow',
    label: 'Script flow',
    description: 'Pause, branch, loop, wait for conditions, or stop execution.',
  },
] as const;

export interface AutomatorCommandDefinition {
  readonly id: string;
  readonly keyword: string;
  readonly category: AutomatorCommandCategoryId;
  readonly syntax: string;
  readonly description: string;
  readonly examples: readonly string[];
  readonly unlock?: string;
}

/**
 * User-facing command reference from GameDatabase.reality.automator.commands.
 * This intentionally documents the commands, not the parser implementation.
 */
export const automatorCommandDefinitions: readonly AutomatorCommandDefinition[] = [
  {
    id: 'studies-respec',
    keyword: 'STUDIES RESPEC',
    category: 'time-studies',
    syntax: 'studies respec',
    description: 'Turns on Time Study respec for the next manual or automatic Eternity; it does not Eternity by itself.',
    examples: ['studies respec'],
  },
  {
    id: 'studies-load',
    keyword: 'STUDIES LOAD',
    category: 'time-studies',
    syntax: 'studies [nowait] load id <1-6> | studies [nowait] load name <name>',
    description: 'Loads a Time Study preset. Without nowait, the command keeps trying until the preset is bought.',
    examples: ['studies load id 2', 'studies load name Main', 'studies nowait load name Dil'],
  },
  {
    id: 'studies-purchase',
    keyword: 'STUDIES PURCHASE',
    category: 'time-studies',
    syntax: 'studies [nowait] purchase <study list or constant>',
    description: 'Purchases a list of Time Studies. IDs, ranges, path aliases, and a study-string constant are supported.',
    examples: ['studies nowait purchase 11,21,31', 'studies purchase 11-62, antimatter, idle', 'studies nowait purchase TSFull'],
  },
  {
    id: 'prestige',
    keyword: 'PRESTIGE',
    category: 'event-triggers',
    syntax: 'infinity | eternity [nowait] [respec] | reality [nowait] [respec]',
    description: 'Triggers the requested prestige when its requirements are available; nowait skips instead of waiting.',
    examples: ['infinity', 'eternity respec', 'reality nowait'],
    unlock: 'The related prestige and autobuyer must be unlocked; Reality also requires Reality Upgrade 25.',
  },
  {
    id: 'unlock',
    keyword: 'UNLOCK',
    category: 'event-triggers',
    syntax: 'unlock [nowait] dilation | unlock [nowait] ec<N>',
    description: 'Attempts to unlock Time Dilation or an Eternity Challenge. By default it repeats until successful.',
    examples: ['unlock dilation', 'unlock ec7'],
  },
  {
    id: 'start',
    keyword: 'START',
    category: 'event-triggers',
    syntax: 'start ec<N> | start dilation',
    description: 'Starts an Eternity Challenge or Dilated Eternity, attempting the unlock first for an Eternity Challenge.',
    examples: ['start ec12', 'start dilation'],
  },
  {
    id: 'wait',
    keyword: 'WAIT',
    category: 'script-flow',
    syntax: 'wait <comparison> | wait infinity | wait eternity | wait reality | wait black hole <off|bh1|bh2>',
    description: 'Waits for a resource comparison, prestige event, or Black Hole state. Use pause for a fixed duration.',
    examples: ['wait am >= 1e308', 'wait pending completions >= 5', 'wait infinity', 'wait black hole bh1'],
  },
  {
    id: 'auto',
    keyword: 'AUTO',
    category: 'alter-settings',
    syntax: 'auto infinity|eternity|reality [on|off|duration|amount|x highest]',
    description: 'Turns a prestige autobuyer on or off and can change its supported threshold, duration, or x-highest setting.',
    examples: ['auto infinity on', 'auto eternity off', 'auto infinity 30s', 'auto eternity 1e100 x highest'],
    unlock: 'Only unlocked autobuyers and settings can be changed; Reality uses RM and does not support duration or x highest.',
  },
  {
    id: 'black-hole',
    keyword: 'BLACK HOLE',
    category: 'alter-settings',
    syntax: 'black hole on | black hole off',
    description: 'Toggles the Black Hole speedup effect without bypassing its normal gradual acceleration.',
    examples: ['black hole on', 'black hole off'],
    unlock: 'The command is useful after the second Black Hole is unlocked.',
  },
  {
    id: 'store-game-time',
    keyword: 'STORE GAME TIME',
    category: 'alter-settings',
    syntax: 'store game time on | off | use',
    description: 'Controls Enslaved Black Hole game-time storage, or consumes all stored time with use.',
    examples: ['store game time on', 'store game time off', 'store game time use'],
    unlock: 'Requires Enslaved to be unlocked.',
  },
  {
    id: 'notify',
    keyword: 'NOTIFY',
    category: 'information',
    syntax: 'notify "<text>"',
    description: 'Shows a notification in the top-right corner, useful when the script runs while another tab is open.',
    examples: ['notify "Dilation reached"', 'notify "ECs completed"'],
  },
  {
    id: 'comments',
    keyword: 'COMMENTS',
    category: 'information',
    syntax: '# <text> | // <text>',
    description: 'Adds a no-op note. Comments must occupy their own line; inline comments after a command are invalid.',
    examples: ['# get 1e20 before starting ec1', '// this loop alternates dilation and pushing'],
  },
  {
    id: 'pause',
    keyword: 'PAUSE',
    category: 'script-flow',
    syntax: 'pause <number><ms|s|m|h> | pause <duration constant>',
    description: 'Stops execution for a fixed duration. A duration constant is interpreted in seconds.',
    examples: ['pause 10s', 'pause 1 minute', 'pause 34 seconds'],
  },
  {
    id: 'if',
    keyword: 'IF',
    category: 'script-flow',
    syntax: 'if <comparison> { commands }',
    description: 'Runs the inner block only when the comparison is true when the line is reached.',
    examples: ['if ec10 completions < 5', 'if ep > 1e6000'],
  },
  {
    id: 'until',
    keyword: 'UNTIL',
    category: 'script-flow',
    syntax: 'until <comparison|prestige event> { commands }',
    description: 'Repeats the inner block until a comparison becomes true or until the specified prestige occurs.',
    examples: ['until ep > 1e500', 'until reality'],
  },
  {
    id: 'while',
    keyword: 'WHILE',
    category: 'script-flow',
    syntax: 'while <comparison> { commands }',
    description: 'Repeats the inner block while the comparison remains true.',
    examples: ['while ep < 1e500', 'while myThreshold > am'],
  },
  {
    id: 'stop',
    keyword: 'STOP',
    category: 'script-flow',
    syntax: 'stop',
    description: 'Stops the Automator and resets its execution position, like the stop control in the game UI.',
    examples: ['stop'],
  },
] as const;

export const automatorCommandById = new Map(
  automatorCommandDefinitions.map((definition) => [definition.id, definition]),
);

export interface AutomatorModeDefinition {
  readonly value: number;
  readonly label: string;
  readonly description: string;
}

export const automatorModeDefinitions: readonly AutomatorModeDefinition[] = [
  {
    value: 1,
    label: 'Paused',
    description: 'The Automator is not advancing commands. A non-empty execution stack can still remain paused.',
  },
  {
    value: 2,
    label: 'Running',
    description: 'The Automator advances the selected script on its game-loop interval.',
  },
  {
    value: 3,
    label: 'Single step',
    description: 'The Automator executes one command and then returns to Paused.',
  },
] as const;

export const automatorEditorTypeDefinitions = [
  {
    value: 0,
    label: 'Text editor',
    description: 'The game displays and edits the script as Automator text.',
  },
  {
    value: 1,
    label: 'Block editor',
    description: 'The game displays the same script through draggable command blocks; the persisted content remains text.',
  },
] as const;

export const automatorInfoPanelDefinitions = [
  { value: 0, label: 'Introduction', description: 'Automator overview and usage guide.' },
  { value: 1, label: 'Commands', description: 'Command syntax and examples.' },
  { value: 2, label: 'Errors', description: 'Compiler and script error panel.' },
  { value: 3, label: 'Events', description: 'Execution event log.' },
  { value: 4, label: 'Data transfer', description: 'Script import/export tools.' },
  { value: 5, label: 'Constants', description: 'Named values used by scripts.' },
  { value: 6, label: 'Templates', description: 'Generated script templates.' },
  { value: 7, label: 'Blocks', description: 'Block-editor command palette.' },
] as const;

export const automatorLimits = {
  maxScriptCharacters: 10_000,
  maxTotalScriptCharacters: 60_000,
  maxScriptCount: 20,
  maxScriptNameCharacters: 15,
  maxConstantCount: 30,
  maxConstantNameCharacters: 20,
  maxConstantValueCharacters: 250,
} as const;

export interface AutomatorCurrencyDefinition {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}

export const automatorCurrencyDefinitions: readonly AutomatorCurrencyDefinition[] = [
  { id: 'am', label: 'am', description: 'Current Antimatter.' },
  { id: 'ip', label: 'ip', description: 'Current Infinity Points.' },
  { id: 'ep', label: 'ep', description: 'Current Eternity Points.' },
  { id: 'rm', label: 'rm', description: 'Current Reality Machines.' },
  { id: 'infinities', label: 'infinities', description: 'Current Infinity count.' },
  { id: 'banked infinities', label: 'banked infinities', description: 'Current Banked Infinity count.' },
  { id: 'eternities', label: 'eternities', description: 'Current Eternity count.' },
  { id: 'realities', label: 'realities', description: 'Current Reality count.' },
  { id: 'pending ip', label: 'pending ip', description: 'Infinity Points gained by an available Infinity.' },
  { id: 'pending ep', label: 'pending ep', description: 'Eternity Points gained by an available Eternity.' },
  { id: 'pending tp', label: 'pending tp', description: 'Tachyon Particles gained by exiting Dilation.' },
  { id: 'pending rm', label: 'pending rm', description: 'Reality Machines gained by an available Reality.' },
  { id: 'pending glyph level', label: 'pending glyph level', description: 'Glyph level gained by an available Reality.' },
  { id: 'dt', label: 'dt', description: 'Current Dilated Time.' },
  { id: 'tp', label: 'tp', description: 'Current Tachyon Particles.' },
  { id: 'rg', label: 'rg', description: 'Current Replicanti Galaxies.' },
  { id: 'rep', label: 'rep', description: 'Current Replicanti.' },
  { id: 'tt', label: 'tt', description: 'Unspent Time Theorems.' },
  { id: 'total tt', label: 'total tt', description: 'All Time Theorems, including spent and generated values.' },
  { id: 'spent tt', label: 'spent tt', description: 'Time Theorems currently spent on Time Studies.' },
  { id: 'total completions', label: 'total completions', description: 'Total completions across all Eternity Challenges.' },
  { id: 'pending completions', label: 'pending completions', description: 'Completions gained by the current Eternity Challenge on Eternity.' },
  { id: 'ec<N> completions', label: 'ec<N> completions', description: 'Completion count for one Eternity Challenge, such as ec6 completions.' },
  { id: 'filter score', label: 'filter score', description: 'Glyph filter score for the Glyph selected by the current filter.' },
  { id: 'space theorems', label: 'space theorems', description: 'Current unspent Space Theorems when the feature is unlocked.' },
  { id: 'total space theorems', label: 'total space theorems', description: 'Total Space Theorems, including those spent on studies.' },
] as const;

export type AutomatorConstantValueKind = 'time-study-list' | 'custom';

export interface AutomatorConstantDefinition {
  /** The exact user-defined key stored in the save. */
  readonly name: string;
  /** A readable label for the editor; this never replaces the stored key. */
  readonly label: string;
  readonly description: string;
  readonly valueKind: AutomatorConstantValueKind;
}

const createTimeStudyConstantDefinition = (
  name: string,
  label: string,
  routeDescription: string,
): AutomatorConstantDefinition => ({
  name,
  label,
  description: `${routeDescription} The value is a comma-separated Time Study list in the reference fixture.`,
  valueKind: 'time-study-list',
});

/**
 * Names found in the reference PC/Android fixtures. Automator constants are
 * user-defined, so these meanings are conventions from the saved Time Study
 * presets rather than identifiers assigned by the game engine.
 */
export const automatorConstantDefinitions: readonly AutomatorConstantDefinition[] = [
  createTimeStudyConstantDefinition(
    'TSEarlyGame',
    'Early-game Time Study preset',
    'A Time Study route for the early game.',
  ),
  createTimeStudyConstantDefinition(
    'TSADActive',
    'Active Antimatter Dimensions preset',
    'An active-production route centred on Antimatter Dimensions.',
  ),
  createTimeStudyConstantDefinition(
    'TSTDActive',
    'Active Time Dimensions preset',
    'An active-production route centred on Time Dimensions.',
  ),
  createTimeStudyConstantDefinition(
    'TSFirstDil',
    'First Dilation preset',
    'The Time Study route used to reach the first Time Dilation unlock.',
  ),
  createTimeStudyConstantDefinition(
    'TSIDActive',
    'Active Infinity Dimensions preset',
    'An active-production route centred on Infinity Dimensions.',
  ),
  createTimeStudyConstantDefinition(
    'TSTDPassive',
    'Passive Time Dimensions preset',
    'A passive route centred on Time Dimensions.',
  ),
  createTimeStudyConstantDefinition(
    'TSTDIdle',
    'Idle Time Dimensions preset',
    'An idle route centred on Time Dimensions.',
  ),
  createTimeStudyConstantDefinition(
    'TSEC11',
    'Eternity Challenge 11 preset',
    'The Time Study route used for Eternity Challenge 11.',
  ),
  createTimeStudyConstantDefinition(
    'TS2PathFull',
    'Second path · full preset',
    'A full Time Study route using the save’s second path convention.',
  ),
  createTimeStudyConstantDefinition(
    'TS2PathFullIdle',
    'Second path · full idle preset',
    'An idle variant of the save’s full second-path Time Study route.',
  ),
  createTimeStudyConstantDefinition(
    'TSFull',
    'Full Time Study tree preset',
    'The save’s full available Time Study route.',
  ),
] as const;

export const automatorConstantDefinitionByName = new Map(
  automatorConstantDefinitions.map((definition) => [definition.name, definition]),
);

const createCustomAutomatorConstantDefinition = (name: string): AutomatorConstantDefinition => ({
  name,
  label: 'Custom Automator constant',
  description: 'This key is user-defined. Its value only gets meaning from the command that reads it.',
  valueKind: 'custom',
});

export const getAutomatorConstantDefinition = (name: string): AutomatorConstantDefinition => (
  automatorConstantDefinitionByName.get(name) ?? createCustomAutomatorConstantDefinition(name)
);

export interface AutomatorScriptEntry {
  readonly id: number;
  readonly name: string;
  readonly content: string;
  readonly path: DocumentPath;
  readonly namePath: DocumentPath;
  readonly contentPath: DocumentPath;
}

export interface AutomatorConstantEntry {
  readonly name: string;
  readonly value: unknown;
  readonly present: boolean;
  readonly path: DocumentPath;
  readonly definition: AutomatorConstantDefinition;
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object'
  && value !== null
  && !Array.isArray(value)
  && !(value instanceof Set)
  && !(value instanceof Date)
);

const getAutomatorRecord = (saveData: SaveObject): Record<string, unknown> | undefined => {
  const reality = saveData.reality;
  if (!isRecord(reality) || !isRecord(reality.automator)) return undefined;
  return reality.automator;
};

const getNumericId = (value: unknown): number | undefined => (
  typeof value === 'number' && Number.isInteger(value) ? value : undefined
);

export const getAutomatorScripts = (saveData: SaveObject): AutomatorScriptEntry[] => {
  const automator = getAutomatorRecord(saveData);
  const scripts = automator?.scripts;
  if (scripts === undefined) return [];

  const entries: AutomatorScriptEntry[] = [];

  if (Array.isArray(scripts)) {
    scripts.forEach((script, index) => {
      if (!isRecord(script)) return;
      const id = getNumericId(script.id);
      if (id === undefined) return;
      const path = `reality.automator.scripts[${index}]`;
      entries.push({
        id,
        name: typeof script.name === 'string' ? script.name : `Script ${id}`,
        content: typeof script.content === 'string' ? script.content : '',
        path,
        namePath: `${path}.name`,
        contentPath: `${path}.content`,
      });
    });
  } else if (isRecord(scripts)) {
    Object.entries(scripts).forEach(([key, script]) => {
      if (!isRecord(script)) return;
      const id = getNumericId(script.id);
      if (id === undefined) return;
      const path = `reality.automator.scripts.${key}`;
      entries.push({
        id,
        name: typeof script.name === 'string' ? script.name : `Script ${id}`,
        content: typeof script.content === 'string' ? script.content : '',
        path,
        namePath: `${path}.name`,
        contentPath: `${path}.content`,
      });
    });
  }

  return entries.sort((left, right) => left.id - right.id || left.path.localeCompare(right.path));
};

export const getAutomatorConstants = (saveData: SaveObject): AutomatorConstantEntry[] => {
  const automator = getAutomatorRecord(saveData);
  const constants = automator?.constants;
  if (!isRecord(constants)) return [];

  const sortOrder = Array.isArray(automator?.constantSortOrder)
    ? automator.constantSortOrder.filter((name): name is string => typeof name === 'string')
    : [];
  const orderedNames = [...sortOrder, ...Object.keys(constants).filter((name) => !sortOrder.includes(name))];

  return orderedNames.map((name) => ({
    name,
    value: constants[name],
    present: Object.prototype.hasOwnProperty.call(constants, name),
    path: `reality.automator.constants.${name}`,
    definition: getAutomatorConstantDefinition(name),
  }));
};

const createAutomatorIssue = (
  code: string,
  message: string,
  path: DocumentPath,
  severity: SaveValidationIssue['severity'] = 'error',
): SaveValidationIssue => ({ code, message, path, severity });

const validateScriptRecord = (
  script: Record<string, unknown>,
  path: DocumentPath,
  ids: Set<number>,
  scriptLengths: number[],
): SaveValidationIssue[] => {
  const issues: SaveValidationIssue[] = [];
  const id = getNumericId(script.id);

  if (id === undefined || id < 1) {
    issues.push(createAutomatorIssue('automator-script-id', 'Automator script IDs must be positive integers.', `${path}.id`));
  } else if (ids.has(id)) {
    issues.push(createAutomatorIssue('automator-script-id-duplicate', `Automator script ID ${id} is duplicated.`, `${path}.id`));
  } else {
    ids.add(id);
  }

  if (typeof script.name !== 'string') {
    issues.push(createAutomatorIssue('automator-script-name', 'Automator script names must be strings.', `${path}.name`));
  } else if (script.name.length > automatorLimits.maxScriptNameCharacters) {
    issues.push(createAutomatorIssue(
      'automator-script-name-length',
      `Automator script names cannot exceed ${automatorLimits.maxScriptNameCharacters} characters in the game.`,
      `${path}.name`,
    ));
  }

  if (typeof script.content !== 'string') {
    issues.push(createAutomatorIssue('automator-script-content', 'Automator script content must be text.', `${path}.content`));
  } else {
    scriptLengths.push(script.content.length);
    if (script.content.length > automatorLimits.maxScriptCharacters) {
      issues.push(createAutomatorIssue(
        'automator-script-content-length',
        `A single Automator script cannot exceed ${automatorLimits.maxScriptCharacters} characters in the game.`,
        `${path}.content`,
      ));
    }
  }

  return issues;
};

const validateAutomatorConstants = (automator: Record<string, unknown>): SaveValidationIssue[] => {
  const issues: SaveValidationIssue[] = [];
  const constants = automator.constants;
  if (constants === undefined) return issues;

  if (!isRecord(constants)) {
    return [createAutomatorIssue('automator-constants-shape', 'Automator constants must be an object.', 'reality.automator.constants')];
  }

  const constantNames = Object.keys(constants);
  if (constantNames.length > automatorLimits.maxConstantCount) {
    issues.push(createAutomatorIssue(
      'automator-constant-count',
      `The game allows at most ${automatorLimits.maxConstantCount} Automator constants.`,
      'reality.automator.constants',
    ));
  }

  for (const name of constantNames) {
    const path = `reality.automator.constants.${name}`;
    if (!/^[a-zA-Z_][a-zA-Z_0-9]*$/u.test(name)) {
      issues.push(createAutomatorIssue('automator-constant-name', 'Automator constant names must be valid identifiers.', path));
    }
    if (name.length > automatorLimits.maxConstantNameCharacters) {
      issues.push(createAutomatorIssue(
        'automator-constant-name-length',
        `Automator constant names cannot exceed ${automatorLimits.maxConstantNameCharacters} characters in the game.`,
        path,
      ));
    }
    if (typeof constants[name] !== 'string') {
      issues.push(createAutomatorIssue('automator-constant-value', 'Automator constant values must be strings.', path));
    } else if (constants[name].length > automatorLimits.maxConstantValueCharacters) {
      issues.push(createAutomatorIssue(
        'automator-constant-value-length',
        `Automator constant values cannot exceed ${automatorLimits.maxConstantValueCharacters} characters in the game.`,
        path,
      ));
    }
  }

  const sortOrder = automator.constantSortOrder;
  if (sortOrder !== undefined) {
    if (!Array.isArray(sortOrder)) {
      issues.push(createAutomatorIssue('automator-constant-order-shape', 'Automator constantSortOrder must be an array.', 'reality.automator.constantSortOrder'));
    } else {
      const seen = new Set<string>();
      for (const [index, name] of sortOrder.entries()) {
        const path = `reality.automator.constantSortOrder[${index}]`;
        if (typeof name !== 'string') {
          issues.push(createAutomatorIssue('automator-constant-order-entry', 'Automator constantSortOrder entries must be strings.', path));
          continue;
        }
        if (seen.has(name)) {
          issues.push(createAutomatorIssue('automator-constant-order-duplicate', `Constant ${name} appears more than once in constantSortOrder.`, path));
        }
        seen.add(name);
        if (!Object.prototype.hasOwnProperty.call(constants, name)) {
          issues.push(createAutomatorIssue(
            'automator-constant-order-missing',
            `constantSortOrder references missing constant ${name}.`,
            path,
            'warning',
          ));
        }
      }
      for (const name of Object.keys(constants)) {
        if (!seen.has(name)) {
          issues.push(createAutomatorIssue(
            'automator-constant-order-incomplete',
            `Constant ${name} is not present in constantSortOrder; the game normally keeps both collections synchronized.`,
            'reality.automator.constantSortOrder',
            'warning',
          ));
        }
      }
    }
  }

  return issues;
};

/**
 * Validates the cross-field contracts the game relies on when compiling and
 * starting Automator scripts. Missing legacy Automator subtrees remain
 * optional; malformed present data is reported instead of silently repaired.
 */
export const validateAutomatorSave = (saveData: SaveObject, saveType?: SaveType): SaveValidationIssue[] => {
  const automator = getAutomatorRecord(saveData);
  if (!automator) return [];

  const issues = validateAutomatorConstants(automator);
  const scripts = automator.scripts;
  const ids = new Set<number>();
  const scriptLengths: number[] = [];

  if (scripts !== undefined && saveType === SaveType.PC && !isRecord(scripts)) {
    issues.push(createAutomatorIssue(
      'automator-scripts-pc-shape',
      'PC Automator scripts must use the upstream ID-keyed object shape.',
      'reality.automator.scripts',
    ));
  }
  if (scripts !== undefined && saveType === SaveType.Android && !Array.isArray(scripts)) {
    issues.push(createAutomatorIssue(
      'automator-scripts-android-shape',
      'Android Automator scripts must use the upstream array shape.',
      'reality.automator.scripts',
    ));
  }

  if (scripts !== undefined && !Array.isArray(scripts) && !isRecord(scripts)) {
    issues.push(createAutomatorIssue('automator-scripts-shape', 'Automator scripts must be an object on PC or an array on Android.', 'reality.automator.scripts'));
  } else if (Array.isArray(scripts)) {
    if (scripts.length > automatorLimits.maxScriptCount) {
      issues.push(createAutomatorIssue(
        'automator-script-count',
        `The game allows at most ${automatorLimits.maxScriptCount} Automator scripts.`,
        'reality.automator.scripts',
      ));
    }
    scripts.forEach((script, index) => {
      const path = `reality.automator.scripts[${index}]`;
      if (!isRecord(script)) {
        issues.push(createAutomatorIssue('automator-script-shape', 'Each Automator script must be an object.', path));
        return;
      }
      issues.push(...validateScriptRecord(script, path, ids, scriptLengths));
    });
  } else if (isRecord(scripts)) {
    const entries = Object.entries(scripts);
    if (entries.length > automatorLimits.maxScriptCount) {
      issues.push(createAutomatorIssue(
        'automator-script-count',
        `The game allows at most ${automatorLimits.maxScriptCount} Automator scripts.`,
        'reality.automator.scripts',
      ));
    }
    entries.forEach(([key, script]) => {
      const path = `reality.automator.scripts.${key}`;
      if (!isRecord(script)) {
        issues.push(createAutomatorIssue('automator-script-shape', 'Each Automator script must be an object.', path));
        return;
      }
      issues.push(...validateScriptRecord(script, path, ids, scriptLengths));
    });
  }

  const totalScriptCharacters = scriptLengths.reduce((total, length) => total + length, 0);
  if (totalScriptCharacters > automatorLimits.maxTotalScriptCharacters) {
    issues.push(createAutomatorIssue(
      'automator-total-script-content-length',
      `All Automator scripts together cannot exceed ${automatorLimits.maxTotalScriptCharacters} characters in the game.`,
      'reality.automator.scripts',
    ));
  }

  const state = automator.state;
  if (isRecord(state)) {
    const mode = state.mode;
    if (typeof mode === 'number' && !automatorModeDefinitions.some((definition) => definition.value === mode)) {
      // The pinned game source has a separate unlock predicate and only defines
      // modes 1-3. Preserve zero without inventing a game meaning for it.
      const isUnrecognizedZeroMode = mode === 0;
      issues.push(createAutomatorIssue(
        'automator-mode',
        isUnrecognizedZeroMode
          ? 'Automator mode 0 is outside the current upstream mode enum and will be preserved without changing the save.'
          : 'Automator mode must be Paused (1), Running (2), or Single step (3).',
        'reality.automator.state.mode',
        isUnrecognizedZeroMode ? 'warning' : 'error',
      ));
    }

    for (const field of ['topLevelScript', 'editorScript'] as const) {
      const scriptId = getNumericId(state[field]);
      if (scriptId !== undefined && scriptId > 0 && ids.size > 0 && !ids.has(scriptId)) {
        issues.push(createAutomatorIssue(
          'automator-script-reference',
          `Automator state.${field} references script ${scriptId}, which is not present in the save.`,
          `reality.automator.state.${field}`,
        ));
      }
    }

    if (state.stack !== undefined && !Array.isArray(state.stack)) {
      issues.push(createAutomatorIssue('automator-stack-shape', 'Automator execution state.stack must be an array.', 'reality.automator.state.stack'));
    }
  }

  const type = automator.type;
  if (typeof type === 'number' && !automatorEditorTypeDefinitions.some((definition) => definition.value === type)) {
    issues.push(createAutomatorIssue('automator-editor-type', 'Automator editor type must be Text (0) or Blocks (1).', 'reality.automator.type'));
  }

  const currentInfoPane = automator.currentInfoPane;
  if (typeof currentInfoPane === 'number' && !automatorInfoPanelDefinitions.some((definition) => definition.value === currentInfoPane)) {
    issues.push(createAutomatorIssue('automator-info-pane', 'Automator currentInfoPane must reference a known in-game information panel.', 'reality.automator.currentInfoPane'));
  }

  return issues;
};
