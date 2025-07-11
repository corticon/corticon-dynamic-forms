---
sidebar_position: 1
---

# Corticon.js Technical Fundamentals

The technical foundation of Corticon.js is its ability to transpile complex, graphically modeled rules into a single, optimized, and self-contained JavaScript bundle. This bundle has no runtime dependencies on other Corticon server components, making it exceptionally portable. 

The ubiquity of JavaScript allows this decision service to be deployed in virtually any modern computing environment, from serverless functions on platforms like AWS Lambda and Azure Functions to mobile apps built with React Native or Xamarin, and even directly within a web browser or on an IoT device.  

This architecture enables a particularly powerful offline capability model. Unlike many solutions whose offline functionality is limited to caching form submissions for later synchronization , Corticon.js allows for the full, complex decision logic to be executed directly on the client device without any network connection. 

A mobile application, for instance, can embed the Corticon.js rules engine locally. This enables it to provide instant, sophisticated data validation, dynamic form behavior, and decision outcomes, completely negating the latency and dependency of server-side processing.  

However, this power comes with a clear division of responsibility. While Corticon provides the offline execution engine, the application developer is responsible for implementing the surrounding data synchronization logic. The developer must build the necessary infrastructure to handle local data storage (e.g., using Room or SQLite), manage submission queues, and implement strategies for handling data conflicts when the device comes back online.

