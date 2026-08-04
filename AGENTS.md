# Repository operating rules

These rules apply to every change in this repository. Preserve unrelated
worktree changes. Do not use `git reset`, `git clean`, or `git checkout` to
discard work that is not explicitly in scope.

## Architecture and dependency boundaries

The application is organized into four layers:

- `src/app` owns composition, entry points, and React state providers. It may
  import `features`, `shared`, and `domain`.
- `src/features` owns user workflows such as import, export, structured
  editing, and JSON editing. Features may consume domain contracts and shared
  UI, but must not implement a second transport codec or validation pipeline.
- `src/domain` is framework-free TypeScript. It contains the save model,
  document store, platform adapters, transport codecs, catalogs, and
  validation. It must not import React, browser globals, or SCSS.
- `src/shared` contains reusable UI primitives and presentation utilities. It
  must not own feature-specific save rules or silently mutate save documents.

SCSS remains the presentation layer. Keep design tokens in the existing
`scss` token/theme/component files and do not introduce a UI framework for
routine editor work.

Remaining legacy modules under `src/Struct` are migration-only compatibility
types. New application code must use `JsonValue`, `SaveObject`, and the
platform adapters; do not add new dependencies on legacy structures.

## Canonical save contracts

- Use `JsonValue`, `SaveObject`, and `SaveArray` instead of global `any` or
  `Record<string, any>`.
- `src/domain/save/catalog/fields.ts` is the single source of truth for field
  ids, sections, labels, PC/Android paths, aliases, kinds, support status, and
  rules.
- `bitfields.ts`, `challenges.ts`, and the collection catalog are the single
  source of truth for masks, challenge indexes, collection entries, and
  unknown-entry handling.
- `src/features/save-editor/structured/sectionCatalog.ts` owns structured
  section order, groups, titles, and error routing. Sections consume `fieldId`
  or catalog data instead of repeating literal save paths.
- Build field indexes once and reuse them for exploration, routing, and
  validation. Do not create competing registries or validators.
- Give every editable save path one owning structured section. A Systems or
  catalog projection may explain a specialized value, but it must be read-only
  when another section owns the write path; All values and JSON remain the
  explicit advanced fallback.
- Do not add historical service facades, compatibility aliases, or silent
  fallback execution paths. A migration is complete only after its old path is
  removed and its tests use the canonical contract.
- Unknown fields, unknown bit positions, unknown bitfield segments, unknown
  collection entries, and future collection values must survive an edit and a
  transport round-trip.
- `src/domain/save/catalog/automator.ts` is the canonical snapshot for
  Automator commands, condition values, editor modes, and upstream limits.
  Keep PC script objects and Android script arrays normalized only in the
  catalog helpers; do not duplicate command lists in React components.
- Automator script text is user data: never log, publish, or include its raw
  content in diagnostics. The editor may edit and structurally validate it,
  but must not claim to compile or execute it without a live game check.

## Transport and platform rules

Treat every imported save as untrusted input. Apply encoded, compressed, and
inflated size limits before expensive work. Never log a raw save payload,
publish one, commit one, or include one in diagnostics.

The transport contract follows the pinned upstream reference
`5409e320cecef96a917cca1dfb68f1f183e499ca`:

- PC exports use the upstream `AAA`/`AAB` envelope, compression, suffix, and
  reserved `Infinity` marker.
- Android exports use the `AAA` envelope and Android field aliases described
  by the platform adapter.
- `Set` is converted to an array only at the transport boundary. The editor
  codec must preserve `Infinity` and must not turn it into `null`.
- Fixture transport tests establish parsing and round-trip behavior only.
  They do not establish complete Android compatibility or live-game
  compatibility. A real game import/export remains a separate manual gate.

## Required checks

Before hand-off, run all four repository gates:

```text
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Keep the lockfile frozen in CI. Do not hide failures with `continue-on-error`,
empty test fallbacks, or broad warning suppression.

When reporting verification, distinguish:

- unit tests: isolated functions and components;
- functional coverage: import, edit, validation, and export workflows;
- browser smoke: a rendered interaction path in a real browser;
- fixture compatibility: known PC/Android files and their exact tested scope;
- live compatibility: a disposable save verified in the target game.

Passing one category never implies that the other categories passed.

## Worktree procedure

Before editing, inspect `git status` and preserve unrelated changes. Review the
diff after each migration step. Finish with:

```text
git diff --check
```

Do not overwrite or delete a user file merely to make a check green. If a
generated artifact appears, remove only that exact artifact and document it.

## UI and accessibility

Preserve the dark cosmic identity and existing themes. Every interactive
control needs a visible focus state, accessible name, logical keyboard order,
and a usable label relationship. Support keyboard-only operation, reduced
motion, readable contrast, and explicit loading, error, empty, and success
states.

Validate responsive behavior at `390x844`, `768x1024`, and `1536x1024`, including
section navigation, dialogs, long JSON values, bitfield controls, focus/error
routing, and export feedback. Do not make core functionality hover-only or
hide the import/edit/export path on narrow screens.

## Final report

The final hand-off must list checks under exactly these practical categories:

- passed, with the command and scope;
- not executed, with the reason;
- blocked, with the external or environment blocker.

State whether compatibility evidence is fixture-based, an internal
round-trip, browser-based, or live-game verified. Keep README and compatibility
notes aligned with the evidence actually collected.
