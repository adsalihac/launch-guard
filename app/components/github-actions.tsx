"use client";

import { useEffect, useState } from "react";

const repoUrl = "https://github.com/adsalihac/launch-guard";
const apiUrl = "https://api.github.com/repos/adsalihac/launch-guard";

function GitHubIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.42-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13v3.16c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  );
}

function StarIcon() {
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
        d="m12 3.5 2.65 5.37 5.93.86-4.29 4.18 1.01 5.9L12 17.02l-5.3 2.79 1.01-5.9-4.29-4.18 5.93-.86L12 3.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatStars(count: number) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k`;
  }

  return count.toLocaleString();
}

export function GitHubActions() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadStars() {
      try {
        const response = await fetch(apiUrl, {
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: 3600 },
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { stargazers_count?: number };

        if (mounted && typeof data.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      } catch {
        if (mounted) {
          setStars(null);
        }
      }
    }

    loadStars();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex items-center gap-2">
      <a
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-white/10"
        href={repoUrl}
        rel="noreferrer"
        target="_blank"
      >
        <StarIcon />
        <span className="hidden sm:inline">Star</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold text-gray-400">
          {stars === null ? "-" : formatStars(stars)}
        </span>
      </a>
      <a
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-400 px-3.5 py-2.5 text-sm font-bold text-black transition hover:bg-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-400/30"
        href={`${repoUrl}/fork`}
        rel="noreferrer"
        target="_blank"
      >
        <GitHubIcon />
        <span className="hidden min-[420px]:inline">Contribute</span>
      </a>
    </div>
  );
}
