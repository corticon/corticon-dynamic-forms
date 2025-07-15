---
title: Steps Controller Guide
sidebar_position: 3
---

# Guide to the Steps Controller

The `stepsController.js` is the central coordinator for the dynamic multi-step form. It acts as the "brain" of the form, managing the user's journey, orchestrating the flow of data, handling validation, and communicating with the Corticon.js decision service.

## Core Responsibilities

* **State Management:** Maintains the complete state of the form, including the current step number, the data entered in all previous steps, and the payload received from the Corticon.js decision service.
* **Navigation Control:** Manages all movement between steps ("Next", "Previous"), ensuring that all necessary processing (like validation) is completed before rendering the next view.
* **Validation:** Initiates client-side validation for the current step's fields before allowing the user to proceed.
* **Data Interaction:** Serves as the primary liaison between the UI and the Corticon decision service. It packages form data, sends it for processing, and uses the response to dynamically adjust the form.

## State Management in Detail

The Decision Service itself is stateless. Therefore, the `stepsController` is solely responsible for maintaining the state of the form as the user progresses. It accomplishes this by:

* **Tracking the Current Stage:** The controller maintains a variable for the `currentStageNumber`. When a user proceeds, the controller uses the `nextStageNumber` from the Decision Service's response to update this value for the subsequent request.
* **Aggregating User Data:** The controller maintains an object that stores all data collected from the user. When a rule author defines a user interface control, they also specify a `fieldName` where the response should be stored. The controller uses this `fieldName` to save the user's input into the main data object.
* **Handling the Data Path:** The Decision Service can specify a `pathToData` to instruct the controller to store responses within a specific nested object in the main data object. The controller maintains the current `pathToData` value across stages unless a new one is provided.
* **Finalizing Data:** When the Decision Service returns `done: true`, the controller knows the form is complete. It is then responsible for passing the final, aggregated data object to another function or process for submission.

## Key Functions

| Function         | Description                                                                                                                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `init()`         | Initializes the controller, sets the form to its starting state, and makes the initial call to the decision service to render the first set of controls.                                                    |
| `nextStep()`     | Manages the transition to the next step. It first triggers validation for the current step. If validation succeeds, it sends the current form data to the decision service and renders the subsequent step. |
| `previousStep()` | Manages the transition to the previous step. It retrieves the form state for the prior step from its history and re-renders it without calling the decision service.                                        |
| `getFormData()`  | A utility function that gathers and returns all the data entered by the user across all steps, formatted as a single JSON object ready for submission.                                                      |

## System Interactions

The `stepsController` works closely with other components:

* **`uiControlsRenderers.js`:** The controller **commands** the renderer. It receives a payload from the decision service and passes the UI definitions to the renderer to create the HTML.
* **`decisionServiceBundle.js`:** This is the controller's source of truth. It sends the current form data and receives instructions on what to display next, including new fields, updated dropdowns, or changes in field visibility.