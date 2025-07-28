'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

interface LocaleSwitcherProps {
  locales: string[];
}

const LocaleSwitcher = ({ locales }: LocaleSwitcherProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const defaultLocale = 'en'; // Default locale
  const activeLocale = pathname?.split('/')[1] || defaultLocale;

  const changeLocale = (newLocale: string) => {
    if (newLocale === defaultLocale) {
      const segments = pathname.split('/');
      segments.splice(1, 1); // Remove the locale segment
      const newPathname = segments.join('/') || '/';
      router.push(newPathname);
    } else {
      const segments = pathname.split('/');
      segments[1] = newLocale; // Replace or add the new locale
      const newPathname = `/${segments.filter(Boolean).join('/')}`;
      router.push(newPathname);
    }
  };

  return (
    <div className="relative">
      <label htmlFor="locale-switcher" className="sr-only">
        Choose language
      </label>
      <select
        id="locale-switcher"
        value={activeLocale === defaultLocale ? defaultLocale : activeLocale}
        onChange={(e) => changeLocale(e.target.value)}
        className="bg-black text-white border border-gray-600 rounded-lg px-4 py-2 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale} className="bg-black text-white">
            {locale.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocaleSwitcher;
