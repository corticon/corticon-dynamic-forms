---
title: "Tutorial 4: Health Marketplace Application"
sidebar_position: 4
---

# Health Marketplace Application

This tutorial guides you through building a Health Marketplace insurance application. It's our most advanced project yet and will teach you how to handle applications for a household with multiple members, a very common requirement in real-world forms.

**What You Will Learn:**

* How to model nested data, like a `household` that contains a collection of `member` entities.
* How to use rules to dynamically add UI controls based on user input (e.g., adding a set of fields for each household member).
* How to perform back-end calculations on complex data.
* How to display summarized results to the user.

---

## Step 1: Building the Vocabulary

This form has the most detailed data model so far, involving multiple related entities.

1.  In Corticon.js Studio, create a **New > Vocabulary** and name it `MarketplaceVocabulary.ecore`.
2.  Create a **New Entity** named **`household`**.
3.  Add the following attributes to the `household` entity:

| Attribute Name      | Data Type |
| :------------------ | :-------- |
| `countyfips`        | String    |
| `desiredMetalLevel` | String    |
| `peopleInHousehold` | Integer   |
| `totalIncome`       | Decimal   |
| `totalExpenses`     | Decimal   |
| `eligibility`       | String    |

4.  Next, create another **New Entity** named **`member`**.
5.  Add the following attributes to the `member` entity:

| Attribute Name | Data Type |
| :------------- | :-------- |
| `fullName`     | String    |
| `dob`          | Date      |
| `gender`       | String    |

6.  Now, we need to create the relationship between them. **Right-click the `household` entity, select New > Association, and target the `member` entity**. Name the association `members`. This tells Corticon that a `household` can contain multiple `members`.
7.  Save your vocabulary file.

---

## Step 2: Creating the Form Stages

We'll build the form stage by stage, starting with basic household information.

### Stage 0: Household Information

1.  Create a **New > Rulesheet** named `Stage0_Household.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 0`.
3.  In the Actions section, add the following rules:
    * **Set Data Path:** `UI.pathToData` = `'household'`.
    * **Create Container:** `UI.containers` = `Container.new` with a `title` of `'Household Information'`.
    * **Add Text Input:** Create a `UIControl.new` of `type` 'Text' for `countyfips` (County FIPS Code).
    * **Add Dropdown:** Create a `UIControl.new` of `type` 'MultipleChoices' for `desiredMetalLevel` and add options for 'Bronze', 'Silver', 'Gold'.
    * **Set Next Stage:** `UI.nextStageNumber` = `1`.

### Stage 1: Number of People

1.  Create a **New > Rulesheet** named `Stage1_PeopleCount.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 1`.
3.  Add the following rules:
    * **Create Container:** Create a `Container.new` with the `title` 'Household Members'.
    * **Add Number Input:** Create a `UIControl.new` of `type` 'Number' with the `fieldName` `peopleInHousehold` and the label 'How many people are in your household?'.
    * **Set Next Stage:** `UI.nextStageNumber` = `2`.

### Stage 2: Member Details

This is a key stage. The rules will dynamically create a set of fields for each person in the household.

1.  Create a **New > Rulesheet** named `Stage2_MemberDetails.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 2`.
3.  This rulesheet uses a loop (implicitly). Add rules to create UI controls for each member:
    * **Create Container:** Create a `Container.new` titled 'Member Details'.
    * **Create Member Fields:** This is where the magic happens. You'll create a set of `UIControl`s (`Text` for `fullName`, `DateTime` for `dob`, `MultipleChoices` for `gender`). The key is that these will be created for **each** `member` in the `household.members` collection. The front-end renderer understands this and will repeat this group of fields for the number of people specified in the previous step.
    * **Set Next Stage:** `UI.nextStageNumber` = `3`.

### Subsequent Stages

Continue this pattern for the remaining stages based on the ruleflow report:

* **Stage 3 (Income):** Create a rulesheet that adds `MultiText` or `Number` fields to capture different sources of income.
* **Stage 4 (Expenses):** Create another rulesheet to capture monthly expenses.
* **Stage 5 (Calculate - Non-Visual):** This is a background processing stage (`UI.noUiToRenderContinue` = `true`). Write conditional rules to sum the incomes and expenses, and then determine the `household.eligibility` status (e.g., 'Eligible', 'Not Eligible') based on the results.
* **Stage 6 (Results):** The final stage. Create a rulesheet that displays the calculated `eligibility` status in a `ReadOnlyText` control and sets `UI.done` = `true`.

---

## Step 3: Assembling the Ruleflow

1.  Create a **New > Ruleflow** named `HHSMarketplace.erf`.
2.  Drag all your rulesheets onto the canvas.
3.  As with the previous tutorials, **do not connect them**. The `currentStageNumber` precondition on each sheet will manage the execution flow.

---

## Step 4: Testing Your Logic

Testing is crucial for a form with calculations.

1.  **Test Case 1 (Calculation):**
    * **Input:** A `UI` object with `currentStageNumber = 5`. A `household` object populated with `totalIncome` and `totalExpenses` data.
    * **Expected Output:** The `UI` object should have `nextStageNumber = 6`. The `household.eligibility` attribute should be correctly calculated and populated based on your rules.

---

## Conclusion

Fantastic work! You have now built a highly realistic and complex dynamic form. You've learned how to handle nested data for multiple household members and how to perform background calculations to present a final result to the user. These skills are essential for building powerful, data-driven applications.