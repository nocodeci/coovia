-- Créer la table sessions si vous voulez utiliser les sessions en base de données
CREATE TABLE IF NOT EXISTS public.sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    payload TEXT NOT NULL,
    last_activity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS sessions_user_id_index ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_last_activity_index ON public.sessions(last_activity);

-- Trigger pour updated_at
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON public.sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour nettoyer les sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM public.sessions
    WHERE last_activity < EXTRACT(EPOCH FROM NOW() - INTERVAL '2 hours');

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Message de confirmation
SELECT 'Table sessions créée avec succès!' as message;
