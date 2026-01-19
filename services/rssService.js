import Parser from 'rss-parser';

const parser = new Parser();

const FEEDS = [
  { name: 'CNBC Finance', url: 'https://search.cnbc.com/rs/search/all/view.rss?partnerId=2000&keywords=finance' },
  { name: 'Reuters Markets', url: 'https://www.reutersagency.com/feed/?best-topics=markets&post_type=best' },
  { name: 'WSJ Markets', url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml' }
];

export async function getTopHeadlines(count = 5) {
  const allHeadlines = [];

  for (const feed of FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);
      feedData.items.forEach(item => {
        allHeadlines.push({
          source: feed.name,
          title: item.title,
          contentSnippet: item.contentSnippet || item.description || '',
          link: item.link,
          isoDate: item.isoDate
        });
      });
    } catch (err) {
      console.error(`Error fetching RSS feed ${feed.name}:`, err.message);
    }
  }

  // Sort by date (newest first) and take the top X
  return allHeadlines
    .sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate))
    .slice(0, count);
}
