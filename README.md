# ✦ Addis Eats

A premium Ethiopian food delivery web application built with React. Browse dishes, place orders, manage favorites, and track deliveries — all wrapped in a stunning golden-themed UI with dark mode support, GSAP scroll animations, and a fully-featured admin dashboard.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React** | UI component library |
| **React Router** | Client-side routing and navigation |
| **Zustand** | Lightweight global state management |
| **GSAP + ScrollTrigger** | Scroll-linked animations and entrance effects |
| **Radix UI** | Accessible, unstyled primitives (Select dropdown) |
| **Lucide React** | Icon library (used in Shadcn-style components) |
| **Vite** | Development server and build tool |
| **Vanilla CSS** | Custom design system with CSS variables |

---

## Project Structure

```
day35/
├── index.html                  # App entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── public/
│   └── menu-data.json          # Static dish catalog (base menu data)
└── src/
    ├── main.jsx                # React DOM root and app mount
    ├── App.jsx                 # Route definitions and provider wrappers
    ├── styles.css              # Complete design system and all styles
    │
    ├── api/
    │   └── dishes.js           # Menu category list and fetch helper
    │
    ├── hooks/
    │   └── useFetch.js         # Generic async data-fetching hook
    │
    ├── store/                  # Zustand global state stores
    │   ├── dishesStore.js      # Menu items (syncs base data + admin edits)
    │   ├── cartStore.js        # Shopping cart (add, remove, quantities)
    │   ├── favoritesStore.js   # Favorite dish IDs (localStorage persisted)
    │   ├── ordersStore.js      # Placed orders list and status management
    │   ├── authStore.jsx       # User authentication state
    │   └── toastStore.js       # Global toast notification messages
    │
    ├── auth/
    │   └── AuthContext.jsx     # Legacy auth context provider (wraps authStore)
    │
    ├── components/
    │   ├── Layout.jsx          # Root layout — header, footer, mobile menu, toast
    │   └── DishCard.jsx        # Reusable dish card (standard + premium variants)
    │
    ├── pages/
    │   ├── Home.jsx            # Landing page — hero, specials, values, CTA
    │   ├── Menu.jsx            # Full menu with category filters and search
    │   ├── DishDetail.jsx      # Single dish view with add-to-cart
    │   ├── Favorites.jsx       # User's saved favorite dishes
    │   ├── Cart.jsx            # Shopping cart with quantity controls
    │   ├── Checkout.jsx        # Delivery form and order placement
    │   ├── OrderHistory.jsx    # List of past orders with status tracking
    │   ├── Login.jsx           # User sign-in / sign-up page
    │   ├── AdminDashboard.jsx  # Admin home — stats overview + tab navigation
    │   ├── AdminLogin.jsx      # Admin authentication page
    │   └── NotFound.jsx        # 404 fallback page
    │
    ├── admin/
    │   ├── AdminAuthContext.jsx # Admin authentication context provider
    │   ├── AdminLayout.jsx     # Admin section layout wrapper
    │   ├── AdminMenu.jsx       # Dish management — add, edit, delete, availability
    │   └── AdminOrders.jsx     # Order management — status updates, deletion
    │
    └── ui/
        ├── ErrorBoundary.jsx   # React error boundary for crash recovery
        ├── Select.jsx          # Shadcn-inspired Radix UI select dropdown
        └── States.jsx          # Reusable loading spinner, error, and empty states
```

---

## Key Files Explained

### Entry & Configuration

| File | Description |
|---|---|
| `index.html` | Single HTML shell that mounts the React app |
| `vite.config.js` | Vite dev server and build configuration |
| `main.jsx` | Creates the React root and renders `<App />` |
| `App.jsx` | Defines all routes (`/`, `/menu`, `/cart`, `/admin`, etc.) and wraps the app in context providers |

### Design System

| File | Description |
|---|---|
| `styles.css` | The entire design system in a single file. Contains CSS variables (colors, fonts, spacing), component styles, responsive breakpoints, dark mode overrides, GSAP-compatible animation helpers, the premium mobile menu overlay, and admin dashboard styles |

### Data Layer

| File | Description |
|---|---|
| `public/menu-data.json` | The base dish catalog loaded at runtime. Contains dish IDs, names, categories, prices, descriptions, images, and tags |
| `api/dishes.js` | Exports the `fetchDishes()` function and the `categories` array used for menu filtering |
| `hooks/useFetch.js` | A generic hook that takes an async function and returns `{ data, loading, error }` — used as a fallback fetcher |

### State Management (Zustand Stores)

| Store | Description |
|---|---|
| `dishesStore.js` | **Central menu store.** Fetches `menu-data.json`, then merges in any admin modifications (additions, edits, deletions) stored in `localStorage`. All pages (Home, Menu, Favorites, DishDetail) read from this single source of truth |
| `cartStore.js` | Manages cart items, quantities, and totals. Persisted to `localStorage` so the cart survives page refreshes |
| `favoritesStore.js` | Stores an array of favorite dish IDs. Persisted to `localStorage` |
| `ordersStore.js` | Stores placed orders with customer info, items, timestamps, and status. Supports status updates and deletion (used by both the customer order history and the admin panel) |
| `authStore.jsx` | Manages user sign-in/sign-out state. Persisted to `localStorage` |
| `toastStore.js` | A simple store that holds a single toast message string. When set, the global toast notification appears and auto-dismisses |

### Pages

| Page | Route | Description |
|---|---|---|
| `Home.jsx` | `/` | Landing page with an animated hero section (looping word rotator), daily specials grid, brand values, and a call-to-action banner. Uses GSAP ScrollTrigger for entrance animations |
| `Menu.jsx` | `/menu` | Full dish catalog with a search bar, category filter tabs, and a responsive grid of dish cards |
| `DishDetail.jsx` | `/menu/:id` | Detailed view of a single dish with full description, price, and add-to-cart functionality |
| `Favorites.jsx` | `/favorites` | Displays only the dishes the user has hearted. Shows an empty state with a link to the menu if none are saved |
| `Cart.jsx` | `/cart` | Shopping cart with quantity increment/decrement, item removal, subtotal calculation, and a checkout button |
| `Checkout.jsx` | `/checkout` | Delivery form (name, phone, address with example placeholder) that creates an order and shows a confirmation page |
| `OrderHistory.jsx` | `/orders` | Lists all placed orders with their status, items, and timestamps |
| `Login.jsx` | `/login` | User authentication form with sign-in and sign-up modes |
| `AdminDashboard.jsx` | `/admin` | Admin overview with stat cards (total dishes, orders, revenue) and tab navigation to Menu and Orders management |
| `AdminLogin.jsx` | `/admin/login` | Separate admin authentication gate |
| `NotFound.jsx` | `*` | 404 page shown for unmatched routes |

### Admin Panel

| File | Description |
|---|---|
| `AdminAuthContext.jsx` | Provides admin authentication state (login/logout) via React Context |
| `AdminLayout.jsx` | Wraps admin pages with the admin navigation and auth guard |
| `AdminMenu.jsx` | Full dish CRUD — search dishes, add new dishes via a glassmorphism modal, edit existing dishes, toggle availability (Sold Out), and delete. All changes sync instantly to the storefront via `dishesStore` |
| `AdminOrders.jsx` | Order management — view all placed orders, update status (New → Preparing → Delivering → Delivered / Cancelled) using a Shadcn-style Radix UI dropdown, and delete orders. Includes GSAP entrance animations |

### Reusable Components

| File | Description |
|---|---|
| `Layout.jsx` | The root layout rendered on every page. Contains the site header (logo, desktop nav links, theme toggle, cart badge), a premium sliding mobile menu overlay (with numbered links, action buttons, and brand tagline), the page outlet, the full site footer, and the global toast notification |
| `DishCard.jsx` | Renders a single dish as a card. Supports two variants: **standard** (image, name, price, view link, add-to-cart) and **premium** (large hero image with overlay text). Handles favorites toggling, sold-out state, and toast notifications |

### UI Primitives

| File | Description |
|---|---|
| `Select.jsx` | A Shadcn-inspired accessible dropdown built on `@radix-ui/react-select`. Used in the admin order status management. Features custom styling, hover highlights, and check indicators |
| `States.jsx` | Three small utility components: `Spinner` (loading indicator), `ErrorMessage` (error display), and `EmptyState` (no-content placeholder) |
| `ErrorBoundary.jsx` | A React error boundary that catches rendering crashes and displays a fallback UI instead of a blank screen |

---

## Features

- **Golden Design System** — A cohesive warm palette with CSS variables, dark mode, and golden accents throughout
- **GSAP Scroll Animations** — Elements animate into view on scroll and fade out when scrolling away
- **Premium Mobile Menu** — A sliding side-panel overlay with numbered links, blurred backdrop, and smooth transitions
- **Admin Dashboard** — Full dish CRUD (add, edit, delete, availability toggle) with real-time storefront sync
- **Shadcn-style Dropdowns** — Radix UI-powered accessible select menus for order status management
- **Cart & Checkout** — Add items, adjust quantities, fill in delivery details, and place orders
- **Favorites** — Heart any dish to save it. Count badge shown in the navbar
- **Order Tracking** — View past orders and their current status
- **Toast Notifications** — Contextual confirmations for cart, favorites, and admin actions
- **Dark Mode** — Full dark theme toggle that persists across sessions
- **Responsive Design** — Optimized for desktop, tablet, and mobile breakpoints
