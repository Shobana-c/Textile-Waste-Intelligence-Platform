# Condensed Slide Deck (5 Slides) - Milestone 1 Evaluation

### Project: TexCycle Textile Circularity Platform (Infosys Springboard Internship)

---

## Slide 1: Title & Introduction
*   **Slide Title**: TexCycle: Enterprise Textile Circularity Portal
*   **Subtitle**: Milestone 1: Secure Authentication & Database Foundation
*   **Content**:
    *   **Presented By**: Shobana C (Intern)
    *   **Context**: Infosys Springboard Virtual Internship Project
    *   **Domain**: Circular Economy / Green Software Engineering
    *   **Tech Summary**: FastAPI (Python), React (Vite), SQLite

🎙️ **Speaker Script**:
> *"Good morning. Today I am presenting Milestone 1 of my virtual internship project: TexCycle. TexCycle is a textile waste logging and analysis portal. In this milestone, I established the security architecture, role management, and relational database schema."*

---

## Slide 2: Problem Statement & Objectives
*   **Slide Title**: Context & Milestone Goals
*   **Content**:
    *   **The Problem**: Lack of secure, automated systems to trace fabric types and waste conditions.
    *   **Objective 1: Role Segregation**: Provide separate views for Recycling Operators, Manufacturers, and Sustainability Managers.
    *   **Objective 2: Audit Integrity**: Create a tamper-proof user logging system to replace raw Excel spreadsheets.
    *   **Milestone 1 Deliverable**: A secure login/register system backed by a relational database schema.

🎙️ **Speaker Script**:
> *"The main challenge in textile recycling is traceability. Different operators need different access controls. Milestone 1 solves this by replacing manual paper logs with a secure, role-based platform that acts as the entry gate for all transactions."*

---

## Slide 3: Technical Architecture
*   **Slide Title**: System Design & Tech Stack
*   **Content**:
    *   **Frontend**: React (Vite SPA) styled with Tailwind CSS variables and glassmorphism cards.
    *   **Backend REST Gateway**: FastAPI running on Python 3.12+ (chosen for speed and native typing validation).
    *   **ORM Layer**: SQLAlchemy for secure, object-relational mapping.
    *   **Database Engine**: SQLite database holding relational records.

🎙️ **Speaker Script**:
> *"Here is the architecture: the frontend React SPA connects to a FastAPI backend. FastAPI communicates with our SQLite database using the SQLAlchemy ORM. This ensures type-safe, validated database queries and keeps client inputs clean."*

---

## Slide 4: Secure Auth & User Schema
*   **Slide Title**: JWT Security & Database Schema
*   **Content**:
    *   **Password Encryption**: Plaintext passwords hashed with the `bcrypt` hashing algorithm.
    *   **Session Management**: Stateless JSON Web Tokens (JWT) signed with HS256 HMAC Secret Key.
    *   **User Schema Table**:
        *   `id`: Primary Key (Integer)
        *   `email`: Unique Login ID (String, Indexed)
        *   `full_name`: Operator Name (String)
        *   `hashed_password`: Encrypted pass (String)
        *   `role`: User permission class (Enum String)

🎙️ **Speaker Script**:
> *"Security is handled statelessly. User passwords are encrypted using bcrypt before database storage. At login, a JSON Web Token (JWT) is issued. The user database schema stores details like emails and roles (e.g. Operator, Manufacturer) to determine permissions."*

---

## Slide 5: Verification & Future Roadmap
*   **Slide Title**: Verification & Roadmap
*   **Content**:
    *   **Successful API Handshakes**: Verified auth endpoints (`/register`, `/login`, `/me`) using local python request scripts.
    *   **API Docs**: Auto-generated interactive Swagger UI at `/docs` fully operational.
    *   **Roadmap**:
        *   *Milestone 2*: AI image analysis and fabric classification.
        *   *Milestone 3*: Circularity metrics and SVG charts.
        *   *Milestone 4*: Docker containerization and Nginx proxy configs.

🎙️ **Speaker Script**:
> *"Milestone 1 has been validated: authentication and profile requests operate successfully, and automated API documentation is active. Next, I will implement Milestone 2 (AI fabric sorting) and Milestone 3 (sustainability analytics) before deploying via Docker in Milestone 4. Thank you!"*
