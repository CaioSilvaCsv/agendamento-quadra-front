import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro",
};
/**
 * Layout para as rotas de singup
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
