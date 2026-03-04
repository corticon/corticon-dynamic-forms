---
title: UIControl Field Matrix (Implemented)
sidebar_position: 2.5
---

# UIControl Field Matrix (Implemented)

This matrix reflects what the current front-end renderer actually uses from `UIControl` metadata in:

- `static/corticon-forms-example/clientSideComponent/dynForm/uiControlsRenderers.js`
- `static/corticon-forms-example/clientSideComponent/dynForm/stepsController.js` (for validation impact)

If a field is not listed here for a control type, it is not currently influencing rendering behavior.

## Cross-Cutting Fields

These are renderer features that apply broadly across controls:

| Field | Implemented behavior |
| --- | --- |
| `id` | Used for DOM IDs, labels, and conditional-visibility wiring. |
| `label` | Rendered via `appendLabel(...)`. |
| `labelPosition` | Controls `'Above'` vs `'Side'` label placement. |
| `tooltip` | Rendered in label info bubble; many controls also use it as input `title`. |
| `triggeredByControlWithId` + `triggeredWhenSelection` | Hides/shows controls conditionally. |
| `validationErrorMsg` | Decision-service validation message shown under the control (for controls that call `addValidationMsgFromDecisionService`). |
| `required` | Adds required marker and, for input controls, enables client-side required validation. |

## Per-Type Matrix

Legend: `Y` = implemented for this type, `N` = not implemented for this type.

| UIControl `type` | `fieldName` | `value` | `placeholder` | `required` | `min`/`max` | `minDT`/`maxDT` | `option` | `dataSource` | `multiple` | Other implemented fields / notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `Text` | Y | Y | Y | Y | Y (character length) | N | N | N | Y | Uses dynamic array UI when `multiple=true`. |
| `TextArea` | Y | Y | Y | Y | Y (character length) | N | N | N | N | Supports `rows`, `cols`. |
| `Number` | Y | Y | Y | Y | Y (numeric bounds) | N | N | N | Y | Supports `dataType`, `step`, `format`, `decimals`. |
| `DateTime` | Y | Y | N | Y | N | Y | N | N | Y | Supports `showTime` for date vs date-time picker. |
| `YesNo` | Y | Y | N | Y | N | N | N | N | N | Renders Yes/No select; stores `yes`/`no`. |
| `YesNoBoolean` | Y | Y | N | Y | N | N | N | N | N | Renders Yes/No select; stores `T`/`F`. |
| `ReadOnlyText` | N | Y | N | N | N | N | N | N | N | Display-only text. |
| `SingleChoice` | Y | Y | N | Y | N | N | N | N | N | Checkbox renderer. |
| `Radio` | Y | Y | N | Y | N | N | Y | N | N | Static options only (`option[]`). |
| `MultipleChoices` | Y | Y | Y | Y | N | N | Y | Y | N | Supports static and/or REST-driven options. |
| `MultipleChoicesMultiSelect` | Y | Y (array) | Y (limited UX impact) | Y | N | N | Y | Y | N | Multi-select variant of `MultipleChoices`. |
| `MultiText` | Y | N | Y | N | N | N | N | N | N | Intrinsically repeatable control (internal add-row behavior). |
| `MultiExpenses` | Y | N | N | N | N | N | Y | N | N | Supports `showCurrency` (defaults on). Intrinsically repeatable. |
| `FileUpload` | Y | N | N | Y | N | N | N | N | N | Supports `accept`, `allowMultiple`. |
| `FileUploadExpenses` | Y | N | N | Y | N | N | N | N | N | Supports `accept`, `allowMultiple`. |
| `Geolocation` | Y | N | Y | Y | N | N | N | N | N | Uses Maps autocomplete + browser geolocation button. |
| `Rating` | Y | Y | Y | Y | Y (numeric bounds) | N | N | N | N | Supports `step`; min/max default to 1..5 when omitted. |
| `QRCode` | N | Y | N | N | N | N | N | N | N | Supports `size`, `color`, `background`. |

## MultipleChoices vs Radio (Choices Definition)

Both controls use the same static option object shape:

```javascript
Option.new [value='email', displayName='Email']
```

But behavior differs:

- `Radio` currently uses only static `option[]` (no `dataSource` support).
- `MultipleChoices` supports both static `option[]` and dynamic `dataSource` (+ `dataSourceOptions` mapping).
- `MultipleChoicesMultiSelect` supports multiple selected values; `Radio` is single-select only.
