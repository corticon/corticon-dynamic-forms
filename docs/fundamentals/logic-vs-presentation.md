---
title: Logic vs. Presentation
sidebar_position: 1
---

# The Separation of Concerns: Logic vs. Presentation

The core architectural principle of the Corticon.js Dynamic Forms solution is the **strict separation of business logic from the user interface presentation**. This means that *what* the form does is managed completely separately from *how* the form looks.

This decoupling is what allows for unprecedented agility. The solution is architected around a classic model-view pattern:

* **The Model:** A **Decision Service**, generated from the Corticon.js rule engine, contains all the business logic. It dictates the flow of questions, defines the user interface controls to render, and specifies the validation rules.
* **The View:** A generic **UI Rendering Component**, built with standard web technologies, is responsible for the presentation. This component is written once and can render any form based on the instructions it receives from the Decision Service.

This separation of concerns allows for two distinct roles to work in parallel.

| Role                  | 🏢 The Business Analyst (Rule Author)                                                               | 💻 The Web Developer                                         |
| --------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **What they control** | The form's behavior, logic, and flow.                                                              | The form's look and feel, styling, and branding.            |
| **Primary Tool**      | Corticon Studio (a graphical modeling tool)                                                        | Code editors (e.g., VS Code)                                |
| **Key Artifacts**     | Ruleflows (`.erf`) and Vocabularies (`.ecore`)                                                     | HTML, CSS, and JavaScript files                             |
| **Core Task**         | "What happens if a user selects 'Yes' for this question?"                                          | "What font and color should this 'Yes/No' question use?"    |
| **Result**            | A compiled **Decision Service** (`decisionServiceBundle.js`) that contains all the business logic. | A generic **HTML/JS application** that can render any form. |

This architecture removes the development team as a bottleneck for business logic changes. The user interface can be built once, while the business team can create and modify an endless variety of forms independently.