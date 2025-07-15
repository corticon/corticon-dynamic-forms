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

### The JSON Payload

The Decision Service returns a JSON payload containing an array with two primary objects.

1.  **UI Data (index 0):** This object contains all the information the front-end needs to render the current stage of the form. It includes the definitions for containers, user interface controls, and navigation instructions like `nextStageNumber`.
2.  **Project Data (index 1):** This object contains the business-specific data for the form. This includes any initialization data, all user responses collected so far, and any data produced by the Decision Service during its calculations.

The front-end component is responsible for maintaining the state of the project data and passing it back to the Decision Service with each request. The Decision Service itself remains stateless.