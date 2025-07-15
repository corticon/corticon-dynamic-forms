---
title: Decision Explainability
sidebar_position: 2
---

# Decision Explainability with the Tracer

Understanding *why* a decision was made is critical for both debugging and compliance. The Dynamic Forms solution includes a built-in **Tracer** utility that provides full visibility into the communication between the front-end and the Corticon decision service.

The Tracer appears in the bottom-right corner of the screen and can be expanded to show detailed information for each step of the form.

## Using the Tracer

The Tracer is enabled by default in the example runner. You can show or hide the panel by clicking on the "Trace" button. When expanded, it provides a log of every interaction with the decision service.

Each entry in the log shows:

* **Request Payload:** The exact JSON data that was sent from the browser to the decision service. This includes all the data the user has entered up to that point.
* **Response Payload:** The exact JSON data that the decision service sent back. This contains the instructions for what to render next, including any new user interface controls, updated data, or error messages.
* **Execution Time:** The time it took for the decision service to execute the rules and return a response, measured in milliseconds.

## Why is this important?

By examining the request and response payloads, a developer or rule author can instantly answer key questions:

* "Was the correct data sent to the decision service?"
* "Did the rules execute as expected?"
* "What data did the rules produce?"
* "Are there any unexpected error messages?"

The Tracer is an indispensable tool for rapidly diagnosing issues and verifying that your form logic is behaving exactly as intended.

---
## Developer's Perspective: How it Works

The tracer functionality is managed by the `trace.js` module. This module is responsible for capturing, managing, and displaying all trace information generated during the form's lifecycle.

### Key Responsibilities

The `trace.js` module performs several key functions:

1.  **Trace Management:** It captures and stores a complete history of the inputs sent to the decision service, the outputs received from it, and the state of the form data at each stage.
2.  **Event Handling:** The module listens for a series of custom events (e.g., `BEFORE_DS_EXECUTION`, `NEW_FORM_DATA_SAVED`) raised during the form's execution. When these events are detected, the module updates the trace panel display accordingly.
3.  **UI Rendering:** It dynamically renders the trace panel user interface, organizing the inputs, outputs, and accrued form data in a structured and readable format.
4.  **History Navigation:** It provides the interactive stage links in the trace panel, allowing a developer to switch between saved stages and view the corresponding data for that point in time.

By relying on a standard set of custom events, the tracer integrates seamlessly into the application and provides a transparent view of the decision-making process.