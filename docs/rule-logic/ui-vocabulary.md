---
title: The UI Vocabulary
sidebar_position: 2
---

# The UI Vocabulary: The Rule-to-UI Contract

An effective dynamic form depends on a clear "contract" between the rules that define the logic and the front-end code that renders the user interface. This document describes that contract.

As a rule author, you must use the entities and attributes defined here to construct the form. The front-end application is built to understand this specific vocabulary and will render the UI accordingly.

The core entity for defining a user interface is **`UI`**.

---

## UI

The UI entity is the root element for defining the overall state and flow of the dynamic form.

| Attribute              | Data Type | Description                                                                                                                                                                                         |
| ---------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pathToData`           | String    | Defines the primary data object where user-entered information will be stored. This attribute acts as the bridge between the UI definition and your form data model.                            |
| `noUiToRenderContinue` | Boolean   | Set to `true` for stages where no UI should be rendered but rules should keep advancing (for routing, enrichment, background calls, etc.).                                                       |
| `done`                 | Boolean   | Set to `true` to signal the end of the dynamic form flow. The front-end uses this flag to trigger completion behavior.                                                                            |
| `report`               | Boolean   | Optional flag that tells the front-end to render a review/report step before final submission.                                                                                                     |
| `nextStageNumber`      | Integer   | **(Action)** Set this in rulesheet actions to indicate which stage the form should proceed to next. If this is the final stage, leave this null and set `UI.done = true`.                      |
| `currentStageNumber`   | Integer   | **(Precondition/Filter)** The front-end sends this value in the request payload. Use it in a rulesheet filter/precondition so rules apply only to the current stage.                            |
| `labelPosition`        | String    | Optional UI default for control label placement (for example `'Above'` or `'Side'`).                                                                                                              |
| `language`             | String    | Defines the language context. Rules can set this (for example `UI.language = 'italian'`) to change language dynamically during the form flow.                                                    |

---

### Container

Represents a logical grouping or panel within a form stage, containing UI controls. A `Container` is referenced in the rules via the `UI.containers` collection.

| Attribute       | Data Type | Description                                                                                                   |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| `id`            | String    | A required, unique identifier for the container within the current stage.                                     |
| `title`         | String    | Text rendered as the header (e.g., using an `<h3>` tag) for the container.                                    |
| `validationMsg` | String    | Optional text displayed as a validation message associated with the entire container.                         |
| `description`   | String    | An optional descriptive string, not rendered by default but useful for rule troubleshooting or documentation. |

---

### UIControl

Represents an individual form element like an input field, text display, or button.

#### Common `UIControl` Attributes

| Attribute                  | Data Type               | Description                                                                                                                                                                 |
| -------------------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                     | String                  | The specific UI control type to render. This determines which other attributes are required/optional.                                                                      |
| `fieldName`                | String                  | **Crucial for data binding.** Links the control's value to an attribute within the object targeted by `UI.pathToData`.                                                    |
| `id`                       | String                  | Required, unique identifier for the control within its container.                                                                                                           |
| `label`                    | String                  | Label text shown to the user.                                                                                                                                                |
| `value`                    | String, Number, Boolean | Default value for editable controls, or display text for read-only controls.                                                                                                |
| `required`                 | Boolean                 | If `true`, front-end required-field validation is enforced before moving to the next step.                                                                                 |
| `validationErrorMsg`       | String                  | Error text returned by rules and displayed under the control (decision-service validation feedback).                                                                        |
| `labelPosition`            | String                  | Optional label placement override (for example `'Above'`, `'Side'`).                                                                                                        |
| `option`                   | Collection of `Option`  | Option list used by choice controls (`MultipleChoices`, `MultipleChoicesMultiSelect`, `Radio`, `MultiExpenses`).                                                          |
| `multiple`                 | Boolean                 | For supported controls (for example `Text`, `Number`, `DateTime`), enables dynamic multiple entries (array capture).                                                      |
| `dataSource`               | URL (String)            | REST endpoint used to populate choice-based controls dynamically.                                                                                                            |
| `emphasize`                | Boolean                 | If `true`, instructs the renderer to emphasize the control label.                                                                                                           |
| `min` / `max`              | Number                  | Numeric min/max for `Number`; character min/max for `Text` and `TextArea`.                                                                                                 |
| `minDT` / `maxDT`          | Date (String)           | Min/max selectable date for `DateTime` controls (for example `'YYYY-MM-DD'`).                                                                                              |
| `sortOptions`              | String                  | Optionally instructs the front-end to sort options (`'A to Z'` or `'Z to A'`) for choice-based controls.                                                                  |
| `tooltip`                  | String                  | Optional tooltip/help text for the control label.                                                                                                                           |
| `triggeredByControlWithId` | String                  | The `id` of another control that must be interacted with before this control becomes visible.                                                                               |
| `triggeredWhenSelection`   | String                  | The value(s) in the triggering control that make this control visible.                                                                                                      |

#### UIControl Types

| Type                         | Description                                                          | Key Attributes & Rule Examples                                                                                                                                                                             |
| ---------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReadOnlyText`               | Renders non-editable text.                                           | **`value`**: Text to display. <br/> ```javascript <br/> UIControl.new [type='ReadOnlyText', value='...'] <br/> ```                                                                                          |
| `TextArea`                   | Renders a multi-line text input field.                               | **`fieldName`**, **`rows`**, **`cols`**, optional **`min`/`max`** (character limits). <br/> ```javascript <br/> UIControl.new [type='TextArea', fieldName='comments', rows=3, min=10, max=500] <br/> ``` |
| `Text`                       | Renders a single-line text input field.                              | **`fieldName`**, optional **`min`/`max`** (character limits). <br/> ```javascript <br/> UIControl.new [type='Text', fieldName='streetAddress', min=5, max=120] <br/> ```                                   |
| `Number`                     | Renders an input field for numeric entry.                            | **`fieldName`**, **`min`**, **`max`**. <br/> ```javascript <br/> UIControl.new [type='Number', fieldName='age', min=18] <br/> ```                                                                           |
| `DateTime`                   | Renders a date or date-time picker.                                  | **`fieldName`**, **`showTime`**. <br/> ```javascript <br/> UIControl.new [type='DateTime', fieldName='dob', showTime=false] <br/> ```                                                                        |
| `SingleChoice`               | Renders a single checkbox.                                           | **`fieldName`** mapped to a Boolean attribute. <br/> ```javascript <br/> UIControl.new [type='SingleChoice', fieldName='agreedToTerms'] <br/> ```                                                            |
| `Radio`                      | Renders a single-select radio button group.                          | **`fieldName`**, **`option`** list. <br/> ```javascript <br/> UIControl.new [type='Radio', fieldName='contactMethod'] <br/> myRadio.option += Option.new [value='email', displayName='Email'] <br/> ```   |
| `MultipleChoices`            | Renders a choice control for single selection (dropdown).            | **`fieldName`**, optional **`dataSource`**, options via `Option`. <br/> ```javascript <br/> myControl.option += Option.new [value='M', displayName='Male'] <br/> ```                                        |
| `MultipleChoicesMultiSelect` | Renders a choice control for multiple selections.                    | **`fieldName`** should map to a collection; options via `Option`.                                                                                                                                          |
| `MultiText`                  | Allows a dynamic number of single-line text inputs.                  | **`fieldName`** should map to a collection.                                                                                                                                                                 |
| `YesNo`                      | Renders a binary choice storing `'yes'` or `'no'`.                   | **`fieldName`** mapped to a String attribute.                                                                                                                                                               |
| `YesNoBoolean`               | Renders a binary choice storing `'T'` or `'F'`.                      | **`fieldName`** mapped to a String/flag attribute expected by your rules.                                                                                                                                   |
| `FileUpload`                 | Renders a file selection button.                                     | **`fieldName`**.                                                                                                                                                                                            |
| `MultiExpenses`              | Complex control for multiple expense entries.                        | **`fieldName`** should map to a collection; `Option` defines expense types.                                                                                                                                 |

---

### DataSourceOptions

Configuration for a `UIControl.dataSource` if the REST endpoint's JSON structure doesn't match the default.

| Attribute            | Data Type         | Description                                                                                                     |
| -------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `dataTextField`      | String            | The key in the fetched JSON to use for the option's **display text**.                                           |
| `dataValueField`     | String            | The key in the fetched JSON to use for the option's **stored value**.                                           |
| `pathToOptionsArray` | String (JSONPath) | The path to the array of options within the JSON response if it's not at the root level (e.g., `$.results[*]`). |
| `sort`               | Boolean           | Optional. If `true` (default), sorts options by display text.                                                   |
| `sortDir`            | String            | Optional sort direction: `'a'` (ascending, default) or `'d'` (descending).                                      |

---

### Option

Defines a single choice for a `MultipleChoices` or similar control.

| Attribute     | Data Type            | Description                                                             |
| ------------- | -------------------- | ----------------------------------------------------------------------- |
| `displayName` | String               | The text displayed to the user for this option.                         |
| `value`       | String, Number, etc. | The actual value stored in the data model when this option is selected. |

---

### BackgroundData

Retrieves data from a REST endpoint to populate the data model without rendering UI controls.

| Attribute           | Data Type         | Description                                                                                                    |
| ------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `url`               | URL (String)      | The URL of the JSON REST endpoint to fetch data from.                                                          |
| `fieldNameN`        | String            | The name of the attribute (e.g., `fieldName1`) where the fetched data will be stored.                          |
| `labelNameN`        | String            | The name of the key (e.g., `labelName1`) in the fetched JSON whose value should be extracted.                  |
| `pathToValueN`      | String (JSONPath) | Optional JSONPath expression used to extract the value from the fetched JSON.                                   |
| `arrayToCollection` | Boolean           | If `true`, maps a JSON array to a collection of new entities in the data model. Requires `collectionName`.     |
| `arrayToSet`        | Boolean           | If `true`, extracts values from a fetched array and stores them as a single, comma-separated string.           |
| `collectionName`    | String            | Required when `arrayToCollection` is `true`. Specifies the name of the collection attribute in the vocabulary. |
