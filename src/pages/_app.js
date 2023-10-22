import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import MainLayout from "@/components/layout";

export default function App({ Component, pageProps }) {
  return (
    <ClerkProvider>
      <NextUIProvider>
        <NextThemesProvider attribute="class">
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </NextThemesProvider>
      </NextUIProvider>
    </ClerkProvider>
  );
}
