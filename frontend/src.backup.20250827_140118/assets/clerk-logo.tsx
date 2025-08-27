// Placeholder for ClerkLogo component
export function ClerkLogo({ ...props }) {
  return (
    <div
      style={{
        width: "1rem",
        height: "1rem",
        backgroundColor: "var(--p-color-bg-fill-highlight)",
        borderRadius: "var(--p-border-radius-100)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "var(--p-font-size-275)",
        fontWeight: "var(--p-font-weight-semibold)",
      }}
      {...props}
    >
      C
    </div>
  )
}
