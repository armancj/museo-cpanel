# Development Guidelines for Museo-CPanel

This document provides guidelines and information for developers working on the Museo-CPanel project.

## Build/Configuration Instructions

### Prerequisites
- Node.js (version compatible with Next.js 15.2.3)
- pnpm (recommended) or npm

### Environment Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
   or
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Copy `sample.env` to `.env`
   - Update the values as needed
   - The main environment variable is `NEXT_PUBLIC_API_BASE_URL` which should point to your API server

### Development Server
Run the development server:
```bash
pnpm dev
```
or
```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

### Building for Production
Build the application for production:
```bash
pnpm build
```
or
```bash
npm run build
```

Start the production server:
```bash
pnpm start
```
or
```bash
npm run start
```

## Testing Information

### Testing Framework
The project uses Playwright for end-to-end testing.

### Running Tests
To run all tests:
```bash
pnpm test
```
or
```bash
npm run test
```

### Adding New Tests
1. Create test files in the `tests` directory with the `.spec.ts` extension
2. Use the Playwright API to write tests
3. Follow the example in `tests/home.spec.ts`

### Example Test
Here's a simple test that checks if the homepage loads correctly:

```typescript
import { test, expect } from '@playwright/test';

test('homepage has title and links', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');
  
  // Expect the page to have a title
  await expect(page).toHaveTitle(/Museo/);
  
  // Check if the page contains some expected text or elements
  const content = await page.textContent('body');
  expect(content).toBeTruthy();
});
```

### Test Configuration
The Playwright configuration is in `playwright.config.ts`. Key settings include:
- Test directory: `./tests`
- Timeout: 30 seconds
- Base URL: `http://localhost:3000`
- Web server command: `npm run dev`

## Additional Development Information

### Code Style
The project uses ESLint and Prettier for code linting and formatting.

#### Prettier Configuration
- Tab Width: 4 spaces
- No trailing commas
- Semicolons: Yes
- Single quotes: Yes
- Print width: 250 characters
- Brackets on new line

#### Running Linting and Formatting
- To lint the code: `pnpm lint` or `npm run lint`
- To format the code: `pnpm format` or `npm run format`

### Project Structure
- `app/`: Next.js application code
  - `(main)/`: Main application routes
  - `(full-page)/`: Full-page routes (like auth pages)
- `layout/`: Layout components
- `types/`: TypeScript type definitions
- `public/`: Static assets
- `styles/`: Global styles
- `tests/`: Test files

### API Integration
The application connects to an API server specified by the `NEXT_PUBLIC_API_BASE_URL` environment variable. Make sure this is correctly configured before starting development.
