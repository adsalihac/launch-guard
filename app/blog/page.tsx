"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  title: string;
  link: string;
  source: string;
  snippet: string;
  date: string;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getCategory(title: string, snippet: string): string {
  const t = `${title} ${snippet}`.toLowerCase();
  if (t.includes("app store") || t.includes("apple") || t.includes("ios")) return "App Store";
  if (t.includes("google play") || t.includes("android")) return "Google Play";
  if (t.includes("privacy") || t.includes("data")) return "Privacy";
  if (t.includes("subscription") || t.includes("pay")) return "Monetization";
  if (t.includes("reject") || t.includes("review") || t.includes("guideline")) return "Review";
  return "Policy";
}

const categoryColors: Record<string, string> = {
  "App Store": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Google Play": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Privacy: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Monetization: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Review: "bg-red-500/10 text-red-400 border-red-500/20",
  Policy: "bg-brand-400/10 text-brand-400 border-brand-400/20",
};

export default function Blog() {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setArticles(data.articles);
      } catch {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-400/10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V7" />
                <path d="M10 7h6M10 11h6M10 15h4" />
              </svg>
            </div>
            <span className="text-lg font-bold">Blog</span>
          </a>
          <a href="/" className="text-sm text-gray-400 transition hover:text-white">
            Back to App
          </a>
        </div>
      </nav>

      <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-brand-400/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-400/20 bg-brand-400/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-brand-400" />
            <span className="text-sm font-semibold text-brand-400">Auto-curated News</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            App Store & Google Play <br />
            <span className="text-brand-400">Policy Intelligence</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-gray-400">
            Stay ahead of policy changes, rejection trends, and submission best practices
            curated from Apple, Google, and industry sources.
          </p>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="mx-auto max-w-5xl px-6">
          {loading ? (
            <div className="space-y-6">
              <div className="h-56 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-44 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]" />
                ))}
              </div>
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-16 text-center">
              <svg className="mx-auto mb-4 h-12 w-12 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-lg font-semibold text-gray-300">No articles right now</p>
              <p className="mt-1 text-sm text-gray-500">Check back later for the latest policy updates.</p>
            </div>
          ) : (
            <>
              {featured ? (
                <a
                  href={featured.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative mb-10 block overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-white/[0.12] sm:p-8"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 max-w-2xl">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[getCategory(featured.title, featured.snippet)]}`}>
                          {getCategory(featured.title, featured.snippet)}
                        </span>
                        <span className="text-xs text-gray-600">Featured</span>
                      </div>
                      <h2 className="text-xl font-bold text-white transition group-hover:text-brand-400 sm:text-2xl line-clamp-2">
                        {featured.title}
                      </h2>
                      <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
                        <span className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-xs">
                          {featured.source}
                        </span>
                        <span>{formatDate(featured.date)}</span>
                        <span className="flex items-center gap-1 text-brand-400 opacity-0 transition group-hover:opacity-100">
                          Read more
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <div className="hidden h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] sm:flex">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3ecf8e" strokeWidth="1.2">
                        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V7" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 7h6M10 11h6M10 15h4" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </a>
              ) : null}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article, i) => (
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`${article.link}-${i}`}
                    className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    <span className={`mb-3 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${categoryColors[getCategory(article.title, article.snippet)]}`}>
                      {getCategory(article.title, article.snippet)}
                    </span>
                    <h3 className="text-sm font-bold text-white transition group-hover:text-brand-400 line-clamp-2">
                      {article.title}
                    </h3>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                      <span className="truncate max-w-[120px]">{article.source}</span>
                      <span>{formatDate(article.date)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Never miss a policy update
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            Follow along with the latest App Store and Google Play policy changes, rejection
            trends, and submission best practices — auto-curated from official sources.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-400 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-brand-400/20 transition hover:bg-brand-300"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Check Your App Risk
          </a>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs text-gray-600">
            Curated from Apple Developer, Android Developers Blog, 9to5Mac, TechCrunch, and other industry sources.
            LaunchGuard does not own or edit these articles.
          </p>
        </div>
      </footer>
    </main>
  );
}
