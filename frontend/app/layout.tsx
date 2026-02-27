import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Event Registry",
  description: "Registre eventos culturais com linguagem natural",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
