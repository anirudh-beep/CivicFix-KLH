# CivicFix

> AI-Assisted Civic Issue Reporting and Repair Management Platform

CivicFix is a civic issue reporting and management platform that connects **citizens, repairmen, HODs, and district administrators** through a unified system.

Citizens can report civic problems with photos, descriptions, and GPS locations. AI can assist with issue classification, while repairmen can view assigned tasks, log in/out for their working availability, navigate to locations, and submit geo-tagged repair evidence.

---

## Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [User Roles](#user-roles)
- [Current Frontend](#current-frontend)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Application Flow](#application-flow)
- [Citizen Workflow](#citizen-workflow)
- [Repairman Workflow](#repairman-workflow)
- [Repairman Log On / Log Off](#repairman-log-on--log-off)
- [Complaint Lifecycle](#complaint-lifecycle)
- [AI Classification](#ai-classification)
- [Geo-tagged Photos](#geo-tagged-photos)
- [Authentication](#authentication)
- [Backend Integration](#backend-integration)
- [Database](#database)
- [API Integration](#api-integration)
- [Maps and Location](#maps-and-location)
- [Light and Dark Mode](#light-and-dark-mode)
- [Flutter Mobile Conversion](#flutter-mobile-conversion)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Production Build](#production-build)
- [Environment Variables](#environment-variables)
- [Development Guidelines](#development-guidelines)
- [Future Improvements](#future-improvements)
- [Team Responsibilities](#team-responsibilities)

---

# Project Overview

CivicFix is designed to improve the process of reporting and resolving civic problems.

Examples of civic issues include:

- Street lights not working
- Garbage overflowing
- Potholes
- Damaged roads
- Water leakage
- Drainage problems
- Public infrastructure damage
- Other municipal issues

The platform follows the workflow:

```text
Citizen
   ↓
Report Issue
   ↓
Photo + Description + GPS Location
   ↓
AI Classification
   ↓
User Confirmation
   ↓
Complaint Submitted
   ↓
Department / HOD
   ↓
Repairman Assignment
   ↓
Repairman Logs In
   ↓
Repair Started
   ↓
Repair Evidence Uploaded
   ↓
Repair Completed
   ↓
Citizen Verification
   ↓
Complaint Resolved
