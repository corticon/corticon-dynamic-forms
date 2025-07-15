---
title: "Tutorial 4: Health Marketplace Application"
sidebar_position: 4
---

# Tutorial 4: Health Marketplace Application

## Prerequisites: Getting the Project Files

Before you begin, this tutorial requires you to download two key assets from our GitHub repository:

1.  **The "Form Template" Rule Project**: The foundational project for creating dynamic forms.
2.  **The Front-End Renderer**: The HTML and JavaScript files needed to display the forms.

Follow these two steps to get everything you need.

### Step 1: Import the Rule Projects into Studio

We use a PowerShell script to automatically find and install all the sample rule projects, including the essential **"Form Template,"** into your Corticon.js Studio.

1.  **Navigate to the `sample-projects` Directory**:
    * Go to: [https://github.com/corticon/dynamic-forms/tree/main/sample-projects](https://github.com/corticon/dynamic-forms/tree/main/sample-projects)

2.  **Download the Import Script**:
    * In the file list, find and click on `Import-CorticonSamples.ps1`.
    * On the script's page, click the **Download raw file** button (the icon with a downward arrow).
    * Save the script to a convenient location, like your Desktop.

3.  **Run the Script**:
    * Open a PowerShell window, navigate to where you saved the file, and run it:
        ```powershell
        .\Import-CorticonSamples.ps1
        ```
    * This script will temporarily clone the `dynamic-forms` repository in the background, find all the samples, and install them into your Corticon.js Studio.

4.  **Restart Corticon.js Studio**:
    * After the script finishes, restart the studio. Go to **Help -> Samples** to find the **"Form Template"** project.

---

### Step 2: Get the Front-End Files

The front-end rendering application is in the `front-end-files` directory. We will use the `downgit` tool to download just this specific folder.

1.  **Download the Directory**:
    * Click this direct link to download the `front-end-files` directory as a ZIP file:
    * **[Download `front-end-files` using downgit](https://downgit.github.io/#/home?url=https://github.com/corticon/dynamic-forms/tree/main/front-end-files)**
    * This will download a file named `front-end-files.zip`.

2.  **Unzip the Files**:
    * Create a main project folder on your computer for this work (e.g., `C:\corticon-tutorial`).
    * Unzip the `front-end-files.zip` directly into that folder. Your folder structure should now look like this:
        ```
        C:\corticon-tutorial\
        └── front-end-files\
            ├── clientSideComponent\
            ├── decisionServices\
            ├── trace\
            └── index.html
            └── ... (and other files)
        ```

3.  **Important Note for Later**:
    * As you proceed through the tutorials, you will generate new Decision Services from Corticon.js Studio. **You must save these into the `decisionServices` subfolder.** For example: `C:\corticon-tutorial\front-end-files\decisionServices\`. This ensures the front-end application can find and load them.

---

## Tutorial: Building the Health Marketplace Application

This tutorial guides you through building a Health Marketplace insurance application. It's our most advanced project yet and will teach you how to handle applications for a household with multiple members, a very common requirement in real-world forms.

**What You Will Learn:**

* How to model nested data, like a `household` that contains a collection of `member` entities.
* How to use rules to dynamically add UI controls based on user input (e.g., adding a set of fields for each household member).
* How to perform back-end calculations on complex data.
* How to display summarized results to the user.

---

## Step 1: Building the Vocabulary

This form has the most detailed data model so far, involving multiple related entities.

1.  In Corticon.js Studio, open the **Form Template** project you imported earlier.
2.  In the Project Explorer, open the `Rule Vocabulary.ecore` file.
3.  Create a **New Entity** named **`household`**.
4.  Add the following attributes to the `household` entity:

| Attribute Name      | Data Type |
| :------------------ | :-------- |
| `countyfips`        | String    |
| `desiredMetalLevel` | String    |
| `peopleInHousehold` | Integer   |
| `totalIncome`       | Decimal   |
| `totalExpenses`     | Decimal   |
| `eligibility`       | String    |

5.  Next, create another **New Entity** named **`member`**.
6.  Add the following attributes to the `member` entity:

| Attribute Name | Data Type |
| :------------- | :-------- |
| `fullName`     | String    |
| `dob`          | Date      |
| `gender`       | String    |

7.  Now, we need to create the relationship between them. **Right-click the `household` entity, select New > Association, and target the `member` entity**. Name the association `members`. This tells Corticon that a `household` can contain multiple `members`.
8.  Save your vocabulary file.

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