import { RiskChecker } from "./components/risk-checker";
import { GitHubActions } from "./components/github-actions";

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
  },
  {
    title: "Google Play Risk Score",
    body: "Detect Play Store compliance gaps across privacy, permissions, and policy surfaces.",
  },
  {
    title: "Privacy Checklist",
    body: "Verify policy, disclosures, data collection, deletion, and nutrition label requirements.",
  },
  {
    title: "Review Checklist",
    body: "Turn store submission readiness into a clear report your team can action.",
  },
  {
    title: "Subscription Validation",
    body: "Check pricing, renewal, disclosure, trial, and account management implementation risks.",
  },
  {
    title: "UGC Compliance",
    body: "Confirm moderation, reporting, blocking, and safety controls for user-generated content.",
  },
];

const audienceIcons: Record<string, React.ReactNode> = {
  "Indie Developers": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  "React Native Teams": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M7 7V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3M9 7v10M15 7v10M5 17h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
    </svg>
  ),
  "Expo Developers": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M12 18h.01" />
      <path d="M9 6h6" />
    </svg>
  ),
  "Mobile Agencies": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  ),
  "Startup Founders": (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  ),
};

const audiences: Array<{ name: string; description: string }> = [
  { name: "Indie Developers", description: "Solo devs shipping to both stores" },
  { name: "React Native Teams", description: "Cross-platform teams reducing risk" },
  { name: "Expo Developers", description: "Expo-first apps ready for review" },
  { name: "Mobile Agencies", description: "Client launches done right" },
  { name: "Startup Founders", description: "Pre-seed MVPs that make it through" },
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

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C9 7 7 11.5 7 15c0 2.5 2 5 5 6.5 3-1.5 5-4 5-6.5 0-3.5-2-8-5-13z" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="11" y="16" width="2" height="6" rx="1" fill="#3ecf8e" opacity="0.5" />
      <circle cx="12" cy="10" r="2.5" fill="none" stroke="#3ecf8e" strokeWidth="1.5" />
      <path d="M7 8l2 1.5M17 8l-2 1.5M7 14l2-1M17 14l-2-1" stroke="#3ecf8e" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4m0 4h.01M10.3 4.5 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.5a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 inline-flex rounded-full border border-brand-400/20 bg-brand-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
      {children}
    </p>
  );
}

function HeroDashboard() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mx-0">
      <div className="dashboard-card relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
              LaunchGuard Report
            </p>
            <h2 className="mt-1 text-xl font-bold text-white">
              Review Readiness
            </h2>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Low Review Risk
          </span>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-400">App Store Risk Score</p>
              <span className="rounded-full bg-brand-400 px-2.5 py-1 text-xs font-bold text-black">
                22%
              </span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="risk-bar bg-brand-400" style={{ width: "22%" }} />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Privacy disclosures and account settings need review.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-400">Google Play Risk Score</p>
              <span className="rounded-full bg-brand-400 px-2.5 py-1 text-xs font-bold text-black">
                15%
              </span>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
              <div className="risk-bar bg-brand-400" style={{ width: "15%" }} />
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Store listing, permissions, and safety checks look strong.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-bold text-white">Requirements Missing</p>
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-400">
              2 items
            </span>
          </div>
          <div className="space-y-3">
            {["Privacy Nutrition Labels", "Account Deletion Flow"].map((item) => (
              <div
                className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                key={item}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
                    <AlertIcon />
                  </span>
                  <span className="text-sm font-semibold text-gray-300">{item}</span>
                </div>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-gray-600">
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

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-400/10">
              <ShieldIcon />
            </div>
            <span className="text-lg font-bold">LaunchGuard</span>
          </a>
          <div className="flex items-center gap-3">
            <GitHubActions />
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-36 pb-20 md:pt-48 md:pb-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] rounded-full bg-brand-400/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-400/10 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-400" />
                <span className="text-sm font-semibold text-brand-400">App Store Submission Intelligence</span>
              </div>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Will Apple or <span className="text-brand-400">Google Reject</span> Your App?
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-gray-400 md:text-xl">
                Get an instant App Store and Google Play review risk assessment before you submit.
                LaunchGuard helps mobile app developers predict review risks, missing compliance requirements, privacy tasks, and potential rejection reasons in minutes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center rounded-xl bg-brand-400 px-8 py-3.5 text-base font-bold text-black shadow-lg shadow-brand-400/20 transition hover:bg-brand-300 hover:shadow-brand-400/30"
                  href="#checker"
                >
                  Start Risk Check
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-8 py-3.5 text-base font-bold text-white transition hover:border-white/20 hover:bg-white/[0.05]"
                  href="#checker"
                >
                  Try Demo
                </a>
              </div>
              <div className="mt-10 grid max-w-md grid-cols-3 gap-5 border-t border-white/5 pt-7">
                {[
                  ["2 stores", "Apple and Google"],
                  ["6 checks", "Core policy areas"],
                  ["Instant", "Readiness signal"],
                ].map(([value, label]) => (
                  <div key={value}>
                    <p className="text-lg font-extrabold text-white">{value}</p>
                    <p className="mt-1 text-sm leading-5 text-gray-500">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <HeroDashboard />
          </div>
        </div>
      </section>

      <RiskChecker />

      <section className="border-t border-white/5 py-20 md:py-28" id="problem">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <SectionLabel>The Problem</SectionLabel>
              <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
                App Rejections Cost Time and Revenue
              </h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-400">
                Review blockers often hide in policy details, not product quality.
                LaunchGuard turns those unknowns into a practical pre-submit checklist.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {rejectionReasons.map((reason) => (
                <div
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-red-500/20 hover:bg-red-500/[0.03]"
                  key={reason}
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <AlertIcon />
                  </span>
                  <h3 className="text-base font-bold text-white">{reason}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 py-20 md:py-28" id="how-it-works">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              From app details to review confidence in three steps
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {workflowSteps.map((step) => (
              <div
                className="relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-7"
                key={step.number}
              >
                <span className="text-5xl font-extrabold text-white/10">
                  {step.number}
                </span>
                <h3 className="mt-6 text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-3 leading-7 text-gray-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" id="features">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Everything you need before App Review sees your build
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-7 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
                key={feature.title}
              >
                <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-400/10">
                  <svg aria-hidden="true" className="h-5 w-5 text-brand-400" fill="none" viewBox="0 0 24 24">
                    <path d="M5 12.5 9.2 17 19 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                  </svg>
                </span>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="mt-3 leading-7 text-gray-400">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/5 py-20 md:py-28" id="audience">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Who Is It For</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Built for teams that ship mobile products
            </h2>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {audiences.map((audience) => (
              <div
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center transition hover:border-white/[0.12] hover:bg-white/[0.04]"
                key={audience.name}
              >
                <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-400/10 text-brand-400">
                  {audienceIcons[audience.name]}
                </span>
                <h3 className="text-base font-bold text-white">{audience.name}</h3>
                <p className="mt-1.5 text-sm leading-5 text-gray-500">{audience.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28" id="faq">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Questions before you submit
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition open:border-white/[0.12]"
                key={faq.question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left text-lg font-bold text-white">
                  {faq.question}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-500 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl leading-7 text-gray-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 bg-[#0a0a0a] py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm text-gray-500">© 2026 Launch Guard. Built by <a href="https://github.com/adsalihac" target="_blank" rel="noreferrer" className="text-gray-400 transition hover:text-gray-200">adsalihac</a></p>
            <div className="flex items-center gap-4">
              <a
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFDD00] px-4 py-2.5 text-sm font-bold text-black shadow-sm transition hover:bg-[#F6D300]"
                href="https://www.buymeacoffee.com/adsalihac"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
                </svg>
                Buy me a coffee
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
