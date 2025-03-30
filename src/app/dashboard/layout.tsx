import { Header } from "@/components/header/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header /> 

      <div className="flex-1">{children}</div>
    </div>
  );
}