import { CardType, Status, Ticket } from "@/lib/types";

export const tickets: Ticket[] = [
  {
    id: 1,
    title: "Setup project repository",
    status: "completed",
    description: "Initialize GitHub repo and setup main branches",
  },
  {
    id: 2,
    title: "Configure CI/CD pipeline",
    status: "completed",
    description: "Setup GitHub Actions for testing and deployment",
  },
  {
    id: 3,
    title: "Design application layout",
    status: "completed",
    description: "Create initial wireframes and UI mockups",
  },
  {
    id: 4,
    title: "Implement authentication",
    status: "progress",
    description: "Add login and registration functionality using OAuth",
  },
  {
    id: 5,
    title: "Create user dashboard",
    status: "progress",
    description: "Build dashboard layout with widgets and recent activity",
  },
  {
    id: 6,
    title: "Set up database schema",
    status: "completed",
    description: "Design and implement schema using PostgreSQL",
  },
  {
    id: 7,
    title: "Develop ticket model and API",
    status: "progress",
    description: "Add endpoints for creating, updating, and fetching tickets",
  },
  {
    id: 8,
    title: "Implement drag and drop for board",
    status: "backlog",
    description: "Enable drag-and-drop for ticket movement",
  },
  {
    id: 9,
    title: "Add user profile settings",
    status: "backlog",
    description: "Let users update profile, password, and notifications",
  },
  {
    id: 10,
    title: "Create activity log feature",
    status: "backlog",
    description: "Track user actions and system events",
  },
  {
    id: 11,
    title: "Add dark mode toggle",
    status: "backlog",
    description: "Support light and dark UI themes",
  },
  {
    id: 12,
    title: "Implement search functionality",
    status: "backlog",
    description: "Allow search by ticket title, status, and assignee",
  },
  {
    id: 13,
    title: "Fix layout issues on mobile",
    status: "progress",
    description: "Make UI responsive and mobile-friendly",
  },
  {
    id: 14,
    title: "Setup test environment",
    status: "completed",
    description: "Create separate config and env vars for testing",
  },
  {
    id: 15,
    title: "Write unit tests for API",
    status: "progress",
    description: "Cover major endpoints with Jest tests",
  },
  {
    id: 16,
    title: "Add loading indicators",
    status: "backlog",
    description: "Display spinners or skeletons during async operations",
  },
  {
    id: 17,
    title: "Optimize initial load time",
    status: "backlog",
    description: "Reduce bundle size and preload critical assets",
  },
  {
    id: 18,
    title: "Deploy staging environment",
    status: "completed",
    description: "Deploy working version to staging server",
  },
  {
    id: 19,
    title: "Gather team feedback",
    status: "progress",
    description: "Schedule team review and collect suggestions",
  },
  {
    id: 20,
    title: "Prepare demo for client",
    status: "backlog",
    description: "Create demo flow and gather presentation assets",
  },
];

export const statuses: Status[] = ["backlog", "progress", "completed"];

export const DEFAULT_CARDS: CardType[] = [
  // BACKLOG
  { title: "Look into render bug in dashboard", id: "1", column: "backlog" },
  { title: "SOX compliance checklist", id: "2", column: "backlog" },
  { title: "[SPIKE] Migrate to Azure", id: "3", column: "backlog" },
  { title: "Document Notifications service", id: "4", column: "backlog" },
  // TODO
  {
    title: "Research DB options for new microservice",
    id: "5",
    column: "todo",
  },
  { title: "Postmortem for outage", id: "6", column: "todo" },
  { title: "Sync with product on Q3 roadmap", id: "7", column: "todo" },

  // DOING
  {
    title: "Refactor context providers to use Zustand",
    id: "8",
    column: "doing",
  },
  { title: "Add logging to daily CRON", id: "9", column: "doing" },
  // DONE
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "10",
    column: "done",
  },
];
