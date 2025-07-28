import type { MetadataRoute } from 'next';
import { getAvailableLocales } from '@/utils/getLocales';

const baseUrl = 'https://ledscroller.online';

const pages = ['']; // Add more paths as needed

export async function generateStaticParams() {
  const locales = getAvailableLocales(); // Dynamically fetch locales

  // Generate params for each combination of pages and locales
  const params = pages.flatMap((path) =>
    locales.map((locale) => ({
      path,
      locale,
    }))
  );

  return params;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = getAvailableLocales(); // Dynamically fetch locales
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const path of pages) {
    const url = `${baseUrl}${path}`;
    const lastModified = new Date();

    // Define the structure of the alternates object explicitly
    const alternates: Record<string, string> = locales.reduce((acc, locale) => {
      acc[locale] = `${baseUrl}/${locale}${path}`;
      return acc;
    }, {} as Record<string, string>);

    sitemapEntries.push({
      url,
      lastModified,
      alternates: { languages: alternates },
    });
  }

  return sitemapEntries;
}
