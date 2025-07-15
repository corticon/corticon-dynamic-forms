---
title: Corticon Design Pattern Comparison
sidebar_position: 1.5
---

# Corticon Solution Comparison

It is important to distinguish between the core Corticon.js engine and the Corticon.js Dynamic Forms solution, which is a specific implementation that uses the engine. The table below clarifies the differences between the JavaScript-based offerings and the traditional Java-based Corticon Server.

| Feature                   | Corticon.js (The Engine)                                                     | Corticon.js Dynamic Forms (The Solution)                              | Corticon Server (Traditional)                                |
| :------------------------ | :--------------------------------------------------------------------------- | :-------------------------------------------------------------------- | :----------------------------------------------------------- |
| **Execution Environment** | Client-side (Browser), Server-side (Node.js), or Function-as-a-Service       | Primarily Client-side (Browser)                                       | Server-side (Java Application)                               |
| **Primary Use Case**      | A library for executing Corticon rules in any JavaScript application.        | A pre-built solution for creating rule-driven, interactive web forms. | High-volume, transactional decisions for enterprise systems. |
| **Primary Data Source**   | JSON objects provided by the host application.                               | User input from the web form.                                         | SOAP/REST requests or direct database calls.                 |
| **Integration Method**    | A flexible JavaScript library that developers integrate into their own code. | A specific front-end architecture that uses the Corticon.js library.  | A standalone decision service accessed remotely via APIs.    |

The key takeaway is that the Dynamic Forms solution is a ready-to-use architecture for building interactive user experiences, powered by the versatile Corticon.js engine.