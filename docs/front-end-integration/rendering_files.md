---
sidebar_position: 3
---



## dynForm Folder Documentation

This folder contains the core components and utilities required for rendering and managing dynamic forms in the Corticon.js framework. ---

These files encapsulate the logic and styling required to create, render, and manage dynamic forms. Each file plays a specific role in ensuring the forms are interactive, maintainable, and adaptable to various use cases.

Below is a description of each file in this folder:

---

### Files Overview

#### 1. **clientSetup.js**
- **Purpose**: 
  - Acts as the entry point for initializing and managing the dynamic form lifecycle.
  - Handles sample selection, language switching, and UI state restoration.
  - Coordinates the interaction between the decision service engine and the dynamic form renderer.
- **Key Responsibilities**:
  - Initialize input data for different samples.
  - Manage user interactions like starting, navigating, and switching between samples.
  - Save and restore UI state using local storage.

---

#### 2. **customEvents.js**
- **Purpose**: 
  - Defines and manages custom events used throughout the dynamic form lifecycle.
  - Provides a mechanism to raise and handle events for various stages of the form process.
- **Key Responsibilities**:
  - Define custom events such as `BEFORE_START`, `NEW_STEP`, and `FORM_DONE`.
  - Allow other components to add event handlers and raise events dynamically.

---

#### 3. **history.js**
- **Purpose**: 
  - Maintains a history of the form's state across multiple steps.
  - Enables navigation between steps by storing and retrieving previous states.
- **Key Responsibilities**:
  - Store decision service inputs for each step.
  - Provide methods to retrieve the previous step's data.
  - Support restarting the form from a saved state.

---

#### 4. **stepsController.js**
- **Purpose**: 
  - Manages the overall flow of the dynamic form, including rendering steps and processing user inputs.
  - Interacts with the decision service engine to fetch and render the next set of UI elements.
- **Key Responsibilities**:
  - Start the dynamic form process and handle navigation between steps.
  - Validate user inputs and save them to the form data.
  - Handle form completion and post-processing (e.g., sending data to a REST API).
  - Manage background data processing and dynamic updates.

---

#### 5. **uiControlsRenderers.js**
- **Purpose**: 
  - Handles the rendering of UI controls based on the decision service's output.
  - Supports various control types such as text inputs, dropdowns, checkboxes, and more.
- **Key Responsibilities**:
  - Render containers and their associated UI controls dynamically.
  - Apply styling and behavior based on the rendering mode (e.g., Kendo UI or plain HTML).
  - Provide utility functions for creating and managing input elements.

---

#### 6. **UIControlsStyles.css**
- **Purpose**: 
  - Defines the styles for the dynamic form's UI components.
  - Ensures a consistent look and feel across different rendering modes.
- **Key Responsibilities**:
  - Style containers, input controls, validation messages, and other UI elements.
  - Provide overrides for third-party libraries like Kendo UI.


## Trace Folder

# trace.js Overview

The `trace.js` file is responsible for managing and displaying trace information during the execution of dynamic forms. It provides a mechanism to track and visualize the inputs, outputs, and intermediate states of the decision service engine, enabling developers and analysts to debug and understand the form's behavior.

---

## Key Features

1. **Trace Management**:
   - Captures and stores inputs, outputs, and form data for each stage of the form's lifecycle.
   - Maintains a history of all stages for easy navigation and debugging.

2. **Event Handling**:
   - Listens to custom events raised during the form's execution, such as `BEFORE_START`, `NEW_FORM_DATA_SAVED`, and `BEFORE_DS_EXECUTION`.
   - Updates the trace panel dynamically based on these events.

3. **Trace Panel UI**:
   - Displays the following in a structured format:
     - Inputs to the decision service.
     - Outputs from the decision service.
     - Accrued form data at each stage.
   - Provides navigation through the trace history using clickable stage links.

4. **History Navigation**:
   - Allows users to switch between saved stages and view the corresponding inputs, outputs, and form data.

---

## Key Functions

- **setupTracing**: Initializes the trace system by registering event handlers for various custom events.
- **_clearTraceData**: Clears all trace data and resets the trace panel.
- **_traceDecisionServiceInputs**: Captures and displays the inputs sent to the decision service.
- **_traceDecisionServiceResults**: Captures and displays the outputs received from the decision service.
- **_traceFormData**: Captures and displays the form data saved at each stage.
- **_switchToSavedStage**: Handles navigation to a previously saved stage in the trace history.

---

## Usage

The `trace.js` file is automatically integrated into the dynamic forms system. It listens for events raised during the form's lifecycle and updates the trace panel accordingly. Developers can use the trace panel to debug and analyze the decision-making process of the form.

---

## Integration

- **Custom Events**: The file relies on custom events defined in `customEvents.js` to capture and update trace information.
- **UI Elements**: The trace panel is rendered in the HTML and interacts with the DOM to display trace data dynamically.

---

By providing a detailed trace of the form's execution, `trace.js` simplifies debugging and ensures transparency in the decision-making process.
