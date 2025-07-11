---
sidebar_position: 2
---

# Integration and Data Handling

Corticon.js is designed to integrate seamlessly into modern, data-driven application architectures. Its data handling model is both flexible and developer-centric.

The platform's data model, known as a "Vocabulary," is defined based on the structure of the data it will process. Vocabularies can be generated directly from standard JSON or JSON Schema files, making Corticon.js native to the data formats used in contemporary web and mobile development. The entire interaction with a deployed Corticon.js decision service occurs via a JSON payload. The client application constructs a JSON object representing the input data, passes it to the decision service for rule execution, and receives a modified JSON object containing the results and any audit information.   