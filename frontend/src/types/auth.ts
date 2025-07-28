export interface User {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
    role: "admin" | "user"
    email_verified_at?: string
    phone_verified_at?: string
    mfa_enabled: boolean
    created_at: string
    updated_at: string
  }
  
  export interface LoginCredentials {
    email: string
    password: string
  }
  
  export interface RegisterData {
    name: string
    email: string
    password: string
    password_confirmation: string
    phone?: string
  }
  
  export interface MfaSetupResponse {
    secret: string
    qr_code_url: string
    message: string
  }
  
  export interface MfaVerificationData {
    mfa_token: string
    code: string
    is_backup_code?: boolean
  }
  
  export interface AuthResponse {
    message: string
    user: User
    token: string
    mfa_required?: boolean
    mfa_token?: string
    backup_codes_available?: boolean
  }
  
  export interface ApiError {
    message: string
    errors?: Record<string, string[]>
  }
  