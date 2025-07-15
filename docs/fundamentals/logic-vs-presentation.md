---
title: Logic vs. Presentation
sidebar_position: 1
---

# The Separation of Concerns: Logic vs. Presentation

The core architectural principle of the Corticon.js Dynamic Forms solution is the **strict separation of business logic from the user interface presentation**. This means that *what* the form does is managed completely separately from *how* the form looks.

This decoupling is what allows for unprecedented agility. The solution is architected around a classic model-view pattern that can be thought of as "the Brains" vs. "the Beauty."

* **The "Brains" (Model):** The Corticon.js Decision Service is the core of the form's intelligence. It defines the data model, enforces validation rules, controls form behavior (e.g., hiding or showing fields), and executes complex business logic.
* **The "Beauty" (View):** The front-end code is responsible for rendering the user interface. It displays the appropriate user interface controls, handles user events, communicates with the Decision Service, and applies all styling and branding.

This architecture removes the development team as a bottleneck for business logic changes. The user interface can be built once, while the business team can create and modify an endless variety of forms independently.

### Interactive vs. Transactional Decisions

Another key distinction is how the Decision Service is used. A traditional decision service makes a **transactional decision**: it receives a complete set of data and returns a final answer.

In contrast, a Dynamic Form uses **interactive UI generation**. The payload sent to the Decision Service contains the user's data *so far*. The response does not contain a final answer; instead, it provides instructions for the front-end on what questions to ask *next*. This iterative exchange is what makes the form dynamic.