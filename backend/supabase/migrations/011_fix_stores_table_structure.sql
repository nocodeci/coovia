-- Migration complète pour corriger la table stores
-- Vérifier et ajouter toutes les colonnes nécessaires

-- Ajouter la colonne status si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'status') THEN
        ALTER TABLE public.stores ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
END $$;

-- Ajouter la colonne is_active si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'is_active') THEN
        ALTER TABLE public.stores ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Ajouter la colonne logo si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'logo') THEN
        ALTER TABLE public.stores ADD COLUMN logo TEXT;
    END IF;
END $$;

-- Ajouter la colonne banner si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'banner') THEN
        ALTER TABLE public.stores ADD COLUMN banner TEXT;
    END IF;
END $$;

-- Ajouter la colonne category si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'category') THEN
        ALTER TABLE public.stores ADD COLUMN category VARCHAR(100) DEFAULT 'general';
    END IF;
END $$;

-- Ajouter la colonne slug si elle n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'stores' AND column_name = 'slug') THEN
        ALTER TABLE public.stores ADD COLUMN slug VARCHAR(255);
    END IF;
END $$;

-- Mettre à jour les valeurs par défaut pour les enregistrements existants
UPDATE public.stores
SET status = 'active'
WHERE status IS NULL;

UPDATE public.stores
SET is_active = true
WHERE is_active IS NULL;

UPDATE public.stores
SET category = 'general'
WHERE category IS NULL;

-- Générer des slugs pour les boutiques existantes qui n'en ont pas
UPDATE public.stores
SET slug = LOWER(REPLACE(REPLACE(name, ' ', '-'), '''', ''))
WHERE slug IS NULL;

-- Ajouter des contraintes
ALTER TABLE public.stores
DROP CONSTRAINT IF EXISTS chk_stores_status;

ALTER TABLE public.stores
ADD CONSTRAINT chk_stores_status CHECK (status IN ('active', 'inactive', 'suspended'));

-- Rendre le slug unique
ALTER TABLE public.stores
DROP CONSTRAINT IF EXISTS unique_stores_slug;

-- Créer un index unique sur le slug
CREATE UNIQUE INDEX IF NOT EXISTS unique_stores_slug ON public.stores(slug);

-- Créer les autres index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON public.stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_status ON public.stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_is_active ON public.stores(is_active);
CREATE INDEX IF NOT EXISTS idx_stores_category ON public.stores(category);

-- Ajouter des commentaires pour la documentation
COMMENT ON COLUMN public.stores.status IS 'Statut de la boutique (active, inactive, suspended)';
COMMENT ON COLUMN public.stores.is_active IS 'Indique si la boutique est active ou non';
COMMENT ON COLUMN public.stores.logo IS 'URL ou chemin vers le logo de la boutique';
COMMENT ON COLUMN public.stores.banner IS 'URL ou chemin vers la bannière de la boutique';
COMMENT ON COLUMN public.stores.category IS 'Catégorie de la boutique';
COMMENT ON COLUMN public.stores.slug IS 'Slug unique pour la boutique (URL friendly)';

-- Afficher la structure finale pour vérification
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'stores'
ORDER BY ordinal_position;
