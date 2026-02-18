// frontend/src/app/layout.tsx
import '../styles/globals.css';
import { Providers } from '../components/Providers';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'TaskMaster - Boost Your Productivity',
  description: 'The simplest way to manage your tasks and boost productivity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
