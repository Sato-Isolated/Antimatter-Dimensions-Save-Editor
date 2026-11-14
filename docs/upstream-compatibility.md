# Validation audit — issue #13

Reference: [IvarK PC source at 5409e320](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca).
Audited on 2026-11-14. The issue remains open. Its screenshot establishes the
reported error, not the contents of the original save; reproduction uses synthetic data.

## Confirmed errors and corrections

| Area | Evidence and correction |
| --- | --- |
| Black Hole 1 and 2 phase | Both catalog fields imposed `minimum: 0`, rejecting an entire import. Both now accept any finite number without changing it. `src/core/black-hole.js:50` discusses negative update arguments and intends a nonnegative resulting phase; this does **not** establish that every negative stored phase is corrupt, or prove how the reported mobile value arose. |
| Historical versions | `src/core/storage/migrations.js:46` and `:72` define versions `9.5` and `12.1`. Both validation layers, version metadata, and the version input now preserve fractions. |
| Historical paths and required fields | `src/core/storage/migrations.js:739` renames `money` to `antimatter`, and `:946` renames `resets` to `dimensionBoosts`. The PC catalog reads/edits those existing historical paths without renaming them. Modern fields and an unproven complete progression schema are not required. These PC aliases are not applied to mobile saves. |
| Gameplay bounds and integers | Minimum, maximum, and integer expectations for resources, counters, challenge IDs and settings now warn. They are useful diagnostics, not proof of corruption. Structural bitfield constraints remain errors. |
| Automator | Count/length limits come from `src/core/automator/automator-backend.js:171`; exceeding an editor/gameplay limit does not make all stored data unreadable. Limits, unknown enums, constant naming/order and stale references now warn. `initializeFromSave()` handles a missing top-level reference upstream. Script text is never compiled, executed, logged or included in diagnostics. |
| Inferred schemas | A type inferred from one unknown field's original value is advisory. Known structural validators still block malformed data, including non-text Automator content. |
| Collections | Unknown string/numeric IDs, including values outside the catalog's current ID type, survive edits and export with a warning when atypical. Duplicates remain warnings. Malformed containers and nonprimitive entries remain errors. |
| Numeric inputs | Whole decimal/scientific parsing replaces `parseInt` and zero fallbacks. New numeric input that would round, underflow or overflow is rejected; PC large-number input can retain the exact string. Mobile decimal edits retain unknown object metadata. |
| Autobuyer interval | Galaxy `buyMaxInterval` is numeric in `src/core/player.js:94` and both mobile/PC fixture models. Its control previously wrote a boolean; it now retains numeric intervals. |
| Time Studies | The comma parser truncated numbers and silently filtered entries. The existing JSON-array control now preserves complete entries, including future values. |
| JSON serialization | `NaN` and negative infinity previously became `null` through `JSON.stringify`. They now fail serialization explicitly. JSON fields show a serialization error; positive infinity still uses the game's reserved marker. |

## Rules retained

- The transport limits, envelope/compression/suffix checks and direct-player root
  check remain blocking. A numeric version and valid antimatter are required.
- Present numeric scalar fields must have the expected numeric representation;
  malformed types and nonfinite ordinary scalar values remain errors. Large
  numbers retain supported numeric/string/mantissa-exponent representations.
  Missing optional fields remain warnings; no defaults are written on import.
- Booleans, arrays, objects and platform-specific collection shapes remain
  checked without coercion. Optional absent/null/empty values retain the existing
  missing-field handling.
- PC bitfields retain their nonnegative integer/31-bit storage checks, including
  every segment. Unknown bits inside that representation are preserved.
  The existing PC glyph-mask validator is **not** applied to mobile masks,
  which exceed its width in the Android fixture. Generated mobile mask rules
  also no longer inherit the unproven PC 31-bit maximum.
- `Number.MAX_VALUE` record sentinels, Lai'tela entropy `-1`, zero Automator
  script references, and positive `Infinity` retain their stored meaning.
- Mobile Replicanti upgrade counters, decimal objects, upgrade masks, Automator
  script arrays and aliases retain their platform contracts. PC chance/interval
  values and ID-keyed scripts are not substituted for those mobile values.
- Numeric conversions used only for enum selections, generated array indexes,
  catalog labels, record-reset constants, error locations and milestone display
  were reviewed separately from save writes. They do not normalize imported data.

## Evidence and limits

- Unit/component tests cover catalog types, missing values, every numeric
  constraint on each platform, input precision, serialization failures, and
  numeric controls. Functional tests cover import/edit/validate/export and
  preservation of original/unknown values.
- The two PC JSON fixtures and the Android/iOS JSON fixtures pass unchanged
  internal round-trips. Existing transport tests also check encoded fixtures.
  This is fixture evidence, not complete schema or live-game compatibility.
- Chromium smoke at `390x844`, `768x1024`, and `1536x1024` exercises all three
  envelopes: import, section navigation, both negative phases, scientific input,
  export dialog/feedback and decoded output preservation. Browser plugin was
  unavailable; an already installed Playwright runtime was used without adding
  dependencies. Screenshots were kept outside the repository.
- The PC browser path also checks error focus/export blocking, keyboard bitfield
  edits preserving an unknown high bit, long JSON text, Tab navigation, and
  recovery to a successful export.
- No target game was launched. PC source comparison is pinned to the commit
  above. Android/iOS behavior beyond the checked fixtures is unverified; PC
  gameplay bounds and Automator limits are advisory there too.
- Native JSON parsing still uses JavaScript numbers. Precision already lost in
  a source's bare JSON numbers cannot be recovered. Large decimal strings and
  mobile mantissa/exponent objects are preserved without migration; new scalar
  input is checked against its decimal round-trip before conversion.
- Successful export does not promise the game will accept atypical values,
  future enum IDs, or an Automator script. Live import/export remains a separate
  manual gate using a disposable save.

## Verification recorded for this change

- passed: `pnpm typecheck` (application and tooling TypeScript), `pnpm lint`
  (zero warnings), `pnpm test` (193 tests in 24 files: unit/component,
  functional workflows and fixture coverage), `pnpm build` (production bundle),
  and `git diff --check` (whitespace). Checks ran on the complete working tree,
  including pre-existing local changes.
- passed: the temporary Playwright smoke script ran nine Chromium
  import/edit/export paths across three platforms and three viewport sizes;
  page identity, rendered content, console health, overflow and export contents
  were checked. The PC cases additionally exercised the error/keyboard/JSON
  paths described above. The script and screenshots remain outside the repo.
- not executed: live-game import/export and script compilation/execution;
  no disposable target-game session was used. The original issue's save payload
  was not available, so its exact original contents were not tested.
- blocked: none for implementation or the repository gates. Mobile behavior
  outside the fixture scope remains unverified, not established by PC source.
