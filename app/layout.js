import './globals.css';

export const metadata = {
  title: 'Sudoko Solver',
  description: 'Sudoko Solver App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
