"use client";

import { useMemo, useState } from "react";
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

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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

function StatusIcon({ status }: { status: ChecklistStatus }) {
  if (status === "Ready") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
        <CheckIcon />
      </span>
    );
  }

  if (status === "Review") {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-200">
        <AlertIcon />
      </span>
    );
  }

  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-1 ring-amber-200">
      <AlertIcon />
    </span>
  );
}

function statusClasses(status: string) {
  if (status === "Low") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "Medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-red-200 bg-red-50 text-red-700";
}

function scoreColor(score: number) {
  if (score >= 65) {
    return "bg-red-500";
  }

  if (score >= 35) {
    return "bg-amber-500";
  }

  return "bg-emerald-500";
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
    <fieldset className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <legend className="px-1 text-base font-bold text-slate-950">{title}</legend>
      <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
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
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/30">
      <span>
        <span className="block text-sm font-bold text-slate-800">{label}</span>
        <span className="mt-1 block text-sm leading-5 text-slate-500">{description}</span>
      </span>
      <input
        checked={checked}
        className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
    </label>
  );
}

function Checklist({ items }: { items: ChecklistItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4" key={item.label}>
          <StatusIcon status={item.status} />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-slate-950">{item.label}</p>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                {item.status}
              </span>
            </div>
            <p className="mt-1 text-sm leading-5 text-slate-500">{item.note}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function RiskChecker() {
  const [answers, setAnswers] = useState<RiskAnswers>(defaultAnswers);
  const [copied, setCopied] = useState(false);
  const report = useMemo(() => calculateRiskReport(answers), [answers]);

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

  return (
    <section className="border-y border-slate-200 bg-slate-50" id="checker">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Live App Checker
            </p>
            <h2 className="font-heading text-4xl font-bold leading-tight text-slate-950 sm:text-5xl">
              Check your app before you submit
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Answer the same review-sensitive questions your team should resolve before
              upload. LaunchGuard updates the risk report instantly.
            </p>

            <div className="mt-8 space-y-5">
              <FieldGroup
                title="App profile"
                description="Set the broad product context so the report can weight policy-sensitive categories."
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">App name</span>
                    <input
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      onChange={(event) => updateAnswer("appName", event.target.value)}
                      placeholder="My App"
                      type="text"
                      value={answers.appName}
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">Category</span>
                    <select
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      onChange={(event) =>
                        updateAnswer("category", event.target.value as AppCategory)
                      }
                      value={answers.category}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {categoryLabel(category)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-sm font-bold text-slate-700">Build stack</span>
                    <select
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      onChange={(event) =>
                        updateAnswer("framework", event.target.value as Framework)
                      }
                      value={answers.framework}
                    >
                      {frameworks.map((framework) => (
                        <option key={framework.value} value={framework.value}>
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
                  <p className="text-sm font-bold text-slate-700">Collected data</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {dataTypes.map((dataType) => (
                      <label
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/30"
                        key={dataType.value}
                      >
                        <input
                          checked={answers.dataTypes.includes(dataType.value)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
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
                  <p className="text-sm font-bold text-slate-700">Sensitive permissions</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {permissions.map((permission) => (
                      <label
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50/30"
                        key={permission.value}
                      >
                        <input
                          checked={answers.sensitivePermissions.includes(permission.value)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
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
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
                  onClick={() => setAnswers(exampleAnswers)}
                  type="button"
                >
                  Load Risky Example
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
                  onClick={() => setAnswers(defaultAnswers)}
                  type="button"
                >
                  Reset Checker
                </button>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24" aria-live="polite">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)]">
              <div className="border-b border-slate-200 bg-slate-950 px-6 py-5 text-white">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                      Instant Report
                    </p>
                    <h3 className="font-heading mt-2 text-2xl font-bold">
                      {answers.appName || "Untitled app"}
                    </h3>
                  </div>
                  <span
                    className={`w-fit rounded-full border px-3 py-1.5 text-sm font-black ${statusClasses(
                      report.status,
                    )}`}
                  >
                    {report.status} Review Risk
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      Approval Chance
                    </p>
                    <p className="font-heading mt-2 text-4xl font-bold text-slate-950">
                      {report.approvalChance}%
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-slate-700">App Store Risk</p>
                      <span className="text-sm font-black text-slate-950">
                        {report.appStoreRisk}%
                      </span>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${scoreColor(report.appStoreRisk)}`}
                        style={{ width: `${report.appStoreRisk}%` }}
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <p className="text-sm font-bold text-slate-700">Google Play Risk</p>
                      <span className="text-sm font-black text-slate-950">
                        {report.googlePlayRisk}%
                      </span>
                    </div>
                    <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full ${scoreColor(report.googlePlayRisk)}`}
                        style={{ width: `${report.googlePlayRisk}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
                  {report.summary}
                </p>

                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                      Missing Compliance
                    </h4>
                    <div className="mt-3 space-y-2">
                      {report.missingRequirements.map((item) => (
                        <div
                          className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
                          key={item}
                        >
                          <span className="mt-0.5 text-amber-600">
                            <AlertIcon />
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                      Potential Rejections
                    </h4>
                    <div className="mt-3 space-y-2">
                      {report.potentialRejections.map((item) => (
                        <div
                          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700"
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
                    <h4 className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                      Privacy Checklist
                    </h4>
                    <Checklist items={report.privacyChecklist} />
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                      Review Checklist
                    </h4>
                    <Checklist items={report.reviewChecklist} />
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h4 className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                    Recommended Next Steps
                  </h4>
                  <div className="mt-4 space-y-3">
                    {report.recommendations.length > 0 ? (
                      report.recommendations.map((item) => (
                        <p className="flex gap-3 text-sm leading-6 text-slate-700" key={item}>
                          <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
                            <CheckIcon />
                          </span>
                          {item}
                        </p>
                      ))
                    ) : (
                      <p className="text-sm leading-6 text-slate-600">
                        No urgent fixes detected. Re-check the report after metadata,
                        screenshots, and store listing content are final.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  onClick={copyReport}
                  type="button"
                >
                  {copied ? "Report Copied" : "Copy Report"}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
