# 🚀 API Documentation Builder

A modern visual documentation management platform built with Next.js and TypeScript.

This project helps teams create, manage, and publish API documentation faster by importing OpenAPI/Swagger definitions and transforming them into customizable documentation pages.

---

## ✨ Overview

API Documentation Builder is a visual documentation management platform that converts OpenAPI / Swagger definitions into fully customizable documentation websites.

Instead of manually creating documentation pages for every API, teams can import their API specifications and generate structured documentation automatically.

The platform provides a visual builder where developers can create, organize, and publish API documentation without writing additional frontend code.

It bridges the gap between backend API definitions and developer-friendly documentation experiences.

---

# 🎯 Features

---

<!-- ## 🖼️ Preview

<div align="center">

<table>
<tr>
<td>
<img src="@/assets/Images/AdminBase.png" width="400"/>
</td>

<td>
<img src="@/assets/Images/componentManagement.png" width="400"/>
</td>
</tr>

<tr>
<td>
<img src="@/assets/Images/createNewPage.png" width="400"/>
</td>

<td>
<img src="@/assets/Images/Import-swagger.png" width="400"/>
</td>
</tr>

</table>

</div>

--- -->

## 🚀 Dynamic Documentation Generation

Unlike traditional Swagger viewers, this platform does not only display API endpoints.

It transforms OpenAPI / Swagger definitions into a complete documentation workspace where pages, sections, menus, and content blocks are generated dynamically.

Teams can create new documentation pages without writing new frontend code. 
The documentation structure is managed through the builder itself, allowing developers to focus on APIs while the platform handles the presentation layer.

---

## 📌 OpenAPI / Swagger Integration

- Import Swagger JSON / OpenAPI specifications
- Automatically detect controllers and API endpoints
- Generate endpoint documentation structures
- Extract request parameters and response schemas
- Convert API definitions into reusable documentation components

---

## 🧩 Visual Documentation Builder

A no-code documentation management experience for developers and technical teams.

Features:

- Create documentation pages dynamically
- Add and arrange documentation blocks visually
- Build custom API documentation flows
- Manage menus, groups, and navigation structures
- Preview documentation changes instantly

No need to create new React pages or modify frontend code for every new API document.

---

## 📚 Reusable Documentation Components

Build documentation pages using configurable blocks:

- Swagger Endpoint Viewer
- Request Parameters Table
- Response Schema Viewer
- API Request / Response Examples
- Markdown / Rich Text Documentation
- Custom Content Sections

Each component can be reused across multiple documentation pages.

---

## 🗂 Documentation Workspace

Manage your API documentation like a content management system:

- Organize APIs into groups and categories
- Create custom documentation hierarchies
- Control documentation structure independently from application code
- Separate documentation content from frontend implementation

---

## 🔄 Version Management *(Roadmap)*

Support for enterprise documentation workflows:

- Draft and published versions
- Documentation history
- Change comparison
- Rollback to previous versions

---

## 🤖 AI Documentation Assistant *(Roadmap)*

Improve documentation quality with AI assistance:

- Generate API descriptions automatically
- Create examples from schemas
- Suggest improvements for technical documentation
- Help teams maintain consistent documentation standards

---




# 📂 Project Architecture
<pre>
src/
│
├── app/
│   └── # Next.js App Router structure, layouts and application routes
│
├── components/
│   │
│   ├── auth/
│   │   └── # Authentication section
│   │
│   ├── ui/
│   │   └── # Components responsible for rendering documentation preview
│   │
│   ├── hooks/
│   │   └── # Navigation and documentation menu components
│   │
│   ├──page-rende
│   │
│   └── layout/
│       └── # Reusable UI components shared across the application
│
├── context/
│       └── # BlockRegistry and sidebar context
│
├── data/
│    └── # file that stores data for created pages.
│
├── features/
│   │
│   ├── docs-builder/
│   │   │
│   │   ├── components/
│   │   │   └── # Feature-specific React components
│   │   │
│   │   ├── hooks/
│   │   │   └── # Custom React hooks for docs builder logic
│   │   │
│   │   ├── models/
│   │   └── # TypeScript interfaces, types and domain models
│   │   │
│   │   └── services/
│   │       └── # API communication and business logic services
│   │
│   │
│   │
│   ├── docs-preview/
│   │   │
│   │   ├── model/ 
│   │   │    └── # TypeScript interfaces, types and domain models 
│   │   │
│   │   └──components/
│   │        └── ui/ 
│   │             └── # preview ui components
│   │
│   │
│   └── swagger-import/ 
│   
│   
│
│
├── lib/
│  
└── assets/
    └── # fonts  
</pre>

----
---

# 📄 License

MIT License 

Free to use, modify, and distribute.