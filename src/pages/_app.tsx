// src/pages/_app.tsx
import { ThemeProvider } from "next-themes";
import type { AppType } from "next/app";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { api } from "../utils/api";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "../contexts/AuthContext";

const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  const isAuthPage = router.pathname.startsWith("/auth/");

  return (
    <ThemeProvider attribute="class" enableSystem={false}>
      <Head>
        <meta
          name="google-site-verification"
          content="9hH0whHzR4kwqqYNqU9Gw201EcjJG1Ryu9GYdJlbEjI"
        />
      </Head>
      <AuthProvider>
        <div className="fixed w-full">
          {isAuthPage ? (
            <Component {...pageProps} />
          ) : (
            <Sidebar>
              <Component {...pageProps} />
            </Sidebar>
          )}
        </div>
        <Toaster position="top-right" />
      </AuthProvider>
      <Analytics />
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
