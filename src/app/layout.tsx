import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { ModeToggle } from "@/components/mode-toggle";
import { AuthProvider } from "@/context/auth";
import { Toaster } from "@/components/ui/sonner";
import { BookingUpdateProvider } from "@/context/BookingUpdateContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define o título padrão da página
export const metadata: Metadata = {
  title:{
    template: "%s | QuadraFácil",
    default: "QuadraFácil",
  },
  icons: "/icon.ico",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        <BookingUpdateProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModeToggle className="fixed z-50 right-4 bottom-4" />
            {children}
            <Toaster />
          </ThemeProvider>
          </BookingUpdateProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
