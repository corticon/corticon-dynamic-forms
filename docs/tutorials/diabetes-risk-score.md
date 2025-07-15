---
title: "Tutorial 6: Diabetes Risk Score Calculator"
sidebar_position: 6
---

# Tutorial 6: Diabetes Risk Score Calculator

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

## Tutorial: Building the Diabetes Risk Score Calculator

In this tutorial, you will build a Type 2 Diabetes risk assessment form. This project demonstrates how to create a "scorecard," where a user's answers to a series of questions each contribute points towards a final score. The final score is then used to determine a risk level.

**What You Will Learn:**

* How to implement a scorecard using conditional rules.
* How to increment a score based on multiple user inputs.
* How to use a final calculated score to present a summary or recommendation to the user.
* How to structure a multi-stage questionnaire.

---

## Step 1: Building the Vocabulary

First, we'll define the data model. We need an entity to hold the user's answers and their calculated risk score.

1.  In Corticon.js Studio, open the **Form Template** project you imported earlier.
2.  In the Project Explorer, open the `Rule Vocabulary.ecore` file.
3.  You will see the standard `UI`, `Container`, `UIControl`, and `Option` entities. We need to add one more to store our registrant's information.
4. Expand the 'Data' folder in the rule vocabulary. Double click on the entity 'renameToYourPathToData', and enter **`T2DB`**.
5. Right click on the entity called 'Data' and click 'Add Association'.
   
      ![](../../static/img/pathToData1.png)
   
6.  For the source entity name, keep 'Data.Data' for the the target entity name, select 'Data.T2DB', and click the 'One' button beneath it. Then, change 'Navigability' to 'Data.Data->Data.T2DB'.

7.  Add the following attributes to the `T2DB` entity. These will store the user's answers and the results of the calculation.

| Attribute Name        | Data Type |
| :-------------------- | :-------- |
| `age`                 | Integer   |
| `bmi`                 | Decimal   |
| `familyHistory`       | Boolean   |
| `highBloodPressure`   | Boolean   |
| `physicallyActive`    | Boolean   |
| `gender`              | String    |
| `gestationalDiabetes` | Boolean   |
| `score`               | Integer   |
| `risk`                | String    |

8.  Save your vocabulary file.

---

## Step 2: Creating the Form Stages

We will build the questionnaire one stage at a time. Each stage will ask a question and, in some cases, add points to the `score` attribute immediately.

### Stage 0: Age

1.  Create a **New > Rulesheet** named `Stage0_Age.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 0`.
3.  Add the following rules in the Actions section:
    * **Set Data Path:** `UI.pathToData` = `'T2DB'`
    * **Create Container:** `UI.containers` = `Container.new` with a `title` of `'Diabetes Risk Assessment'`.
    * **Add Age Input:** Create a `UIControl.new` of `type` 'Number' with the `fieldName` `'age'` and the label 'What is your age?'.
    * **Set Next Stage:** `UI.nextStageNumber` = `1`

### Stage 1: BMI (Body Mass Index)

1.  Create a **New > Rulesheet** named `Stage1_BMI.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 1`.
3.  Add the following rules:
    * **Create Container:** Create a `Container.new` with the `title` of `'Diabetes Risk Assessment'`.
    * **Add BMI Input:** Create a `UIControl.new` of `type` 'Number' with the `fieldName` `'bmi'` and an appropriate label.
    * **Set Next Stage:** `UI.nextStageNumber` = `2`

### Stage 2: Calculate Score (Non-Visual)

This is a background stage where we add points to the score based on the first two answers.

1.  Create a **New > Rulesheet** named `Stage2_Calculate1.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 2`.
3.  Add the following rules:
    * **Enable Background Processing:** `UI.noUiToRenderContinue` = `true`.
    * **Age-Based Scoring:** Create several **Conditional Rules**:
        * **Condition:** `T2DB.age >= 40 AND T2DB.age <= 49`
        * **Action:** `T2DB.score` = `1`
        * **Condition:** `T2DB.age >= 50 AND T2DB.age <= 59`
        * **Action:** `T2DB.score` = `2`
        * (Continue for other age brackets as defined in the report)
    * **BMI-Based Scoring:** Create conditional rules to add points based on the BMI value.
        * **Condition:** `T2DB.bmi >= 25 AND T2DB.bmi <= 30`
        * **Action:** `T2DB.score += 1`
        * (Continue for other BMI ranges)
    * **Set Next Stage:** `UI.nextStageNumber` = `3`

### Subsequent Stages

Continue this pattern for the remaining questions, creating rulesheets for each stage.

* **Stage 3 (Gender):** Asks for gender. This is needed for the conditional gestational diabetes question later.
* **Stage 4 (Family History):** A Yes/No question (`YesNoBoolean`) that adds 1 point to `T2DB.score` if the condition `T2DB.familyHistory = true` is met.
* **Stage 5 (High Blood Pressure):** A Yes/No question that adds 1 point if true.
* **Stage 6 (Physical Activity):** A Yes/No question that adds 1 point if **false** (i.e., not active).
* **Stage 7 (Gestational Diabetes):** This is a conditional stage.
    * **Routing (Stage 7):** A non-visual routing rulesheet. If `T2DB.gender = 'Female'`, set `nextStageNumber = 8`. If `T2DB.gender = 'Male'`, set `nextStageNumber = 9` (skipping the question).
    * **Question (Stage 8):** The Yes/No question about gestational diabetes, which adds 1 point if true. Then sets `nextStageNumber = 9`.
* **Stage 9 (Final Calculation - Non-Visual):** This final background stage determines the risk level.
    * **Condition:** `T2DB.score >= 5`
    * **Action:** `T2DB.risk` = `'You are at increased risk of having pre-diabetes or type 2 diabetes.'`
    * **Condition:** `T2DB.score < 5`
    * **Action:** `T2DB.risk` = `'You are likely at low risk for pre-diabetes.'`
    * **Set Next Stage:** `UI.nextStageNumber` = `10`
* **Stage 10 (Display Results):** The final stage. Displays the calculated `T2DB.risk` string in a `ReadOnlyText` control and sets `UI.done = true`.

---

## Step 3: Assembling the Ruleflow

1.  Create a **New > Ruleflow** named `T2DB.erf`.
2.  Drag all your rulesheets onto the canvas.
3.  **Do not connect them.** The stage progression is controlled entirely by your rules.

---

## Step 4: Testing Your Logic

1.  **Test Case 1 (High Risk Scenario):**
    * **Input:** Create a `T2DB` object with data that should result in a high score (e.g., `age = 55`, `bmi = 31`, `familyHistory = true`, `highBloodPressure = true`, `physicallyActive = false`).
    * **Execution:** Run the test, providing the necessary `currentStageNumber` for each step.
    * **Expected Output:** After the final calculation stage, the `T2DB.score` should be correctly summed up, and the `T2DB.risk` attribute should contain the "increased risk" message.

---

## Conclusion

You have successfully built a clinical risk scorecard! This powerful pattern can be adapted for all sorts of use cases, from financial assessments to lead qualification and beyond. You have demonstrated mastery of conditional logic, incremental calculations, and dynamic user paths.