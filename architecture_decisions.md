# Architecture Decisions Records (ADR)

## ADR-001: Vite as Build Tool
- **Status:** Accepted
- **Context:** The project requires a highly performant, lightweight "Landing Page" feel but with the complex state management of a Dashboard.
- **Decision:** Use **Vite** instead of Create React App or Next.js (SSR).
- **Consequences:** 
  - Faster development server startup (<300ms).
  - Optimized production build (ES Modules).
  - Simplifies deployment to static hosts like Netlify.

## ADR-002: Tailwind CSS for Styling
- **Status:** Accepted
- **Context:** We need a strict, premium design system ("Oil & Gas" aesthetic) without the overhead of heavy component libraries (MUI/Bootstrap).
- **Decision:** Use **Tailwind CSS** with a custom `tailwind.config.js` defining the `oil-navy`, `oil-gold`, and `status` color palettes.
- **Consequences:** 
  - Zero runtime CSS overhead.
  - Consistent styling enforcement via utility classes.
  - Easy integration of dark mode default.

## ADR-003: Serverless Backend for AI Security
- **Status:** Proposed / In-Progress
- **Context:** The application uses Google's Gemini API which requires a sensitive `API_KEY`. Storing this key in the frontend code exposes it to the public Internet.
- **Decision:** Implement **Netlify Functions** (Node.js) as a proxy layer.
- **Consequences:**
  - **Security:** The API Key remains server-side in Netlify Environment Variables.
  - **Architecture:** The Frontend calls `/.netlify/functions/getBrief` instead of calling Google directly.
  - **Complexity:** Requires a small backend script but significantly improves security posture.

## ADR-004: Test Driven Development (TDD)
- **Status:** Accepted
- **Context:** The AI responses can be unpredictable. We need to ensure the application doesn't crash if the AI returns malformed data.
- **Decision:** Use **Vitest** for unit testing the Service Layer.
- **Consequences:** 
  - `npm test` must pass before deployment.
  - Mocks are used to simulate various AI response structures (JSON vs Markdown).

## ADR-005: Gemini Model Selection
- **Status:** Accepted (Updated)
- **Context:** The project requires complex reasoning and high-fidelity search grounding for strategic analysis.
- **Decision:** Use **`gemini-3-pro-preview`**.
- **Reasoning:** Superior search integration and the ability to maintain complex JSON structures even when performing multiple research tasks.

## ADR-006: Light Theme Transformation
- **Status:** Accepted
- **Context:** User feedback required a more professional, "clean" aesthetic suitable for executive meetings.
- **Decision:** Pivot from Dark Mode to a **Premium Light Theme** (`bg-[#F4F6F8]`).
- **Consequences:** Improved readability and accessibility. All design tokens (Navy, Gold) shifted to high-contrast light variants.

## ADR-007: Smart Caching (Stale-While-Revalidate)
- **Status:** Accepted
- **Context:** The 10-15s delay of AI research was perceived as "slow" by users.
- **Decision:** Implement **Smart Cache** in `localStorage` keyed by date.
- **Consequences:** 
  - Instant load for returning users on the same day.
  - Reduced API cost and token usage.
  - Manual "Refresh Analysis" button provided for the user to override cache.

## ADR-008: Source Reliability Protocol (Grounding + Fallback)
- **Status:** Accepted
- **Context:** AI can occasionally "hallucinate" URLs or provide broken links.
- **Decision:** 
  1. Strict Prompting: Forbidden to invent URLs.
  2. Fallback: If no verified URL is found, the system generates a **Google News Search link** instead.
- **Consequences:** 100% link reliability; zero "404 Page Not Found" errors for source reports.
