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

// Import Prism.js for syntax highlighting in the editor
import "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-json"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-bash"
import "prismjs/components/prism-sql"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java"
import "prismjs/components/prism-c"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-csharp"
import "prismjs/components/prism-php"
import "prismjs/components/prism-ruby"
import "prismjs/components/prism-go"
import "prismjs/components/prism-rust"
import "prismjs/components/prism-swift"
import "prismjs/components/prism-kotlin"
import "prismjs/components/prism-scala"
import "prismjs/components/prism-clojure"
import "prismjs/components/prism-haskell"
import "prismjs/components/prism-lua"
import "prismjs/components/prism-perl"
import "prismjs/components/prism-r"
import "prismjs/components/prism-matlab"
import "prismjs/components/prism-scheme"
import "prismjs/components/prism-smalltalk"
import "prismjs/components/prism-tcl"
import "prismjs/components/prism-yaml"
import "prismjs/components/prism-toml"
import "prismjs/components/prism-ini"
import "prismjs/components/prism-docker"
import "prismjs/components/prism-diff"
import "prismjs/components/prism-git"
import "prismjs/components/prism-http"
import "prismjs/components/prism-nginx"
import "prismjs/components/prism-apache"
import "prismjs/components/prism-vim"
import "prismjs/components/prism-emacs"
import "prismjs/components/prism-vscode"
import "prismjs/components/prism-sublime"
import "prismjs/components/prism-atom"
import "prismjs/components/prism-brackets"
import "prismjs/components/prism-codeblocks"
import "prismjs/components/prism-codemirror"
import "prismjs/components/prism-monokai"
import "prismjs/components/prism-github"
import "prismjs/components/prism-tomorrow"
import "prismjs/components/prism-twilight"
import "prismjs/components/prism-vs"
import "prismjs/components/prism-xcode"
import "prismjs/components/prism-okaidia"
import "prismjs/components/prism-coy"
import "prismjs/components/prism-solarizedlight"
import "prismjs/components/prism-solarizeddark"
import "prismjs/components/prism-funky"
import "prismjs/components/prism-hopscotch"
import "prismjs/components/prism-atom-dark"
import "prismjs/components/prism-duotone-dark"
import "prismjs/components/prism-duotone-light"
import "prismjs/components/prism-ghcolors"
import "prismjs/components/prism-googlecode"
import "prismjs/components/prism-gruvbox-dark"
import "prismjs/components/prism-gruvbox-light"
import "prismjs/components/prism-hybrid"
import "prismjs/components/prism-idea"
import "prismjs/components/prism-ir-black"
import "prismjs/components/prism-isbl-editor-dark"
import "prismjs/components/prism-isbl-editor-light"
import "prismjs/components/prism-kimbie-dark"
import "prismjs/components/prism-kimbie-light"
import "prismjs/components/prism-lightfair"
import "prismjs/components/prism-lucario"
import "prismjs/components/prism-material-dark"
import "prismjs/components/prism-material-light"
import "prismjs/components/prism-material-oceanic"
import "prismjs/components/prism-mbo"
import "prismjs/components/prism-mdn-like"
import "prismjs/components/prism-midnight"
import "prismjs/components/prism-mnimi"
import "prismjs/components/prism-monokai-sublime"
import "prismjs/components/prism-nord"
import "prismjs/components/prism-obsidian"
import "prismjs/components/prism-oceanic-next"
import "prismjs/components/prism-one-dark"
import "prismjs/components/prism-one-light"
import "prismjs/components/prism-panda-syntax-dark"
import "prismjs/components/prism-panda-syntax-light"
import "prismjs/components/prism-paraíso-dark"
import "prismjs/components/prism-paraíso-light"
import "prismjs/components/prism-pastel-on-dark"
import "prismjs/components/prism-purebasic"
import "prismjs/components/prism-qtcreator-dark"
import "prismjs/components/prism-qtcreator-light"
import "prismjs/components/prism-railscasts"
import "prismjs/components/prism-rainbow"
import "prismjs/components/prism-shades-of-purple"
import "prismjs/components/prism-snazzy"
import "prismjs/components/prism-solarized-dark"
import "prismjs/components/prism-solarized-light"
import "prismjs/components/prism-srcery"
import "prismjs/components/prism-stanley"
import "prismjs/components/prism-synthwave84"
import "prismjs/components/prism-tomorrow-night"
import "prismjs/components/prism-tomorrow-night-blue"
import "prismjs/components/prism-tomorrow-night-bright"
import "prismjs/components/prism-tomorrow-night-eighties"
import "prismjs/components/prism-true-dark"
import "prismjs/components/prism-tulip"
import "prismjs/components/prism-vs-dark-plus"
import "prismjs/components/prism-vsc-dark-plus"
import "prismjs/components/prism-xonokai"
import "prismjs/components/prism-zenburn"

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