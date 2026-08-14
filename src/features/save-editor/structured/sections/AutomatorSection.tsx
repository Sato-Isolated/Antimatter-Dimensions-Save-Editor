import React from 'react';
import { FaBook, FaCode, FaPlayCircle, FaTerminal } from 'react-icons/fa';
import { getValueAtPath } from '../../../../domain/save/document/path';
import {
  automatorCommandCategories,
  automatorCommandDefinitions,
  automatorConstantDefinitions,
  automatorCurrencyDefinitions,
  automatorEditorTypeDefinitions,
  automatorInfoPanelDefinitions,
  automatorLimits,
  automatorModeDefinitions,
  AUTOMATOR_UPSTREAM_SNAPSHOT,
  getAutomatorConstants,
  getAutomatorScripts,
} from '../../../../domain/save/catalog/automator';
import { resolveRegisteredFieldPath } from '../../../../domain/save/catalog/fields';
import { SaveObject, SaveType } from '../../../../domain/save/model';
import JsonTextareaField from '../../../../shared/ui/JsonValueField';
import FieldDescription from '../../../../shared/ui/FieldDescription';
import SectionShell, { SectionShellTab } from '../../../../shared/ui/SectionShell';
import { SectionProps } from './types';

const getFieldPath = (saveRecord: SaveObject, fieldId: string, saveType: SaveType): string => (
  resolveRegisteredFieldPath(saveRecord, fieldId, saveType)
);

const getOptionalNumber = (saveRecord: SaveObject, path: string): number | undefined => {
  const value = getValueAtPath(saveRecord, path);
  return typeof value === 'number' ? value : undefined;
};

const getOptionalBoolean = (saveRecord: SaveObject, path: string): boolean | undefined => {
  const value = getValueAtPath(saveRecord, path);
  return typeof value === 'boolean' ? value : undefined;
};

const getSelectValue = (value: number | boolean | undefined): string => (
  value === undefined ? '' : String(value)
);

const sanitizeId = (value: string): string => value.replace(/[^a-zA-Z0-9_-]+/gu, '-');

const AutomatorSection: React.FC<SectionProps> = ({
  saveData,
  handleValueChange,
  renderValidationIndicator,
  saveType,
}) => {
  const [activeTab, setActiveTab] = React.useState('execution');
  const saveRecord = saveData as unknown as SaveObject;
  const scripts = getAutomatorScripts(saveRecord);
  const constants = getAutomatorConstants(saveRecord);

  const modePath = getFieldPath(saveRecord, 'automatorMode', saveType);
  const topLevelScriptPath = getFieldPath(saveRecord, 'automatorTopLevelScript', saveType);
  const editorScriptPath = getFieldPath(saveRecord, 'automatorEditorScript', saveType);
  const repeatPath = getFieldPath(saveRecord, 'automatorRepeat', saveType);
  const forceRestartPath = getFieldPath(saveRecord, 'automatorForceRestart', saveType);
  const followExecutionPath = getFieldPath(saveRecord, 'automatorFollowExecution', saveType);
  const editorTypePath = getFieldPath(saveRecord, 'automatorEditorType', saveType);
  const execTimerPath = getFieldPath(saveRecord, 'automatorExecTimer', saveType);
  const forceUnlockPath = getFieldPath(saveRecord, 'automatorForceUnlock', saveType);
  const currentInfoPanePath = getFieldPath(saveRecord, 'automatorCurrentInfoPane', saveType);
  const constantSortOrderPath = getFieldPath(saveRecord, 'automatorConstantSortOrder', saveType);

  const mode = getOptionalNumber(saveRecord, modePath);
  const topLevelScript = getOptionalNumber(saveRecord, topLevelScriptPath);
  const editorScript = getOptionalNumber(saveRecord, editorScriptPath);
  const repeat = getOptionalBoolean(saveRecord, repeatPath);
  const forceRestart = getOptionalBoolean(saveRecord, forceRestartPath);
  const followExecution = getOptionalBoolean(saveRecord, followExecutionPath);
  const editorType = getOptionalNumber(saveRecord, editorTypePath);
  const execTimer = getOptionalNumber(saveRecord, execTimerPath);
  const forceUnlock = getOptionalBoolean(saveRecord, forceUnlockPath);
  const currentInfoPane = getOptionalNumber(saveRecord, currentInfoPanePath);
  const executionStack = getValueAtPath<unknown>(saveRecord, 'reality.automator.state.stack');
  const stackLength = Array.isArray(executionStack) ? executionStack.length : undefined;
  const constantSortOrder = getValueAtPath<unknown>(saveRecord, constantSortOrderPath);

  const tabs: SectionShellTab[] = [
    { id: 'execution', title: 'Execution', icon: <FaPlayCircle className="subtab-icon" /> },
    { id: 'scripts', title: 'Scripts', icon: <FaCode className="subtab-icon" /> },
    { id: 'constants', title: 'Constants', icon: <FaTerminal className="subtab-icon" /> },
    { id: 'reference', title: 'In-game reference', icon: <FaBook className="subtab-icon" /> },
  ];

  const scriptOptions = (selectedId: number | undefined): React.ReactNode => (
    <>
      {selectedId === undefined ? <option value="">Missing in save</option> : null}
      {selectedId === 0 ? <option value="0">No script selected</option> : null}
      {selectedId !== undefined && selectedId !== 0 && !scripts.some((script) => script.id === selectedId) ? (
        <option value={String(selectedId)}>Unknown script ID {selectedId}</option>
      ) : null}
      {scripts.map((script) => (
        <option key={`${script.path}-${script.id}`} value={String(script.id)}>
          {script.id} · {script.name || 'Unnamed script'}
        </option>
      ))}
    </>
  );

  const handleNumberSelect = (path: string, value: string): void => {
    if (value !== '') handleValueChange(path, Number(value));
  };

  const handleBooleanSelect = (path: string, value: string): void => {
    if (value !== '') handleValueChange(path, value === 'true');
  };

  return (
    <SectionShell
      id="automator"
      title="Automator"
      description="Scripts that the game can execute in Reality. The catalog below is pinned to the upstream game source; this editor does not compile or run scripts."
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className={`subtab-content ${activeTab === 'execution' ? 'active' : ''}`}>
        <div className="resource-group">
          <h4>Execution controls</h4>
          <FieldDescription>
            The selected IDs point into the saved script collection. Mode controls execution; the game separately uses
            the persisted stack to tell whether a script is currently active. Missing or unknown values are shown rather
            than replaced with a default.
          </FieldDescription>
          <div className="reality-grid">
            <div className="form-group">
              <label htmlFor="automator-mode">Execution mode</label>
              <select
                id="automator-mode"
                value={getSelectValue(mode)}
                onChange={(event) => handleNumberSelect(modePath, event.target.value)}
              >
                {mode === undefined ? <option value="">Missing in save</option> : null}
                {mode !== undefined && !automatorModeDefinitions.some((definition) => definition.value === mode) ? (
                  <option value={String(mode)}>Unknown upstream mode ({mode})</option>
                ) : null}
                {automatorModeDefinitions.map((definition) => (
                  <option key={definition.value} value={definition.value}>
                    {definition.value} · {definition.label}
                  </option>
                ))}
              </select>
              <FieldDescription>
                {automatorModeDefinitions.find((definition) => definition.value === mode)?.description
                  ?? 'The value is outside the pinned upstream mode catalog.'}
              </FieldDescription>
              {renderValidationIndicator(modePath)}
            </div>

            <div className="form-group">
              <label htmlFor="automator-top-level-script">Script executed</label>
              <select
                id="automator-top-level-script"
                value={getSelectValue(topLevelScript)}
                onChange={(event) => handleNumberSelect(topLevelScriptPath, event.target.value)}
              >
                {scriptOptions(topLevelScript)}
              </select>
              <FieldDescription>The top-level script that the game starts or resumes.</FieldDescription>
              {renderValidationIndicator(topLevelScriptPath)}
            </div>

            <div className="form-group">
              <label htmlFor="automator-editor-script">Script open in editor</label>
              <select
                id="automator-editor-script"
                value={getSelectValue(editorScript)}
                onChange={(event) => handleNumberSelect(editorScriptPath, event.target.value)}
              >
                {scriptOptions(editorScript)}
              </select>
              <FieldDescription>The script currently visible in the in-game Automator editor.</FieldDescription>
              {renderValidationIndicator(editorScriptPath)}
            </div>

            <div className="form-group">
              <label htmlFor="automator-repeat">Repeat after completion</label>
              <select
                id="automator-repeat"
                value={getSelectValue(repeat)}
                onChange={(event) => handleBooleanSelect(repeatPath, event.target.value)}
              >
                {repeat === undefined ? <option value="">Missing in save</option> : null}
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
              <FieldDescription>When enabled, reaching the end starts the selected top-level script again.</FieldDescription>
              {renderValidationIndicator(repeatPath)}
            </div>

            <div className="form-group">
              <label htmlFor="automator-force-restart">Restart after Reality reset</label>
              <select
                id="automator-force-restart"
                value={getSelectValue(forceRestart)}
                onChange={(event) => handleBooleanSelect(forceRestartPath, event.target.value)}
              >
                {forceRestart === undefined ? <option value="">Missing in save</option> : null}
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
              <FieldDescription>Controls whether a Reality reset restarts the Automator instead of continuing its current execution state.</FieldDescription>
              {renderValidationIndicator(forceRestartPath)}
            </div>

            <div className="form-group">
              <label htmlFor="automator-follow-execution">Follow the executed line</label>
              <select
                id="automator-follow-execution"
                value={getSelectValue(followExecution)}
                onChange={(event) => handleBooleanSelect(followExecutionPath, event.target.value)}
              >
                {followExecution === undefined ? <option value="">Missing in save</option> : null}
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
              <FieldDescription>Scrolls the in-game editor to the command currently being executed when the running script is open.</FieldDescription>
              {renderValidationIndicator(followExecutionPath)}
            </div>

            <div className="form-group">
              <label htmlFor="automator-editor-type">Editor format</label>
              <select
                id="automator-editor-type"
                value={getSelectValue(editorType)}
                onChange={(event) => handleNumberSelect(editorTypePath, event.target.value)}
              >
                {editorType === undefined ? <option value="">Missing in save</option> : null}
                {editorType !== undefined && !automatorEditorTypeDefinitions.some((definition) => definition.value === editorType) ? (
                  <option value={String(editorType)}>Unknown upstream format ({editorType})</option>
                ) : null}
                {automatorEditorTypeDefinitions.map((definition) => (
                  <option key={definition.value} value={definition.value}>{definition.value} · {definition.label}</option>
                ))}
              </select>
              <FieldDescription>
                {automatorEditorTypeDefinitions.find((definition) => definition.value === editorType)?.description
                  ?? 'The game format is outside the pinned upstream catalog.'}
              </FieldDescription>
              {renderValidationIndicator(editorTypePath)}
            </div>
          </div>
        </div>

        <div className="resource-group">
          <h4>Runtime diagnostics</h4>
          <div className="reality-grid">
            <div className="form-group">
              <label htmlFor="automator-exec-timer">Execution timer (ms)</label>
              <input
                type="number"
                id="automator-exec-timer"
                value={execTimer ?? ''}
                readOnly
              />
              <FieldDescription>The game-loop accumulator, reset to 0 when Automator execution starts. It is diagnostic, not a script setting.</FieldDescription>
              {renderValidationIndicator(execTimerPath)}
            </div>

            <div className="form-group">
              <label htmlFor="automator-force-unlock">Force unlock (debug flag)</label>
              <select
                id="automator-force-unlock"
                value={getSelectValue(forceUnlock)}
                onChange={(event) => handleBooleanSelect(forceUnlockPath, event.target.value)}
              >
                {forceUnlock === undefined ? <option value="">Missing in save</option> : null}
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
              <FieldDescription>Developer-style override in the save. It is not a normal Reality progression unlock.</FieldDescription>
              {renderValidationIndicator(forceUnlockPath)}
            </div>

            <div className="form-group">
              <label htmlFor="automator-info-pane">In-game information panel</label>
              <select
                id="automator-info-pane"
                value={getSelectValue(currentInfoPane)}
                onChange={(event) => handleNumberSelect(currentInfoPanePath, event.target.value)}
              >
                {currentInfoPane === undefined ? <option value="">Missing in save</option> : null}
                {currentInfoPane !== undefined && !automatorInfoPanelDefinitions.some((definition) => definition.value === currentInfoPane) ? (
                  <option value={String(currentInfoPane)}>Unknown upstream panel ({currentInfoPane})</option>
                ) : null}
                {automatorInfoPanelDefinitions.map((definition) => (
                  <option key={definition.value} value={definition.value}>{definition.value} · {definition.label}</option>
                ))}
              </select>
              <FieldDescription>
                {automatorInfoPanelDefinitions.find((definition) => definition.value === currentInfoPane)?.description
                  ?? 'The panel ID is outside the pinned upstream catalog.'}
              </FieldDescription>
              {renderValidationIndicator(currentInfoPanePath)}
            </div>
          </div>
          <FieldDescription>
            {stackLength === undefined
              ? 'Execution stack: absent or malformed; the game normally stores an array and rebuilds it from the script.'
              : `Execution stack: ${stackLength} frame${stackLength === 1 ? '' : 's'} persisted. It is intentionally not editable here because the game rebuilds it during Automator initialization.`}
          </FieldDescription>
        </div>
      </div>

      <div className={`subtab-content ${activeTab === 'scripts' ? 'active' : ''}`}>
        <div className="resource-group">
          <h4>Executable scripts</h4>
          <FieldDescription>
            These are the actual text programs stored by the game. The save editor edits their names and text but does not
            claim to compile them; use the in-game Automator error panel or the pinned command reference below to verify behavior.
            The game allows {automatorLimits.maxScriptCount} scripts, {automatorLimits.maxScriptCharacters} characters per script,
            and {automatorLimits.maxTotalScriptCharacters} characters in total.
          </FieldDescription>
          {scripts.length === 0 ? (
            <FieldDescription>No Automator scripts are present in this save.</FieldDescription>
          ) : (
            <div className="automator-script-list">
              {scripts.map((script) => {
                const scriptId = sanitizeId(script.path);
                const isRunning = script.id === topLevelScript;
                const isOpen = script.id === editorScript;
                return (
                  <article className="automator-script-card" key={script.path}>
                    <div className="automator-script-card__header">
                      <div>
                        <h5>{script.id} · {script.name || 'Unnamed script'}</h5>
                        <span className="automator-script-card__badges">
                          {isRunning ? 'Executed' : null}
                          {isRunning && isOpen ? ' · ' : null}
                          {isOpen ? 'Open in editor' : null}
                        </span>
                      </div>
                      <span className="automator-script-card__length">
                        {script.content.length}/{automatorLimits.maxScriptCharacters}
                      </span>
                    </div>
                    <div className="form-group">
                      <label htmlFor={`automator-script-name-${scriptId}`}>Script name</label>
                      <input
                        type="text"
                        id={`automator-script-name-${scriptId}`}
                        value={script.name}
                        maxLength={automatorLimits.maxScriptNameCharacters}
                        onChange={(event) => handleValueChange(script.namePath, event.target.value)}
                      />
                      <FieldDescription>Upstream limit: {automatorLimits.maxScriptNameCharacters} characters.</FieldDescription>
                      {renderValidationIndicator(script.namePath)}
                    </div>
                    <div className="form-group">
                      <label htmlFor={`automator-script-content-${scriptId}`}>Script content</label>
                      <textarea
                        id={`automator-script-content-${scriptId}`}
                        rows={Math.min(14, Math.max(5, script.content.split('\n').length + 1))}
                        value={script.content}
                        spellCheck={false}
                        onChange={(event) => handleValueChange(script.contentPath, event.target.value)}
                      />
                      <FieldDescription>Raw Automator text. Formatting and command syntax are preserved exactly; no silent fallback or compile step is applied.</FieldDescription>
                      {renderValidationIndicator(script.contentPath)}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className={`subtab-content ${activeTab === 'constants' ? 'active' : ''}`}>
        <div className="resource-group">
          <h4>Constants shared by scripts</h4>
          <FieldDescription>
            Constants are strings interpreted by the game according to their use: numeric values for comparisons,
            seconds for pause durations, or Time Study import strings for study commands. Names are dynamic; the fixture
            examples such as TSFull are not a fixed schema.
          </FieldDescription>
          {constants.length === 0 ? (
            <FieldDescription>No Automator constants are present in this save.</FieldDescription>
          ) : (
            <div className="reality-grid">
              {constants.map((constant) => (
                <div className="form-group" key={constant.path}>
                  <label htmlFor={`automator-constant-${sanitizeId(constant.name)}`}>
                    <span>{constant.definition.label}</span>
                    <code className="automator-constant-key">{constant.name}</code>
                  </label>
                  <input
                    type="text"
                    id={`automator-constant-${sanitizeId(constant.name)}`}
                    value={typeof constant.value === 'string' ? constant.value : ''}
                    maxLength={automatorLimits.maxConstantValueCharacters}
                    onChange={(event) => handleValueChange(constant.path, event.target.value)}
                  />
                  <FieldDescription>
                    {constant.definition.description}{' '}
                    {constant.present
                      ? `Value limit: ${automatorLimits.maxConstantValueCharacters} characters; names are limited to ${automatorLimits.maxConstantNameCharacters} characters.`
                      : 'This key is present in constantSortOrder but missing from constants; entering a value will create it.'}
                  </FieldDescription>
                  {renderValidationIndicator(constant.path)}
                </div>
              ))}
            </div>
          )}
          <JsonTextareaField
            id="automator-constant-sort-order"
            label="Constant display order"
            description="The game keeps this array synchronized with constants to control the order shown in its definition panel."
            value={Array.isArray(constantSortOrder) ? constantSortOrder : []}
            onChange={(value) => handleValueChange(constantSortOrderPath, value)}
            expectation="array"
            rows={4}
            stringifySpace={2}
            fallbackValue={[]}
          />
          {renderValidationIndicator(constantSortOrderPath)}
        </div>
      </div>

      <div className={`subtab-content ${activeTab === 'reference' ? 'active' : ''}`}>
        <div className="resource-group">
          <h4>Known Time Study preset names</h4>
          <FieldDescription>
            These are the readable meanings of the names found in the reference fixtures. The names are still
            user-defined Automator keys: the game stores and resolves the value, but does not attach this label to it.
          </FieldDescription>
          <div className="automator-constant-reference">
            {automatorConstantDefinitions.map((constant) => (
              <div className="automator-constant-reference__entry" key={constant.name}>
                <strong>{constant.label}</strong>
                <code>{constant.name}</code>
                <span>{constant.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="resource-group">
          <h4>Commands available in the game</h4>
          <FieldDescription>
            Reference from upstream commit {AUTOMATOR_UPSTREAM_SNAPSHOT}. Availability can still depend on the player’s
            unlocks; the save editor lists syntax and meaning but does not validate a script against the game parser.
          </FieldDescription>
          <div className="automator-command-catalog">
            {automatorCommandCategories.map((category) => (
              <details key={category.id} className="automator-command-category">
                <summary>{category.label}</summary>
                <FieldDescription>{category.description}</FieldDescription>
                <div className="automator-command-list">
                  {automatorCommandDefinitions
                    .filter((command) => command.category === category.id)
                    .map((command) => (
                      <details key={command.id} className="automator-command-entry">
                        <summary>{command.keyword}</summary>
                        <code>{command.syntax}</code>
                        <p>{command.description}</p>
                        {command.unlock ? <p className="field-description">Unlock note: {command.unlock}</p> : null}
                        <ul>
                          {command.examples.map((example) => <li key={example}><code>{example}</code></li>)}
                        </ul>
                      </details>
                    ))}
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="resource-group">
          <h4>Values usable in conditions</h4>
          <FieldDescription>
            These are calculated by the running game, not persisted save paths. Pending gains, filter score, completion
            counts, and Space Theorems can therefore differ from the visible JSON values or be unavailable until unlocked.
          </FieldDescription>
          <div className="automator-currency-list">
            {automatorCurrencyDefinitions.map((currency) => (
              <div key={currency.id} className="automator-currency-entry">
                <code>{currency.label}</code>
                <span>{currency.description}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="resource-group">
          <h4>Compatibility boundary</h4>
          <FieldDescription>
            Save shape: checked against PC/mobile fixtures. Command syntax: catalogued from pinned upstream but not
            compiled here. Live-game compatibility: not verified, especially on mobile where this source snapshot does
            not include a matching runtime implementation.
          </FieldDescription>
        </div>
      </div>
    </SectionShell>
  );
};

export default AutomatorSection;
