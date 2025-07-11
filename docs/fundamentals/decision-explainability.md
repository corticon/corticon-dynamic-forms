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
* **Response Payload:** The exact JSON data that the decision service sent back. This contains the instructions for what to render next, including any new UI controls, updated data, or error messages.
* **Execution Time:** The time it took for the decision service to execute the rules and return a response, measured in milliseconds.

## Why is this important?

By examining the request and response payloads, a developer or rule author can instantly answer key questions:

* "Was the correct data sent to the decision service?"
* "Did the rules execute as expected?"
* "What data did the rules produce?"
* "Are there any unexpected error messages?"

The Tracer is an indispensable tool for rapidly diagnosing issues and verifying that your form logic is behaving exactly as intended.