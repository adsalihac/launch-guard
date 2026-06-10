# LaunchGuard

**Predict App Store and Google Play review risks before you submit.**

LaunchGuard helps mobile app developers, teams, and agencies instantly assess the likelihood of app rejection by evaluating privacy compliance, subscription flows, UGC moderation, permissions, and other review-sensitive surfaces — before your build ever reaches Apple or Google.

## Features

- **Dual‑Store Risk Scoring** — Separate App Store and Google Play risk scores calculated from 20+ policy signals.
- **Privacy Checklist** — Verify privacy policy, nutrition labels, data safety forms, tracking consent, and data collection disclosures.
- **Review Checklist** — Confirm reviewer access, account deletion, subscription disclosures, and external payment compliance.
- **UGC Compliance** — Check moderation tools, content reporting, user blocking, and children‑targeting safeguards.
- **Subscription Validation** — Detect missing or unclear subscription disclosures, trial terms, and renewal policies.
- **Live Report** — Instant risk report updates as you fill out the form. Copy or download as PDF.
- **PDF Export** — Generate a shareable A4 PDF report with scores, findings, and recommendations — branded with "Powered by LaunchGuard."
- **Policy News Feed** — Auto‑curated blog with the latest App Store and Google Play policy updates from official sources.
- **Progress Tracking** — Visual completion bar and auto‑save to localStorage so you never lose your work.
- **Quick Demos** — Pre‑built scenarios (Social, Health, Fintech) to explore the tool instantly.
- **Dark Theme** — Modern dark UI with green brand accents, built with Tailwind CSS v4.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| PDF | jsPDF |
| News | RSS Feeds (Apple, Android, 9to5Mac, TechCrunch) |
| Font | Inter |

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── api/news/route.ts       # RSS news feed API
├── blog/page.tsx           # Policy news blog
├── components/
│   ├── github-actions.tsx  # GitHub star/fork buttons
│   └── risk-checker.tsx    # Main risk assessment form & report
├── lib/
│   └── risk-engine.ts      # Risk calculation engine
├── layout.tsx              # Root layout & metadata
├── page.tsx                # Home page
└── globals.css             # Global styles & theme
```

## Contributing

Contributions are welcome and appreciated. Here's how you can help:

1. **Fork** the repository.
2. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. **Make your changes** — keep the code style consistent and avoid unnecessary dependencies.
4. **Run the build** to verify everything compiles:
   ```bash
   npm run build
   ```
5. **Submit a pull request** with a clear description of what your changes do and why they're useful.

### Guidelines

- Use TypeScript for all new code.
- Follow the existing Tailwind CSS v4 conventions (dark theme, green brand palette).
- Keep components focused and avoid adding heavy dependencies.
- Test your changes by running `npm run build` before submitting.
