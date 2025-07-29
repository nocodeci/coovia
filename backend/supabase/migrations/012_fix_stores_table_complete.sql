-- Migration complète pour corriger la table stores
-- Correction des erreurs PostgreSQL avec JSONB

-- Supprimer les colonnes existantes si elles ont le mauvais type
DO $$
BEGIN
    -- Supprimer les colonnes si elles existent avec le mauvais type
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'stores' AND column_name = 'contact' AND data_type = 'json') THEN
        ALTER TABLE public.stores DROP COLUMN contact;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'stores' AND column_name = 'address' AND data_type = 'json') THEN
        ALTER TABLE public.stores DROP COLUMN address;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'stores' AND column_name = 'settings' AND data_type = 'json') THEN
        ALTER TABLE public.stores DROP COLUMN settings;
    END IF;
END $$;

-- Ajouter les colonnes avec le bon type JSONB
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'contact') THEN
        ALTER TABLE public.stores ADD COLUMN contact JSONB DEFAULT '{"email":"","phone":"","website":""}'::jsonb;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'address') THEN
        ALTER TABLE public.stores ADD COLUMN address JSONB DEFAULT '{"street":"","city":"","state":"","country":"Côte d''Ivoire","postal_code":""}'::jsonb;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'settings') THEN
        ALTER TABLE public.stores ADD COLUMN settings JSONB DEFAULT '{"currency":"XOF","language":"fr","timezone":"Africa/Abidjan","tax_rate":18}'::jsonb;
    END IF;
END $$;

-- Ajouter les autres colonnes
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'status') THEN
        ALTER TABLE public.stores ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'is_active') THEN
        ALTER TABLE public.stores ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'logo') THEN
        ALTER TABLE public.stores ADD COLUMN logo TEXT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'banner') THEN
        ALTER TABLE public.stores ADD COLUMN banner TEXT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'category') THEN
        ALTER TABLE public.stores ADD COLUMN category VARCHAR(100) DEFAULT 'general';
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'slug') THEN
        ALTER TABLE public.stores ADD COLUMN slug VARCHAR(255);
    END IF;
END $$;

-- Mettre à jour les valeurs par défaut pour les enregistrements existants
-- Utiliser COALESCE pour éviter les erreurs de comparaison
UPDATE public.stores
SET contact = '{"email":"","phone":"","website":""}'::jsonb
WHERE contact IS NULL;

UPDATE public.stores
SET address = '{"street":"","city":"","state":"","country":"Côte d''Ivoire","postal_code":""}'::jsonb
WHERE address IS NULL;

UPDATE public.stores
SET settings = '{"currency":"XOF","language":"fr","timezone":"Africa/Abidjan","tax_rate":18}'::jsonb
WHERE settings IS NULL;

UPDATE public.stores
SET status = 'active'
WHERE status IS NULL OR status = '';

UPDATE public.stores
SET is_active = true
WHERE is_active IS NULL;

UPDATE public.stores
SET category = 'general'
WHERE category IS NULL OR category = '';

-- Générer des slugs pour les boutiques existantes
UPDATE public.stores
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

-- Gérer les slugs en double
DO $$
DECLARE
    r RECORD;
    new_slug TEXT;
    counter INTEGER;
BEGIN
    FOR r IN
        SELECT slug, COUNT(*) as cnt
        FROM public.stores
        WHERE slug IS NOT NULL AND slug != ''
        GROUP BY slug
        HAVING COUNT(*) > 1
    LOOP
        counter := 1;
        FOR r IN
            SELECT id, slug
            FROM public.stores
            WHERE slug = r.slug
            ORDER BY id
        LOOP
            IF counter > 1 THEN
                new_slug := r.slug || '-' || counter;
                UPDATE public.stores SET slug = new_slug WHERE id = r.id;
            END IF;
            counter := counter + 1;
        END LOOP;
    END LOOP;
END $$;

-- Ajouter des contraintes
ALTER TABLE public.stores
DROP CONSTRAINT IF EXISTS chk_stores_status;

ALTER TABLE public.stores
ADD CONSTRAINT chk_stores_status CHECK (status IN ('active', 'inactive', 'suspended'));

-- Créer les index
DROP INDEX IF EXISTS unique_stores_slug;
CREATE UNIQUE INDEX unique_stores_slug ON public.stores(slug) WHERE slug IS NOT NULL AND slug != '';

CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON public.stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_status ON public.stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_is_active ON public.stores(is_active);
CREATE INDEX IF NOT EXISTS idx_stores_category ON public.stores(category);

-- Ajouter des commentaires
COMMENT ON COLUMN public.stores.contact IS 'Informations de contact de la boutique (JSONB)';
COMMENT ON COLUMN public.stores.address IS 'Adresse de la boutique (JSONB)';
COMMENT ON COLUMN public.stores.settings IS 'Paramètres de la boutique (JSONB)';
COMMENT ON COLUMN public.stores.status IS 'Statut de la boutique (active, inactive, suspended)';
COMMENT ON COLUMN public.stores.is_active IS 'Indique si la boutique est active ou non';
COMMENT ON COLUMN public.stores.logo IS 'URL ou chemin vers le logo de la boutique';
COMMENT ON COLUMN public.stores.banner IS 'URL ou chemin vers la bannière de la boutique';
COMMENT ON COLUMN public.stores.category IS 'Catégorie de la boutique';
COMMENT ON COLUMN public.stores.slug IS 'Slug unique pour la boutique (URL friendly)';
