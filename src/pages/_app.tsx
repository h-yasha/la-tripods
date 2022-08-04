import React from "react";
import "@fontsource/roboto";
import "../styles/index.css";
import { QueryClient, QueryClientProvider } from "react-query";

import type { AppProps } from "next/app";

import { withTRPC } from "@trpc/next";
import { AppRouter } from "./api/trpc/[trpc]";

import DefaultLayout from "../layout/Default";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false },
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DefaultLayout>
        <Component {...pageProps} />
      </DefaultLayout>
    </QueryClientProvider>
  </React.StrictMode>
);

export default withTRPC<AppRouter>({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/trpc`
      : "/api/trpc";

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
  responseMeta({ clientErrors }) {
    if (clientErrors.length) {
      // propagate http first error from API calls
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }

    // cache request for 1 day + revalidate once every second
    const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
    return {
      headers: {
        "cache-control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
      },
    };
  },
})(MyApp);
