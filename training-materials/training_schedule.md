# 2-Day Eitri Agentic Development Workflow Training

Join us for a 2-day training on the Eitri Agentic Development Workflow. We will simulate a real project lifecycle from start to finish — walking you through the entire journey from a Product Requirements Document (PRD) to fine-grained user stories and Technical Requirements Documents (TRDs), to auditing compliance, running the autonomous implementation loop, and validating the implemented feature as a team. Before attending, please complete the prerequisites and feel free to read through the detailed lesson materials we'll be covering here: [Insert Link to Prerequisites & Lessons].

**Who Should Attend:**

- **Product Owners (POs) / Business Analysts (BAs)**
  - **Key Focus:** Creating the PRD for the training project, generating fine-grained independently testable user stories with clear acceptance criteria, and validating the implemented feature against those criteria during UAT

- **Tech Leads**
  - **Key Focus:** Collaborating on fine-grained user stories, synthesising the PRD into Technical Requirements Documents (TRDs), defining architecture boundary rules, configuring team-specific compliance and coding standards, and ensuring quality gates are enforced

- **Developers**
  - **Key Focus:** Executing the autonomous implementation loop (`/do-work`), generating feature-level boundary tests and running two-axis code review, and validating completed features against acceptance criteria before commit

---

## Training Project

Throughout the 2 days, participants will work through the full Eitri workflow using a **Login Page** as the training project. The scope is kept minimal so that the complete lifecycle — from PRD to working feature — can be experienced within the training timeframe.

Participants will build a simple login page covering:

- Username and password login form
- Form validation (required fields, format checks)
- Error messages for invalid credentials
- Loading state during authentication
- Successful login redirect to a landing page
- Seeding test user data to allow testing of the login feature

Features such as MFA, forgot password, social login, account lockout, and user registration are outside the scope of this workshop.

---

## Individual Assessment

The individual assessment evaluates whether each participant can independently apply the Eitri workflow from end-to-end without guidance. It is designed to assess both process competency — following the workflow correctly — and outcome quality — producing a working, well-structured implementation.

Each participant will be given a pre-written PRD for the **Hello World Auth App** (React + Spring Boot) and is expected to run the complete Eitri workflow independently, from Context Phases through to implementation, code review, and UAT. The app covers:

- User registration with password strength validation
- Login with account lockout and IP-level brute-force protection
- Logout with full session invalidation
- Password reset via a stubbed email service
- Admin user management (list, enable/disable, role change, delete)
- Security requirements including CSRF protection, audit logging, and enumeration resistance

**What to submit:**

- All workflow artefacts (TRD, compliance report, tickets, code review output)
- A working implementation with the required integration tests passing

**Submission deadline: 1 week after the training.**

---

## Detailed Schedule

### Day 1: Project Kickoff, Requirements, Planning & Architecture

| Time | Session Topic | Relevant Roles |
| :--- | :--- | :--- |
| **09:00 AM - 09:30 AM** | **Welcome & Project Kickoff**<br>- Overview: High-level introduction to the 2-day training, its goals, and the project participants will be working through together | All Roles (PO, Tech Lead, Developers) |
| **09:30 AM - 10:45 AM** | **Step 1: Business Domain & Spec Generation**<br>- PRD Creation: Participants draft the PRD for the training project, scoped to a minimal feature set<br>- Context Phase 1 (Business Domain): Injecting domain vocabulary and scope before story generation<br>- Spec Generation: Generating fine-grained, independently testable user stories from the PRD — covering what makes a good story versus a problematic one before and during generation | All Roles |
| **10:45 AM - 11:00 AM** | *Morning Break* | - |
| **11:00 AM - 12:30 PM** | **Step 2: Architecture Standards & TRD Synthesis**<br>- Context Phase 2 (Architecture Standards): Injecting application standards (AppStandards), such as best practices for structured logging, user access control, MFA, and file management, alongside custom team standards to align stories with architectural recipes<br>- Wayfinding & TRD Generation: Using `/wayfinder` to plan investigation tickets, then `/to-spec` to generate the Technical Requirements Document (TRD) | All Roles |
| **12:30 PM - 01:30 PM** | *Lunch Break* | - |
| **01:30 PM - 03:00 PM** | **Step 3: Compliance Auditing & Issue Decomposition**<br>- Context Phase 3 (Compliance Policies): Enforcing organisational rules (e.g., IM8) and integrating any custom, project-specific policies<br>- Spec Auditing & Decomposition: Running `/spec-compliance` on the TRD, then `/to-tickets` to decompose it into execution-ready, vertical task slices | All Roles |
| **03:00 PM - 03:15 PM** | *Afternoon Break* | - |
| **03:15 PM - 04:30 PM** | **Step 4: Issue Verification & Backlog Finalisation**<br>- Issue Quality Gate: Running `/issue-verification` to ensure all generated tickets are complete and unambiguous before implementation<br>- Pre-Implementation Evaluation: Using `/grill-me` to surface hidden assumptions and ensure all tickets are fully scoped before Day 2 implementation | All Roles |
| **04:30 PM - 05:00 PM** | **Day 1 Wrap-up**<br>- Recap of key concepts and workflows covered across Steps 1–4<br>- Preview of Day 2: what participants can expect in the implementation, quality gates, and assessment sessions | All Roles |

---

### Day 2: Implementation, Quality Gates, and Feature Walkthrough

| Time | Session Topic | Relevant Roles |
| :--- | :--- | :--- |
| **09:00 AM - 09:30 AM** | **Day 2 Kick-off & Recap**<br>- Recap of Day 1: Revisiting the PRD, generated stories, TRD, compliance findings, and finalised backlog<br>- Preview of Day 2: Walking participants through what to expect across the implementation, quality gates, UAT, and assessment kick-off sessions | All Roles |
| **09:30 AM - 11:00 AM** | **Step 5: Coding Context**<br>- Context Phase 4 (Coding Best Practices): Using the AWS Bedrock KB (`/query-kb`) to retrieve current framework guides and prevent the agent from writing deprecated code<br>- Context Phase 5 (Code Review Standards): Defining team-wide conventions so that automated reviews enforce your exact coding standards | All Roles |
| **11:00 AM - 11:15 AM** | *Morning Break* | - |
| **11:15 AM - 12:30 PM** | **Step 6: Implementation Loop**<br>- Implementation Loop: Executing work via `/do-work` per ticket, iterating until the code is complete | All Roles |
| **12:30 PM - 01:30 PM** | *Lunch Break* | - |
| **01:30 PM - 03:00 PM** | **Step 7: Quality Gates, Feature Review & Commit**<br>- Feature Boundary Tests: Trainer demo of `/arch-tests-gen-feature` to generate module boundary tests scoped to the feature just implemented<br>- Two-Axis (Standards and Spec axes) Code Review: Running `/code-review` to verify that the code follows technical standards AND satisfies the user story's acceptance criteria<br>- UAT & Feature Review: Starting the app and testing the implemented feature live in the browser, validating each acceptance criterion written in Step 1 (all roles participate)<br>- Commit Closeout: Running `/git-commit-skill` to commit residual artefacts cleanly | All Roles |
| **03:00 PM - 03:15 PM** | *Afternoon Break* | - |
| **03:15 PM - 04:30 PM** | **Individual Assessment Kick-off & Briefing**<br>- Assessment Walkthrough: Briefing participants on the individual take-home project instructions and expected outcomes<br>- Hands-On Start: Participants begin setting up their project repositories and running through the Context Phases to configure their project standards while trainers are in the room to assist | All Roles |
| **04:30 PM - 05:00 PM** | **Final Wrap-up & Next Steps** | All Roles |
