-- Créer la table cache pour Laravel
CREATE TABLE IF NOT EXISTS public.cache (
    key VARCHAR(255) PRIMARY KEY,
    value TEXT NOT NULL,
    expiration INTEGER NOT NULL
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS cache_expiration_index ON public.cache(expiration);

-- Créer la table cache_locks
CREATE TABLE IF NOT EXISTS public.cache_locks (
    key VARCHAR(255) PRIMARY KEY,
    owner VARCHAR(255) NOT NULL,
    expiration INTEGER NOT NULL
);

-- Message de confirmation
SELECT 'Tables cache créées avec succès!' as message;
