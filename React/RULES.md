# SportsCourt Architectural Rules

This document defines the strict architectural and design standards that MUST be followed by all agents and developers working on this project.

## 1. Component-First Architecture
- **No Raw HTML for UI**: Avoid using raw `div`, `span`, `p`, `h1-h6` for layout and typography if a common component exists.
- **Mandatory Components**:
  - Use `Box` for layout containers and wrappers.
  - Use `Heading` for all titles and headings.
  - Use `Text` for all paragraphs, labels, and small text.
  - Use `Container` for main page content centering.
  - Use `Logo` for the brand identity.
- **Atomic Icons**: Avoid inline SVGs for repeated icons. Extract them into reusable components (like `Logo`) or use `lucide-react`.

## 2. Design System & Theme Compliance
- **No Hardcoded Colors**: NEVER use `bg-black`, `text-white`, or hex codes like `#ccf32f` directly in components.
- **Semantic Variables**: Use Tailwind CSS semantic classes:
  - `bg-background`, `text-foreground`
  - `bg-primary`, `text-primary-foreground`
  - `bg-card`, `border-border`
  - `text-muted-foreground`
- **Primary Color**: All main action buttons (except "Delete/Remove") must use `bg-primary`.
- **Dark Mode**: All components must be tested and functional in both Light and Dark modes. Use semantic classes to ensure automatic theme switching.

## 3. Localization (i18n)
- **Namespace Organization**: Locales must be split into responsibility-based files (e.g., `common`, `auth`, `dashboard`, `courts`).
- **Translation Keys**: Always use namespaced keys: `t('namespace:key')`.
- **Standard Wording**: Use "Cancelar" instead of "Desistir" for cancellation actions.

## 4. Asset Organization
- **Images**: All images must be placed in `src/assets/images/`.
- **Imports**: Use the `@/` alias for all imports (e.g., `@/assets/images/logo.png`).

## 5. Clean Code
- **No Comments**: Remove all code comments before committing. The code should be self-documenting through proper naming and component abstraction.
- **TypeScript**: Ensure proper type declarations for all props and state.
