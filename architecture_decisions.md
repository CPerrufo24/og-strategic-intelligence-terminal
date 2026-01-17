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
- **Status:** Accepted
- **Context:** The application relies on `responseMimeType: "application/json"` for dashboard cards.
- **Decision:** Use **`gemini-1.5-flash`**.
- **Reasoning:** Newer preview models (like `2.5-flash`) often lack JSON mode support in early beta. `1.5-flash` offers the best balance of speed, cost, and strict JSON adherence.
