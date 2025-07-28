import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { getAvailableLocales } from '@/utils/getLocales';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  // If this is an async function, you must await it
  const availableLocales = await getAvailableLocales();

  return (
      <html lang="en">
      <body className="min-h-screen font-sans antialiased bg-gradient-to-br from-red-50 to-orange-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <div className="fixed bottom-4 right-4">
        <LocaleSwitcher locales={availableLocales} />
      </div>
      </body>
      </html>
  );
}
