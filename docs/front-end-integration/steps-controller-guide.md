---
title: Steps Controller Guide
sidebar_position: 3
---

# Guide to the Steps Controller

`stepsController.js` is the runtime coordinator for the multi-stage form.  
It owns state, calls the decision service, validates user input, persists answers, and triggers rendering for each stage.

## Core Responsibilities

- State management: maintains the two-part decision payload `[controlData, formData]`.
- Navigation control: handles `Next`/`Previous` flow and stage transitions.
- Validation: enforces required checks and client-side constraints (including text length min/max when configured).
- Data interaction: collects UI input, maps it by `fieldName`, and stores under the active `pathToData`.
- Decision-service orchestration: executes rules and renders returned UI metadata.

## State Management in Detail

The decision service is stateless across requests, so `stepsController` carries state between calls:

- `itsDecisionServiceInput[0]` contains control metadata (`currentStageNumber`, `nextStageNumber`, `pathToData`, etc.).
- `itsDecisionServiceInput[1]` is aggregated business data from user input and rule effects.
- `pathToData` controls where saved values land:
  - root object when `pathToData` is empty/null
  - nested object when `pathToData='SomeEntityName'`
- `nextStageNumber` from the current response becomes `currentStageNumber` for the next request.

## Key Functions

| Function | Description |
| --- | --- |
| `startDynUI(baseEl, decisionServiceEngine, externalData, language, questionnaireName, useKui)` | Initializes state and executes the first stage. |
| `processNextStep(baseEl, decisionServiceEngine, language, saveInputToFormData=true)` | Validates current controls, saves values, sets next stage, and executes next decision step. |
| `processPrevStep(baseEl, decisionServiceEngine, language)` | Restores previous state from history and re-renders that stage. |
| `_askDecisionServiceForNextUIElementsAndRender(...)` | Executes DS, processes `payload[0]`, handles background/no-UI steps, and calls the renderer. |
| `_saveNonArrayInputsToFormData(baseEl)` | Saves non-array controls by `fieldName`, including checkbox/radio/select/text/date/number conversions. |
| `validateForm(baseEl)` | Runs client-side required validation and rule-driven length checks before allowing Next. |

## System Interactions

The `stepsController` works closely with other components:

- `uiControlsRenderers.js`: renders the current stage controls from decision metadata.
- `decisionServiceBundle.js`: evaluates rules and returns UI + navigation instructions.
- `history.js`: stores snapshots for Previous/back navigation.
- `customEvents.js`: broadcasts lifecycle events (`BEFORE_DS_EXECUTION`, `AFTER_UI_STEP_RENDERED`, `REVIEW_STEP_DISPLAYED`, etc.).
