"use client";

import { jsPDF } from "jspdf";
import { useEffect, useMemo, useState } from "react";
import {
  calculateRiskReport,
  categoryLabel,
  defaultAnswers,
  type AppCategory,
  type ChecklistItem,
  type ChecklistStatus,
  type DataType,
  type Framework,
  type PermissionType,
  type RiskAnswers,
} from "../lib/risk-engine";

const categories: AppCategory[] = [
  "productivity",
  "social",
  "commerce",
  "finance",
  "health",
  "education",
  "games",
  "marketplace",
];

const frameworks: Array<{ value: Framework; label: string }> = [
  { value: "expo", label: "Expo" },
  { value: "react-native", label: "React Native" },
  { value: "native", label: "Native iOS/Android" },
  { value: "flutter", label: "Flutter" },
  { value: "other", label: "Other" },
];

const dataTypes: Array<{ value: DataType; label: string }> = [
  { value: "contact", label: "Contact info" },
  { value: "location", label: "Location" },
  { value: "health", label: "Health data" },
  { value: "financial", label: "Financial data" },
  { value: "photos", label: "Photos or media" },
  { value: "usage", label: "Usage analytics" },
  { value: "identifiers", label: "Device identifiers" },
];

const permissions: Array<{ value: PermissionType; label: string }> = [
  { value: "camera", label: "Camera" },
  { value: "location", label: "Location" },
  { value: "contacts", label: "Contacts" },
  { value: "notifications", label: "Notifications" },
  { value: "microphone", label: "Microphone" },
  { value: "photos", label: "Photos" },
];

const exampleAnswers: RiskAnswers = {
  appName: "CreatorHub Mobile",
  category: "social",
  framework: "react-native",
  authRequired: true,
  reviewerAccess: false,
  accountDeletion: false,
  privacyPolicy: true,
  privacyLabels: false,
  dataSafetyForm: false,
  dataTypes: ["contact", "photos", "usage", "identifiers"],
  usesTracking: true,
  trackingConsent: false,
  hasSubscriptions: true,
  subscriptionDisclosures: false,
  usesExternalPayments: false,
  hasUserGeneratedContent: true,
  moderationTools: true,
  contentReporting: false,
  userBlocking: false,
  legalDocs: true,
  sensitivePermissions: ["camera", "photos", "notifications"],
  targetChildren: false,
  regulatedContent: false,
  reviewerNotes: false,
};

const demoPresets: Array<{ label: string; answers: RiskAnswers }> = [
  {
    label: "Social App",
    answers: {
      appName: "ConnectHub",
      category: "social",
      framework: "react-native",
      authRequired: true,
      reviewerAccess: false,
      accountDeletion: false,
      privacyPolicy: true,
      privacyLabels: false,
      dataSafetyForm: false,
      dataTypes: ["contact", "photos", "usage", "identifiers"],
      usesTracking: true,
      trackingConsent: false,
      hasSubscriptions: true,
      subscriptionDisclosures: false,
      usesExternalPayments: false,
      hasUserGeneratedContent: true,
      moderationTools: true,
      contentReporting: false,
      userBlocking: false,
      legalDocs: true,
      sensitivePermissions: ["camera", "photos", "notifications"],
      targetChildren: false,
      regulatedContent: false,
      reviewerNotes: false,
    },
  },
  {
    label: "Health App",
    answers: {
      appName: "FitTrack",
      category: "health",
      framework: "native",
      authRequired: true,
      reviewerAccess: true,
      accountDeletion: true,
      privacyPolicy: true,
      privacyLabels: false,
      dataSafetyForm: false,
      dataTypes: ["health", "location", "identifiers"],
      usesTracking: false,
      trackingConsent: false,
      hasSubscriptions: true,
      subscriptionDisclosures: true,
      usesExternalPayments: false,
      hasUserGeneratedContent: false,
      moderationTools: false,
      contentReporting: false,
      userBlocking: false,
      legalDocs: true,
      sensitivePermissions: ["camera", "location", "notifications"],
      targetChildren: false,
      regulatedContent: true,
      reviewerNotes: false,
    },
  },
  {
    label: "Fintech App",
    answers: {
      appName: "PaySwift",
      category: "finance",
      framework: "expo",
      authRequired: true,
      reviewerAccess: true,
      accountDeletion: true,
      privacyPolicy: true,
      privacyLabels: true,
      dataSafetyForm: true,
      dataTypes: ["contact", "financial", "usage", "identifiers"],
      usesTracking: false,
      trackingConsent: false,
      hasSubscriptions: false,
      subscriptionDisclosures: false,
      usesExternalPayments: true,
      hasUserGeneratedContent: false,
      moderationTools: false,
      contentReporting: false,
      userBlocking: false,
      legalDocs: true,
      sensitivePermissions: ["camera", "notifications"],
      targetChildren: false,
      regulatedContent: true,
      reviewerNotes: true,
    },
  },
];

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

function StatusIcon({ status }: { status: ChecklistStatus }) {
  if (status === "Ready") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
        <CheckIcon />
      </span>
    );
  }

  if (status === "Review") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-400/10 text-brand-400">
        <AlertIcon />
      </span>
    );
  }

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
      <AlertIcon />
    </span>
  );
}

function statusClasses(status: string) {
  if (status === "Low") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  }

  if (status === "Medium") {
    return "border-amber-400/30 bg-amber-400/10 text-amber-400";
  }

  return "border-red-500/30 bg-red-500/10 text-red-400";
}

function scoreColor(score: number) {
  if (score >= 65) {
    return "bg-red-500";
  }

  if (score >= 35) {
    return "bg-amber-500";
  }

  return "bg-brand-400";
}

function toggleArrayValue<T extends string>(values: T[], value: T) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

function FieldGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
      <legend className="px-1 text-base font-bold text-white">{title}</legend>
      <p className="mt-1 text-sm leading-6 text-gray-400">{description}</p>
      <div className="mt-5">{children}</div>
    </fieldset>
  );
}

function Toggle({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="group flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:border-brand-400/20 hover:bg-brand-400/[0.03]">
      <span>
        <span className="block text-sm font-bold text-gray-200">{label}</span>
        <span className="mt-1 block text-sm leading-5 text-gray-500">{description}</span>
      </span>
      <input
        checked={checked}
        className="peer sr-only"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span className="mt-1 flex h-6 w-11 shrink-0 items-center rounded-full bg-white/10 p-0.5 transition peer-checked:bg-brand-400 peer-checked:[&>span]:translate-x-5 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-400/30">
        <span className="h-5 w-5 rounded-full bg-white shadow-sm transition" />
      </span>
    </label>
  );
}

function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4" key={item.label}>
          <StatusIcon status={item.status} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-gray-200">{item.label}</p>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-bold text-gray-500">
                {item.status}
              </span>
            </div>
            <p className="mt-1 text-sm leading-5 text-gray-500">{item.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RiskChecker() {
  const [answers, setAnswers] = useState<RiskAnswers>(defaultAnswers);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{ name: string; appStoreRisk: number; googlePlayRisk: number; approvalChance: number; date: string }>>([]);
  const [savedReports, setSavedReports] = useState<Array<{ name: string; answers: RiskAnswers }>>([]);
  const [onboarded, setOnboarded] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [saveName, setSaveName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [compare, setCompare] = useState<{ name: string; appStoreRisk: number; googlePlayRisk: number } | null>(null);
  const report = useMemo(() => calculateRiskReport(answers), [answers]);

  useEffect(() => {
    const saved = localStorage.getItem("lg-answers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as RiskAnswers;
        setAnswers(parsed);
      } catch { /* ignore */ }
    }
    const h = localStorage.getItem("lg-history");
    if (h) { try { setHistory(JSON.parse(h)); } catch {} }
    const r = localStorage.getItem("lg-saved");
    if (r) { try { setSavedReports(JSON.parse(r)); } catch {} }
    if (!localStorage.getItem("lg-onboarded")) {
      setOnboarded(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("lg-answers", JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("lg-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("lg-saved", JSON.stringify(savedReports));
  }, [savedReports]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get("data");
    if (data) {
      try {
        const decoded = JSON.parse(atob(data)) as RiskAnswers;
        setAnswers(decoded);
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (onboarded) return;
    const step = localStorage.getItem("lg-onboarding-step");
    if (step) setOnboardingStep(parseInt(step));
  }, [onboarded]);

  const progress = useMemo(() => {
    let filled = 0;
    let total = 0;

    const bools: Array<keyof RiskAnswers> = [
      "privacyPolicy", "privacyLabels", "dataSafetyForm",
      "hasSubscriptions", "usesExternalPayments",
      "hasUserGeneratedContent", "legalDocs",
      "targetChildren", "regulatedContent", "reviewerNotes",
    ];
    for (const key of bools) {
      total++;
      if (answers[key]) filled++;
    }

    if (answers.usesTracking) {
      total++; if (answers.trackingConsent) filled++;
    }
    if (answers.authRequired) {
      total += 2; if (answers.reviewerAccess) filled++; if (answers.accountDeletion) filled++;
    }
    if (answers.hasSubscriptions) {
      total++; if (answers.subscriptionDisclosures) filled++;
    }
    if (answers.hasUserGeneratedContent) {
      total += 2; if (answers.moderationTools) filled++; if (answers.contentReporting) filled++;
      total++; if (answers.userBlocking) filled++;
    }

    total += 2; // dataTypes + sensitivePermissions
    if (answers.dataTypes.length > 0) filled++;
    if (answers.sensitivePermissions.length > 0) filled++;

    if (answers.appName.trim()) filled++;
    total++;

    return { filled, total, pct: total > 0 ? Math.round((filled / total) * 100) : 0 };
  }, [answers]);

  function updateAnswer<Key extends keyof RiskAnswers>(key: Key, value: RiskAnswers[Key]) {
    setAnswers((current) => ({ ...current, [key]: value }));
    setCopied(false);
  }

  async function copyReport() {
    const reportText = [
      `LaunchGuard report for ${answers.appName || "Untitled app"}`,
      `App Store Risk Score: ${report.appStoreRisk}%`,
      `Google Play Risk Score: ${report.googlePlayRisk}%`,
      `Overall Approval Chance: ${report.approvalChance}%`,
      `Status: ${report.status} review risk`,
      "",
      "Missing Requirements:",
      ...report.missingRequirements.map((item) => `- ${item}`),
      "",
      "Potential Rejection Reasons:",
      ...report.potentialRejections.map((item) => `- ${item}`),
      "",
      "Recommendations:",
      ...report.recommendations.map((item) => `- ${item}`),
    ].join("\n");

    await navigator.clipboard.writeText(reportText);
    setCopied(true);
  }

  function downloadPDF() {
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = 210;
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = margin;

    function addSection(title: string, items: string[]) {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(62, 207, 142);
      pdf.text(title, margin, y);
      y += 6;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);

      for (const item of items) {
        const lines = pdf.splitTextToSize(`- ${item}`, contentW - 5);
        for (const line of lines) {
          if (y > 275) {
            pdf.addPage();
            y = margin;
          }
          pdf.text(line, margin + 3, y);
          y += 5;
        }
      }
      y += 4;
    }

    pdf.setFillColor(10, 10, 10);
    pdf.rect(0, 0, pageW, 297, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.setTextColor(62, 207, 142);
    pdf.text("LaunchGuard", margin, y);
    y += 4;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text("Risk Assessment Report", margin, y);
    y += 10;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(255, 255, 255);
    pdf.text(answers.appName || "Untitled app", margin, y);
    y += 8;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Status: ${report.status} review risk`, margin, y);
    y += 10;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(255, 255, 255);
    pdf.text(`Approval Chance: ${report.approvalChance}%`, margin, y);
    pdf.text(`App Store Risk: ${report.appStoreRisk}%`, margin + contentW / 2, y);
    y += 7;
    pdf.text(`Google Play Risk: ${report.googlePlayRisk}%`, margin, y);
    y += 12;

    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const summaryLines = pdf.splitTextToSize(report.summary, contentW);
    for (const line of summaryLines) {
      if (y > 275) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, margin, y);
      y += 5;
    }
    y += 6;

    addSection("Missing Requirements", report.missingRequirements);

    addSection("Potential Rejection Reasons", report.potentialRejections);

    addSection("Recommendations", report.recommendations);

    if (y > 260) {
      pdf.addPage();
      y = margin;
    }
    y = 280;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 80);
    pdf.text("Powered by LaunchGuard \u2022 https://launchguard.dev", margin, y);

    pdf.save(`${answers.appName || "app"}-risk-report.pdf`);
  }

  function copyShareLink() {
    const data = btoa(JSON.stringify(answers));
    const url = `${window.location.origin}${window.location.pathname}?data=${data}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function saveNewReport() {
    if (!saveName.trim()) return;
    const existing = savedReports.findIndex((r) => r.name === saveName.trim());
    const entry = { name: saveName.trim(), answers };
    if (existing >= 0) {
      const updated = [...savedReports];
      updated[existing] = entry;
      setSavedReports(updated);
    } else {
      setSavedReports([...savedReports, entry]);
    }
    setSaveName("");
    setShowSaveInput(false);
  }

  function loadSaved(name: string) {
    const found = savedReports.find((r) => r.name === name);
    if (found) setAnswers(found.answers);
  }

  function deleteSaved(name: string) {
    setSavedReports(savedReports.filter((r) => r.name !== name));
  }

  function finishOnboarding() {
    localStorage.setItem("lg-onboarded", "1");
    setOnboarded(true);
  }

  function recordHistory() {
    const entry = {
      name: answers.appName || "Untitled",
      appStoreRisk: report.appStoreRisk,
      googlePlayRisk: report.googlePlayRisk,
      approvalChance: report.approvalChance,
      date: new Date().toISOString(),
    };
    setHistory((prev) => [entry, ...prev].slice(0, 20));
  }

  return (
    <>
      {!onboarded ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-8 shadow-2xl">
            {onboardingStep === 0 ? (
              <>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-400/10">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 className="text-center text-2xl font-bold">Welcome to LaunchGuard</h2>
                <p className="mt-3 text-center text-sm leading-6 text-gray-400">Predict your App Store and Google Play review risk before you submit. No sign-up needed.</p>
              </>
            ) : onboardingStep === 1 ? (
              <>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-400/10">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.5"><path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 className="text-center text-2xl font-bold">Answer & Get Instant Results</h2>
                <p className="mt-3 text-center text-sm leading-6 text-gray-400">Fill in your app details and get an instant risk report with scores, missing requirements, and action steps.</p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-400/10">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 className="text-center text-2xl font-bold">Fix & Improve</h2>
                <p className="mt-3 text-center text-sm leading-6 text-gray-400">Use the checklist and recommendations to fix issues before you submit. Save reports and track your progress.</p>
              </>
            )}
            <div className="mt-8 flex items-center justify-between">
              <button
                className="text-sm text-gray-500 transition hover:text-white disabled:opacity-0"
                disabled={onboardingStep === 0}
                onClick={() => setOnboardingStep((s) => s - 1)}
              >
                Back
              </button>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className={`h-1.5 w-1.5 rounded-full transition ${i === onboardingStep ? "bg-brand-400" : "bg-white/20"}`} />
                ))}
              </div>
              {onboardingStep < 2 ? (
                <button
                  className="rounded-xl bg-brand-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-brand-300"
                  onClick={() => setOnboardingStep((s) => s + 1)}
                >
                  Next
                </button>
              ) : (
                <button
                  className="rounded-xl bg-brand-400 px-5 py-2 text-sm font-bold text-black transition hover:bg-brand-300"
                  onClick={finishOnboarding}
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <section className="border-y border-white/5 py-20 md:py-28" id="checker">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-brand-400/20 bg-brand-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-400">
              Live App Checker
            </p>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-400 transition-all duration-500"
                  style={{ width: `${progress.pct}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 shrink-0">{progress.filled}/{progress.total}</span>
            </div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Check your app before you submit
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-gray-400">
              Answer the same review-sensitive questions your team should resolve before
              upload. LaunchGuard updates the risk report instantly.
            </p>

            <div className="mt-8 space-y-5">
              {savedReports.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                  <span className="text-xs font-semibold text-gray-500">Saved:</span>
                  {savedReports.map((r) => (
                    <span key={r.name} className="flex items-center gap-1 rounded-md border border-white/10 px-2 py-0.5">
                      <button className="text-xs text-gray-400 transition hover:text-brand-400" onClick={() => loadSaved(r.name)}>{r.name}</button>
                      <button className="text-gray-600 transition hover:text-red-400" onClick={() => deleteSaved(r.name)}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
              <FieldGroup
                title="App profile"
                description="Set the broad product context so the report can weight policy-sensitive categories."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-gray-300">App name</span>
                    <input
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white shadow-sm outline-none transition focus:border-brand-400/30 focus:ring-4 focus:ring-brand-400/10"
                      onChange={(event) => updateAnswer("appName", event.target.value)}
                      placeholder="My App"
                      type="text"
                      value={answers.appName}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-gray-300">Category</span>
                    <select
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white shadow-sm outline-none transition focus:border-brand-400/30 focus:ring-4 focus:ring-brand-400/10"
                      onChange={(event) =>
                        updateAnswer("category", event.target.value as AppCategory)
                      }
                      value={answers.category}
                    >
                      {categories.map((category) => (
                        <option className="bg-[#0a0a0a]" key={category} value={category}>
                          {categoryLabel(category)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-bold text-gray-300">Build stack</span>
                    <select
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white shadow-sm outline-none transition focus:border-brand-400/30 focus:ring-4 focus:ring-brand-400/10"
                      onChange={(event) =>
                        updateAnswer("framework", event.target.value as Framework)
                      }
                      value={answers.framework}
                    >
                      {frameworks.map((framework) => (
                        <option className="bg-[#0a0a0a]" key={framework.value} value={framework.value}>
                          {framework.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </FieldGroup>

              <FieldGroup
                title="Privacy and data"
                description="Privacy gaps are among the fastest ways to create App Store and Play Console friction."
              >
                <div className="grid gap-3">
                  <Toggle
                    checked={answers.privacyPolicy}
                    description="A public privacy policy URL is available for store metadata."
                    label="Privacy policy is ready"
                    onChange={(checked) => updateAnswer("privacyPolicy", checked)}
                  />
                  <Toggle
                    checked={answers.privacyLabels}
                    description="Apple privacy nutrition labels match the app data collection."
                    label="App Store privacy labels are complete"
                    onChange={(checked) => updateAnswer("privacyLabels", checked)}
                  />
                  <Toggle
                    checked={answers.dataSafetyForm}
                    description="Google Play Data safety answers are prepared."
                    label="Google Play Data safety form is complete"
                    onChange={(checked) => updateAnswer("dataSafetyForm", checked)}
                  />
                  <Toggle
                    checked={answers.usesTracking}
                    description="The app tracks users across apps, websites, or advertising networks."
                    label="Uses tracking or ad attribution"
                    onChange={(checked) => updateAnswer("usesTracking", checked)}
                  />
                  {answers.usesTracking ? (
                    <Toggle
                      checked={answers.trackingConsent}
                      description="The app shows a clear consent prompt before tracking."
                      label="Tracking consent flow is implemented"
                      onChange={(checked) => updateAnswer("trackingConsent", checked)}
                    />
                  ) : null}
                </div>

                <div className="mt-5">
                  <p className="text-sm font-bold text-gray-300">Collected data</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {dataTypes.map((dataType) => (
                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                          answers.dataTypes.includes(dataType.value)
                            ? "border-brand-400/30 bg-brand-400/10 text-brand-400"
                            : "border-white/10 bg-white/[0.02] text-gray-300 hover:border-brand-400/20 hover:bg-brand-400/[0.03]"
                        }`}
                        key={dataType.value}
                      >
                        <input
                          checked={answers.dataTypes.includes(dataType.value)}
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-brand-400 focus:ring-brand-400/30"
                          onChange={() =>
                            updateAnswer(
                              "dataTypes",
                              toggleArrayValue(answers.dataTypes, dataType.value),
                            )
                          }
                          type="checkbox"
                        />
                        {dataType.label}
                      </label>
                    ))}
                  </div>
                </div>
              </FieldGroup>

              <FieldGroup
                title="Review-sensitive flows"
                description="These are the flows reviewers usually need to inspect or verify directly."
              >
                <div className="grid gap-3">
                  <Toggle
                    checked={answers.authRequired}
                    description="Some app functionality is behind login or account creation."
                    label="Requires login"
                    onChange={(checked) => updateAnswer("authRequired", checked)}
                  />
                  {answers.authRequired ? (
                    <>
                      <Toggle
                        checked={answers.reviewerAccess}
                        description="Demo credentials or a review-safe access path are available."
                        label="Reviewer access is ready"
                        onChange={(checked) => updateAnswer("reviewerAccess", checked)}
                      />
                      <Toggle
                        checked={answers.accountDeletion}
                        description="Users can delete their account from inside the app."
                        label="Account deletion flow is implemented"
                        onChange={(checked) => updateAnswer("accountDeletion", checked)}
                      />
                    </>
                  ) : null}
                  <Toggle
                    checked={answers.hasSubscriptions}
                    description="The app sells subscriptions, trials, unlocks, or recurring access."
                    label="Has subscriptions or in-app purchases"
                    onChange={(checked) => updateAnswer("hasSubscriptions", checked)}
                  />
                  {answers.hasSubscriptions ? (
                    <Toggle
                      checked={answers.subscriptionDisclosures}
                      description="Price, renewal, cancellation, and trial terms are visible before purchase."
                      label="Subscription disclosures are clear"
                      onChange={(checked) =>
                        updateAnswer("subscriptionDisclosures", checked)
                      }
                    />
                  ) : null}
                  <Toggle
                    checked={answers.usesExternalPayments}
                    description="Users are routed to an outside payment flow or purchase page."
                    label="Uses external payment links"
                    onChange={(checked) => updateAnswer("usesExternalPayments", checked)}
                  />
                </div>
              </FieldGroup>

              <FieldGroup
                title="Content and permissions"
                description="Moderation, permission prompts, and regulated categories often need extra evidence."
              >
                <div className="grid gap-3">
                  <Toggle
                    checked={answers.hasUserGeneratedContent}
                    description="Users can post, upload, message, comment, list, or share content."
                    label="Has user-generated content"
                    onChange={(checked) => updateAnswer("hasUserGeneratedContent", checked)}
                  />
                  {answers.hasUserGeneratedContent ? (
                    <>
                      <Toggle
                        checked={answers.moderationTools}
                        description="Your team can moderate or remove problematic content."
                        label="Moderation tools exist"
                        onChange={(checked) => updateAnswer("moderationTools", checked)}
                      />
                      <Toggle
                        checked={answers.contentReporting}
                        description="Users can report content or abusive behavior."
                        label="Content reporting exists"
                        onChange={(checked) => updateAnswer("contentReporting", checked)}
                      />
                      <Toggle
                        checked={answers.userBlocking}
                        description="Users can block abusive or unwanted users."
                        label="User blocking exists"
                        onChange={(checked) => updateAnswer("userBlocking", checked)}
                      />
                    </>
                  ) : null}
                  <Toggle
                    checked={answers.targetChildren}
                    description="The app is made for children or likely to be used by children."
                    label="Targets children or family audiences"
                    onChange={(checked) => updateAnswer("targetChildren", checked)}
                  />
                  <Toggle
                    checked={answers.regulatedContent}
                    description="The app includes health, financial, legal, medical, or safety claims."
                    label="Includes regulated content"
                    onChange={(checked) => updateAnswer("regulatedContent", checked)}
                  />
                  <Toggle
                    checked={answers.legalDocs}
                    description="Terms, support contact, and required policy pages are available."
                    label="Legal and support documentation is ready"
                    onChange={(checked) => updateAnswer("legalDocs", checked)}
                  />
                  <Toggle
                    checked={answers.reviewerNotes}
                    description="Submission notes explain login, permissions, subscriptions, and test paths."
                    label="Reviewer notes are prepared"
                    onChange={(checked) => updateAnswer("reviewerNotes", checked)}
                  />
                </div>

                <div className="mt-5">
                  <p className="text-sm font-bold text-gray-300">Sensitive permissions</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {permissions.map((permission) => (
                      <label
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                          answers.sensitivePermissions.includes(permission.value)
                            ? "border-brand-400/30 bg-brand-400/10 text-brand-400"
                            : "border-white/10 bg-white/[0.02] text-gray-300 hover:border-brand-400/20 hover:bg-brand-400/[0.03]"
                        }`}
                        key={permission.value}
                      >
                        <input
                          checked={answers.sensitivePermissions.includes(permission.value)}
                          className="h-4 w-4 rounded border-white/20 bg-white/5 text-brand-400 focus:ring-brand-400/30"
                          onChange={() =>
                            updateAnswer(
                              "sensitivePermissions",
                              toggleArrayValue(
                                answers.sensitivePermissions,
                                permission.value,
                              ),
                            )
                          }
                          type="checkbox"
                        />
                        {permission.label}
                      </label>
                    ))}
                  </div>
                </div>
              </FieldGroup>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-brand-400 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-brand-400/20 transition hover:bg-brand-300"
                  onClick={() => setAnswers(exampleAnswers)}
                  type="button"
                >
                  Load Risky Example
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-white/10"
                  onClick={() => setAnswers(defaultAnswers)}
                  type="button"
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {demoPresets.map((demo) => (
                  <button
                    key={demo.label}
                    className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-gray-400 transition hover:border-brand-400/30 hover:text-brand-400"
                    onClick={() => setAnswers(demo.answers)}
                    type="button"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24" aria-live="polite">
            <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="border-b border-white/5 px-6 py-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-400/70">
                      Instant Report
                    </p>
                    <h3 className="mt-2 text-2xl font-extrabold text-white">
                      {answers.appName || "Untitled app"}
                    </h3>
                  </div>
                  <span
                    className={`w-fit rounded-full border px-3 py-1.5 text-sm font-bold ${statusClasses(
                      report.status,
                    )}`}
                  >
                    {report.status} Review Risk
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">
                      Approval Chance
                    </p>
                    <p className="mt-2 text-4xl font-extrabold text-white">
                      {report.approvalChance}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 sm:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-gray-400">App Store Risk</p>
                      <span className="text-sm font-bold text-white">
                        {report.appStoreRisk}%
                      </span>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${scoreColor(report.appStoreRisk)}`}
                        style={{ width: `${report.appStoreRisk}%` }}
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-gray-400">Google Play Risk</p>
                      <span className="text-sm font-bold text-white">
                        {report.googlePlayRisk}%
                      </span>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full ${scoreColor(report.googlePlayRisk)}`}
                        style={{ width: `${report.googlePlayRisk}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-5 rounded-xl border border-brand-400/10 bg-brand-400/[0.03] px-4 py-3 text-sm font-medium leading-6 text-gray-300">
                  {report.summary}
                </p>

                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-gray-500">
                      Missing Compliance
                    </h4>
                    <div className="mt-3 space-y-2">
                      {report.missingRequirements.map((item) => (
                        <div
                          className="flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.04] px-4 py-3 text-sm font-semibold text-amber-300"
                          key={item}
                        >
                          <span className="mt-0.5 text-amber-400">
                            <AlertIcon />
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-gray-500">
                      Potential Rejections
                    </h4>
                    <div className="mt-3 space-y-2">
                      {report.potentialRejections.map((item) => (
                        <div
                          className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm font-semibold text-gray-300"
                          key={item}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-gray-500">
                      Privacy Checklist
                    </h4>
                    <Checklist items={report.privacyChecklist} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-gray-500">
                      Review Checklist
                    </h4>
                    <Checklist items={report.reviewChecklist} />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-gray-500">
                    Recommended Next Steps
                  </h4>
                  <div className="mt-4 space-y-3">
                    {report.recommendations.length > 0 ? (
                      report.recommendations.map((item) => (
                        <p className="flex gap-3 text-sm leading-6 text-gray-300" key={item}>
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-400 text-black">
                            <CheckIcon />
                          </span>
                          {item}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-gray-500">
                        No urgent fixes detected. Re-check the report after metadata,
                        screenshots, and store listing content are final.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-gray-400 transition hover:border-white/20 hover:text-white"
                    onClick={() => { recordHistory(); setShowSaveInput(true); }}
                    type="button"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    Save
                  </button>
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-medium text-gray-400 transition hover:border-white/20 hover:text-white"
                    onClick={copyShareLink}
                    type="button"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    {copied ? "Copied!" : "Share"}
                  </button>
                </div>

                {showSaveInput ? (
                  <div className="mt-3 flex gap-2">
                    <input
                      className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white outline-none placeholder:text-gray-600 focus:border-brand-400/30"
                      placeholder="Report name..."
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { recordHistory(); saveNewReport(); } }}
                    />
                    <button
                      className="rounded-lg bg-brand-400 px-3 py-2 text-xs font-bold text-black transition hover:bg-brand-300"
                      onClick={() => { recordHistory(); saveNewReport(); }}
                    >
                      Save
                    </button>
                  </div>
                ) : null}

                {history.length > 0 ? (
                  <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500">Score History</h4>
                      <button className="text-[10px] text-gray-600 transition hover:text-red-400" onClick={() => setHistory([])}>Clear</button>
                    </div>
                    <div className="space-y-1.5">
                      {history.slice(0, 6).map((h, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="truncate text-gray-400 max-w-[80px]">{h.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${h.appStoreRisk >= 65 ? "text-red-400" : h.appStoreRisk >= 35 ? "text-amber-400" : "text-emerald-400"}`}>{h.appStoreRisk}%</span>
                            <span className="text-gray-600">|</span>
                            <span className={`font-semibold ${h.googlePlayRisk >= 65 ? "text-red-400" : h.googlePlayRisk >= 35 ? "text-amber-400" : "text-emerald-400"}`}>{h.googlePlayRisk}%</span>
                            <button
                              className="ml-1 text-gray-600 transition hover:text-brand-400"
                              onClick={() => setCompare(compare?.name === h.name ? null : { name: h.name, appStoreRisk: h.appStoreRisk, googlePlayRisk: h.googlePlayRisk })}
                              title="Compare"
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="6" height="18" rx="1"/><rect x="16" y="3" width="6" height="18" rx="1"/></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {compare ? (
                  <div className="mt-3 rounded-xl border border-brand-400/20 bg-brand-400/[0.04] p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-brand-400">Compare: {compare.name}</span>
                      <button className="text-gray-600 transition hover:text-red-400" onClick={() => setCompare(null)}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                    <div className="mt-2 space-y-1 text-[11px]">
                      <div className="flex justify-between text-gray-400">
                        <span>App Store Risk</span>
                        <span className={report.appStoreRisk < compare.appStoreRisk ? "text-emerald-400" : report.appStoreRisk > compare.appStoreRisk ? "text-red-400" : "text-gray-400"}>
                          {report.appStoreRisk}% vs {compare.appStoreRisk}%
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Google Play Risk</span>
                        <span className={report.googlePlayRisk < compare.googlePlayRisk ? "text-emerald-400" : report.googlePlayRisk > compare.googlePlayRisk ? "text-red-400" : "text-gray-400"}>
                          {report.googlePlayRisk}% vs {compare.googlePlayRisk}%
                        </span>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="mt-5 flex gap-3">
                  <button
                    className="flex-1 inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-white/10"
                    onClick={downloadPDF}
                    type="button"
                  >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <path d="M14 2v6h6" />
                      <path d="M12 18v-6M9 15l3 3 3-3" />
                    </svg>
                    Download PDF
                  </button>
                  <button
                    className="flex-1 inline-flex items-center justify-center rounded-xl bg-brand-400 px-5 py-3 text-sm font-bold text-black shadow-lg shadow-brand-400/20 transition hover:bg-brand-300 hover:shadow-brand-400/30 focus:outline-none focus:ring-4 focus:ring-brand-400/30"
                    onClick={copyReport}
                    type="button"
                  >
                    {copied ? "Report Copied" : "Copy Report"}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
    </>
  );
}
