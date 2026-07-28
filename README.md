# Hotel Service Management Dashboard

A modern Hotel Service Management Dashboard built with React, TypeScript, and scalable frontend architecture patterns.
This project is a frontend implementation of a hotel staff dashboard that helps employees monitor guest service requests, manage order workflows, track SLA issues, and handle daily operations efficiently.

## Project Overview

The dashboard is designed for hotel staff who need a centralized interface to:

- Monitor current hotel operations
- View pending guest requests
- Search and filter service orders
- Process order lifecycle changes
- Identify SLA violations
- Handle failed payment situations

The application uses a mock API layer to simulate real backend communication while demonstrating frontend architecture, state management, and user experience decisions.

## Links

Live Demo:
[https://your-vercel-url.vercel.app](https://test-cmpnion.vercel.app/)

Repository:
[https://github.com/username/hotel-dashboard](https://github.com/dedikusniadi2026/test-CMPNION)

## Features

### Dashboard Overview
- **6 Key Metrics Cards** — Active Guests, Pending Orders, Revenue Today, Completed Orders, Average Order Value, Top Selling Service
- **Animated Counters** — Numbers animate on load with smooth transitions
- **Trend Indicators** — Percentage changes with up/down arrows
- **Interactive Hover States** — Cards lift with subtle shadows

### Charts & Analytics
- **Revenue Overview** — 30-day revenue area chart with gradient fill
- **Orders by Service** — Donut chart showing service category distribution
- **Order Status Distribution** — Horizontal bar chart with color-coded statuses
- **Weekly Orders** — Dual-axis bar chart comparing orders and revenue

### Order Management
- **Professional Data Table** — Sortable, filterable, paginated
- **Multi-criteria Search** — Real-time search by guest name, room number, or order ID
- **Advanced Filters** — Status, Service Category, Payment Status (combinable)
- **Sort Options** — Newest, Oldest, Highest/Lowest Amount
- **Column Sorting** — Click table headers (Order Time, Amount) to sort asc/desc
- **URL-based State** — Filters persist in URL query parameters
- **Pagination** — With page numbers, ellipsis, range indicator (e.g. "1-10 of 50"), and page size selector (5/10/15/20)

### Order Details Drawer
- **Slide-in Panel** — Smooth animated drawer (not a modal)
- **Guest Information** — Name, room, email, phone, check-in/out dates
- **Service Details** — Item, category, quantity, unit price, total
- **Special Requests** — Highlighted amber callout box
- **Status Timeline** — Visual timeline with colored dots and timestamps

### Order Lifecycle
- **5 Status States** — New → Acknowledged → In Progress → Completed / Cancelled
- **Optimistic Updates** — Instant UI feedback with server reconciliation
- **Contextual Actions** — Only relevant buttons shown per status

### SLA Monitoring
- **15-Minute Threshold** — Orders waiting too long get visual indicators
- **Red Border Pulse** — Blinking red left border for breached SLA
- **Warning Badge** — Priority clock icon for overdue orders

### Real-Time Simulation
- **Auto-generated Orders** — New orders appear every 20-30 seconds
- **Toast Notifications** — Sonner toasts with guest name and room number
- **Notification Center** — Bell icon with badge count, dropdown panel

### User Experience
- **Dark/Light Mode** — System-aware with manual toggle
- **Command Palette** — ⌘K / Ctrl+K to search and navigate
- **Skeleton Loaders** — Animated placeholders during data loading
- **Empty States** — Beautiful illustrations when no data
- **Error States** — Friendly error messages with retry button
- **Keyboard Navigation** — ARIA labels, focus management

### Responsive Design
- **Desktop** — Full sidebar, top navbar, multi-column layouts
- **Tablet** — Collapsed sidebar, adjusted grid
- **Mobile** — Drawer navigation, stacked cards, horizontal scroll table

## Architecture

```
src/
├── app/                    # App providers & configuration
├── api/                    # API service layer
├── components/
│   ├── ui/                 # Reusable UI primitives (Button, Badge, Card, etc.)
│   ├── dashboard/          # Dashboard-specific components
│   ├── orders/             # Order management components
│   ├── charts/             # Recharts wrapper components
│   └── common/             # Shared components (CommandPalette)
├── pages/                  # Route page components
├── layouts/                # Layout components (Sidebar, TopNav, etc.)
├── hooks/                  # Custom React hooks (TanStack Query wrappers)
├── services/               # Service layer (reserved for future use)
├── store/                  # Zustand UI state management
├── routes/                 # React Router configuration
├── types/                  # TypeScript type definitions
├── constants/              # Application constants
├── lib/                    # Utility functions
├── mock/                   # Mock data & API simulation
└── assets/                 # Static assets
```

### State Management
- **TanStack Query** — Server state (orders, stats, charts) with caching, refetching, and optimistic updates
- **Zustand** — UI state (sidebar, theme, filters, notifications, command palette)

### Data Flow
1. Components call custom hooks (e.g., `useOrders()`)
2. Hooks use TanStack Query to fetch from API service layer
3. API service layer calls mock API functions
4. Mock API functions simulate network delay and random failures
5. UI state (filters, theme) flows through Zustand store
6. URL search params sync with filter state for shareable URLs

## Technical Trade-offs

### Mock API Instead of Backend

Decision:
The assignment focuses on frontend engineering, therefore a mock API layer was used.
Benefits:
- Faster development
- Independent frontend workflow
- Easy backend replacement

### Client-side Filtering
Decision:
Filtering is handled on the client because the dataset is small.

For production scale:
- Move filtering and pagination server-side
- Add database indexing
- Optimize API queries

### Zustand Instead of Redux
Decision:
The application only requires lightweight UI state management.
Zustand provides:
- Less boilerplate
- Simple API
- Good performance

## API & Data Approach
The application uses a mock API service layer to simulate backend communication.
Architecture:

Component
↓
Custom Hooks
↓
TanStack Query
↓
API Service Layer
↓
Mock API

The mock API provides:

- Simulated network delay
- Random request failures
- Loading states
- Error handling
- Retry behaviour
- Optimistic updates

For production integration, the mock functions can be replaced with REST API calls without changing the component layer.

## 📝 Assumptions

- Hotel staff already have access to the dashboard
- Authentication is outside the scope of this assignment
- Data is currently simulated through mock services
- Order volume is assumed to be manageable on the client side
- Backend validation and permissions would be handled server-side

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | UI Framework |
| **TypeScript 6** | Type Safety |
| **Vite 8** | Build Tool |
| **Bun** | Package Manager & Runtime |
| **TailwindCSS 4** | Utility-first CSS |
| **TanStack Query 5** | Server State Management |
| **Zustand 5** | UI State Management |
| **React Router 7** | Routing |
| **React Hook Form + Zod** | Form Validation |
| **Framer Motion 12** | Animations |
| **Recharts 3** | Charts |
| **Lucide React** | Icons |
| **Sonner** | Toast Notifications |
| **dayjs** | Date Formatting |
| **clsx + tailwind-merge** | Classname Utilities |

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) v1.0+ installed

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd hotel-dashboard

# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

### Running Tests

```bash
# Run all tests
bun run test

# Run a specific test file
bun test src/__tests__/utils.test.ts

# Run tests with coverage
bun test --coverage
```

## Deployment

The application is deployed as a static frontend application.

Build output:

dist/

Supported platforms:

- Vercel
- Netlify
- Static hosting providers

No server-side runtime is required — the app is fully client-side. The mock API layer runs in the browser, so the built app works immediately without a backend.

> **Note:** To connect a real backend, update the service functions in `src/api/orders.ts` to call your actual API endpoints instead of the mock functions.

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Type-check and build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run test` | Run unit tests with Bun test runner |

## Design Decisions

### Why TailwindCSS over CSS-in-JS?
Performance-first approach with zero runtime cost. Tailwind's utility classes enable rapid prototyping while maintaining consistency through design tokens.

### Why TanStack Query for Server State?
It provides automatic caching, background refetching, optimistic updates, and error handling out of the box — reducing boilerplate significantly compared to manual fetch + useState patterns.

### Why Zustand over Redux?
Zustand offers a simpler API with less boilerplate while being just as performant. Perfect for UI state that doesn't need Redux's middleware ecosystem.

### Why Framer Motion?
Declarative animation API that integrates seamlessly with React. Used for page transitions, hover effects, drawer animations, and presence animations.

### Why Mock API Layer?
Allows full development and testing without backend dependencies. The service layer is structured so swapping mock for real API requires minimal changes — just update the `api/` functions.


## Next Day Improvements

If given additional development time, I would improve:

- Add authentication and role-based access
- Replace mock API with real backend integration
- Add WebSocket-based notifications
- Improve test coverage
- Add E2E testing
- Add performance monitoring
- Add server-side pagination for large datasets

## Future Improvements

- [ ] **Authentication & Authorization** — Login flow with role-based access (staff, admin, manager)
- [ ] **Real WebSocket Connection** — Replace simulated real-time with actual WebSocket/server-sent events
- [ ] **Service Management CRUD** — Full create/update/delete for hotel services
- [ ] **Guest Profiles** — Detailed guest history, preferences, and loyalty status
- [ ] **Reporting Module** — Exportable reports (PDF/CSV) with date range picker
- [ ] **Multi-language Support** — i18n with react-intl
- [ ] **Drag & Drop** — Kanban board view for order management
- [ ] **Print Receipts** — Printable order receipts for guest billing
- [x] **Unit Tests** — 103 tests with Bun test runner (API, store, utils, constants, hooks)
- [ ] **E2E Tests** — Playwright for critical user flows
- [ ] **PWA** — Offline support and installable app
- [ ] **Performance Monitoring** — Web Vitals instrumentation
- [ ] **Accessibility Audit** — WCAG 2.1 AA compliance

## 📄 License

MIT
