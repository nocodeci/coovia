import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconError404 } from "@tabler/icons-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <IconError404 className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Page non trouvée</CardTitle>
          <CardDescription>
            La page que vous recherchez n'existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            onClick={() => window.history.back()}
            className="mb-2"
          >
            Retour
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = "/"}
          >
            Accueil
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 