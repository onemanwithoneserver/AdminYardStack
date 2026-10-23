# Admin YardStack

A high-performance modern web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and **Lucide React**.

---

## 🌟 Features

- **Header Component (`src/components/Header.tsx`)**:
  - Displays brand name: **Admin YardStack**.
  - **Desktop / Mobile Toggle**: Toggles between desktop and mobile routes dynamically.
  - **View Dropdown**: Displays only **`Projects`** as the active view option.
  - **Close Action**: Closes the header.
- **Top Header Access via Ctrl+M**:
  - Closed/hidden by default for an unobstructed viewport.
  - Accessible and toggled via **`Ctrl+M`** keyboard shortcut (or via floating toggle button).
- **Separate Desktop & Mobile Routes**:
  - **Desktop Route**: `/desktop/Projects` (or `/desktop/:folder`)
  - **Mobile Route**: `/mobile/Projects` (or `/mobile/:folder`)
  - Both routes end with the target folder name (**`Projects`**).
- **Mobile Viewport Simulator (`src/components/MobileViewport.tsx`)**:
  - Authentic mobile device simulator with container constraints (`max-w-[430px]`, shadows, rounded corners).
- **Dropdown Component (`src/components/Dropdown.tsx`)**:
  - Animated dropdown menu powered by `framer-motion`.
- **Pure Router (`src/App.tsx`)**:
  - Configures separate desktop and mobile routes via `react-router-dom`.
- **Projects Store (`src/Projects/`)**:
  - Empty data store.
- **Automated Comment Removal Logic (`scripts/remove-comments.js`)**:
  - Removes comments automatically via `npm run remove-comments`.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Production Build
```bash
npm run build
```

### 4. Remove Comments Automatically
```bash
npm run remove-comments src
```

---

## 📁 Routes

| Viewport | Route URL | Target Folder |
|---|---|---|
| **Desktop** | `/desktop/Projects` | `Projects` |
| **Mobile** | `/mobile/Projects` | `Projects` |
