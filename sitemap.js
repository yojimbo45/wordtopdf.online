// app/sitemap.js

export async function GET() {
    const siteUrl = 'https://wordtopdf.online';

    // Optional: fetch dynamic pages (e.g., from CMS, DB, etc.)
    const staticRoutes = ['', '/about', '/contact', '/tools/pdf-merge'];

    const urls = staticRoutes.map(route => {
        return `
      <url>
        <loc>${siteUrl}${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.join('\n')}
  </urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
