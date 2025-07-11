---
title: "Tutorial 6: Diabetes Risk Score Calculator"
sidebar_position: 6
---

# Tutorial 6: Diabetes Risk Score Calculator

In this tutorial, you will build a Type 2 Diabetes risk assessment form. This project demonstrates how to create a "scorecard," where a user's answers to a series of questions each contribute points towards a final score. The final score is then used to determine a risk level.

**What You Will Learn:**

* How to implement a scorecard using conditional rules.
* How to increment a score based on multiple user inputs.
* How to use a final calculated score to present a summary or recommendation to the user.
* How to structure a multi-stage questionnaire.

---

## Step 1: Building the Vocabulary

First, we'll define the data model. We need an entity to hold the user's answers and their calculated risk score.

1.  In Corticon.js Studio, create a **New > Vocabulary** and name it `DiabetesRiskVocabulary.ecore`.
2.  Create a **New Entity** named **`T2DB`** (for Type 2 Diabetes).
3.  Add the following attributes to the `T2DB` entity. These will store the user's answers and the results of the calculation.

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

4.  Save your vocabulary file.

---

## Step 2: Creating the Form Stages

We will build the questionnaire one stage at a time. Each stage will ask a question and, in some cases, add points to the `score` attribute immediately.

### Stage 0: Age

1.  Create a **New > Rulesheet** named `Stage0_Age.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 0`.
3.  Add the following rules in the Actions section:
    * **Set Data Path:** `UI.pathToData` = `'T2DB'`
    * **Create Container:** `UI.containers` = `Container.new` with a `title` of `'Diabetes Risk Assessment'`.
    * **Add Age Input:** Create a `UIControl.new` of `type` 'Number' with the `fieldName` `'age'` and the label 'What is your age?'.
    * **Set Next Stage:** `UI.nextStageNumber` = `1`

### Stage 1: BMI (Body Mass Index)

1.  Create a **New > Rulesheet** named `Stage1_BMI.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 1`.
3.  Add the following rules:
    * **Create Container:** Create a `Container.new` with the `title` of `'Diabetes Risk Assessment'`.
    * **Add BMI Input:** Create a `UIControl.new` of `type` 'Number' with the `fieldName` `'bmi'` and an appropriate label.
    * **Set Next Stage:** `UI.nextStageNumber` = `2`

### Stage 2: Calculate Score (Non-Visual)

This is a background stage where we add points to the score based on the first two answers.

1.  Create a **New > Rulesheet** named `Stage2_Calculate1.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 2`.
3.  Add the following rules:
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

1.  Create a **New > Ruleflow** named `T2DB.erf`.
2.  Drag all your rulesheets onto the canvas.
3.  **Do not connect them.** The stage progression is controlled entirely by your rules.

---

## Step 4: Testing Your Logic

1.  **Test Case 1 (High Risk Scenario):**
    * **Input:** Create a `T2DB` object with data that should result in a high score (e.g., `age = 55`, `bmi = 31`, `familyHistory = true`, `highBloodPressure = true`, `physicallyActive = false`).
    * **Execution:** Run the test, providing the necessary `currentStageNumber` for each step.
    * **Expected Output:** After the final calculation stage, the `T2DB.score` should be correctly summed up, and the `T2DB.risk` attribute should contain the "increased risk" message.

---

## Conclusion

You have successfully built a clinical risk scorecard! This powerful pattern can be adapted for all sorts of use cases, from financial assessments to lead qualification and beyond. You have demonstrated mastery of conditional logic, incremental calculations, and dynamic user paths.