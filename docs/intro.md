---
sidebar_position: 1
---

# Dynamic Forms with Corticon.js

Creating dynamic forms can be a complex and time-consuming process, even for experienced developers. However, with Corticon.js, dynamic forms can be created efficiently, leveraging contributions from both developers and non-developers. The framework-agnostic design pattern provided by Corticon.js ensures maximum reusability of form logic, reducing development time and effort.

 ## What Are Dynamic Forms?

While most frameworks can handle simple forms, dynamic forms introduce a higher level of complexity. Dynamic forms adapt to user input in real time, presenting only the relevant fields and questions based on prior responses. This is particularly useful in scenarios with hundreds of fields or complex rules, such as insurance claims or loan applications.

Dynamic forms present several challenges:
- **Rule Management**: Systematizing and managing a large number of rules in a single system while ensuring robust testing.
- **Rule Definition**: Allowing business users to define rules in a non-technical, descriptive manner without requiring programming expertise.
- **Frontend Integration**: Visualizing and rendering these rules as a form without requiring developers to have domain knowledge of the business processes.
- **Maintenance**: Implementing and testing changes quickly without introducing regressions.

Corticon.js addresses these challenges by providing a robust, rules-driven framework for creating and maintaining dynamic forms.

## Dynamic Forms with Corticon.js

For Corticon, a dynamic form is one where the entire behavior—the sequence of questions, data validation rules, calculations, and final outcomes—is governed by an external, independently managed and validated ruleset. 

Rules are modeled, tested, validated, and managed in a dedicated Business Rules Management System as a component completely decoupled from the application code and the form's user interface. This architectural separation promotes several key enterprise benefits: reusability of rules across different platforms (e.g., the same ruleset can power a web form, a mobile app, and a back-end batch process), superior scalability for complex rule sets, and a clear separation of concerns between business stakeholders and IT departments. 

## Integrated vs. Externalized Business Logic

The vast majority of form builders utilize an **integrated logic model**. In this paradigm, conditional logic is defined directly within the form-building interface. The rules are intrinsically tied to a specific form, created in the same environment as the visual layout, and are often limited to IF/THEN constructs for showing, hiding, or calculating fields. This approach prioritizes speed of development and ease of use for creating individual forms with simple to moderately complex logic.  

While user-friendly, integrated logic systems have an inherent complexity limit. As the number of rules, conditions, and interdependencies grows, managing them within a typical form builder's UI becomes unwieldy, error-prone, and difficult to audit. Evidence of these limitations can be seen in major platforms; for example, limitations in defining logic which combines rules with AND/OR statements, or performance degradation when handling a large number of rules and dependencies. 

Corticon, by contrast, is engineered specifically for this level of complexity. It provides sophisticated tools to analyze and validate rules at design time, proactively identifying and helping to resolve conflicts, ambiguities, and logical gaps before they can become production issues. This suggests a strategic tipping point where the long-term cost of maintaining complex, brittle logic within an integrated form builder outweighs the initial convenience, making an externalized logic engine the more prudent choice for managing complexity over an application's lifecycle.