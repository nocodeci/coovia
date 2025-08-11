import { Auth } from '@auth/core'
import { Credentials } from '@auth/core/providers/credentials'
import { JWT } from '@auth/core/jwt'
import { NextAuthConfig } from '@auth/nextjs'
import { env } from '@/config/env'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Appel à votre API backend pour l'authentification
          const response = await fetch(`${env.API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          })

          if (!response.ok) {
            return null
          }

          const user = await response.json()
          
          if (user.success) {
            return {
              id: user.user.id,
              email: user.user.email,
              name: user.user.name,
              role: user.user.role,
              accessToken: user.access_token,
              refreshToken: user.refresh_token,
            }
          }

          return null
        } catch (error) {
          console.error('Erreur d\'authentification:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.accessToken = token.accessToken
        session.refreshToken = token.refreshToken
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirection après connexion
      if (url.startsWith('/')) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    }
  },
  pages: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },
  secret: env.AUTH_SECRET,
}

export const { handlers, auth, signIn, signOut } = Auth(authConfig)
