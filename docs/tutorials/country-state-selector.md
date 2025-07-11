---
title: "Tutorial 5: Cascading Country-State-City Selector"
sidebar_position: 5
---

# Cascading Country-State-City Selector

In this final hands-on tutorial, you will build a three-level cascading dropdown selector for Country, State, and City. This is a common requirement in applications that collect address information and is the definitive example of how to chain filtered, data-driven controls.

**What You Will Learn:**

* How to create a multi-level cascading selection form.
* How to use a user's selection in one stage to dynamically filter the `dataSource` for the next stage.
* How to write more advanced JSONPath expressions to pinpoint the exact data you need from a complex JSON response.

---

## Step 1: Building the Vocabulary

The data model for this form is simple, as we only need to store the final user selections.

1.  In Corticon.js Studio, create a **New > Vocabulary** and name it `LocationVocabulary.ecore`.
2.  Create a **New Entity** named `Location`.
3.  Add the following attributes to the `Location` entity:

| Attribute Name | Data Type |
| :------------- | :-------- |
| `country`      | String    |
| `state`        | String    |
| `city`         | String    |

4.  Save your vocabulary file.

---

## Step 2: Creating the Form Stages

The form will guide the user through three selection stages. All data will come from a single, public API endpoint.

### Stage 0: Select Country

1.  Create a **New > Rulesheet** named `Stage0_Country.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 0`.
3.  In the Actions section, add the following rules:
    * **Set Data Path:** `UI.pathToData` = `'Location'`
    * **Create Container:** `UI.containers` = `Container.new` with a `title` of `'Select Your Location'`.
    * **Create Country Dropdown:** Add a `UIControl.new`.
        * `type` = `'MultipleChoices'`
        * `fieldName` = `'country'`
        * `label` = `'Country'`
        * `dataSource` = `'https://api.npoint.io/43503523177704555543'`
    * **Configure DataSource Mapping:** Add a `DataSourceOptions.new` to the dropdown control.
        * `dataValueField` = `'country'`
        * `dataTextField` = `'country'`
    * **Set Next Stage:** `UI.nextStageNumber` = `1`

### Stage 1: Select State

The options in this dropdown will be filtered based on the country chosen in Stage 0.

1.  Create a **New > Rulesheet** named `Stage1_State.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 1`.
3.  Add the following rules:
    * **Create Container:** `UI.containers` = `Container.new` with a `title` of `'Select Your Location'`.
    * **Create State Dropdown:** Add a `UIControl.new`.
        * `type` = `'MultipleChoices'`
        * `fieldName` = `'state'`
        * `label` = `'State'`
        * `dataSource` = `'https://api.npoint.io/43503523177704555543'`
    * **Configure State Filtering:** This is the key step. Add a `DataSourceOptions.new` to the dropdown.
        * `dataValueField` = `'name'`
        * `dataTextField` = `'name'`
        * `pathToOptionsArray` = `$.countries[?(@.country == '` + Location.country + `')].states[*]`
            * This JSONPath finds the country object that matches the user's selection (`Location.country`) and then drills down to get the list of its `states`.
    * **Set Next Stage:** `UI.nextStageNumber` = `2`

### Stage 2: Select City

This final dropdown is filtered by both the previously selected country and state.

1.  Create a **New > Rulesheet** named `Stage2_City.ers`.
2.  Set the **Precondition** to `UI.currentStageNumber = 2`.
3.  Add the following rules:
    * **Create Container:** `UI.containers` = `Container.new` with a `title` of `'Select Your Location'`.
    * **Create City Dropdown:** Add a `UIControl.new`.
        * `type` = `'MultipleChoices'`
        * `fieldName` = `'city'`
        * `label` = `'City'`
        * `dataSource` = `'https://api.npoint.io/43503523177704555543'`
    * **Configure City Filtering:** Add a `DataSourceOptions.new` to the dropdown.
        * `dataValueField` = `'name'`
        * `dataTextField` = `'name'`
        * `pathToOptionsArray` = `$.countries[?(@.country == '` + Location.country + `')].states[?(@.name == '` + Location.state + `')].cities[*]`
            * This path is even more specific, finding the correct country, then the correct state, and finally retrieving the list of its `cities`.
    * **End the Form:** `UI.done` = `true`.

---

## Step 3: Assembling the Ruleflow

1.  Create a **New > Ruleflow** named `FilterByCountryStateCity.erf`.
2.  Drag all three of your rulesheets onto the canvas.
3.  **Do not connect them.** The rules will handle the stage progression.

---

## Step 4: Testing Your Logic

Testing this ruleflow verifies that the dynamic JSONPath expressions are constructed correctly.

1.  **Test Case 1 (State Filtering):**
    * **Input:** `UI` object with `currentStageNumber = 1`. A `Location` object with `country = 'USA'`.
    * **Expected Output:** The `UI` object should have `nextStageNumber = 2`. The `pathToOptionsArray` for the state dropdown should be set to `$.countries[?(@.country == 'USA')].states[*]`.
2.  **Test Case 2 (City Filtering):**
    * **Input:** `UI` object with `currentStageNumber = 2`. A `Location` object with `country = 'Canada'` and `state = 'Ontario'`.
    * **Expected Output:** The `UI` object should have `UI.done = true`. The `pathToOptionsArray` for the city dropdown should be set to `$.countries[?(@.country == 'Canada')].states[?(@.name == 'Ontario')].cities[*]`.

---

## Conclusion

Excellent work! You have successfully built a three-level cascading selection form, which is a common and powerful pattern in web applications. You have mastered how to use data from previous stages to dynamically filter options for the user, creating a clean and intuitive experience. This concludes our hands-on tutorials.