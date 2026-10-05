import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Экспортный патруль — предварительная проверка экспортной сделки',
  description: 'Демонстрационный сервис предварительного комплаенс-анализа экспортных сделок.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
