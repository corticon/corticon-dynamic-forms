---
title: Component Overview
sidebar_position: 1.5
---

# Front-End Component Overview

The core logic for the dynamic forms solution is encapsulated within the `dynForm` folder. The JavaScript modules and stylesheets in this directory work together to initialize the form, manage its state, render user interface controls, and handle user interactions.

Below is an overview of each key component.

## Core JavaScript Modules

### `clientSetup.js`
This module acts as the entry point for the entire dynamic form application. It coordinates the interaction between the decision service and the rendering engine. Its key responsibilities include initializing data for different form samples, managing user interactions like starting or switching forms, and restoring the user interface state from local storage.

### `stepsController.js`
This component is the central manager for the form's flow. It interacts directly with the Corticon.js decision service to fetch rendering instructions for each step. It is responsible for handling navigation, validating user inputs, saving form data, and managing any background data processing.

### `uiControlsRenderers.js`
This module is responsible for rendering all user interface controls based on the data received from the decision service. It contains the logic to dynamically create various control types, such as text inputs, dropdowns, and checkboxes, and apply the necessary styling for a consistent look and feel.

### `history.js`
This module maintains a history of the form's state across multiple steps, which enables navigation back to previous states. It stores the decision service inputs for each step and provides methods to retrieve that data, allowing the form to be "rewound" or restarted from a specific point.

### `customEvents.js`
This utility defines and manages a set of custom events used throughout the form's lifecycle (e.g., `BEFORE_START`, `NEW_STEP`, `FORM_DONE`). It provides a decoupled mechanism for other components to communicate and react to specific stages of the form rendering process.

## Event-Driven Architecture

The front-end components are decoupled and communicate with each other through the custom event system defined in `customEvents.js`. Instead of calling each other directly, components broadcast events to signal that an action has occurred. For example, when a user changes a value in a form field, an event is fired, which triggers a listener that sends the updated data to the Decision Service for processing. This model makes the application highly extensible, as new functionality can be added without modifying the core components.

## Core Stylesheet

### `UIControlsStyles.css`
This file defines the styles for all dynamic form components. It ensures a consistent look and feel for containers, input controls, validation messages, and other user interface elements.