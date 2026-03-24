import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stock Screener Formula Builder',
  description: 'Custom stock screening and backtesting with formula parsing.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
