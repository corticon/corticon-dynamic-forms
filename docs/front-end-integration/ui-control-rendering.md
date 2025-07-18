---
title: UI Control Rendering
sidebar_position: 4
---

# UI Control Rendering

The `uiControlsRenderers.js` file is responsible for translating the JSON payload received from the Corticon decision service into the HTML form elements that the user sees and interacts with. This is the primary file you will edit to change the appearance of form controls or to add new custom ones.

## The Rendering Process

1.  The `stepsController.js` receives a payload from the decision service.
2.  This payload contains an array of UI control definitions for the current step.
3.  The `stepsController` passes this array to the `render()` function in `uiControlsRenderers.js`.
4.  The `render()` function iterates through each control definition and, based on its `type` (e.g., "Text", "DropDown", "CheckBox"), calls a specific private render function (e.g., `_renderText`, `_renderDropDown`) to generate the appropriate HTML.

## Categories of UI Controls

When implementing rendering logic, it is helpful to think of controls in the following categories:

* **Simple Controls:** These map to a single, primitive HTML element. A `Text` control becomes an `<input type="text">`, and a `MultipleChoices` control can be rendered as a `<select>` dropdown. Each simple control corresponds to a single piece of data.
* **Multiple Instance Controls:** These are used when the number of inputs for a specific field is not known in advance (e.g., asking for the names of all children). The user interface should allow for dynamically adding more input fields, and the resulting data is stored as an array.
* **Complex Controls:** These controls render a group of related inputs for a single conceptual item. For example, an expense entry might require a dropdown for the expense type and a text input for the amount. Complex controls often need to be multi-instance as well, allowing the user to add multiple expense entries. The data for each entry is typically stored as an object within a larger array.
* **Data-Sourced Controls:** Any control that presents a list of choices (like a dropdown) can be populated from an external REST service. The Decision Service specifies the URL in the `dataSource` attribute of the control definition. Your rendering logic must be able to fetch data from this URL and populate the control's options.

## How to Customize an Existing Control

To modify an existing control, find its corresponding `_render` function within `uiControlsRenderers.js`.

For example, to add a specific CSS class to all "Text" inputs:

1.  Open `static/corticon-forms-example/clientSideComponent/dynForm/uiControlsRenderers.js`.
2.  Locate the `_renderText(uiControl)` function.
3.  You can modify the HTML structure or add attributes as needed. For instance, adding a class:

    ```javascript
    // Inside _renderText(uiControl)
    const text = document.createElement('input');
    text.type = 'text';
    text.id = uiControl.id;
    text.name = uiControl.id;
    text.value = uiControl.value || '';
    text.className = 'custom-text-input'; // Add your custom class here
    ```

## How to Add a New Custom Control

Adding a new type of control is straightforward:

1.  **Define in Corticon:** First, ensure your rule authors have a new UI `type` they can use in the Corticon vocabulary (e.g., "StarRating").
2.  **Add a new `case`:** In `uiControlsRenderers.js`, find the `switch (uiControl.type)` statement within the `render()` function and add a new case for your control.

    ```javascript
    // Inside the render() function's switch statement
    case 'StarRating':
        this.#_renderStarRating(uiControl, parent);
        break;
    ```
3.  **Create the render function:** Create the new private render function (e.g., `#_renderStarRating`). This function should create the necessary HTML elements for your component and append them to the `parent` container.

    ```javascript
    // Add this new private function to the class
    #_renderStarRating(uiControl, parent) {
        // Create your custom HTML structure here
        const container = document.createElement('div');
        container.className = 'star-rating-container';
        container.innerHTML = `
            <label for="${uiControl.id}">${uiControl.label}</label>
            <div>
                </div>
        `;
        parent.appendChild(container);
    }
    ```