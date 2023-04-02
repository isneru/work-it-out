import { ClerkProvider } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { type AppType } from "next/app"
import Head from "next/head"
import { api } from "utils/api"
import { SidebarProvider, ToastProvider } from "utils/providers"

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
        <SidebarProvider>
          <Component {...pageProps} />
        </SidebarProvider>
      </ToastProvider>
    </ClerkProvider>
  )
}

export default api.withTRPC(MyApp)
