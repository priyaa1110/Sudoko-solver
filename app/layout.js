import './globals.css';
import ThemedWrapper from '../components/ThemedWrapper';

export const metadata = {
  title: 'Sudoko Solver',
  description: 'Sudoko Solver App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemedWrapper>{children}</ThemedWrapper>
      </body>
    </html>
  );
}
