import "@styles/globals.css";
import type { AppProps } from "next/app";
import { UserContext } from "@lib/context";
import { useUserData } from "@lib/hooks";
import Header from "@components/Header";
import { Provider as JotaiProvider } from "jotai";
import Metatags from "@components/Metatags";
import { Toaster } from "react-hot-toast";
import Footer from "@components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <JotaiProvider>
        <Toaster />
        <Metatags title="FOSS Mentoring" description="Sign up for FOSS Mentoring!" />
        <Header />
        <Component {...pageProps} />
        <Footer />
      </JotaiProvider>
    </UserContext.Provider>
  );
}
