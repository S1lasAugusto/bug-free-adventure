// src/pages/_app.tsx
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { AppType } from "next/app";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const isRegula =
    router.pathname.startsWith("/regula") ||
    router.pathname.startsWith("/plan/");

  return (
    <ThemeProvider attribute="class" enableSystem={false}>
      <Head>
        <meta
          name="google-site-verification"
          content="9hH0whHzR4kwqqYNqU9Gw201EcjJG1Ryu9GYdJlbEjI"
        />
      </Head>
      <SessionProvider session={session}>
        <div className="fixed w-full">
          {isRegula ? (
            <Component {...pageProps} />
          ) : (
            <Sidebar>
              <Component {...pageProps} />
            </Sidebar>
          )}
        </div>
        <Toaster position="top-right" />
      </SessionProvider>
      <Analytics />
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
