/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module "*.tsx" {
  import React from "react"
  const Component: React.ComponentType<any>
  export default Component
}

declare module "*.jsx" {
  import React from "react"
  const Component: React.ComponentType<any>
  export default Component
}
