---
title: UI Control Rendering
sidebar_position: 4
---

# UI Control Rendering

`uiControlsRenderers.js` translates decision-service UI metadata into DOM controls.  
It does not decide *what* to render. The rules do that by returning `UI.containers[*].uiControls[*]`.

## Actual Runtime Flow

1. `stepsController.js` executes the decision service.
2. It extracts `result.payload[0]` (the current UI step model).
3. It calls `itsUIControlsRenderer.renderUI(containers, baseEl, labelPosition, language, useKui)`.
4. `renderUI` loops through containers and controls.
5. `renderUIForOneContainer` switches on `oneUIControl.type` and calls type-specific renderers such as:
   - `renderTextInput`
   - `renderTextAreaInput`
   - `renderSingleChoiceInput`
   - `renderRadioInput`
   - `renderMultipleChoicesInput`

## Control Metadata the Renderer Uses

The renderer relies on control attributes from rules:

- `type`: selects which renderer executes.
- `id`: drives DOM IDs, label `for` linkage, and conditional visibility targeting.
- `fieldName`: stored as a data attribute so `stepsController` can persist user input.
- `value`: default display/selection value.
- `required`: rendered as `data-required="true"` for client validation.
- `min` / `max`: applied as character limits for `Text` and `TextArea`, and numeric bounds for `Number`.
- `validationErrorMsg`: decision-service message shown under the control.
- `triggeredByControlWithId` / `triggeredWhenSelection`: used to show/hide controls dynamically.

## Control Categories

- Simple controls: one DOM input per control (`Text`, `Number`, `DateTime`, `Radio` group, etc.).
- Array controls: dynamic repeated items when `multiple=true` (`Text`, `Number`, `DateTime`).
- Complex array controls: grouped repeated objects (`MultiExpenses`, `MultiText`).
- Data-sourced choice controls: option values fetched from `dataSource` using `dataSourceOptions`.

## Adding a New Control Type

1. Add the new `type` to your vocabulary/rules.
2. Add a new `case` in `renderUIForOneContainer`.
3. Implement a renderer function that:
   - creates DOM elements
   - writes `data-fieldName` and any type metadata needed for save/validate
   - applies `required`, defaults, and DS validation message
4. Update `stepsController` validation/saving logic only if the new control needs special handling.
