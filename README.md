# JobMate Frontend

React frontend for JobMate, an AI-assisted job portal for job seekers,
employers, and administrators. The companion backend is
[aiJobPortal](https://github.com/Sameer6576/aiJobPortal).

## Features

- Public job browsing, filters, detail pages, and role-aware navigation
- Job-seeker profiles, structured resumes, saved jobs, applications, and
  password management
- Resume experience, education, skills, projects, languages, awards, and
  certifications
- AI-assisted summaries, experience bullets, career feedback, cover letters,
  natural-language search, and employer job content
- Employer company profiles, job publishing, application review, AI screening,
  and live dashboard counts
- Admin user, company, and job-taxonomy management
- Central API notifications: mutations show **Success**; failures show
  **Error** with the backend message when available

## Requirements and install

- Node.js 20 or newer
- npm
- A running JobMate backend gateway

```bash
git clone https://github.com/sameer6576/ai-job-portal-frontend.git
cd ai-job-portal-frontend
npm install
```

## Run

Native or hybrid backend (gateway `http://localhost:5007`):

```bash
npm run dev
```

Full backend Docker Compose (gateway `http://localhost:5050`):

```bash
npm run dev:docker
```

Vite proxies `/auth` and `/api` to the selected gateway.

## Environment

No frontend secret is required. The default is:

```dotenv
VITE_GATEWAY_URL=http://localhost:5007
```

- `.env.example` documents native/hybrid mode.
- `.env.docker` is loaded by `npm run dev:docker`.
- Use local `.env` only for a different gateway host or port.
- Never put JWT secrets, database passwords, or Gemini keys in `VITE_*`
  variables; they are visible to the browser.

## Scripts

```bash
npm run dev
npm run dev:docker
npm run build
npm run build:docker
npm run lint
npm run preview
```

## AI behavior

AI actions send structured page data automatically. Prompt dialogs accept
optional user instructions such as target role, tone, emphasis, and length.
Generated content is shown for review and is not persisted until the relevant
form is saved or submitted.

Gemini is optional on the backend. AI calls require the AI service and
`GEMINI_API_KEY`; normal job and resume operations do not.

## Known limitations

- Lists are not paginated.
- Resumes are structured records; PDF/DOC upload and export are unavailable.
- No email verification, job alerts, or in-app messaging.
- Dashboard values come from loaded API data. Unsupported metrics, such as job
  views, are intentionally not displayed.
