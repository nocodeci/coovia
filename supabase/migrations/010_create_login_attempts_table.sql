-- Migration pour créer la table login_attempts
-- Date: 2025-07-28

-- Créer la table login_attempts si elle n'existe pas
CREATE TABLE IF NOT EXISTS public.login_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES public.users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    successful BOOLEAN DEFAULT false,
    failure_reason VARCHAR(255),
    mfa_required BOOLEAN DEFAULT false,
    mfa_successful BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer des index pour les performances
CREATE INDEX IF NOT EXISTS login_attempts_user_id_index ON public.login_attempts (user_id);
CREATE INDEX IF NOT EXISTS login_attempts_email_index ON public.login_attempts (email);
CREATE INDEX IF NOT EXISTS login_attempts_ip_address_index ON public.login_attempts (ip_address);
CREATE INDEX IF NOT EXISTS login_attempts_successful_index ON public.login_attempts (successful);
CREATE INDEX IF NOT EXISTS login_attempts_created_at_index ON public.login_attempts (created_at);

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_login_attempts_updated_at ON public.login_attempts;
CREATE TRIGGER update_login_attempts_updated_at
    BEFORE UPDATE ON public.login_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ajouter des commentaires
COMMENT ON TABLE public.login_attempts IS 'Table pour enregistrer les tentatives de connexion';
COMMENT ON COLUMN public.login_attempts.user_id IS 'ID de l''utilisateur (peut être null si utilisateur inexistant)';
COMMENT ON COLUMN public.login_attempts.email IS 'Email utilisé pour la tentative';
COMMENT ON COLUMN public.login_attempts.ip_address IS 'Adresse IP de la tentative';
COMMENT ON COLUMN public.login_attempts.user_agent IS 'User agent du navigateur';
COMMENT ON COLUMN public.login_attempts.successful IS 'Tentative réussie ou non';
COMMENT ON COLUMN public.login_attempts.failure_reason IS 'Raison de l''échec';
COMMENT ON COLUMN public.login_attempts.mfa_required IS 'MFA requis pour cette tentative';
COMMENT ON COLUMN public.login_attempts.mfa_successful IS 'MFA réussi ou non';
