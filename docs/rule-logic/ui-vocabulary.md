---
title: The UI Vocabulary
sidebar_position: 2
---

# The UI Vocabulary: The Rule-to-UI Contract

An effective dynamic form depends on a clear "contract" between the rules that define the logic and the front-end code that renders the user interface. This document describes that contract.

As a rule author, you must use the entities and attributes defined here to construct the form. The front-end application is built to understand this specific vocabulary and will render the UI accordingly.


The core entity for defining a user interface is **`UI`**.

## UI

The UI entity is the root element for defining the overall state and flow of the dynamic form.

**Attributes:**

| Attribute            | Data Type | Description                                                                                                                                                                                                                                                                                                                   |
| -------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pathToData`         | String    | Defines the primary data object where user-entered information will be stored. This attribute acts as the crucial bridge between the UI definition and the form's specific data model. Setting UI.pathToData specifies which vocabulary entity (e.g., LoanApplication) will accrue the data collected via UIControl elements. |
| `noUItoRender`       | Boolean   | Set to true for stages where no UI needs to be rendered, but background processing (like calculations or data augmentation) should occur. Defaults to false.                                                                                                                                                                  |
| `done`               | Boolean   | Set to true by the rules to signal the end of the dynamic form flow. The front-end uses this flag to trigger final data submission or transition to the next part of the application.                                                                                                                                         |
| `nextStageNumber`    | Integer   | (Action) Set this in your rulesheet actions to indicate which stage the form should proceed to next. If this is the final stage, leave this null and set UI.done = true.                                                                                                                                                      |
| `currentStageNumber` | Integer   | (Precondition/Filter) The front-end sends this value in the input payload. Use it in a rulesheet's filter or precondition to ensure rules only apply to the current stage.                                                                                                                                                    |
| `language`           | String    | Defines the language context. Rules can set this (e.g., UI.language = 'italian') to change the language dynamically during the form flow.                                                                                                                                                                                     |
---

### Container

Represents a logical grouping or panel within a form stage, containing UI controls. A Container is referenced in the rules via the UI.containers collection.

**Description**: For all steps presenting UI to the user, the Decision Service specifies a list of containers. Each container can have attributes like a title and holds one or more UIControl elements.

**Attributes:**

| Attribute       | Data Type | Description                                                                                                   |
| --------------- | --------- | ------------------------------------------------------------------------------------------------------------- |
| `id`            | String    | A required, unique identifier for the container within the current stage.                                     |
| `title`         | String    | Text rendered as the header (e.g., using an <h3> tag) for the container.                                      |
| `validationMsg` | String    | Optional text displayed as a validation message associated with the entire container.                         |
| `description`   | String    | An optional descriptive string, not rendered by default but useful for rule troubleshooting or documentation. |
---

### UIControl


**Common `UIControl` Attributes:**

| Attribute         | Data Type               | Description                                                                                                                                                                                                          |
| ----------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`            | String                  | The specific type of UI Control to render. This choice determines which other attributes are required or optional. The various types are detailed in the following sections.                                         |
| `fieldName`       | String                  | Crucial for data binding. Links the control's value to an attribute within the entity defined by UI.pathToData. For example, if UI.pathToData is 'Person' and fieldName is 'dob', the value is stored as Person.dob. |
| `id`              | String                  | A required, unique identifier for the control within its container.                                                                                                                                                  |
| `label`           | String                  | The text displayed as the label for the UI control.                                                                                                                                                                  |
| `value`           | String, Number, Boolean | Provides a default value for input controls. For read-only controls, this holds the text to display. The required data type depends on the control type.                                                             |
| `labelPosition`   | String                  | Optionally specifies where to place the label relative to the control (e.g., 'Above', 'Side').                                                                                                                       |
| `dataSource`      | URL (String)            | A URL to a REST endpoint used to dynamically populate choice-based controls. The front-end expects a JSON array of objects, each with value and displayName keys, though this can be configured.                     |
| `emphasize`       | Boolean                 | If true, instructs the front-end to render the label with emphasis (e.g., bold).                                                                                                                                     |
| `min` / `max`     | Number                  | Specifies the minimum/maximum numeric value for a Number control or the character length for a TextArea.                                                                                                             |
| `minDT` / `maxDT` | Date (String)           | Specifies the minimum/maximum selectable date for DateTime controls (e.g., 'YYYY-MM-DD').                                                                                                                            |
| `sortOptions`     | String                  | Optionally instructs the front-end to sort the list of options ('A to Z' or 'Z to A') for choice-based controls.                                                                                                     |
| `tooltip`         | String                  | Optional text to display as a tooltip when the user hovers over the control.                                                                                                                                         |
| (Other)           | Varies                  | Certain control types have unique attributes, such as rows and cols for TextArea or showTime for DateTime.                                                                                                           | ----- |


#### UIControl Types

| Type                         | Description                                                                                 | Key Attributes & Rule Examples                                                                                                                                                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ReadOnlyText`               | Renders non-editable HTML text.                                                             | value: The text to display. javascript<br>// Display static text<br>UIControl.new [type='ReadOnlyText', value = '...']<br>                                                                                                                     |
| `TextArea`                   | Renders a multi-line text input field.                                                      | fieldName, rows, cols, min, max (character length). javascript<br>// A comment box<br>UIControl.new [type='TextArea', fieldName='comments', rows=3]<br>                                                                                        |
| `Text`                       | Renders a single-line text input field.                                                     | fieldName: Links to a vocabulary attribute. value: Provides a default value. javascript<br>// Street address input<br>UIControl.new [type='Text', fieldName='streetAddress']<br>                                                               |
| `Number`                     | Renders an input field specifically for numeric entry.                                      | fieldName, min, max (numeric value). javascript<br>// Age input with validation<br>UIControl.new [type='Number', fieldName='age', min=18]<br>                                                                                                  |
| `DateTime`                   | Renders a date or date-time picker.                                                         | fieldName, showTime (Boolean), minDT, maxDT. javascript<br>// Date only<br>UIControl.new [type='DateTime', fieldName='dob', showTime=false]<br>                                                                                                |
| `SingleChoice`               | Renders a single choice input, typically as a checkbox.                                     | fieldName: Links to a Boolean vocabulary attribute. javascript<br>// Opt-in checkbox<br>UIControl.new [type='SingleChoice', fieldName='agreedToTerms']<br>                                                                                     |
| `MultipleChoices`            | Renders a multi-choice input (like a dropdown) where the user can select one option.        | fieldName. Options are defined by adding Option entities to the control or by providing a URL in the dataSource attribute. javascript<br>// Static options<br>myControl.option += Option.new [value='M', displayName='Male']<br>               |
| `MultipleChoicesMultiSelect` | Renders a multi-choice input where the user can select multiple options.                    | fieldName: Must link to a collection attribute in the vocabulary. Options are defined by adding Option entities. <br> javascript<br>// Select multiple symptoms<br>UIControl.new [type='MultipleChoicesMultiSelect', fieldName='symptoms']<br> |
| `MultiText`                  | Allows the user to enter a variable number of single-line text strings via an "Add" button. | fieldName: Must link to a collection attribute in the vocabulary. javascript<br>// Enter multiple drug names<br>UIControl.new [type='MultiText', fieldName='drugToCover']<br>                                                                  |
| `YesNo`                      | Renders a binary choice ('Yes'/'No'), storing the literal string 'yes' or 'no'.             | fieldName: Links to a String vocabulary attribute. javascript<br>// Simple Yes/No question<br>UIControl.new [type='YesNo', fieldName='smokerResponse']<br>                                                                                     |
| `YesNoBoolean`               | Renders a binary choice ('Yes'/'No'), storing a Boolean value (true/false).                 | fieldName: Links to a Boolean vocabulary attribute. javascript<br>// Boolean question<br>UIControl.new [type='YesNoBoolean', fieldName='onHTN_meds']<br>                                                                                       |
| `FileUpload`                 | Renders a button for local file selection. The upload is handled by the front-end.          | fieldName: Links to a vocabulary attribute (often String to hold file info). javascript<br>// Upload a document<br>UIControl.new [type='FileUpload', fieldName='justificationDoc']<br>                                                         |
| `MultiExpenses`              | A complex control for entering multiple expense items, each with its own fields.            | fieldName: Links to a collection of expense objects in the vocabulary. Option entities define choices for dropdowns within the control (e.g., expense category). javascript<br>UIControl.new [type='MultiExpenses', fieldName='expenses']<br>  |

### DataSourceOptions

Provides configuration when using UIControl.dataSource to fetch choices from a REST endpoint, especially if the endpoint's JSON structure doesn't match the default ({value: ..., displayName: ...}). This is referenced in rules as: UI.containers.uiControls.dataSourceOptions.


**Attributes:**

| Attribute            | Data Type         | Description                                                                                                                                            |
| -------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dataTextField`      | String            | The name of the key in the fetched JSON objects to use for the option's display text. Use this if the key is not named displayName.                    |
| `dataValueField`     | String            | The name of the key in the fetched JSON objects to use for the option's stored value. Use this if the key is not named value.                          |
| `pathToOptionsArray` | String (JSONPath) | The path to the array of options within the JSON response if it's not at the root level. For example, $.results[*] finds all items in a results array. | ----- |

### Option

Used to define individual choices directly within the rules for `MultipleChoices`, `MultipleChoicesMultiSelect`, or `MultiExpenses` controls.

Referenced in the rules as: `UI.containers.uiControls.option`

**Attributes:**

 | Attribute     | Data Type            | Description                                                                  |
 | ------------- | -------------------- | ---------------------------------------------------------------------------- |
 | `displayName` | String               | The text displayed to the user for this option in the list or dropdown.      |
 | `value`       | String, Number, etc. | The actual value stored in the data model when the user selects this option. |
-----

### BackgroundData

Used to retrieve data from an external REST JSON endpoint and directly populate the form's data model (`pathToData`) *without* presenting choices to the user. Useful for pre-filling data or enriching the model based on initial input.

Referenced in the rules as: `UI.backgroundData`

**Attributes:**

| Attribute           | Data Type         | Description                                                                                                                                                           |
| ------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`               | URL (String)      | The URL of the JSON REST endpoint to fetch data from.                                                                                                                 |
| `fieldNameN`        | String            | The name of the attribute (e.g., fieldName1) where the fetched data for the corresponding labelNameN will be stored.                                                  |
| `labelNameN`        | String            | The name of the key (e.g., labelName1) in the fetched JSON whose value should be extracted and stored.                                                                |
| `pathToDataN`       | String (JSONPath) | Optional JSONPath expression to locate labelNameN within the fetched JSON if it's not at the root level.                                                              |
| `arrayToCollection` | Boolean           | If true, maps an array from the JSON response to a collection of new entities in the data model. Requires collectionName and fieldNameN/labelNameN pairs for mapping. |
| `arrayToSet`        | Boolean           | If true, extracts a value from each object in a fetched array and stores them as a single, comma-separated string in the attribute specified by fieldName1.           |
| `collectionName`    | String            | Required when arrayToCollection is true. Specifies the name of the collection attribute in the vocabulary that will hold the new entities.                            |
<!-- end list -->

