---
title: "Tutorial 2: Homeowner's Insurance Application"
sidebar_position: 2
---

# Homeowner's Insurance Application

In this tutorial, you will build a practical, multi-stage application form for a homeowner's insurance policy. This project is a perfect example of how dynamic forms can handle complex data collection and even perform calculations.

**What You Will Learn:**

* How to model a more complex vocabulary for an insurance application.
* How to build a linear, multi-page form.
* How to use rules to perform a premium calculation based on user input.
* How to display the results of a calculation on a final summary screen.

---

## Step 1: Building the Vocabulary

First, we will define the data model for our insurance application.

1.  In Corticon.js Studio, create a **New > Vocabulary** and name it `HomeownersVocabulary.ecore`.
2.  In the vocabulary editor, right-click and select **Add New Entity**. Name it **`Homeowners`**.
3.  Now, add the following attributes to your new `Homeowners` entity. This will store all the information about the applicant, their property, and the final quote.

| Attribute Name   | Data Type |
| ---------------- | --------- |
| `fullName`       | String    |
| `street`         | String    |
| `city`           | String    |
| `state`          | String    |
| `zipCode`        | String    |
| `propertyType`   | String    |
| `yearBuilt`      | Integer   |
| `construction`   | String    |
| `roofType`       | String    |
| `securitySystem` | Boolean   |
| `swimmingPool`   | Boolean   |
| `fireSuppress`   | Boolean   |
| `coverageAmount` | Decimal   |
| `deductible`     | Decimal   |
| `premium`        | Decimal   |

4.  Save your vocabulary file.

---

## Step 2: Creating the Form Stages

We will now create a series of rulesheets to guide the user through the application process.

### Stage 0: Applicant Information

This stage collects basic information about the person applying.

1.  Create a **New > Rulesheet** named `Stage0_Applicant.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 0`.
3.  In the Actions section, add the following rules:
    * **Set Data Path:** `UI.pathToData` = `'Homeowners'`
    * **Create Container:** `UI.containers` = `Container.new` with a `title` of `'Applicant Information'`.
    * **Add Text Inputs:** Create four `UIControl.new` of `type` 'Text' for the applicant's full name and address. Link them to the vocabulary using the `fieldName` attribute for each (`fullName`, `street`, `city`, etc.).
    * **Set Next Stage:** `UI.nextStageNumber` = `1`

### Stage 1: Property Information

This stage gathers details about the home to be insured.

1.  Create a **New > Rulesheet** named `Stage1_Property.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 1`.
3.  Add the following rules:
    * **Create Container:** `UI.containers` = `Container.new` with a `title` of `'Property Information'`.
    * **Add Dropdowns:** Create `UIControl.new` of `type` 'MultipleChoices' for `propertyType`, `construction`, and `roofType`. For each one, add `Option.new` entities to provide choices (e.g., for `propertyType`, add options for 'Single Family Home', 'Townhouse', 'Condo').
    * **Add Number Input:** Create a `UIControl.new` of `type` 'Number' for `yearBuilt`.
    * **Add Checkboxes:** Create three `UIControl.new` of `type` 'SingleChoice' for `securitySystem`, `swimmingPool`, and `fireSuppress`.
    * **Set Next Stage:** `UI.nextStageNumber` = `2`

### Stage 2: Coverage Information

Here, the user selects their desired coverage levels.

1.  Create a **New > Rulesheet** named `Stage2_Coverage.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 2`.
3.  Add the following rules:
    * **Create Container:** `UI.containers` = `Container.new` with a `title` of `'Coverage Details'`.
    * **Add Number Inputs:** Create two `UIControl.new` of `type` 'Number'. One for `coverageAmount` and one for `deductible`.
    * **Set Next Stage:** `UI.nextStageNumber` = `3`

### Stage 3: Calculate Quote (Non-Visual)

This special stage performs the premium calculation in the background without showing anything to the user.

1.  Create a **New > Rulesheet** named `Stage3_Calculate.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 3`.
3.  Add the following rules:
    * **Enable Background Processing:** `UI.noUiToRenderContinue` = `true`.
    * **Base Premium Rule:** In the Actions, set `Homeowners.premium` = `Homeowners.coverageAmount * 0.005`. This sets a base premium.
    * **Add Surcharge Rules:** Create several **Conditional Rules**. For example:
        * **Condition:** `Homeowners.swimmingPool = true`
        * **Action:** `Homeowners.premium += 150`
        * **Condition:** `Homeowners.roofType = 'Wood Shake'`
        * **Action:** `Homeowners.premium += 200`
    * **Add Discount Rules:** Create conditional rules for discounts:
        * **Condition:** `Homeowners.securitySystem = true`
        * **Action:** `Homeowners.premium -= 75`
    * **Set Next Stage:** `UI.nextStageNumber` = `4`

### Stage 4: Display Quote

This final stage displays the calculated premium to the user.

1.  Create a **New > Rulesheet** named `Stage4_Quote.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 4`.
3.  Add the following rules:
    * **Create Container:** `UI.containers` = `Container.new` with a `title` of `'Your Quote'`.
    * **Display Premium:** Create a `UIControl.new` of `type` 'ReadOnlyText'. Set its `value` to the string `'Your calculated annual premium is: $' + Homeowners.premium`.
    * **End the Form:** `UI.done` = `true`.

---

## Step 3: Assembling the Ruleflow

Just like our first tutorial, we will let the rules handle the flow.

1.  Create a **New > Ruleflow** named `Homeowners.erf`.
2.  Drag all five of your rulesheets (`Stage0` through `Stage4`) onto the canvas.
3.  **Do not connect them.** The `currentStageNumber` precondition on each sheet will control the execution order.

---

## Step 4: Testing Your Logic

Use the Ruletester to verify your calculations.

1.  **Test Case 1 (Premium Calculation):**
    * **Input:** Create a `UI` object with `currentStageNumber = 3`. Create a `Homeowners` object with values like `coverageAmount = 300000`, `swimmingPool = true`, and `securitySystem = true`.
    * **Expected Output:** The `UI` object should have `nextStageNumber = 4`. The `Homeowners.premium` should be calculated correctly (e.g., (300000 * 0.005) + 150 - 75 = 1575).

---

## Conclusion

Great job! You have now built a complete insurance application form that not only collects data across multiple stages but also uses conditional logic to perform calculations and display a result. You are well on your way to mastering dynamic form creation.