---
title: Studio for Beginners
sidebar_position: 1
---

# Corticon.js Studio for Beginners

Welcome, rule authors! If you are new to Corticon.js Studio, this page will introduce you to the core concepts you'll need to understand to build the logic for dynamic forms.

### The Challenge of Rule-Driven Forms

Creating a form that changes based on user input requires complex conditional logic. For example, "If the user is applying for a loan over $50,000 AND has been at their job for less than a year, then ask for a co-signer." As more of these conditions are added, managing them in standard programming code becomes incredibly difficult, error-prone, and slow to change.

Corticon.js Studio was designed to solve this problem by allowing you to define these complex business rules visually, without writing code.

### What is Corticon.js Studio?

**Corticon.js Studio** is a graphical, desktop tool for modeling, analyzing, and testing business rules. Instead of writing code, you will use a spreadsheet-like interface to define the "if-then" logic that powers your forms. The output of your work in Studio is a **Decision Service**—a self-contained bundle of logic that the front-end application can execute.

### Authoring Rules for UI Controls

When authoring rules, you will work with a "base" vocabulary that contains all the standard entities the front-end component is configured to understand (`UI`, `Container`, `UIControl`, etc.). It is critical that the names, associations, and data types of this base vocabulary remain unchanged. You will add your own use-case-specific entities to this vocabulary to capture the data for your form.

#### Creating a Container
Any stage that presents information to the user must have at least one `Container`. This is the panel that holds all the questions for that step. You create one using an action-only rule:

`UI.containers = Container.new[id = 'myContainerId', title = 'My Section Title']`

* The `.new` operator creates a new instance of the `Container` entity.
* You must define the `Container` as a child of the `UI` entity because the front-end expects it at the root of the payload.

#### Creating UI Controls
Every user interface control (a prompt, a checkbox, a dropdown, etc.) must be rendered inside a `Container`. Therefore, you create them as a "grandchild" of the `UI` entity:

`UI.containers.uiControls += UIControl.new[type='Number', label='What is your age?', id='ageCtrl', fieldName='age']`

* **`type`**: Must be one of the control types the front-end is configured to render (e.g., 'Number', 'Text', 'MultipleChoices').
* **`label`**: The text of the question presented to the user.
* **`id`**: A unique identifier for the control within the current stage.
* **`fieldName`**: The name of the attribute where the user's response will be stored. This should correspond to an attribute in your data model if you intend to use its value in later rules.

#### Multi-Rulesheet Stages for Complex Controls
Some controls, like a `MultipleChoices` dropdown with statically defined options, must be defined across two connected rulesheets within the same stage.

1.  **Rulesheet 1:** Creates the main `UIControl` with `type='MultipleChoices'`. You must assign an **alias** to this control in the Scope pane (e.g., `MyDropdown`).
2.  **Rulesheet 2:** Uses the alias to target that specific control and add `Option` entities to it. This rulesheet uses a filter on the alias (e.g., `MyDropdown.id = 'some_unique_id'`) to ensure the options are added to the correct control.

### The Basic Workflow

Your process for authoring form logic in Studio will generally follow these steps:

1.  **Define the Vocabulary:** Start by creating all the entities and attributes your form will need.
2.  **Create Rulesheets:** Build a separate rulesheet for each stage of your form, using a **precondition** on `UI.currentStageNumber` to control execution.
3.  **Write the Rules:** Within each rulesheet, define the `Container` and `UIControl` entities to render, and set `UI.nextStageNumber` to control where the user goes next.
4.  **Construct the Ruleflow:** For most stages, your ruleflow will contain just one rulesheet. Only connect multiple rulesheets if you need to perform sequential logic within a single stage, as described above.
5.  **Test:** Use the built-in Ruletester to simulate running your form logic stage by stage.
6.  **Compile:** Once testing is complete, compile your work into a Decision Service bundle.