---
title: Front-End Integration
---

# Front-End Integration

Integrating the dynamic forms into a web page involves a few key client-side files working together. The core idea is to have a simple HTML host page that loads the necessary JavaScript modules to initialize and run the form.

## Key Files

The client-side logic is primarily orchestrated by three files:

1.  **`index.html` (The Host Page):** This is the main HTML file that contains the containers for the dynamic form. It's responsible for loading all the necessary CSS and JavaScript files.

2.  **`clientSetup.js` (The Initializer):** This script is the entry point for the form. It waits for the page to load, then initializes the `stepsController` and sets up the necessary event listeners to kick off the dynamic form process.

3.  **`stepsController.js` (The Controller):** As the "brain" of the form, this module is initialized by `clientSetup.js`. It manages the form's state, communicates with the Corticon decision service, and orchestrates the rendering of UI controls.

## The Initialization Process

Here is the step-by-step flow of how the form gets initialized:

1.  **Page Load:** The user's browser loads `index.html`. The HTML contains simple `<div>` elements that act as placeholders for the form's header, content, and navigation buttons.

2.  **Script Loading:** The `<script>` tags in `index.html` load the required libraries and, most importantly, `clientSetup.js`.

3.  **Client Setup Execution:** Once the DOM is fully loaded, `clientSetup.js` executes. Its main job is to create an instance of the `StepsController`.

4.  **First Decision Service Call:** Upon initialization, the `StepsController` immediately makes its first call to the Corticon decision service (with an empty payload) to fetch the UI definition for the very first step of the form.

5.  **Initial Render:** The `StepsController` receives the JSON payload from the decision service and passes it to the `uiControlsRenderers.js` module, which generates the HTML for the first set of form fields and displays them to the user.

From this point on, the `StepsController` takes over, managing user interactions and subsequent calls to the decision service as the user navigates through the form.