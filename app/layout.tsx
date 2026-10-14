import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Экспортный патруль — проверка внешнеторговых сделок',
  description: 'Предварительная оценка правовых и регуляторных рисков экспорта и импорта товаров с участием России.',
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
