import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import DynamicWrapper from "../components/DynamicWrapper";
import Providers from "./providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Net Worth Game",
  description: "Net Worth Game Created For Fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <DynamicWrapper>
        <body className={inter.className}>
          <Providers>{children}</Providers>
        </body>
      </DynamicWrapper>
    </html>
  );
}
