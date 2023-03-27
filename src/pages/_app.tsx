import { ClerkProvider } from "@clerk/nextjs"
import { type AppType } from "next/app"
import Head from "next/head"
import { api } from "utils/api"
import { ToastProvider } from "utils/providers"

import { dark } from "@clerk/themes"
import "styles/globals.css"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
      {...pageProps}>
      <Head>
        <title>Work it Out</title>
        <meta name="description" content="🏋️‍♂️" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
