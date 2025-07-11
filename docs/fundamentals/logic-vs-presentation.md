---
title: Logic vs. Presentation
sidebar_position: 1
---

# The Separation of Concerns: Logic vs. Presentation

The core architectural principle of the Corticon.js Dynamic Forms solution is the **strict separation of business logic from the user interface presentation**. This means that *what* the form does is managed completely separately from *how* the form looks.

This decoupling is what allows for unprecedented agility. Business users can change complex form behavior without any front-end code changes.

## Two Roles, Two Worlds

Think of the solution as two distinct parts managed by two distinct roles:

|                       | 🏢 The Business Analyst (Rule Author)                                                               | 💻 The Web Developer                                         |
| --------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **What they control** | The form's behavior, logic, and flow.                                                              | The form's look and feel, styling, and branding.            |
| **Primary Tool**      | Corticon Studio (a graphical modeling tool)                                                        | Code editors (e.g., VS Code)                                |
| **Key Artifacts**     | Ruleflows (`.erf`) and Vocabularies (`.ecore`)                                                     | HTML, CSS, and JavaScript files (`.js`)                     |
| **Core Task**         | "What happens if a user selects 'Yes' for this question?"                                          | "What font and color should this 'Yes/No' question use?"    |
| **Result**            | A compiled **Decision Service** (`decisionServiceBundle.js`) that contains all the business logic. | A generic **HTML/JS application** that can render any form. |

This separation means your development teams are no longer a bottleneck for business logic changes. They build the generic presentation layer once, and the business team can then create and modify endless variations of forms.