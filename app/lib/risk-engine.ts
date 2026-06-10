export type AppCategory =
  | "productivity"
  | "social"
  | "commerce"
  | "finance"
  | "health"
  | "education"
  | "games"
  | "marketplace";

export type Framework = "native" | "react-native" | "expo" | "flutter" | "other";

export type DataType =
  | "contact"
  | "location"
  | "health"
  | "financial"
  | "photos"
  | "usage"
  | "identifiers";

export type PermissionType =
  | "camera"
  | "location"
  | "contacts"
  | "notifications"
  | "microphone"
  | "photos";

export type ChecklistStatus = "Ready" | "Missing" | "Review";

export type ChecklistItem = {
  label: string;
  status: ChecklistStatus;
  note: string;
};

export type RiskAnswers = {
  appName: string;
  category: AppCategory;
  framework: Framework;
  authRequired: boolean;
  reviewerAccess: boolean;
  accountDeletion: boolean;
  privacyPolicy: boolean;
  privacyLabels: boolean;
  dataSafetyForm: boolean;
  dataTypes: DataType[];
  usesTracking: boolean;
  trackingConsent: boolean;
  hasSubscriptions: boolean;
  subscriptionDisclosures: boolean;
  usesExternalPayments: boolean;
  hasUserGeneratedContent: boolean;
  moderationTools: boolean;
  contentReporting: boolean;
  userBlocking: boolean;
  legalDocs: boolean;
  sensitivePermissions: PermissionType[];
  targetChildren: boolean;
  regulatedContent: boolean;
  reviewerNotes: boolean;
};

export type RiskReport = {
  appStoreRisk: number;
  googlePlayRisk: number;
  approvalChance: number;
  status: "Low" | "Medium" | "High";
  summary: string;
  missingRequirements: string[];
  privacyChecklist: ChecklistItem[];
  reviewChecklist: ChecklistItem[];
  potentialRejections: string[];
  recommendations: string[];
};

export const defaultAnswers: RiskAnswers = {
  appName: "Launch build",
  category: "productivity",
  framework: "expo",
  authRequired: true,
  reviewerAccess: true,
  accountDeletion: false,
  privacyPolicy: true,
  privacyLabels: false,
  dataSafetyForm: true,
  dataTypes: ["usage", "identifiers"],
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
  sensitivePermissions: ["notifications"],
  targetChildren: false,
  regulatedContent: false,
  reviewerNotes: true,
};

const categoryRisk: Record<AppCategory, { apple: number; google: number; label: string }> = {
  productivity: { apple: 3, google: 3, label: "Productivity" },
  social: { apple: 10, google: 11, label: "Social or community" },
  commerce: { apple: 8, google: 8, label: "Commerce" },
  finance: { apple: 14, google: 12, label: "Finance" },
  health: { apple: 15, google: 13, label: "Health or wellness" },
  education: { apple: 5, google: 5, label: "Education" },
  games: { apple: 7, google: 6, label: "Games" },
  marketplace: { apple: 12, google: 10, label: "Marketplace" },
};

const hasDataCollection = (answers: RiskAnswers) => answers.dataTypes.length > 0;

function clampScore(score: number) {
  return Math.max(3, Math.min(96, Math.round(score)));
}

function pushUnique(list: string[], item: string) {
  if (!list.includes(item)) {
    list.push(item);
  }
}

function statusFromRisk(risk: number): RiskReport["status"] {
  if (risk >= 65) {
    return "High";
  }

  if (risk >= 35) {
    return "Medium";
  }

  return "Low";
}

function checklistItem(
  label: string,
  status: ChecklistStatus,
  note: string,
): ChecklistItem {
  return { label, status, note };
}

export function categoryLabel(category: AppCategory) {
  return categoryRisk[category].label;
}

export function calculateRiskReport(answers: RiskAnswers): RiskReport {
  let appleRisk = 7 + categoryRisk[answers.category].apple;
  let googleRisk = 7 + categoryRisk[answers.category].google;
  const missingRequirements: string[] = [];
  const potentialRejections: string[] = [];
  const recommendations: string[] = [];

  if (answers.framework === "expo" || answers.framework === "react-native") {
    appleRisk += 2;
    googleRisk += 2;
    recommendations.push("Confirm native permission strings and store metadata match the app behavior.");
  }

  if (hasDataCollection(answers) && !answers.privacyPolicy) {
    appleRisk += 18;
    googleRisk += 20;
    pushUnique(missingRequirements, "Privacy policy URL");
    pushUnique(potentialRejections, "Missing privacy disclosures");
    recommendations.push("Publish a privacy policy before submission and link it in both store listings.");
  }

  if (hasDataCollection(answers) && !answers.privacyLabels) {
    appleRisk += 14;
    googleRisk += 8;
    pushUnique(missingRequirements, "App Store privacy nutrition labels");
    pushUnique(potentialRejections, "Incomplete App Store privacy information");
    recommendations.push("Map each collected data type to Apple privacy nutrition labels.");
  }

  if (hasDataCollection(answers) && !answers.dataSafetyForm) {
    appleRisk += 5;
    googleRisk += 16;
    pushUnique(missingRequirements, "Google Play Data safety form");
    pushUnique(potentialRejections, "Incomplete Google Play data safety declaration");
    recommendations.push("Complete the Play Console Data safety form before review.");
  }

  if (answers.usesTracking && !answers.trackingConsent) {
    appleRisk += 16;
    googleRisk += 8;
    pushUnique(missingRequirements, "Tracking consent and disclosure flow");
    pushUnique(potentialRejections, "Tracking disclosure or consent issue");
    recommendations.push("Add a clear tracking consent flow and align disclosures with collected data.");
  }

  if (answers.authRequired && !answers.reviewerAccess) {
    appleRisk += 13;
    googleRisk += 8;
    pushUnique(missingRequirements, "Reviewer demo access or test credentials");
    pushUnique(potentialRejections, "Review team cannot access app functionality");
    recommendations.push("Provide demo credentials, reviewer notes, or a review-safe access path.");
  }

  if (answers.authRequired && !answers.accountDeletion) {
    appleRisk += 14;
    googleRisk += 9;
    pushUnique(missingRequirements, "In-app account deletion flow");
    pushUnique(potentialRejections, "Account deletion non-compliance");
    recommendations.push("Add a discoverable in-app account deletion flow before submission.");
  }

  if (answers.hasSubscriptions && !answers.subscriptionDisclosures) {
    appleRisk += 16;
    googleRisk += 12;
    pushUnique(missingRequirements, "Subscription price, renewal, and cancellation disclosures");
    pushUnique(potentialRejections, "Subscription disclosure issue");
    recommendations.push("Show pricing, renewal terms, cancellation path, and trial details near purchase.");
  }

  if (answers.usesExternalPayments) {
    appleRisk += 14;
    googleRisk += 11;
    pushUnique(missingRequirements, "External payment policy review");
    pushUnique(potentialRejections, "External payment or purchase flow violation");
    recommendations.push("Review whether external payments are allowed for your category and region.");
  }

  if (answers.hasUserGeneratedContent) {
    appleRisk += 6;
    googleRisk += 7;

    if (!answers.moderationTools || !answers.contentReporting || !answers.userBlocking) {
      appleRisk += 17;
      googleRisk += 16;
      pushUnique(missingRequirements, "UGC moderation, reporting, and blocking controls");
      pushUnique(potentialRejections, "User-generated content moderation gap");
      recommendations.push("Add content reporting, moderation response, and user blocking controls.");
    }
  }

  if (!answers.legalDocs) {
    appleRisk += 8;
    googleRisk += 8;
    pushUnique(missingRequirements, "Terms, privacy, and support documentation");
    pushUnique(potentialRejections, "Incomplete legal documentation");
    recommendations.push("Prepare public terms, support contact, and legal policy links.");
  }

  if (answers.sensitivePermissions.length > 0) {
    appleRisk += answers.sensitivePermissions.length * 3;
    googleRisk += answers.sensitivePermissions.length * 5;
    recommendations.push("Ensure permission prompts explain the user benefit in plain language.");
  }

  if (answers.targetChildren) {
    appleRisk += 15;
    googleRisk += 16;
    pushUnique(missingRequirements, "Children and family policy compliance review");
    pushUnique(potentialRejections, "Children data, ads, or safety compliance issue");
    recommendations.push("Review children privacy, ads, tracking, and age-appropriate content requirements.");
  }

  if (answers.regulatedContent) {
    appleRisk += 12;
    googleRisk += 11;
    pushUnique(missingRequirements, "Regulated content disclaimers and review evidence");
    pushUnique(potentialRejections, "Regulated health, finance, or legal claims need substantiation");
    recommendations.push("Add disclaimers and reviewer notes for regulated health, finance, or legal features.");
  }

  if (!answers.reviewerNotes) {
    appleRisk += 6;
    googleRisk += 4;
    pushUnique(missingRequirements, "Reviewer notes with feature and test instructions");
    recommendations.push("Add concise reviewer notes for subscriptions, login, permissions, and edge cases.");
  }

  const appStoreRisk = clampScore(appleRisk);
  const googlePlayRisk = clampScore(googleRisk);
  const blendedRisk = Math.round((appStoreRisk + googlePlayRisk) / 2);
  const approvalChance = Math.max(4, Math.min(98, 100 - blendedRisk));
  const status = statusFromRisk(blendedRisk);

  const privacyChecklist: ChecklistItem[] = [
    checklistItem(
      "Privacy policy included",
      answers.privacyPolicy ? "Ready" : "Missing",
      answers.privacyPolicy
        ? "Policy URL can be referenced in store metadata."
        : "Required when the app collects user, device, or usage data.",
    ),
    checklistItem(
      "App Store privacy labels",
      !hasDataCollection(answers) || answers.privacyLabels ? "Ready" : "Missing",
      hasDataCollection(answers)
        ? "Collected data must be reflected in Apple privacy nutrition labels."
        : "No user data collection selected.",
    ),
    checklistItem(
      "Google Play Data safety",
      !hasDataCollection(answers) || answers.dataSafetyForm ? "Ready" : "Missing",
      hasDataCollection(answers)
        ? "Data collection and sharing must be declared in Play Console."
        : "No data safety declaration risk from selected answers.",
    ),
    checklistItem(
      "Tracking consent",
      !answers.usesTracking || answers.trackingConsent ? "Ready" : "Missing",
      answers.usesTracking
        ? "Tracking must be disclosed and gated behind consent where required."
        : "No cross-app or advertising tracking selected.",
    ),
  ];

  const reviewChecklist: ChecklistItem[] = [
    checklistItem(
      "Reviewer access",
      !answers.authRequired || answers.reviewerAccess ? "Ready" : "Missing",
      answers.authRequired
        ? "Reviewers need demo access to gated functionality."
        : "No required login selected.",
    ),
    checklistItem(
      "Account deletion flow",
      !answers.authRequired || answers.accountDeletion ? "Ready" : "Missing",
      answers.authRequired
        ? "Apps with account creation should provide account deletion inside the app."
        : "Not required for the selected login model.",
    ),
    checklistItem(
      "Subscription validation",
      !answers.hasSubscriptions || answers.subscriptionDisclosures ? "Ready" : "Missing",
      answers.hasSubscriptions
        ? "Subscription pricing, renewal, cancellation, and trial terms should be clear."
        : "No subscription flow selected.",
    ),
    checklistItem(
      "UGC safety controls",
      !answers.hasUserGeneratedContent ||
        (answers.moderationTools && answers.contentReporting && answers.userBlocking)
        ? "Ready"
        : "Missing",
      answers.hasUserGeneratedContent
        ? "UGC apps need moderation, reporting, and blocking paths."
        : "No user-generated content selected.",
    ),
    checklistItem(
      "Reviewer notes",
      answers.reviewerNotes ? "Ready" : "Review",
      answers.reviewerNotes
        ? "Submission includes notes for review-sensitive flows."
        : "Add notes for login, permissions, subscriptions, and gated flows.",
    ),
  ];

  if (potentialRejections.length === 0) {
    potentialRejections.push("No major rejection pattern detected from the current answers.");
  }

  if (missingRequirements.length === 0) {
    missingRequirements.push("No critical missing requirements detected.");
  }

  const summary =
    status === "Low"
      ? "This app profile looks close to review-ready. Address any review items before uploading the build."
      : status === "Medium"
        ? "This app has a few review-sensitive areas. Fix the missing items before submitting."
        : "This app has multiple high-risk submission gaps. Resolve the missing requirements before review.";

  return {
    appStoreRisk,
    googlePlayRisk,
    approvalChance,
    status,
    summary,
    missingRequirements,
    privacyChecklist,
    reviewChecklist,
    potentialRejections,
    recommendations: recommendations.slice(0, 6),
  };
}
