# Fairview City Library · Obituary Collection

A responsive, accessible Next.js visitor experience for the Library's obituary archive and funeral-home notices.

## Start

Use Node.js **20+**. Start the provided Express backend on port 3001, then run:

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Open <http://localhost:3000>. Set `OBITUARY_API_URL` to the Express API address if it is not at `http://localhost:3001`. It is a server-side setting; the browser only requests `/api/obituaries` on the same host.

## Features

- Search on initial load and on form submission (names, dates, obituary text, and location)
- Filter by record source and browse all records without a search
- Mobile-friendly record cards, accessible record dialog, individual SEO metadata pages, citation copying and original-source links
- Shareable search URLs, bounded pagination, loading / error / empty states
- Server-side proxy to API, no browser CORS requirement
- Print-friendly record details and reduced-motion accommodations

## Check

```bash
npm run typecheck
npm run lint
npm run build
```

No historical records are seeded or invented by the frontend. The real MySQL `obits` table and configured funeral-home feeds drive the results.
