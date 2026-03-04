---
title: Styling The Forms
sidebar_position: 5
---

# Styling The Forms

The dynamic forms solution is designed to be easily styled with standard CSS. You can modify the provided stylesheets to match any branding requirements.

## Core CSS Files

There are two primary CSS files that control the appearance of the forms:

* **`/static/corticon-forms-example/client.css`**: This file contains the main layout styles for the host page, including the positioning of the form container, header, and navigation buttons.
* **`/static/corticon-forms-example/clientSideComponent/dynForm/UIControlsStyles.css`**: This is the most important file for styling. It contains all the CSS classes related to the individual UI controls, such as labels, inputs, containers, and validation messages.

A third file, `TraceStyles.css`, controls the look of the Tracer utility.

## Styling Example: Changing a Container Title

Let's walk through changing the color and font weight of the container titles.

1.  **Inspect the Element:** Using your browser's developer tools, inspect a container title. In the current implementation, titles are rendered as `<h3>` inside `#dynUIContainerId`.

2.  **Locate the CSS Rule:** Open `UIControlsStyles.css`. You will find a rule targeting this element:
    ```css
    #dynUIContainerId h3 {
        color: #2C3E50;
        font-size: 15px;
        margin-bottom: 20px;
    }
    ```
3.  **Modify the Rule:** To make the titles dark gray and bold, you can change the rule to:
    ```css
    #dynUIContainerId h3 {
        color: #333; /* Changed from blue to dark gray */
        font-weight: bold; /* Added font-weight */
        font-size: 15px;
        margin-bottom: 20px;
    }
    ```

You can use this same process of inspecting elements and modifying their corresponding CSS rules in `UIControlsStyles.css` to customize any part of the dynamic form.
