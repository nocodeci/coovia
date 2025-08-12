export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug } = req.query

  if (!slug) {
    return res.status(400).json({ error: 'Slug is required' })
  }

  try {
    // Validation du format du slug
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return res.status(400).json({ 
        error: 'Invalid slug format. Only lowercase letters, numbers, and hyphens are allowed.' 
      })
    }

    // Vérifier la longueur minimale
    if (slug.length < 3) {
      return res.status(400).json({ 
        error: 'Slug must be at least 3 characters long' 
      })
    }

    // Vérifier la longueur maximale
    if (slug.length > 63) {
      return res.status(400).json({ 
        error: 'Slug must be less than 63 characters long' 
      })
    }

    // Mots réservés (sous-domaines spéciaux)
    const reservedWords = [
      'www', 'api', 'admin', 'mail', 'ftp', 'blog', 'shop', 'store', 
      'app', 'dev', 'test', 'staging', 'prod', 'cdn', 'static',
      'wozif', 'wizof', 'coovia', 'nocodeci'
    ]

    if (reservedWords.includes(slug.toLowerCase())) {
      return res.status(200).json({ 
        exists: true, 
        reason: 'reserved_word',
        message: 'This subdomain is reserved and cannot be used.' 
      })
    }

    // TODO: Vérifier dans la base de données si le slug existe déjà
    // Pour l'instant, on simule une vérification
    const existingSlugs = [
      'ma-boutique',
      'digital-store', 
      'formation-pro',
      'ebooks-online',
      'cours-digitaux'
    ]

    const exists = existingSlugs.includes(slug.toLowerCase())

    return res.status(200).json({ 
      exists,
      slug: slug.toLowerCase(),
      message: exists ? 'This subdomain is already taken.' : 'This subdomain is available.'
    })

  } catch (error) {
    console.error('Error checking slug availability:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Unable to check slug availability at this time.'
    })
  }
}
