import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import { Toaster } from "react-hot-toast";

import client from "./../apollo";
import ThemeProvider from "../mui/Theme";

import "../styles/index.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <ThemeProvider>
          <Toaster />
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
