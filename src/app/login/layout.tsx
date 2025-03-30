import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Login",
};

/**
 * 
 * Layout para as rotas de login
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
