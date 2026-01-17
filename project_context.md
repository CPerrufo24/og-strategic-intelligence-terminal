# Project Context: O&G Strategic Intelligence Terminal

## Overview
The **O&G Strategic Intelligence Terminal** is a high-precision executive dashboard designed to provide real-time strategic analysis of Mexico's Energy Sector. Unlike a standard news feed, this terminal synthesizes data using Generative AI to offer "implications" and "strategic actions" for C-Level executives.

## Core Value Proposition
- **Synthesis over Noise:** Filters out general news to focus on high-impact events (PEMEX financial state, Private E&P contracts, Macroeconomic shifts).
- **Executive Aesthetics:** A "Bloomberg-style" dark mode interface designed for high-contrast readability and authoritative presentation.
- **Real-Time Intelligence:** Powered by Google's Gemini Models to fetch and analyze the latest market moves.

## Technology Stack

### Frontend / Core
- **Framework:** [React 19](https://react.dev)
- **Build Tool:** [Vite](https://vitejs.dev) (Chosen for high-performance builds and "Landing Page" speed)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom "Oil & Gas" design token system)

### Intelligence Engine
- **Provider:** Google Gemini API (`@google/genai`)
- **Current Model:** `gemini-1.5-flash` (Optimized for latency and JSON structure)
- **Features:** Grounding with Google Search, Structured JSON Output.

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
- **UI/UX:** Fully implemented with responsive "Oil Navy" theme.
- **AI Integration:** Operational logic; pending API Key/Model alignment (Transitioning to Netlify Functions for security).
- **Verification:** TDD implemented with Vitest; CI/CD pipeline pending.
