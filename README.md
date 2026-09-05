# Trovio — Campus Lost & Found Network 🧭
> **Front End Engineering Course Project (SPA)**  
> Built by Student Engineering Team (3-4 Members) | Evaluated under Academic Rubrics

---

## 📖 1. Project Overview & Vision
**Trovio** is a clean, production-ready React (Vite) Single-Page Application (SPA) designed to solve the campus lost-and-found problem. It connects students, faculty, and campus security through a centralized, searchable, and responsive digital registry.

### Core Capabilities:
1. **Report Lost Items:** Dedicated, fast form with item category, detailed descriptions, date picker, optional reward note, and contact channels.
2. **Report Found Items:** Streamlined form to log discovered belongings with category, description, date, and finder contact details.
3. **Lost & Found Directory:** Instant keyword search, category filters (Electronics, IDs, Books, Calculators, Keys, Bags), report type tabs (*All*, *Lost*, *Found*), status filters (*All*, *Active*, *Resolved*), and sorting.
4. **Item Details & Ownership Resolution:** Comprehensive view for every item. Authors can **"Mark as Resolved"** (updating status with resolution notes) or delete postings. Non-authors can contact finders/losers via email or WhatsApp.
5. **Authentication & "My Reports" Dashboard:** Student sign in/sign up with persistent accounts and a dashboard to monitor, resolve, and manage reports.

---

## 🎯 2. Academic Rubric Compliance Matrix

| Academic Rubric Requirement | How Trovio Satisfies the Rubric | Relevant Code Locations |
| :--- | :--- | :--- |
| **Semantic HTML5** | Uses `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<aside>`, `<time>`, `<address>`, `<fieldset>`, `<legend>` | `src/components/layout/`, `src/pages/` |
| **Vanilla CSS & Design Tokens** | Pure CSS variables (`--color-primary`, `--color-lost`, `--color-found`, `--shadow-lg`, `--radius-md`), flexbox, grid, zero CSS bloat | `src/index.css`, `src/App.css` |
| **Functional Components & JSX** | 100% Modern React functional components with clean JSX syntax and modular separation | `src/components/`, `src/pages/` |
| **Props & State Management** | Clear prop typing, `useState` for local component state, `useMemo` for search/filter algorithms | `src/pages/ItemsDirectory.jsx`, `ItemCard.jsx` |
| **React Hooks & Lifecycle** | `useState`, `useEffect` for syncing with storage and window scroll, custom hooks (`useAuth`, `useItems`) | `src/context/AuthContext.jsx`, `src/context/ItemContext.jsx` |
| **Client-Side Routing** | `react-router-dom` v7 with `BrowserRouter`, `Routes`, `Route`, `useNavigate`, `useParams`, `useSearchParams`, `NavLink` | `src/App.jsx`, `src/components/layout/Navbar.jsx` |
| **State Persistence** | Synchronized with browser `localStorage` (`trovio_items`, `trovio_current_user`, `trovio_users`) across page refreshes | `src/utils/storage.js` |

---

## 📂 3. Folder & File Architecture

```text
trovio/
├── public/
│   ├── favicon.svg             # Branded SVG compass favicon
│   └── ...
├── src/
│   ├── assets/                 # Static media & assets
│   ├── components/
│   │   ├── common/
│   │   │   ├── ItemCard.jsx    # Semantic <article> item card with quick resolve
│   │   │   └── Stats.jsx       # Dynamic live metric counters
│   │   └── layout/
│   │       ├── Navbar.jsx      # Semantic <header> & <nav> with responsive drawer
│   │       └── Footer.jsx      # Semantic <footer> with emergency hotline & viva reset
│   ├── context/
│   │   ├── AuthContext.jsx     # User authentication state & session persistence
│   │   └── ItemContext.jsx     # Global items state, CRUD & "Mark as Resolved" logic
│   ├── pages/
│   │   ├── Landing.jsx         # Hero section, quick search, recent items & guide
│   │   ├── ItemsDirectory.jsx  # Search bar, category filter, tabs & status toggles
│   │   ├── ReportLost.jsx      # Validated submission form for missing belongings
│   │   ├── ReportFound.jsx     # Validated submission form for turned-in items
│   │   ├── ItemDetails.jsx     # Route /items/:id with owner controls & resolution modal
│   │   ├── SignIn.jsx          # Login screen + 1-Click Viva Demo credentials
│   │   ├── SignUp.jsx          # New student registration
│   │   └── MyReports.jsx       # Student dashboard with active/resolved management
│   ├── utils/
│   │   ├── mockData.js         # Realistic campus seed data (MacBook, ID, Keys, etc.)
│   │   └── storage.js          # LocalStorage abstraction wrapper
│   ├── App.jsx                 # Client-side router & provider hierarchy
│   ├── App.css                 # Comprehensive styling, micro-animations & responsive queries
│   ├── index.css               # Global CSS variables, typography & reset
│   └── main.jsx                # React root mount
├── index.html                  # Accessible HTML5 document with Google Fonts
├── package.json                # Project dependencies & npm scripts
└── vite.config.js              # Vite configuration
```

---

## 👥 4. Team Member Viva Allocation Guide (For 3-4 Students)

If dividing presentation responsibilities for the course viva examination:

- **Member 1 (Architecture, Layout & Routing):**
  - Explains `src/App.jsx`, `src/components/layout/Navbar.jsx`, `Footer.jsx`.
  - Discusses `react-router-dom` routing (`/`, `/directory`, `/report-lost`, `/report-found`, `/items/:id`, `/my-reports`).
  - Explains how semantic HTML5 tags (`<header>`, `<nav>`, `<footer>`) improve accessibility and SEO.
- **Member 2 (State Persistence & React Context API):**
  - Explains `src/context/AuthContext.jsx`, `ItemContext.jsx`, and `src/utils/storage.js`.
  - Details how `useState` triggers reactive re-renders and `useEffect` synchronizes mutations with `localStorage`.
  - Demonstrates state surviving browser hard-refreshes (F5).
- **Member 3 (Forms, Validation & User Interactions):**
  - Explains `ReportLost.jsx` and `ReportFound.jsx`.
  - Discusses controlled inputs, form validation logic, dynamic error display, and image preview fallbacks.
  - Demonstrates how new reports immediately update the central directory.
- **Member 4 (Directory Filtering, Item Resolution & Dashboard):**
  - Explains `ItemsDirectory.jsx`, `ItemDetails.jsx`, and `MyReports.jsx`.
  - Explains `useMemo` for high-performance multi-criteria search filtering (type, category, status, keywords).
  - Demonstrates the **"Mark as Resolved"** feature, ownership verification, and status badge transitions.

---

## ⚡ 5. Getting Started & Running Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### 1. Install dependencies:
```bash
npm install
```

### 2. Start the development server:
```bash
npm run dev
```

### 3. Open in Browser:
Visit `http://localhost:5173` (or the port displayed in terminal).

### 4. Build for Production:
```bash
npm run build
```

---

## 🧪 6. Quick Viva Evaluation Demo Script

For the smoothest demonstration during evaluation:

1. **Check Initial Seed Data:**
   - On the homepage, notice the real-time dynamic statistics (*Campus Reports*, *Items Reunited*, *Active Inquiries*, *Recovery Rate*).
2. **Search & Filter:**
   - Go to **Browse Directory**.
   - Type `"MacBook"` or click the **"Electronics"** category filter.
   - Switch between **"Lost"** and **"Found"** tabs to test instant reactivity.
3. **Inspect Item Details:**
   - Click on **"HP Pavilion 14-inch Laptop"** (`/items/item_101`).
   - Notice the status: *ACTIVE SEARCH*.
4. **Test "Mark as Resolved" (Ownership Feature):**
   - Click the user avatar in the Navbar. Aarav Sharma is pre-authenticated!
   - Since Aarav owns the laptop listing, notice the **"Mark as Resolved"** button on the top banner.
   - Click **"Mark as Resolved"**, enter a note (*e.g. "Recovered from hostel"*), and confirm.
   - Notice how the banner immediately transforms to vibrant green *RESOLVED*, and the live stats counter updates.
   - Refresh the browser (Ctrl+R / Cmd+R) to prove **persistence in LocalStorage**.
5. **Manage "My Reports":**
   - Click **"My Reports"** in the top navigation.
   - View your active vs resolved listings. Test the **"Reopen"** or **"Delete"** controls.
6. **Switch User with 1-Click:**
   - Click user dropdown or go to **Sign In**.
   - Click **Ananya Iyer (ECE Demo)**.
   - Notice "My Reports" now instantly shows Ananya's reports (*Casio Calculator* & *Wildcraft Backpack*).
