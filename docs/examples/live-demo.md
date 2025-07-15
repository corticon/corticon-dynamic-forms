---
title: Live Demonstration
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Live Demonstration: One Front-End, Many Forms

A core principle of the Corticon.js Dynamic Forms solution is the **separation of logic from presentation**. This means you can build a single front-end application that can render *any* number of different forms without changing the front-end code.

The embedded application below is a single HTML page. It is not specific to any one form.

**Use the dropdown menu within the application to select and run different decision services.** Notice how the entire form's steps, fields, labels, and validation rules change dynamically based on your selection. This demonstrates how business logic, defined in Corticon, dictates the user experience rendered by the generic front-end.

<iframe
  src={useBaseUrl('/corticon-forms-example/index.html')}
  width="100%"
  height="700px"
  style={{ border: '1px solid #ccc', borderRadius: '8px' }}
  title="Live Dynamic Forms Demonstration">
</iframe>