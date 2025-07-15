---
title: Controlling Form Flow
sidebar_position: 3
---

# Controlling Form Flow with Rules

In the Dynamic Forms solution, the Decision Service—not the front-end—is responsible for controlling the stage-by-stage flow of the form. A "stage" is a unique identifier representing the user's current position in the form's state machine. This control is achieved by using the current stage number as a filter for your rules and explicitly setting the next stage number on the root **`UI`** entity.

## The Stage-Based Rulesheet Pattern

A best practice is to organize your ruleflow so that each stage of your form corresponds to its own rulesheet. The key is to use the **`UI.currentStageNumber`** as a precondition to ensure only the correct rulesheet executes.

### In the Request: `UI.currentStageNumber` (Precondition)

When the front-end component makes a request to the Decision Service, it specifies which stage to execute by setting the `UI.currentStageNumber` attribute. You should use this in the **Preconditions** section of your rulesheet to ensure it only runs when the user is on the corresponding stage.

**Example Rulesheet Precondition for Stage 1:**
![Corticon Studio screenshot](<../../static/img/stage 1.png>)

`UI.currentStageNumber == 1`

### In the Response: `UI.nextStageNumber` (Action)

Within your rulesheet's actions, you must set a value for **`UI.nextStageNumber`**. This attribute tells the front-end which stage to render next. When the user proceeds, the front-end will use this value as the `currentStageNumber` for the next request. If you do not set this attribute, the form will not advance.

The Decision Service response may also contain `currentStageNumber` and an optional `currentStageDescription`. These are for troubleshooting and debugging purposes; the front-end does not use them for navigation.

## Example: A Two-Stage Form

Imagine a form with two stages.

**Rulesheet 1: "Handle Stage 1"**

* **Precondition:** `UI.currentStageNumber == 1`
* **Purpose:** Validates the data from stage 1 and decides where to go next.
* **Action:** `UI.nextStageNumber` = 2

**Rulesheet 2: "Handle Stage 2"**

* **Precondition:** `UI.currentStageNumber == 2`
* **Purpose:** Processes the data from stage 2.
* **Action:** `UI.nextStageNumber` = 3 // Or perhaps a "confirmation" stage

## Conditional Navigation

To create dynamic navigation, you simply add conditions to your rules that set `nextStageNumber` differently based on user data.

**Example:** Directing the user to a different stage based on their "experienceLevel".

**Rulesheet: "Handle Stage 1"**
* **Precondition:** `UI.currentStageNumber == 1`

* **Rule 1: Novice User**
    * **Condition:** `User.experienceLevel` == 'Novice'
    * **Action:** `UI.nextStageNumber` = 3 // Go to the "Simple" stage

* **Rule 2: Expert User**
    * **Condition:** `User.experienceLevel` == 'Expert'
    * **Action:** `UI.nextStageNumber` = 4 // Go to the "Advanced" stage

This pattern gives the rule author complete and precise control over the user's journey.