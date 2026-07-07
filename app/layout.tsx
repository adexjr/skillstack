import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill stack — Learn to Code in Minutes",
  description: "Bite-sized coding lessons. Build a streak. Level up.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body bg-base-950 text-ink-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
