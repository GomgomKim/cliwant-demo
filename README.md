# Next.js with Feature-Sliced Design

This project is a Next.js application structured according to Feature-Sliced Design (FSD) methodology.

## Project Structure

```
src/
├── app/             # App Router pages and layouts
├── entities/        # Business entities (users, products, etc.)
├── features/        # User scenarios and processes
├── pages/           # (optional) Pages directory for additional routing
├── shared/          # Reusable infrastructure
│   ├── api/         # API clients and methods
│   ├── config/      # Global configuration
│   ├── lib/         # Utility functions and helpers
│   ├── types/       # TypeScript type definitions
│   └── ui/          # UI components
└── widgets/         # Composite components for pages
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

- [Feature-Sliced Design](https://feature-sliced.design/) - Learn about FSD methodology
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

## Architecture Decisions

This project follows the Feature-Sliced Design methodology to create a modular, scalable architecture:

1. **Slices**: The codebase is divided into horizontal layers (app, widgets, features, entities, shared)
2. **Segments**: Each layer is divided into segments to group related functionality
3. **Public API**: Only exports what's needed through index files
4. **Unidirectional Dependencies**: Higher layers can import from lower layers but not vice versa

This structure helps maintain separation of concerns and makes the codebase more maintainable.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
