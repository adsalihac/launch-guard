export const dynamic = "force-dynamic";

const RSS_FEEDS = [
  { url: "https://developer.apple.com/news/rss/news.rss", source: "Apple Developer" },
  { url: "https://9to5mac.com/guides/app-store/feed/", source: "9to5Mac" },
  { url: "https://android-developers.googleblog.com/feeds/posts/default", source: "Android Developers" },
  { url: "https://techcrunch.com/category/mobile/feed/", source: "TechCrunch" },
];

interface NewsItem {
  title: string;
  link: string;
  source: string;
  snippet: string;
  date: string;
}

function parseRSS(xml: string, defaultSource: string): NewsItem[] {
  const items: NewsItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;

  let match: RegExpExecArray | null;
  const isAtom = xml.includes("<entry>");
  const regex = isAtom ? entryRegex : itemRegex;

  while ((match = regex.exec(xml)) !== null) {
    const content = match[1];
    const title = content.match(/<title[^>]*>(.*?)<\/title>/)?.[1] || "";
    const link = isAtom
      ? content.match(/<link[^>]*href="(.*?)"[^>]*\/>/)?.[1]
        || content.match(/<link[^>]*>(.*?)<\/link>/)?.[1]
        || ""
      : content.match(/<link>(.*?)<\/link>/)?.[1] || "";
    const rawSnippet = isAtom
      ? content.match(/<content[^>]*>(.*?)<\/content>/)?.[1]
        || content.match(/<summary[^>]*>(.*?)<\/summary>/)?.[1]
        || ""
      : content.match(/<description>(.*?)<\/description>/)?.[1] || "";
    const snippet = rawSnippet.replace(/<[^>]*>/g, "").slice(0, 250) || "";
    const date = (isAtom
      ? content.match(/<published>(.*?)<\/published>/)?.[1]
        || content.match(/<updated>(.*?)<\/updated>/)?.[1]
      : content.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]) || "";
    const source = content.match(/<source[^>]*>(.*?)<\/source>/)?.[1] || defaultSource;

    if (title) {
      items.push({ title, link, source, snippet, date });
    }
  }

  return items;
}

export async function GET() {
  try {
    const allItems: NewsItem[] = [];
    const seen = new Set<string>();

    for (const feed of RSS_FEEDS) {
      try {
        const res = await fetch(feed.url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; LaunchGuardBot/1.0)" },
          signal: AbortSignal.timeout(6000),
        });
        const xml = await res.text();
        const items = parseRSS(xml, feed.source);

        for (const item of items) {
          const key = item.title.toLowerCase().replace(/\s+/g, " ").trim();
          if (!seen.has(key) && item.title) {
            seen.add(key);
            allItems.push(item);
          }
        }
      } catch {
        continue;
      }
    }

    allItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return Response.json({ articles: allItems.slice(0, 24) });
  } catch {
    return Response.json({ articles: [] });
  }
}
