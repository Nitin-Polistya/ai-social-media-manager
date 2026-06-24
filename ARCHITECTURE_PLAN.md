# AI Social Media Manager - Architecture Plan

This document outlines the proposed architecture and file structure for the modular AI Social Media Manager, building upon the existing Next.js codebase.

## 1. Overall System Architecture

The AI Social Media Manager will be built as a set of loosely coupled, modular "engines" that integrate with the existing Next.js application. Each engine will encapsulate specific functionalities, interacting with the core application through well-defined interfaces and API routes. The existing `app/api` routes for `generate-post` and `generate-image` will be refactored or extended to serve as part of the "Integration Layer" or be consumed by the respective engines.

```mermaid
graph TD
    UserInterface[User Interface (Next.js Frontend)]
    NextjsAPI[Next.js API Routes]
    ContentEngine[Content Engine]
    CreativeEngine[Creative Engine]
    SchedulerEngine[Scheduler Engine]
    AnalyticsEngine[Analytics Engine]
    IntegrationLayer[Integration Layer]
    GeminiAPI[Gemini API]
    StabilityAI[Stability AI]
    SocialMediaAPIs[Social Media APIs (Mock/Real)]
    Database[Database (for scheduling/analytics)]

    UserInterface --> NextjsAPI
    NextjsAPI --> ContentEngine
    NextjsAPI --> CreativeEngine
    NextjsAPI --> SchedulerEngine
    NextjsAPI --> AnalyticsEngine

    ContentEngine --> IntegrationLayer
    CreativeEngine --> IntegrationLayer
    SchedulerEngine --> IntegrationLayer
    AnalyticsEngine --> IntegrationLayer

    IntegrationLayer --> GeminiAPI
    IntegrationLayer --> StabilityAI
    IntegrationLayer --> SocialMediaAPIs
    IntegrationLayer --> Database

    SchedulerEngine --> Database
    AnalyticsEngine --> Database
```

## 2. Module Breakdown and Responsibilities

### 2.1. Content Engine

**Responsibilities:**
*   Generating captions
*   Generating hashtags
*   Generating post ideas
*   Generating hooks/scripts

**API/Services:**
*   Will primarily interact with the Gemini API via the Integration Layer.
*   May have its own internal services for prompt engineering and response parsing.

### 2.2. Creative Engine

**Responsibilities:**
*   Generating image prompts
*   Generating video prompts (future)
*   Ensuring branding consistency logic (e.g., style guides, tone of voice)

**API/Services:**
*   Will primarily interact with the Stability AI (or similar) API via the Integration Layer for image generation.
*   May have internal logic for managing brand assets and guidelines.

### 2.3. Scheduler Engine

**Responsibilities:**
*   Post scheduling system
*   Queue management for posts
*   Calendar integration (e.g., displaying scheduled posts)

**API/Services:**
*   Will require a database for storing scheduled posts and queue information.
*   May interact with external calendar APIs (e.g., Google Calendar).
*   Will need API routes for scheduling, updating, and retrieving posts.

### 2.4. Analytics Engine

**Responsibilities:**
*   Engagement tracking
*   Post performance insights
*   Growth recommendations

**API/Services:**
*   Will require a database for storing analytics data.
*   Will interact with Social Media APIs (or mock data) via the Integration Layer to fetch post performance metrics.
*   Will need API routes for retrieving and processing analytics data.

### 2.5. Integration Layer

**Responsibilities:**
*   Centralized handling of external API integrations (Gemini, Stability AI, Social Media APIs).
*   Authentication and API key management for external services.
*   Request/response transformation and error handling for external APIs.
*   Database interaction for other engines (e.g., Scheduler, Analytics).

**API/Services:**
*   Will expose internal services for other engines to consume (e.g., `geminiService.generateText`, `stabilityService.generateImage`).
*   Will manage database connections and ORM/query logic.

## 3. Proposed Folder Structure

To accommodate the new modular engines, the following folder structure is proposed:

```
. 
├── app/
│   ├── api/
│   │   ├── content/              # API routes for Content Engine
│   │   ├── creative/             # API routes for Creative Engine
│   │   ├── scheduler/            # API routes for Scheduler Engine
│   │   ├── analytics/            # API routes for Analytics Engine
│   │   ├── integration/          # API routes for Integration Layer (if needed for direct client access)
│   │   ├── generate-image/       # Existing, will be refactored/consumed by Creative Engine
│   │   └── generate-post/        # Existing, will be refactored/consumed by Content Engine
│   ├── generator/
│   ├── dashboard/                # New: For displaying scheduled posts and analytics
│   ├── settings/                 # New: For user settings, API key configuration
│   └── ... (existing app files)
├── components/
│   ├── content-engine/           # UI components for Content Engine
│   ├── creative-engine/          # UI components for Creative Engine
│   ├── scheduler-engine/         # UI components for Scheduler Engine
│   ├── analytics-engine/         # UI components for Analytics Engine
│   ├── layout/
│   └── ui/
├── lib/
│   ├── engines/                  # Core logic for each engine
│   │   ├── content/              # Content Engine logic (services, types, utils)
│   │   ├── creative/             # Creative Engine logic (services, types, utils)
│   │   ├── scheduler/            # Scheduler Engine logic (services, types, utils)
│   │   └── analytics/            # Analytics Engine logic (services, types, utils)
│   ├── services/                 # Reusable services for external APIs and database
│   │   ├── gemini.ts             # Gemini API service
│   │   ├── stability.ts          # Stability AI API service
│   │   ├── social-media.ts       # Social Media API service (mock/real)
│   │   ├── database.ts           # Database connection and ORM
│   │   └── ...
│   ├── types/                    # Shared TypeScript types and interfaces
│   ├── utils.ts
│   └── post-generator.ts         # Existing, will be refactored/moved to content/types or lib/types
├── ... (other existing files)
```

## 4. UI Integration Points

*   **`/generator` page:** This page will be the primary interface for the **Content Engine** and **Creative Engine**. Users will generate captions, hashtags, post ideas, and images here. The existing UI components in `components/generator/` will be adapted or extended.
*   **`/dashboard` (New Page):** This page will serve as the central hub for the **Scheduler Engine** and **Analytics Engine**. Users will view scheduled posts, manage queues, and see performance insights. This page will likely contain new UI components within `components/scheduler-engine/` and `components/analytics-engine/`.
*   **`/settings` (New Page):** This page will allow users to configure API keys for Gemini, Stability AI, and potentially connect their social media accounts. This will interact with the **Integration Layer**.

## 5. Development Rules for AI Tools (Reiteration from AI_CONTEXT.md)

*   **Modularity:** All new AI functionalities should be developed as modular "engines" to ensure loose coupling and maintainability.
*   **Clean Architecture:** Adhere to clean architecture principles, separating concerns between UI, application logic, and infrastructure (AI API calls).
*   **Reusable Services:** Design and implement reusable services for interacting with external APIs (e.g., a dedicated service for Gemini, another for Stability AI) to centralize logic and facilitate testing.
*   **No Hardcoding:** Avoid hardcoding sensitive information (API keys) or configuration values. Use environment variables for configuration.
*   **Error Handling:** Implement robust error handling for all AI API calls and user inputs, providing informative feedback to the user.
*   **Mocking for Development:** Continue to support mock responses for AI services when API keys are not available, enabling frontend development without full backend integration.
*   **Incremental Changes:** Implement new features incrementally, ensuring existing functionalities remain stable.
*   **Testing:** Consider adding unit and integration tests for new modules and services to ensure correctness and prevent regressions.
*   **Documentation:** Document new modules, components, and services, especially their purpose, inputs, outputs, and any external dependencies.
*   **Performance:** Optimize AI calls and data processing to ensure a responsive user experience.
*   **Security:** Ensure API keys are handled securely (server-side only, environment variables).
*   **User Experience:** Prioritize a smooth and intuitive user experience, especially when dealing with AI generation, providing clear feedback on progress and potential issues.
*   **Continue, Cline, Cursor Fallback:** The system should be designed to be extensible and adaptable to different AI models or tools. The current implementation uses Gemini and Stability AI, but the architecture should allow for easy swapping or addition of other AI providers or local models in the future. This implies a clear interface for AI services.