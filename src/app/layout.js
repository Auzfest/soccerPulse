"use client";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';
import { ColorProvider } from './components/colorContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
<link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"/>
        <SessionProvider>
          <ColorProvider>
            {children}
          </ColorProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
