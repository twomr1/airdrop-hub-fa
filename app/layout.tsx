// app/layout.tsx
import "./globals.css";
import React from "react";

export const metadata = {
  title: "مرجع ایردراپ فارسی",
  description: "ایردراپ‌های کریپتو با فیلتر و پنل ادمین — RTL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}