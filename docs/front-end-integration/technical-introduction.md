---
title: Technical Introduction
sidebar_position: 1
---

# Technical Introduction to the Front-End

Welcome to the Developer Guide. Before diving into specific components, it's important to understand the overall architecture of the client-side solution.

The dynamic forms application is a vanilla JavaScript solution designed for simplicity and portability. It is not dependent on any front-end frameworks like React, Angular, or Vue, which allows it to be easily embedded in any web application.

## Core Client-Side Modules

The application's logic is primarily contained within a few key JavaScript modules located in `static/corticon-forms-example/clientSideComponent/dynForm/`:

* **`clientSetup.js`**: The main entry point. It initializes the entire application when the host page loads.
* **`stepsController.js`**: The "brain" of the application. It manages the form's state, controls navigation between steps, and orchestrates communication with the Corticon decision service.
* **`uiControlsRenderers.js`**: The "hands" of the application. It takes the JSON data from the decision service and builds the corresponding HTML form controls.
* **`history.js`**: A simple module for managing the form's state history, allowing for "previous" step functionality.

## High-Level Data Flow

The interaction between the user interface and the rule engine follows a query model. The front-end rendering component is responsible for displaying controls and collecting user input, but it has no knowledge of the business logic. The Decision Service, which contains the rules, dictates what to display at each step but does not maintain the overall state of the form.

The typical user interaction follows this pattern:

1.  A user fills out a form step and clicks **"Next"**.
2.  The `stepsController` gathers the data from the current step's user interface controls.
3.  It sends this data as a JSON payload to the **Corticon Decision Service**.
4.  The Decision Service executes its rules and returns a new JSON payload containing instructions for the next step.
5.  The `stepsController` receives this payload and passes the user interface definitions to the `uiControlsRenderers`.
6.  The `uiControlsRenderers` clears the old user interface controls and renders the new ones defined in the payload. The user now sees the next step in the form.

This entire process is powered by the logic defined in the rules, completely decoupling the form's behavior from the front-end code.

### Decision Service Payload Contract

At runtime, the controller sends and receives a two-slot payload:

1. **`payload[0]` (UI/Control Data):** stage and rendering metadata.
2. **`payload[1]` (Form Data):** accumulated business data.

Typical UI/control fields in `payload[0]`:

- `currentStageNumber`
- `nextStageNumber`
- `pathToData`
- `labelPosition`
- `done`
- `report`
- `noUiToRenderContinue`
- `containers[]`

Each container includes:

- `id`
- `title`
- `validationMsg`
- `uiControls[]`

Each UI control includes at least:

- `type`
- `id`
- `fieldName` (for data binding)
- plus type-specific fields like `option`, `dataSource`, `min`, `max`, `minDT`, `maxDT`, `required`, `validationErrorMsg`

### How the Front End Uses the Response

1. `stepsController` reads `result.payload[0]` as the current UI step.
2. It updates internal `pathToData` when provided.
3. It handles non-visual stages (`noUiToRenderContinue=true`) without rendering controls.
4. It passes `containers` to `uiControlsRenderers.renderUI(...)`.
5. On user input save, it writes values by `fieldName` under:
   - `payload[1]` root, or
   - `payload[1][pathToData]` when `pathToData` is set.

This contract is what lets rules decide:

- which component to render (`type`)
- what values/options to show (`value`, `option`, `dataSource`)
- where data is stored (`fieldName`, `pathToData`)
- when the form advances (`nextStageNumber`, `done`)
