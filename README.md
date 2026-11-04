# CuraLink

# CuraLink – Clinical Trials Management & Patient-Researcher Collaboration Platform

## 📌 Project Overview

CuraLink is a web-based clinical trials management and collaboration platform designed to bridge the gap between patients and clinical researchers by simplifying the process of discovering, managing, and participating in clinical trials.

The platform aims to improve accessibility to clinical research by providing patients with a centralized interface to explore available clinical trials, understand eligibility requirements, and connect with relevant research opportunities. At the same time, it provides researchers with dedicated tools to manage clinical trial information, monitor patient participation, and organize research activities.

The application focuses on creating a structured digital ecosystem where patients and researchers can interact through role-based dashboards, centralized trial information, and secure data management.

Built using **Next.js and Firebase**, CuraLink leverages modern web development technologies to deliver a responsive user interface, authentication, real-time data handling, and cloud-based storage.

## 🎯 Project Objectives

- Develop a centralized platform for discovering and managing clinical trials.
- Connect patients with researchers through a unified digital ecosystem.
- Simplify clinical trial discovery through structured trial information.
- Implement role-based access control for patients and researchers.
- Provide dedicated dashboards based on user roles.
- Enable researchers to manage clinical trial information and patient-related activities.
- Maintain secure access to application data through authentication and database security rules.
- Build a scalable and responsive web application.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Next.js | React-based frontend and application framework |
| React.js | Component-based UI development |
| JavaScript / TypeScript | Application logic and development |
| Firebase Authentication | User registration and authentication |
| Cloud Firestore | NoSQL database and real-time data management |
| Firebase Security Rules | Role-based data access and authorization |
| Firebase Storage | Cloud-based file storage, where required |
| CSS / Tailwind CSS | Responsive UI styling, depending on implementation |
| Vercel | Application deployment and hosting |
| Git & GitHub | Version control and source code management |

## ⚙️ Core Features and Implementation

### 1. User Authentication and Authorization

CuraLink incorporates Firebase Authentication to provide secure user registration and login functionality.

The authentication system supports separate user roles, allowing patients and researchers to access different areas of the application.

The authentication workflow includes:

- User registration and login.
- Authentication state management.
- Role identification and authorization.
- Protected application routes.
- Role-specific dashboard redirection.
- Secure access to application resources.

Firebase Authentication handles user identity, while Firestore stores additional user profile information and application-specific role data.

### 2. Patient Dashboard

The patient dashboard provides a centralized interface through which users can explore clinical trial opportunities and manage their interactions with the platform.

The dashboard is designed to simplify the clinical trial discovery process by presenting relevant trial information in an organized format.

Key functionality includes:

- Browse available clinical trials.
- View trial descriptions and research objectives.
- Explore eligibility requirements.
- Access relevant trial information.
- Manage personal profile information.
- Track relevant trial-related activities.

### 3. Researcher Dashboard

The researcher dashboard provides a dedicated workspace for managing clinical trial information and research-related activities.

Researchers can use the platform to organize trial information and maintain structured records associated with their research activities.

Key functionality includes:

- Create and manage clinical trial listings.
- Update trial descriptions and eligibility criteria.
- Maintain research-related information.
- View and manage patient-related trial interactions.
- Monitor trial information through a centralized dashboard.
- Manage researcher profile information.

### 4. Clinical Trial Management

The clinical trial management module acts as the central component of CuraLink.

It organizes clinical trial information into structured records that can be accessed through the application based on user permissions.

Each trial can contain relevant information such as:

- Clinical trial title and description.
- Research objectives.
- Medical condition or research area.
- Eligibility requirements.
- Trial status.
- Researcher or organization details.
- Additional trial-related documentation.

The module provides a structured approach to maintaining trial information and making it accessible to relevant platform users.

### 5. Role-Based Access Control

A role-based authorization mechanism is implemented to ensure that patients and researchers can access only the application functionality and data permitted for their roles.

Firebase Authentication is used to identify authenticated users, while Firestore Security Rules enforce access permissions at the database level.

The authorization layer helps prevent unauthorized access to protected user information and researcher-specific operations.

### 6. Database Design and Integration

Cloud Firestore is used as the primary NoSQL database to store and retrieve application data.

The database is organized around application entities such as:

- User profiles.
- Patient information.
- Researcher information.
- Clinical trial records.
- Trial-related interactions.

The application communicates with Firestore through Firebase SDK integrations, allowing data to be retrieved, created, updated, and managed through the web interface.

Security rules are configured to control access to collections and documents based on authentication and user permissions.

### 7. Responsive Frontend and Deployment

The frontend is developed using Next.js and React.js, following a component-based architecture to maintain reusable UI components and modular application functionality.

The application is designed to provide a consistent experience across desktop and mobile screen sizes.

Vercel is used for application deployment, providing a streamlined deployment workflow and integration with the source code repository.

---
