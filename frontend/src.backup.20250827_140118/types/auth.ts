import { DefaultSession, DefaultUser } from '@auth/core/types'

declare module '@auth/core/types' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      accessToken: string
      refreshToken: string
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: string
    accessToken: string
    refreshToken: string
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role: string
    accessToken: string
    refreshToken: string
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user: {
    id: string
    name: string
    email: string
    role: string
    created_at: string
    updated_at: string
  }
  access_token: string
  refresh_token: string
  message?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  created_at: string
  updated_at: string
}
  