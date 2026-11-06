import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'SPORTIQ AI',
  description: 'Football Intelligence & Analytics',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
