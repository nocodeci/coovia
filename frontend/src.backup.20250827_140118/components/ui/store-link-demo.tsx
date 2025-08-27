import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ViewStoreButton } from "./view-store-button"
import { generateBoutiqueUrl, getBoutiqueUrl } from "@/utils/store-links"
import { getApiUrl } from "@/utils/environment"

interface StoreLinkDemoProps {
  storeId: string
  storeSlug: string
}

export function StoreLinkDemo({ storeId, storeSlug }: StoreLinkDemoProps) {
  const handleTestLink = () => {
    const url = generateBoutiqueUrl(storeSlug)
    console.log('🔗 URL générée:', url)
    window.open(url, '_blank')
  }

  const handleTestApi = async () => {
    try {
      const apiUrl = getApiUrl(`/api/boutique/slug/${storeId}`)
      console.log('🌐 API URL:', apiUrl)
      const response = await fetch(apiUrl)
      const data = await response.json()
      console.log('📡 Données API:', data)
    } catch (error) {
      console.error('❌ Erreur API:', error)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test des liens boutique</CardTitle>
        <CardDescription>
          Testez les différents formats d'URL pour la boutique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">Store ID: {storeId}</p>
          <p className="text-sm font-medium">Store Slug: {storeSlug}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">URLs générées:</p>
          <div className="space-y-1">
            <p className="text-xs font-mono bg-muted p-2 rounded">
              {generateBoutiqueUrl(storeSlug)}
            </p>
            <p className="text-xs font-mono bg-muted p-2 rounded">
              {getBoutiqueUrl(storeSlug)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <ViewStoreButton storeId={storeId} />
          <Button variant="outline" size="sm" onClick={handleTestLink}>
            Tester le lien direct
          </Button>
          <Button variant="outline" size="sm" onClick={handleTestApi}>
            Tester l'API
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
