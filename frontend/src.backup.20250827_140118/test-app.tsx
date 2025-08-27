import React from "react"

export function TestApp() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333' }}>Test Application</h1>
      <p style={{ color: '#666' }}>Si vous voyez ceci, React fonctionne correctement.</p>
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #ddd'
      }}>
        <h2>Informations de diagnostic :</h2>
        <ul>
          <li>React version: {React.version}</li>
          <li>Timestamp: {new Date().toLocaleString()}</li>
          <li>User Agent: {navigator.userAgent}</li>
        </ul>
      </div>
    </div>
  )
} 