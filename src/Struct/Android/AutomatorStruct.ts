export interface AutomatorStruct {
  mode: string;
  type: string;
  line: number;
  state: AutomatorState;
  execution: AutomatorExecution;
  repetition: string;
  trigger: string;
  flashTicksLeft: number;
  topLevelScript: string;
  currentErrors: ErrorReport[];
  editorScript: string;
  scripts: Record<string, ScriptData>;
  constantSortOrder: string[];
}

export interface AutomatorState {
  topLevelScript: string;
  stackFrames: StackFrame[];
  hasJumped: boolean;
}

export interface AutomatorExecution {
  timer: number;
  isRunning: boolean;
  isActive: boolean;
  waitMode: boolean;
  isFullscreen: boolean;
  wasInstant: boolean;
  lastRealityTime: number;
  completions: number;
}

export interface StackFrame {
  scriptName: string;
  line: number;
  loop: LoopHandler[];
  if: IfHandler[];
}

export interface LoopHandler {
  variable: string;
  start: number;
  end: number;
  step: number;
  value: number;
  loopStart: number;
}

export interface IfHandler {
  isTrue: boolean;
  ifStart: number;
  elseStart: number;
  endLocation: number;
}

export interface ErrorReport {
  run: boolean;
  start: number;
  end: number;
  type: string;
  scriptName: string;
  details: string;
}

export interface ScriptData {
  name: string;
  content: string;
  locked: boolean;
  isCommand: boolean;
  selected: boolean;
  color: number;
} 