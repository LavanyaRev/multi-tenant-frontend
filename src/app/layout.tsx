'use client';
import { AuthProvider } from '../context/AuthContext';
import '@/app/globals.css'; // import globals.css from src/app


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
