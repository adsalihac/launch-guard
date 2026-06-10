import { RiskChecker } from "./components/risk-checker";

const rejectionReasons = [
  "Missing privacy disclosures",
  "Subscription issues",
  "Login requirement violations",
  "User-generated content moderation gaps",
  "Incomplete legal documentation",
  "Account deletion non-compliance",
];

const workflowSteps = [
  {
    number: "01",
    title: "Describe Your App",
    body: "Capture category, features, authentication, subscriptions, data collection, and user content details.",
  },
  {
    number: "02",
    title: "Analyze Store Policies",
    body: "LaunchGuard checks known App Store and Play Store requirements against your submission profile.",
  },
  {
    number: "03",
    title: "Get Your Report",
    body: "Receive risk scores, missing requirements, privacy tasks, and clear rejection prevention steps.",
  },
];

const features = [
  {
    title: "App Store Risk Score",
    body: "Predict potential Apple review issues before they slow down your launch.",
    tone: "blue",
  },
  {
    title: "Google Play Risk Score",
    body: "Detect Play Store compliance gaps across privacy, permissions, and policy surfaces.",
    tone: "green",
  },
  {
    title: "Privacy Checklist",
    body: "Verify policy, disclosures, data collection, deletion, and nutrition label requirements.",
    tone: "amber",
  },
  {
    title: "Review Checklist",
    body: "Turn store submission readiness into a clear report your team can action.",
    tone: "gray",
  },
  {
    title: "Subscription Validation",
    body: "Check pricing, renewal, disclosure, trial, and account management implementation risks.",
    tone: "red",
  },
  {
    title: "UGC Compliance",
    body: "Confirm moderation, reporting, blocking, and safety controls for user-generated content.",
    tone: "blue",
  },
];

const audiences = [
  "Indie Developers",
  "React Native Teams",
  "Expo Developers",
  "Mobile Agencies",
  "Startup Founders",
];

const faqs = [
  {
    question: "How accurate are the scores?",
    answer:
      "LaunchGuard scores are policy-informed risk estimates based on your answers and common review patterns. They are designed to surface likely issues before submission.",
  },
  {
    question: "Does LaunchGuard guarantee approval?",
    answer:
      "No. Apple and Google make final review decisions. LaunchGuard helps reduce avoidable rejections by highlighting compliance gaps early.",
  },
  {
    question: "Does it support both stores?",
    answer:
      "Yes. Reports include separate App Store and Google Play risk scores, plus shared privacy and readiness recommendations.",
  },
  {
    question: "Do policies stay updated?",
    answer:
      "LaunchGuard is designed around current store policy categories and review requirements, with checks that can evolve as policies change.",
  },
  {
    question: "Can I use it before development starts?",
    answer:
      "Yes. Founders and teams can use LaunchGuard during planning to avoid building flows that create preventable review risk later.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "LaunchGuard",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  description:
    "LaunchGuard helps mobile app developers predict App Store and Google Play review risks before submission.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
      {children}
    </p>
  );
}

function StatusDot({ color = "bg-emerald-500" }: { color?: string }) {
  return <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${color}`} />;
}

function AlertIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M12 9v4m0 4h.01M10.3 4.5 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.5a2 2 0 0 0-3.4 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mx-0">
      <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-full border border-slate-200 lg:block" />
      <div className="absolute -right-4 bottom-12 hidden h-20 w-20 rounded-[24px] border border-blue-100 bg-blue-50/70 lg:block" />
      <div className="dashboard-card relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              LaunchGuard Report
            </p>
            <h2 className="font-heading mt-1 text-xl font-bold text-slate-950">
              Review Readiness
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            <StatusDot />
            Low Review Risk
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="score-panel rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">App Store Risk Score</p>
              <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-bold text-white">
                22%
              </span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="risk-bar bg-blue-600" style={{ width: "22%" }} />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Privacy disclosures and account settings need review.
            </p>
          </div>

          <div className="score-panel rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">Google Play Risk Score</p>
              <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white">
                15%
              </span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="risk-bar bg-emerald-500" style={{ width: "15%" }} />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Store listing, permissions, and safety checks look strong.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 bg-white px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold text-slate-950">Requirements Missing</p>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
              2 items
            </span>
          </div>
          <div className="space-y-3">
            {["Privacy Nutrition Labels", "Account Deletion Flow"].map((item) => (
              <div
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
                key={item}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
                    <AlertIcon />
                  </span>
                  <span className="text-sm font-semibold text-slate-700">{item}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                  Review
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureGlyph({ tone }: { tone: string }) {
  const classes: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    red: "bg-red-50 text-red-600 ring-red-100",
    gray: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <span
      className={`mb-6 flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${
        classes[tone] ?? classes.gray
      }`}
    >
      <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
        <path
          d="M5 12.5 9.2 17 19 7"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.2"
        />
      </svg>
    </span>
  );
}

export default function Home() {
  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8"
        >
          <a className="flex items-center gap-3" href="#top" aria-label="LaunchGuard home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
              LG
            </span>
            <span className="font-heading text-lg font-bold">LaunchGuard</span>
          </a>
          <a
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
            href="#checker"
          >
            Check My App
          </a>
        </nav>
      </header>

      <section id="top" className="relative border-b border-slate-200">
        <div className="absolute inset-0 -z-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-35" />
        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
              <StatusDot color="bg-blue-600" />
              App Store Submission Intelligence
            </div>
            <h1 className="font-heading max-w-4xl text-5xl font-bold leading-[1.04] text-slate-950 sm:text-6xl lg:text-7xl">
              Will Apple or Google Reject Your App?
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Get an instant App Store and Google Play review risk assessment before you
              submit.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500">
              LaunchGuard helps mobile app developers predict review risks, missing
              compliance requirements, privacy tasks, and potential rejection reasons in
              minutes.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                href="#checker"
              >
                Check My App
              </a>
              <a
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
                href="#checker"
              >
                Try Demo
              </a>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-5 border-t border-slate-200 pt-7">
              {[
                ["2 stores", "Apple and Google"],
                ["6 checks", "Core policy areas"],
                ["Instant", "Readiness signal"],
              ].map(([value, label]) => (
                <div key={value}>
                  <p className="text-lg font-black text-slate-950">{value}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <HeroDashboard />
        </div>
      </section>

      <RiskChecker />

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8" id="problem">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <SectionLabel>The Problem</SectionLabel>
            <h2 className="font-heading text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              App Rejections Cost Time and Revenue
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Review blockers often hide in policy details, not product quality.
              LaunchGuard turns those unknowns into a practical pre-submit checklist.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {rejectionReasons.map((reason) => (
              <div
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                key={reason}
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100">
                  <AlertIcon />
                </span>
                <h3 className="text-base font-bold text-slate-950">{reason}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50" id="how-it-works">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="font-heading text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              From app details to review confidence in three steps
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <div
                className="relative rounded-xl border border-slate-200 bg-white p-7 shadow-sm"
                key={step.number}
              >
                <span className="font-heading text-5xl font-bold text-slate-200">
                  {step.number}
                </span>
                <h3 className="mt-6 text-xl font-bold text-slate-950">{step.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8" id="features">
        <div className="max-w-3xl">
          <SectionLabel>Features</SectionLabel>
          <h2 className="font-heading text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Everything you need before App Review sees your build
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article
              className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              key={feature.title}
            >
              <FeatureGlyph tone={feature.tone} />
              <h3 className="text-xl font-bold text-slate-950">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8" id="audience">
        <div className="mx-auto max-w-3xl text-center">
          <SectionLabel>Who Is It For</SectionLabel>
          <h2 className="font-heading text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
            Built for teams that ship mobile products
          </h2>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {audiences.map((audience) => (
            <div
              className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              key={audience}
            >
              <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                {audience
                  .split(" ")
                  .map((word) => word[0])
                  .join("")}
              </span>
              <h3 className="text-base font-bold text-slate-950">{audience}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50" id="faq">
        <div className="mx-auto max-w-4xl px-5 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="font-heading text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Questions before you submit
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm open:shadow-md"
                key={faq.question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-bold text-slate-950">
                  {faq.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <a className="flex items-center gap-3" href="#top" aria-label="LaunchGuard home">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                LG
              </span>
              <span className="font-heading text-lg font-bold">LaunchGuard</span>
            </a>
            <p className="mt-3 text-sm text-slate-500">App Store Submission Intelligence</p>
          </div>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600"
          >
            <a className="nav-link" href="#features">
              Features
            </a>
            <a className="nav-link" href="#faq">
              FAQ
            </a>
            <a className="nav-link" href="#privacy">
              Privacy
            </a>
            <a className="nav-link" href="#terms">
              Terms
            </a>
            <a className="nav-link" href="#checker">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
