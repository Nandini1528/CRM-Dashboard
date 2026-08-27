# 📇 Rolodex — Advanced CRM Dashboard

*A customer management dashboard with advanced filtering, real-time search, and full CRUD, built for speed and clarity when managing hundreds of contacts.*

<p align="center">
  <a href="https://your-deployment-url.vercel.app">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Website-success?style=for-the-badge" />
  </a>
  <a href="https://github.com/Nandini1528/CRM-Dashboard">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white"/>
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square"/>
  <img src="https://img.shields.io/badge/TanStack_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white"/>
  <img src="https://img.shields.io/badge/dnd--kit-764ABC?style=flat-square"/>
</p>

---

## Overview

Rolodex is a customer relationship management dashboard built to make searching, filtering, and managing large contact lists fast and frictionless.

Rather than a bare CRUD table, Rolodex focuses on the workflows people actually repeat all day searching by name or company, narrowing by status or date range, saving frequently-used filter combinations, and updating customer records without losing their place. The interface adapts cleanly between desktop and mobile, with a dark/light theme that stays legible in both.

---

## Live Demo

🔗 **Try Rolodex:** **[your-deployment-url.vercel.app](https://your-deployment-url.vercel.app)**

No installation required to explore the application.

---

## Preview

### Customer List & Search
<p align="center">
  <img src="./docs/list-view.png" width="900"/>
</p>
<!-- TODO: add screenshot -->

### Advanced Filters Panel
<p align="center">
  <img src="./docs/filters.png" width="900"/>
</p>
<!-- TODO: add screenshot -->

### Customer Details
<p align="center">
  <img src="./docs/details.png" width="900"/>
</p>
<!-- TODO: add screenshot -->

### Dark Mode
<p align="center">
  <img src="./docs/dark-mode.png" width="900"/>
</p>
<!-- TODO: add screenshot -->

---

## Features

- 🔍 Real-time search by name, email, or company
- 🎛️ Advanced multi-type filter panel (status, company, date range, phone, email)
- 💾 Save and reorder custom filter combinations via drag-and-drop
- 📊 Sortable, paginated customer table (10 / 25 / 50 per page)
- 👤 Full customer CRUD with inline form validation
- ⚡ Optimistic UI updates powered by TanStack Query
- ✅ Bulk actions — select multiple, bulk status update, bulk delete
- 📤 Export filtered customers as CSV
- 🌓 Dark / light mode toggle
- ⏱️ Debounced search for performance
- 📈 Dashboard overview with summary stats
- 📱 Fully responsive across desktop and mobile

---

## Objectives

- Make filtering and searching large contact lists fast and intuitive
- Keep the UI dense with information without feeling cluttered
- Demonstrate clean data-fetching architecture with proper caching and optimistic updates
- Ensure the experience holds up equally well on mobile and desktop

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

### Data & State
- TanStack Query (React Query)
- dnd-kit (drag-and-drop)

### Tools
- Git
- GitHub
- Vercel

---

## Project Structure

```text
CRM-Dashboard/
│
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── customers/
│   │   ├── BulkActionBar.tsx
│   │   ├── BulkDeleteDialog.tsx
│   │   ├── CustomerAvatar.tsx
│   │   ├── CustomerDetails.tsx
│   │   ├── CustomerFilters.tsx
│   │   ├── CustomerForm.tsx
│   │   ├── CustomerPagination.tsx
│   │   ├── CustomerSearchInput.tsx
│   │   ├── CustomerTable.tsx
│   │   ├── DashboardOverview.tsx
│   │   ├── DeleteCustomerDialog.tsx
│   │   └── SortableSavedFilterItem.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── checkbox.tsx
│       ├── command.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input-group.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── popover.tsx
│       ├── select.tsx
│       ├── sheet.tsx
│       ├── sonner.tsx
│       └── textarea.tsx
│
├── data/
│   └── customers.ts
│
├── hooks/
│   ├── useCustomerMutations.ts
│   ├── useCustomers.ts
│   ├── useDebounce.ts
│   ├── useHasMounted.ts
│   ├── useIsMobile.ts
│   ├── useSavedFilters.ts
│   └── useSelection.ts
│
├── lib/
│   ├── api.ts
│   ├── avatar.ts
│   ├── csv-export.ts
│   ├── navigation-context.tsx
│   └── utils.ts
│
├── types/
│   └── customer.ts
│
├── public/
│   ├── file.svg
│   ├── globe.svg
│   └── next.svg
│
├── README.md
└── .gitignore
```

---

## Installation

### Clone the repository

```bash
git clone https://github.com/Nandini1528/CRM-Dashboard.git
```

### Navigate into the project

```bash
cd CRM-Dashboard
```

### Install dependencies

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

### Create a production build

```bash
npm run build
npm start
```

---

## System Approach

Customer data is managed entirely through TanStack Query, with mutations (`create`, `update`, `delete`) applying optimistic updates so the UI reflects changes instantly, then rolling back automatically if a request fails.

Search, filters, sorting, and pagination are all composed client-side, and saved filter combinations persist via `localStorage`, scoped per browser. The layout is fully responsive, with the sidebar collapsing into a mobile drawer and dialogs adapting their spacing at smaller breakpoints, rather than switching to a separate mobile-only layout.

---

## Future Improvements

- Server-backed persistence for customers and saved filters
- Automated test suite (unit + e2e)
- Keyboard shortcuts (e.g. Cmd+K to open filters)
- Full optimistic updates for create/update, not just delete
- Resume/undo for bulk delete actions

---

## Author

**Nandini Dipak Tekwade**

Full-Stack Developer • MERN Stack • UI/UX Enthusiast • AI

**GitHub:** https://github.com/Nandini1528

**LinkedIn:** www.linkedin.com/in/nandini-tekwade

---

## 📄 License

This project is licensed under the MIT License.
