-- Migration pour corriger la table users pour Laravel
-- Date: 2025-07-28

-- Ajouter les colonnes manquantes à la table users si elles n'existent pas
DO $$ 
BEGIN
    -- Ajouter email_verified_at si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'email_verified_at') THEN
        ALTER TABLE public.users ADD COLUMN email_verified_at TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Ajouter remember_token si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'remember_token') THEN
        ALTER TABLE public.users ADD COLUMN remember_token VARCHAR(100);
    END IF;

    -- Ajouter is_active si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'is_active') THEN
        ALTER TABLE public.users ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;

    -- Ajouter login_attempts si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'login_attempts') THEN
        ALTER TABLE public.users ADD COLUMN login_attempts INTEGER DEFAULT 0;
    END IF;

    -- Ajouter locked_until si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'locked_until') THEN
        ALTER TABLE public.users ADD COLUMN locked_until TIMESTAMP WITH TIME ZONE;
    END IF;

    -- Ajouter mfa_enabled si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'mfa_enabled') THEN
        ALTER TABLE public.users ADD COLUMN mfa_enabled BOOLEAN DEFAULT false;
    END IF;

    -- Ajouter mfa_secret si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'mfa_secret') THEN
        ALTER TABLE public.users ADD COLUMN mfa_secret VARCHAR(255);
    END IF;

    -- Ajouter backup_codes si elle n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'backup_codes') THEN
        ALTER TABLE public.users ADD COLUMN backup_codes JSONB;
    END IF;
END $$;

-- Mettre à jour les utilisateurs existants
UPDATE public.users 
SET 
    is_active = true,
    login_attempts = 0,
    mfa_enabled = false
WHERE is_active IS NULL OR login_attempts IS NULL OR mfa_enabled IS NULL;

-- Ajouter des index pour les performances
CREATE INDEX IF NOT EXISTS users_email_verified_at_index ON public.users (email_verified_at);
CREATE INDEX IF NOT EXISTS users_is_active_index ON public.users (is_active);
CREATE INDEX IF NOT EXISTS users_mfa_enabled_index ON public.users (mfa_enabled);

-- Ajouter des commentaires
COMMENT ON COLUMN public.users.email_verified_at IS 'Date de vérification de l''email';
COMMENT ON COLUMN public.users.remember_token IS 'Token de mémorisation Laravel';
COMMENT ON COLUMN public.users.is_active IS 'Utilisateur actif ou non';
COMMENT ON COLUMN public.users.login_attempts IS 'Nombre de tentatives de connexion échouées';
COMMENT ON COLUMN public.users.locked_until IS 'Date jusqu''à laquelle le compte est verrouillé';
COMMENT ON COLUMN public.users.mfa_enabled IS 'Authentification à deux facteurs activée';
COMMENT ON COLUMN public.users.mfa_secret IS 'Secret pour l''authentification à deux facteurs';
COMMENT ON COLUMN public.users.backup_codes IS 'Codes de récupération MFA';
