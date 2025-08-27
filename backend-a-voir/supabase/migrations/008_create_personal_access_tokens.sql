-- Migration pour créer la table personal_access_tokens pour Laravel Sanctum
-- Date: 2025-07-28

-- Créer la table personal_access_tokens
CREATE TABLE IF NOT EXISTS public.personal_access_tokens (
    id BIGSERIAL PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Créer un index sur tokenable
CREATE INDEX IF NOT EXISTS personal_access_tokens_tokenable_type_tokenable_id_index
ON public.personal_access_tokens (tokenable_type, tokenable_id);

-- Créer un index sur le token
CREATE INDEX IF NOT EXISTS personal_access_tokens_token_unique
ON public.personal_access_tokens (token);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_personal_access_tokens_updated_at ON public.personal_access_tokens;
CREATE TRIGGER update_personal_access_tokens_updated_at
    BEFORE UPDATE ON public.personal_access_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ajouter des commentaires
COMMENT ON TABLE public.personal_access_tokens IS 'Table pour les tokens d''accès personnel Laravel Sanctum';
COMMENT ON COLUMN public.personal_access_tokens.tokenable_type IS 'Type du modèle (ex: App\Models\User)';
COMMENT ON COLUMN public.personal_access_tokens.tokenable_id IS 'ID de l''utilisateur propriétaire du token';
COMMENT ON COLUMN public.personal_access_tokens.name IS 'Nom du token';
COMMENT ON COLUMN public.personal_access_tokens.token IS 'Hash du token';
COMMENT ON COLUMN public.personal_access_tokens.abilities IS 'Permissions du token (JSON)';
COMMENT ON COLUMN public.personal_access_tokens.last_used_at IS 'Dernière utilisation du token';
COMMENT ON COLUMN public.personal_access_tokens.expires_at IS 'Date d''expiration du token';
