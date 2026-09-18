# Flow — Task Management & To-Do Dashboard
> A modern, production-grade Angular 21 task dashboard featuring interactive CDK Drag & Drop, Chart.js analytics, dark mode, and smart task alerts.

---

## 📌 Prompt for Claude (Copy & Paste to Generate Your Presentation)

> **Instructions for the presenter:**
> Copy the prompt below and send it to Claude. Claude will create a complete, professional slide deck presentation (including slide titles, visual layout ideas, bullet points, and speaker notes) based on the exact features and technical architecture of this app.

```markdown
You are an expert technical presenter and software architect.
I have built an Angular application called "Flow" (a Task Management & To-Do Dashboard).
Please create a professional, engaging 10-12 slide presentation deck based on the project documentation below.

For each slide, provide:
1. Slide Title & Subtitle
2. Recommended Visual / Layout Layout (e.g., side-by-side, 3 columns, metric cards, screenshot placeholder)
3. Key Content & Bullet Points (clear, concise, presentation-ready)
4. Speaker Notes (what I should say during the presentation, explaining both business value and technical implementation)

Here is the complete project information:
[Include the rest of this README below]
```

---

## 🎯 Executive Summary & Project Purpose

**Flow** is a comprehensive task management and productivity dashboard built with **Angular 21**. It was developed to showcase both core and modern advanced Angular design patterns:
- **Reactive State Management** using Angular Signals and RxJS observables.
- **Interactive Drag & Drop Kanban Board** using `@angular/cdk/drag-drop`.
- **Live Data Visualizations** powered by Chart.js (donut, bar, and trend charts).
- **Responsive & Accessible UI** with custom light & dark themes ("Lagoon" and "Ember").
- **Offline-Ready Local Storage** syncing all user actions with zero backend latency.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Angular 21** | Standalone components, modern control flow (`@if`, `@for`), Signals, reactive forms |
| **Interactivity** | **@angular/cdk/drag-drop** | Drag-and-drop Kanban board with custom animations and drop lists |
| **Data Viz** | **Chart.js 4** | Canvas-based charts (Status Donut, Priority Bars, 7-day Activity Trends) |
| **Styling** | **Custom CSS3 Design System** | Dual theme variables (Lagoon / Ember), CSS Grid, Flexbox, responsive layouts |
| **State & Storage** | **RxJS + LocalStorage API** | `BehaviorSubject` + Angular `toSignal()`, real-time syncing to `flow-tasks` |
| **Typography** | **Google Fonts** | *Sora* (display headers) and *Manrope* (interface & body text) |

---

## 🚀 Features Matrix & Implementation Details

### 1. Required Features (100% Implemented)
- **Add Task (`/tasks/add`)**: Reactive Angular form with strict validation (`title`, `description`, `status`, `priority`, `category`, `dueDate`).
- **Edit Task (`/tasks/edit/:id`)**: Pre-populated reactive form allowing seamless updates to all task metadata.
- **Delete Task**: Safe task removal with user confirmation dialog to prevent accidental deletion.
- **Task Title & Description**: Multi-line descriptions and titles, validated and indexed for search.
- **Strict Status Lifecycle**:
  - `Pending` (Tasks waiting to start)
  - `In Progress` (Tasks actively being worked on)
  - `Completed` (Tasks finished, recorded with `completedAt` timestamps)
- **Priority Categorization**:
  - `Low` (Green soft badge)
  - `Medium` (Amber/warning soft badge)
  - `High` (Coral/danger soft badge)

### 2. Additional Features (100% Implemented)
- **Full-Text Real-Time Search**: Filters tasks instantly across both title and description without page reloads.
- **Multi-Dimensional Filtering**: Real-time filtering by Status, Priority, and Category simultaneously.
- **Live Metric Counters**: Prominently displayed summary cards showing:
  - Total Tasks Counter
  - Completed Tasks Counter
  - Pending Tasks Counter
  - In Progress Counter
  - Overdue Counter
  - Overall Completion Rate percentage (`%`)
- **Offline LocalStorage Persistence**:
  - All additions, edits, deletions, toggles, and status transitions persist in browser `localStorage` (`flow-tasks`).
  - Includes sample data seeding and "Clear All (Start at 0)" capabilities.
- **Responsive Layout**:
  - Desktop: Collapsible sidebar rail.
  - Mobile/Tablet (`<= 900px`): Off-canvas navigation drawer with backdrop overlay and topbar hamburger menu.

### 3. Bonus Features (100% Implemented)
- **Interactive Drag & Drop Kanban Board (`/board`)**:
  - Built with `@angular/cdk/drag-drop`.
  - Three distinct status lanes: *Pending*, *In Progress*, and *Completed*.
  - Dragging a card across lanes immediately updates the task status, completion timestamp, and dashboard metrics.
  - Supports reordering within lanes and includes live search/priority filtering on the board.
- **Due Date & Overdue Intelligence Engine**:
  - Date picker integration with visual overdue indicators.
  - Real-time overdue alerts for overdue pending tasks.
- **Dark Mode ("Ember") & Light Mode ("Lagoon")**:
  - Dual theme system stored in `localStorage` (`flow-theme`).
  - Automatic detection of user's OS `prefers-color-scheme`.
  - Instant theme switching without layout shifts.
- **Interactive Dashboard Statistics (Chart.js)**:
  - **Status Breakdown**: Circular Donut chart with live task count in center.
  - **Priority Distribution**: Horizontal bar chart comparing workload urgency.
  - **Top Categories**: Breakdown of tasks by project areas.
  - **7-Day Trend Line Chart**: Tracks daily created vs. completed tasks.
- **Task Health & Stagnation Alerts (`/alerts`)**:
  - Dedicated view flagging overdue tasks, long-running tasks (>3 days active), and urgent pending tasks.
  - Quick action buttons: *Complete*, *Extend Due Date (+3 days)*, and *Delete*.

---

## 📂 Project Architecture & Folder Structure

```
src/
├── app/
│   ├── alerts/               # Overdue & stagnant task alert monitor
│   │   ├── alerts.ts
│   │   ├── alerts.html
│   │   └── alerts.css
│   ├── dashboard/            # Overview metrics, charts & recent activity
│   │   ├── dashboard.ts
│   │   ├── dashboard.html
│   │   └── dashboard.css
│   ├── models/               # TypeScript interfaces & types
│   │   └── task.model.ts     # Task, TaskDraft, TaskStats, TaskAlert types
│   ├── services/             # Core application state & services
│   │   ├── task.service.ts   # CRUD, LocalStorage, stats computation
│   │   ├── theme.service.ts  # Lagoon/Ember theme switcher & storage
│   │   └── ui.service.ts     # Mobile navigation drawer & sidebar collapse
│   ├── shared/               # Reusable chart components
│   │   ├── bar-chart/        # Chart.js Bar Chart component
│   │   ├── donut-chart/      # Chart.js Donut Chart component
│   │   └── trend-chart/      # Chart.js 7-Day Activity Trend component
│   ├── sidebar/              # Responsive navigation & theme toggler
│   │   ├── sidebar.ts
│   │   ├── sidebar.html
│   │   └── sidebar.css
│   ├── tasks/                # Task management views
│   │   ├── task-board.ts     # CDK Drag & Drop Kanban board
│   │   ├── task-board.html
│   │   ├── task-board.css
│   │   ├── task-form.ts      # Add & Edit reactive form
│   │   ├── task-form.html
│   │   ├── task-form.css
│   │   ├── task-list.ts      # Filterable & searchable card grid
│   │   ├── task-list.html
│   │   └── task-list.css
│   ├── app.routes.ts         # Angular router definitions
│   ├── app.ts                # Root layout shell
│   ├── app.html
│   └── app.css
├── styles.css                # Global CSS variables, themes & resets
└── index.html                # HTML entry point with web fonts
```

---

## 🖥️ Suggested Presentation Outline (10-Slide Deck)

When presenting this project, you can structure your talk as follows:

| Slide # | Slide Title | Core Theme / Focus |
| :---: | :--- | :--- |
| **1** | **Title Slide: Flow** | Introduction, project purpose, modern Angular 21 stack |
| **2** | **The Problem & Solution** | Why task management needs visual feedback, fast filtering, and responsive UX |
| **3** | **Architecture & Modern Angular** | Standalone components, Signals, RxJS, and clean separation of concerns |
| **4** | **Core Task Management (CRUD)** | Adding, editing, deleting, status workflows, and reactive form validation |
| **5** | **Search & Smart Filtering** | Multi-attribute search, status/priority filters, and instant client-side execution |
| **6** | **Drag & Drop Kanban Board** | Angular CDK implementation, column transitions, and state synchronization |
| **7** | **Interactive Analytics & Dashboard** | Chart.js visualizations (Donut, Bar, 7-Day Trends) and dynamic metric cards |
| **8** | **Proactive Alerts & Health Monitoring** | Overdue detection, stagnant task alerts, and one-click quick actions |
| **9** | **Design System & Dark Mode** | Lagoon & Ember themes, CSS variables, accessibility, and mobile drawer |
| **10** | **Conclusion & Key Takeaways** | What was achieved, lessons learned, and future enhancements |

---

## 🚦 How to Run the Project Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start development server**:
   ```bash
   npm start
   ```
3. **Open browser**:
   Navigate to `http://localhost:4200`
4. **Build production bundle**:
   ```bash
   npm run build
   ```