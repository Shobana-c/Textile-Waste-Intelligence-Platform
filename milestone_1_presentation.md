# PowerPoint Presentation Slide Deck: Milestone 1

### Project: TexCycle Textile Circularity Platform (Infosys Springboard Internship)

---

## Slide 1: Title Slide
*   **Slide Title**: TexCycle: Enterprise Textile Waste Circularity Portal
*   **Subtitle**: Milestone 1 Presentation: Secure Authentication & Database System
*   **Visual Layout**: Dark green background theme, high-contrast white text, Infosys Springboard logo placeholder.
*   **Content**:
    *   **Presented By**: Shobana C (Intern)
    *   **Domain**: Circular Economy / Green Software Engineering
    *   **Submission Date**: July 2026

🎙️ **Speaker Script**:
> *"Good morning evaluators. Today I am presenting Milestone 1 of my virtual internship project: TexCycle. TexCycle is an enterprise circular economy portal created to automate the identification and logging of textile waste. In this first milestone, I have built the secure authentication gateway, user role managers, and the relational database foundation."*

---

## Slide 2: Problem Statement
*   **Slide Title**: The Challenge in Textile Waste Tracking
*   **Visual Layout**: Bullet points on the left, an icons list on the right (Trash, Alert, Scale).
*   **Content**:
    *   **Lack of Traceability**: Textile sorting facilities struggle to record batches, leading to landfill overflow.
    *   **Role Identification**: Different operators (Facility Operators, Manufacturers, Sustainability Managers) need separate access levels.
    *   **Security Gaps**: Raw spreadsheets are prone to data manipulation; secure audit logs are required.
    *   **Solution**: A secure, role-based cloud platform with unified databases.

🎙️ **Speaker Script**:
> *"Before looking at the code, let’s understand why this database is needed. Millions of tons of fabrics end up in landfills because sorting facilities lack proper tracing. Different stakeholders—such as operators who sort, manufacturers who buy recycled yarn, and managers who track impact—need secure, separate portals. Milestone 1 establishes this secure entry gate and data schema."*

---

## Slide 3: Milestone 1 Technical Architecture
*   **Slide Title**: Milestone 1: System Design & Tech Stack
*   **Visual Layout**: A simple three-column architecture block diagram.
    *   **Frontend (React + Vite)** ──[REST API / JSON]──> **Backend (FastAPI)** ──[SQLAlchemy ORM]──> **Database (SQLite)**
*   **Content**:
    *   **Client Layer**: React SPA styled with Tailwind CSS variables and glassmorphism.
    *   **REST API Gateway**: FastAPI running on Python 3.12+ (chosen for speed and auto-generated OpenAPI documentation).
    *   **ORM Layer**: SQLAlchemy for type-safe database queries.
    *   **Database**: SQLite (relational engine, ideal for local deployment).

🎙️ **Speaker Script**:
> *"Here is the tech stack I selected. The client layer uses React + Vite, communicating with a FastAPI backend via JSON REST APIs. I chose FastAPI because of its high performance and automatic validation. I am using SQLAlchemy as the ORM to communicate with a SQLite database, ensuring clean database schemas."*

---

## Slide 4: Secure Authentication Gateway
*   **Slide Title**: JWT & Cryptographic Security
*   **Visual Layout**: Flow diagram showing registration and login handshake.
    *   `Register (Plaintext Password)` ──[Bcrypt Hash]──> `Stored Hash in DB`
    *   `Login (Credentials)` ──[Verify Hash]──> `Issue JWT Access Token`
*   **Content**:
    *   **Password Hashing**: Secure encryption using the `bcrypt` library (protects passwords from database leaks).
    *   **Session Management**: JSON Web Tokens (JWT) signed with a custom HS256 HMAC Secret Key.
    *   **Stateless Security**: Users submit the token in the `Authorization` header to access protected inventory actions.

🎙️ **Speaker Script**:
> *"Security is a critical part of the Springboard project requirements. Passwords are never stored in plaintext; instead, they are hashed using the industry-standard bcrypt algorithm before saving to the database. Once verified at login, the backend issues a signed JSON Web Token (JWT) that secures subsequent requests."*

---

## Slide 5: Database Schema Design
*   **Slide Title**: Relational Database Schema
*   **Visual Layout**: Entity-Relationship Diagram (ERD) or table representation.
*   **Content**:
    *   **Users Table Schema**:
        *   `id`: Integer (Primary Key)
        *   `email`: String (Unique, Indexed)
        *   `full_name`: String
        *   `hashed_password`: String (Bcrypt Hash)
        *   `role`: Enum String (Operator, Manufacturer, Manager, Admin)
        *   `is_active`: Boolean
    *   **Validation**: Handled at runtime via Pydantic Schemas (`UserCreate`, `UserLogin`, `Token`).

🎙️ **Speaker Script**:
> *"For Milestone 1, the core model is the User schema. It stores indexed emails, names, hashed passwords, and roles. The roles are bound to specific operational options: Recycling Facility Operator, Textile Manufacturer, Sustainability Manager, or Administrator. Pydantic schemas validate all client inputs before they touch the database."*

---

## Slide 6: API Implementation & Routing
*   **Slide Title**: API Endpoint Routing Architecture
*   **Visual Layout**: Two-column layout list.
*   **Content**:
    *   **Authentication Routes**:
        *   `POST /api/auth/register`: Creates new accounts and validates password match.
        *   `POST /api/auth/login`: Authenticates password and issues JWT.
        *   `GET /api/auth/me`: Retrieves the active user profile (Protected Route).
    *   **FastAPI Documentation**: Automated Swagger interactive UI generated at `/docs`.

🎙️ **Speaker Script**:
> *"The backend exposes three core endpoints for authentication: Register, Login, and Me. The `/api/auth/me` route is protected; it parses the incoming JWT token, looks up the user ID, and returns the current user profile only if the token is valid."*

---

## Slide 7: Frontend Authentication UI
*   **Slide Title**: User Interface & UX Design
*   **Visual Layout**: Placeholders for two screenshots (Login Screen & Registration Form).
*   **Content**:
    *   **Visual Aesthetics**: Sleek, modern dark-mode design with subtle green accents indicating ecology themes.
    *   **User Feedback**: Real-time error messages (e.g. "Password mismatch", "Email already registered").
    *   **Autocomplete Support**: Integrated browser autofill tags for seamless password and email entry.

🎙️ **Speaker Script**:
> *"On the frontend, I developed a clean, user-friendly interface using React. The registration page prompts users to select their specific role. It features responsive input cards and handles real-time verification checks to ensure smooth registration."*

---

## Slide 8: Demonstration & Next Steps
*   **Slide Title**: Verification Results & Future Roadmap
*   **Visual Layout**: Progression timeline chart.
    *   `Milestone 1 [Complete]` ──> `Milestone 2 [AI Analysis]` ──> `Milestone 3 [Analytics]` ──> `Milestone 4 [Docker]`
*   **Content**:
    *   **Milestone 1 Success**: Passed API unit tests, database operations verified, registration and logins operate cleanly.
    *   **Milestone 2 Goal**: Fabric image upload and AI classification pipeline.
    *   **Milestone 3 Goal**: Environmental impact calculations and SVG charting.
    *   **Milestone 4 Goal**: Nginx proxy and Docker Compose orchestrations.

🎙️ **Speaker Script**:
> *"To verify Milestone 1, I ran unit tests confirming that authentication, hashing, and token issuance function correctly. With the secure database foundation complete, the next milestones will build on this: adding image uploads in Milestone 2, sustainability analytics in Milestone 3, and containerizing the final portal using Docker in Milestone 4. Thank you, and I am happy to take any questions."*
