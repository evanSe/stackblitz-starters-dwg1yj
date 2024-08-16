import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata = {
  title: "Handsontable Demo",
  description: "Showing off the new react wrapper",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
