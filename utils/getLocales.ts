import fs from 'fs';
import path from 'path';

export const getAvailableLocales = (): string[] => {
  const localesPath = path.join(process.cwd(), 'app/locales');
  try {
    return fs
      .readdirSync(localesPath, { withFileTypes: true })
      .filter((dir) => dir.isDirectory())
      .map((dir) => dir.name);
  } catch (error) {
    console.error('Error reading locales:', error);
    return ['en']; // Default to 'en' if error occurs
  }
};
