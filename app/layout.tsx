import './globals.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LocaleSwitcher from '@/components/LocaleSwitcher';
import { getAvailableLocales } from '@/utils/getLocales';

interface LayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
    const availableLocales = await getAvailableLocales();

    return (
        <html lang="en">
        <body className="relative z-0 min-h-screen font-sans antialiased bg-gradient-to-br from-red-50 to-orange-50 flex flex-col">
        {/* Global Z-index container */}
        <div className="relative z-0">
            <Header />
            <main className="flex-1 z-0 relative">{children}</main>
            <Footer />
        </div>

        {/* Locale Switcher should also appear above everything */}
        <div className="fixed bottom-4 right-4 z-50">
            <LocaleSwitcher locales={availableLocales} />
        </div>
        </body>
        </html>
    );
}
