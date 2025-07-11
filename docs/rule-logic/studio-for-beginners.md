---
title: Studio for Beginners
sidebar_position: 1
---

# Corticon.js Studio for Beginners

Welcome, rule authors! If you are new to Corticon.js Studio, this page will introduce you to the core concepts you'll need to understand to build the logic for dynamic forms.

### What is Corticon.js Studio?

**Corticon.js Studio** is a graphical, desktop tool for modeling, analyzing, and testing business rules. Instead of writing code, you will use a spreadsheet-like interface to define the "if-then" logic that powers your forms. The output of your work in Studio is a **Decision Service**—a self-contained bundle of logic that the front-end application can execute.

### Key Concepts for Dynamic Forms

For dynamic form building, you will primarily work with three key components in Studio:

1.  **The Vocabulary:** This is the **data model** for your form. Think of it as the blueprint for all the data you will work with. It's where you define the `UI` entity, the `UIControl` entity, and any custom data entities your form needs (like `LoanApplication` or `NewUser`). Every attribute you want to use in your rules must be defined here first.

2.  **Rulesheets:** This is where you write the actual **logic**. Each rulesheet is like a smart spreadsheet where you define conditions and actions. For dynamic forms, a common pattern is to have one rulesheet for each "stage" of the form. For example, a rulesheet for stage 1 will define what the user sees on the first screen and what happens when they click "Next".

3.  **Ruleflow:** This is the **orchestrator** for a single stage. For dynamic forms, you typically do not connect rulesheets to control the sequence of stages. Instead, stage progression is managed by rules that set the `UI.nextStageNumber` attribute.

    So, what are ruleflow connectors for? You use them to organize complex logic **within a single stage**. For example, if you need to create two different dropdown menus on the same screen, you might use two rulesheets connected in a sequence:
    * **Rulesheet 1:** Creates the two `UIControl` entities for the dropdowns.
    * **Rulesheet 2 (connected after):** Identifies each specific dropdown using an alias (e.g., `dropdown1` and `dropdown2`) and adds the `Option` entities to populate each one individually.

### The Basic Workflow

Your process for authoring form logic in Studio will generally follow these steps:

1.  **Define the Vocabulary:** Start by creating all the entities and attributes your form will need (e.g., `UI`, `UIControl`, `LoanApplication`).
2.  **Create Rulesheets:** Build a separate rulesheet for each stage of your form. Use a **precondition** like `UI.currentStageNumber = 1` to ensure the rulesheet only executes for the correct stage.
3.  **Write the Rules:** Within each rulesheet, define the UI controls to render and set `UI.nextStageNumber` to control where the user goes next.
4.  **Construct the Ruleflow:** For most stages, your ruleflow will contain just one rulesheet. Only connect multiple rulesheets if you need to perform sequential logic within a single stage, as described above.
5.  **Test:** Use the built-in Ruletester to simulate running your form logic stage by stage.
6.  **Compile:** Once testing is complete, compile your work into a Decision Service bundle for the front-end development team to use.