# Project Context: O&G Intelligence Briefing

## Overview
The **O&G Intelligence Briefing** is a high-precision executive dashboard designed to provide real-time strategic analysis of Mexico's Energy Sector. Unlike a standard news feed, this terminal synthesizes data using Generative AI to offer "implications" and "strategic actions" for C-Level executives.

## Core Value Proposition
- **Synthesis over Noise:** Filters out general news to focus on high-impact events (PEMEX financial state, Private E&P contracts, Macroeconomic shifts).
- **Executive Aesthetics (Light Theme):** A professional, clean, and high-contrast interface designed for executive presentations and clarity.
- **Real-Time Intelligence:** Powered by Google's Gemini Models to fetch and analyze the latest market moves with verified grounding.

## Technology Stack

### Frontend / Core
- **Framework:** [React 19](https://react.dev)
- **Build Tool:** [Vite](https://vitejs.dev) (Chosen for high-performance builds and "Landing Page" speed)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom "Oil & Gas" design token system)

### Intelligence Engine
- **Provider:** Google Gemini API (`@google/genai`)
- **Current Model:** `gemini-3-pro-preview` (High-performance reasoning and grounding tools)
- **Features:** Grounding with Google Search, Structured JSON Output, Smart Link Fallback Protocol.

### Infrastructure & Deployment (Planned)
- **Hosting:** Netlify (Static Site Hosting)
- **Backend:** Netlify Functions (Serverless Node.js) to securely proxy API requests and protect keys.
- **Version Control:** GitHub

## Project Structure
- **/src**: UI Components and styles.
- **/services**: Integration with external APIs (Gemini).
- **/scripts**: Utility scripts for validation (e.g., model listing).
- **test**: Unit testing via Vitest (TDD implementation).

## Current Status
- **UI/UX:** Fully redesigned with "Premium Light Theme" and corporate branding (Oil Navy & Gold).
- **AI Integration:** Operational with `gemini-3-pro-preview` and strict grounding rules.
- **Performance:** Instant initialization via Smart Cache (Date-aware localStorage).
- **Verification:** Free of TypeScript errors; layout verified for executive use.
