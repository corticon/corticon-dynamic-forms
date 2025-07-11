---
sidebar_position: 1
---

# Form Logic versus Form Presentation

The architecture of the Corticon platform is built upon a foundational separation of roles, providing distinct environments and responsibilities for business and technical users. This delineation is a core element of its value proposition.

This strict separation of concerns is a defining characteristic of Corticon. While most low-code platforms feature a single "builder" persona who handles both UI and logic, Corticon enforces a clear boundary. This division of responsibilities liberates IT while empowering the business. This approach delivers maximum value in environments where the business logic is volatile and changes more frequently than the application's underlying architecture or user interface. It allows the business to be more agile and responsive without being bottlenecked by IT development cycles.   


## The Business Analyst (Rule Modeler)
This non-technical or semi-technical persona operates within **Corticon.js Studio**, a dedicated, standalone desktop environment designed for intuitive rule authoring. 

The primary interface for modeling rules is a spreadsheet-style grid, a format intentionally chosen for its familiarity to business users. The process begins with defining a **Vocabulary**,which is the data model the rules will operate on. 

This vocabulary can be generated directly from standard JSON or JSON Schema files, aligning it with modern data structures. The analyst then creates **Rulesheets** where they define conditions and corresponding actions in a tabular format. Finally, they orchestrate the execution order of these rulesheets in a graphical **Ruleflow**. 

This model empowers domain experts—such as policy managers, underwriters, or compliance officers—to directly author, test, and manage the business logic they are responsible for. 


## The Developer (Integrator)
The developer's role begins after the business analyst has modeled, tested, and packaged the rules. The developer does not interact with the rule logic itself. 

Their primary artifact is a self-contained, transpiled JavaScript bundle (e.g., `decisionServiceBundle.js`) produced by Corticon Studio. Their responsibility is to integrate this decision service into the target application. 

This involves building the user interface, preparing the JSON data payload that will be sent to the decision service, invoking the service's 
`execute` function, and then processing the modified JSON payload that is returned. 

To facilitate this process, Progress provides sample "wrapper" code that demonstrates how to integrate the bundle across various target platforms, including Node.js servers, AWS Lambda functions, mobile applications, and web browsers.   
