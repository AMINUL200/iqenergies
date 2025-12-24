# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

1️⃣ Brand-Level (Landing Page) – Master Color Scheme

This is what users see first. It should match the logo, feel professional, and allow smooth transition into product categories.

🎨 Primary Brand Palette (Landing Page)
Usage Color Hex
Primary (Brand / CTA) Energy Green #4CAF50
Secondary Deep Teal #0F766E
Accent Solar Orange #F59E0B
Background Soft Light #F8FAFC
Text (Primary) Charcoal #1F2933
Text (Muted) Gray #6B7280

2️⃣ Sun Energy Products – Warm & Powerful

When user navigates to Sun Energy, the UI should feel hot, bright, and optimistic.

☀️ Sun Energy Color Scheme
Usage Color Hex
Primary Solar Orange #F97316
Secondary Sun Yellow #FACC15
Accent Burnt Red #DC2626
Background Warm Cream #FFF7ED
Text Dark Brown #3B2F2F

3️⃣ Water Energy Products – Cool & Reliable

Water energy should feel clean, calm, and trustworthy.

🌊 Water Energy Color Scheme
Usage Color Hex
Primary Ocean Blue #2563EB
Secondary Aqua #38BDF8
Accent Teal #0EA5A4
Background Ice White #F0F9FF
Text Navy #0F172A

4️⃣ Wind Energy Products – Clean & Minimal

Wind energy works best with white, airy, minimal design.

🌬️ Wind Energy Color Scheme
Usage Color Hex
Primary Cool Gray #64748B
Secondary Sky Gray #CBD5E1
Accent Mint Green #2DD4BF
Background Pure White #FFFFFF
Text Slate #1E293B

<!-- admin -->

COLOR SCHEMA
🔹 Primary Colors

Primary Black: #0A0A0A
→ Main text, headings, icons, buttons

Pure White: #FFFFFF
→ Page background, cards, sections

🔹 Secondary / Neutral Colors

Dark Gray: #1F2937 (gray-800)
→ Hover state (black buttons)

Medium Gray: #4B5563 (gray-600)
→ Body text

Light Gray: #E5E7EB (gray-200)
→ Borders, dividers

Soft Background Gray: #F3F4F6 (gray-100)
→ Section background, cards, scrollbar track

🖱️ BUTTON STYLES & HOVER BEHAVIOR
1️⃣ Primary Button (Black → White on Hover)

Default:

Background: #0A0A0A

Text: #FFFFFF

Border: #0A0A0A

Hover:

Background: #FFFFFF

Text: #0A0A0A

Tailwind

bg-gray-900 text-white border border-gray-900
hover:bg-white hover:text-gray-900

2️⃣ Secondary Button (White → Black on Hover)

Default:

Background: #FFFFFF

Text: #0A0A0A

Border: #E5E7EB

Hover:

Background: #0A0A0A

Text: #FFFFFF
