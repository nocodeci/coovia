import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import NotFound from "@/components/not-found"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// Import the generated route tree
import { routeTree } from "./routeTree.gen"

// Import providers
import { SanctumProvider } from "@/providers/sanctum-provider"
import { ThemeProvider } from "@/context/theme-context"
import { StoreProvider } from "@/context/store-context"
import { DataLoadingProvider } from "@/context/data-loading-context"

// Import our configured QueryClient
import { queryClient } from "@/lib/react-query-client"

// Import styles
import "./index.css"

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultNotFoundComponent: NotFound,
})

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <DataLoadingProvider>
            <SanctumProvider>
              <StoreProvider>
                <RouterProvider router={router} />
              </StoreProvider>
            </SanctumProvider>
          </DataLoadingProvider>
        </ThemeProvider>
        
        {/* React Query DevTools - seulement en développement */}
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </React.StrictMode>,
  )
}
