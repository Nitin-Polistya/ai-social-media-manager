# Project Architecture Summary

This project is a Next.js application designed as an AI Social Media Manager. It leverages serverless API routes for AI content generation and a modern React-based frontend with Shadcn/UI components.

**Key Architectural Principles:**
*   **Modular Design:** The application is structured to allow for the integration of various AI "engines" (Content, Creative, Scheduler, Analytics) as distinct, loosely coupled modules.
*   **API-driven AI Integration:** AI functionalities (post generation, image generation) are exposed via Next.js API routes, abstracting the underlying AI service calls (Gemini, Stability AI) from the frontend.
*   **Component-Based UI:** The user interface is built using React and styled with Tailwind CSS, utilizing Shadcn/UI for pre-built, accessible, and customizable components.
*   **Scalability:** Next.js provides server-side rendering (SSR) and API routes, which are suitable for scalable web applications.
*   **Environment Variable Configuration:** API keys for AI services are managed via environment variables, with fallback mock responses for development without keys.

# Folder Structure Explanation

```
.
├── app/                      # Next.js application routes and API endpoints
│   ├── api/                  # API routes for backend functionalities
│   │   ├── generate-image/   # API for AI image generation (Stability AI)
│   │   └── generate-post/    # API for AI text generation (Gemini)
│   ├── generator/            # Main page for AI content generation
│   ├── favicon.ico
│   ├── globals.css           # Global CSS styles
│   ├── layout.tsx            # Root layout for the application
│   └── page.tsx              # Home page
├── components/               # Reusable React components
│   ├── generator/            # Components specific to the generator page
│   ├── layout/               # Layout-related components (e.g., SiteHeader)
│   ├── ui/                   # Shadcn/UI components (button, card, etc.)
│   ├── theme-provider.tsx    # Theme context provider
│   └── theme-toggle.tsx      # Theme switching component
├── lib/                      # Utility functions and shared logic
│   ├── download-image.ts     # Logic for image downloading
│   ├── post-generator.ts     # Types and helper functions for post generation
│   └── utils.ts              # General utility functions
├── public/                   # Static assets
├── .gitignore
├── AGENTS.md                 # Agent-specific instructions
├── CLAUDE.md                 # Claude-specific instructions (if any)
├── components.json           # Shadcn/UI configuration
├── eslint.config.mjs         # ESLint configuration
├── next.config.ts            # Next.js configuration
├── package-lock.json
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration (for Tailwind CSS)
├── README.md
├── tsconfig.json             # TypeScript configuration
└── AI_CONTEXT.md             # This file
```

# Core Modules and Responsibilities

*   **`app/` (Next.js App Router):** Handles routing, page rendering (SSR/SSG/ISR), and API endpoints.
    *   `app/page.tsx`: Landing page, introduces the application and its features.
    *   `app/generator/page.tsx`: The primary interface for users to generate social media content.
    *   `app/api/generate-post/route.ts`: Responsible for orchestrating calls to the Gemini API to generate text-based social media content (captions, hashtags, CTAs, image prompts).
    *   `app/api/generate-image/route.ts`: Responsible for orchestrating calls to the Stability AI API to generate images based on provided prompts.
*   **`components/`:** Houses all reusable UI components.
    *   `components/ui/`: Contains Shadcn/UI components, providing a consistent and accessible design system.
    *   `components/layout/`: Contains structural components like headers and footers.
*   **`lib/`:** Contains shared utility functions, types, and business logic that can be reused across the application.
    *   `lib/post-generator.ts`: Defines types and interfaces for post generation requests and responses, and potentially helper functions for data validation or transformation.

# API/Services Used

*   **Gemini API:** Used for generating text-based content (captions, hashtags, CTAs, expanded prompts, image prompts). The `app/api/generate-post/route.ts` file handles the integration.
*   **Stability AI:** Used for generating images based on text prompts. The `app/api/generate-image/route.ts` file handles the integration.
*   **Next.js API Routes:** Act as a backend for frontend (BFF) layer, abstracting direct AI API calls from the client and handling API key management securely.

# UI System Rules (Shadcn/UI + Figma Usage)

*   **Shadcn/UI:** The project utilizes Shadcn/UI components for a consistent and accessible user interface. All new UI elements should adhere to Shadcn/UI's design principles and leverage existing components where possible.
*   **Figma-based Design System:** The existing UI is based on a Figma design system. Any new UI development or modifications must respect the established visual language, spacing, typography, and color palette defined in the Figma design. Custom styling should be minimal and only applied when necessary to extend Shadcn/UI components while maintaining the overall design consistency.
*   **Tailwind CSS:** Styling is managed with Tailwind CSS. Utility classes should be preferred for styling, and custom CSS should be avoided unless absolutely necessary for complex components or animations.

# Development Rules for all AI Tools (Continue, Cline, Cursor fallback)

*   **Modularity:** All new AI functionalities should be developed as modular "engines" (Content, Creative, Scheduler, Analytics) to ensure loose coupling and maintainability.
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
