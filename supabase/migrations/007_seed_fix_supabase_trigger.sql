-- Supprimer tous les triggers dépendants d'abord
DROP TRIGGER IF EXISTS inscription_utilisateur ON public.users;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Supprimer la fonction
DROP FUNCTION IF EXISTS public.cree_un_utilisateur() CASCADE;

-- Créer une nouvelle fonction corrigée
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    supabase_user_id,
    email,
    name,
    email_verified_at,
    role
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN NEW.email_confirmed_at ELSE NULL END,
    'user'
  )
  ON CONFLICT (supabase_user_id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    email_verified_at = EXCLUDED.email_verified_at;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recréer le trigger avec le nouveau nom
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ajouter une contrainte pour éviter les doublons
ALTER TABLE public.users
ADD CONSTRAINT unique_supabase_user_id
UNIQUE (supabase_user_id);
