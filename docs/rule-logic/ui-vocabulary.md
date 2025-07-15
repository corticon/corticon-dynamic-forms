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

| Attribute            | Data Type | Description                                                                                                                                                                             |
| -------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pathToData`         | String    | Defines the primary data object where user-entered information will be stored. This attribute acts as the crucial bridge between the UI definition and the form's specific data model.  |
| `noUItoRender`       | Boolean   | Set to `true` for stages where no UI needs to be rendered, but background processing (like calculations or data augmentation) should occur. Defaults to `false`.                        |
| `done`               | Boolean   | Set to `true` by the rules to signal the end of the dynamic form flow. The front-end uses this flag to trigger final data submission or transition to the next part of the application. |
| `nextStageNumber`    | Integer   | **(Action)** Set this in your rulesheet actions to indicate which stage the form should proceed to next. If this is the final stage, leave this null and set `UI.done = true`.          |
| `currentStageNumber` | Integer   | **(Precondition/Filter)** The front-end sends this value in the input payload. Use it in a rulesheet's filter or precondition to ensure rules only apply to the current stage.          |
| `language`           | String    | Defines the language context. Rules can set this (e.g., `UI.language = 'italian'`) to change the language dynamically during the form flow.                                             |

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

| Attribute                  | Data Type               | Description                                                                                                                                              |
| -------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                     | String                  | The specific type of UI Control to render. This choice determines which other attributes are required or optional. The various types are detailed below. |
| `fieldName`                | String                  | **Crucial for data binding.** Links the control's value to an attribute within the entity defined by `UI.pathToData`.                                    |
| `id`                       | String                  | A required, unique identifier for the control within its container.                                                                                      |
| `label`                    | String                  | The text displayed as the label for the UI control.                                                                                                      |
| `value`                    | String, Number, Boolean | Provides a default value for input controls. For read-only controls, this holds the text to display.                                                     |
| `labelPosition`            | String                  | Optionally specifies where to place the label relative to the control (e.g., `'Above'`, `'Side'`).                                                       |
| `dataSource`               | URL (String)            | A URL to a REST endpoint used to dynamically populate choice-based controls.                                                                             |
| `emphasize`                | Boolean                 | If `true`, instructs the front-end to render the `label` with emphasis (e.g., bold).                                                                     |
| `min` / `max`              | Number                  | Specifies the minimum/maximum numeric value for a `Number` control or character length for a `TextArea`.                                                 |
| `minDT` / `maxDT`          | Date (String)           | Specifies the minimum/maximum selectable date for `DateTime` controls (e.g., `'YYYY-MM-DD'`).                                                            |
| `sortOptions`              | String                  | Optionally instructs the front-end to sort options (`'A to Z'` or `'Z to A'`) for choice-based controls.                                                 |
| `tooltip`                  | String                  | Optional text to display as a tooltip when the user hovers over the control.                                                                             |
| `triggeredByControlWithId` | String                  | The `id` of another control that must be interacted with before this control becomes visible.                                                            |
| `triggeredWhenSelection`   | String                  | The specific value that must be selected in the triggering control for this control to become visible.                                                   |

#### UIControl Types

| Type                         | Description                                                          | Key Attributes & Rule Examples                                                                                                                                                                       |
| ---------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReadOnlyText`               | Renders non-editable HTML text.                                      | **`value`**: The text to display. <br/> ```javascript <br/> // Display static text <br/> UIControl.new [type='ReadOnlyText', value = '...'] <br/> ```                                                |
| `TextArea`                   | Renders a multi-line text input field.                               | **`fieldName`**, **`rows`**, **`cols`**, **`min`**, **`max`**. <br/> ```javascript <br/> // A comment box <br/> UIControl.new [type='TextArea', fieldName='comments', rows=3] <br/> ```              |
| `Text`                       | Renders a single-line text input field.                              | **`fieldName`**: Links to a vocabulary attribute. <br/> ```javascript <br/> // Street address input <br/> UIControl.new [type='Text', fieldName='streetAddress'] <br/> ```                           |
| `Number`                     | Renders an input field for numeric entry.                            | **`fieldName`**, **`min`**, **`max`**. <br/> ```javascript <br/> // Age input with validation <br/> UIControl.new [type='Number', fieldName='age', min=18] <br/> ```                                 |
| `DateTime`                   | Renders a date or date-time picker.                                  | **`fieldName`**, **`showTime`** (Boolean). <br/> ```javascript <br/> // Date only <br/> UIControl.new [type='DateTime', fieldName='dob', showTime=false] <br/> ```                                   |
| `SingleChoice`               | Renders a single choice input, typically a checkbox.                 | **`fieldName`**: Links to a Boolean vocabulary attribute. <br/> ```javascript <br/> // Opt-in checkbox <br/> UIControl.new [type='SingleChoice', fieldName='agreedToTerms'] <br/> ```                |
| `MultipleChoices`            | Renders a multi-choice input (like a dropdown) for single selection. | **`fieldName`**, **`dataSource`**. Options defined via `Option` entities. <br/> ```javascript <br/> // Static options <br/> myControl.option += Option.new [value='M', displayName='Male'] <br/> ``` |
| `MultipleChoicesMultiSelect` | Renders a multi-choice input for multiple selections.                | **`fieldName`**: Must link to a *collection*. Options defined via `Option` entities. <br/> ```javascript <br/> UIControl.new [type='...', fieldName='symptoms'] <br/> ```                            |
| `MultiText`                  | Allows for a dynamic number of single-line text inputs.              | **`fieldName`**: Must link to a *collection*. <br/> ```javascript <br/> UIControl.new [type='MultiText', fieldName='drugToCover'] <br/> ```                                                          |
| `YesNo`                      | Renders a binary choice, storing the string `'yes'` or `'no'`.       | **`fieldName`**: Links to a String attribute. <br/> ```javascript <br/> UIControl.new [type='YesNo', fieldName='smokerResponse'] <br/> ```                                                           |
| `YesNoBoolean`               | Renders a binary choice, storing a Boolean (`true`/`false`).         | **`fieldName`**: Links to a Boolean attribute. <br/> ```javascript <br/> UIControl.new [type='YesNoBoolean', fieldName='onHTN_meds'] <br/> ```                                                       |
| `FileUpload`                 | Renders a file selection button.                                     | **`fieldName`**. <br/> ```javascript <br/> UIControl.new [type='FileUpload', fieldName='justificationDoc'] <br/> ```                                                                                 |
| `MultiExpenses`              | A complex control for entering multiple expense items.               | **`fieldName`**: Links to a *collection*. `Option` entities define choices within the control. <br/> ```javascript <br/> UIControl.new [type='MultiExpenses', fieldName='expenses'] <br/> ```        |

---

### DataSourceOptions

Configuration for a `UIControl.dataSource` if the REST endpoint's JSON structure doesn't match the default.

| Attribute            | Data Type         | Description                                                                                                     |
| -------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `dataTextField`      | String            | The key in the fetched JSON to use for the option's **display text**.                                           |
| `dataValueField`     | String            | The key in the fetched JSON to use for the option's **stored value**.                                           |
| `pathToOptionsArray` | String (JSONPath) | The path to the array of options within the JSON response if it's not at the root level (e.g., `$.results[*]`). |

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
| `pathToDataN`       | String (JSONPath) | Optional JSONPath expression to locate `labelNameN` within the fetched JSON.                                   |
| `arrayToCollection` | Boolean           | If `true`, maps a JSON array to a collection of new entities in the data model. Requires `collectionName`.     |
| `arrayToSet`        | Boolean           | If `true`, extracts values from a fetched array and stores them as a single, comma-separated string.           |
| `collectionName`    | String            | Required when `arrayToCollection` is `true`. Specifies the name of the collection attribute in the vocabulary. |