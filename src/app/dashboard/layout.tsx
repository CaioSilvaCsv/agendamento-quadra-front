import { Header } from "@/components/header/header";
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header /> 
      {/* <Navbar /> */}
      <div className="flex-1">{children}</div>
    </div>
  );
}