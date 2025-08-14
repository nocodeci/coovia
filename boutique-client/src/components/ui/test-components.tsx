import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Loader,
  Alert,
  AlertDescription,
  Badge,
  Separator,
  Status,
} from './index';

export const TestComponents: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Test des composants shadcn/ui</h1>
      
      {/* Test des boutons */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Boutons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button>Bouton par défaut</Button>
          <Button variant="secondary">Bouton secondaire</Button>
          <Button variant="outline">Bouton contour</Button>
          <Button variant="destructive">Bouton destructif</Button>
          <Button variant="ghost">Bouton fantôme</Button>
          <Button variant="link">Bouton lien</Button>
        </div>
      </section>

      <Separator />

      {/* Test des cartes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Cartes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Titre de la carte</CardTitle>
              <CardDescription>Description de la carte</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Contenu de la carte avec du texte d'exemple.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Carte avec badge</CardTitle>
              <CardDescription>Une carte avec des éléments interactifs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="default">Par défaut</Badge>
                <Badge variant="secondary">Secondaire</Badge>
                <Badge variant="success">Succès</Badge>
                <Badge variant="warning">Attention</Badge>
                <Badge variant="info">Info</Badge>
              </div>
              <Button size="sm">Action</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Test des loaders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Indicateurs de chargement</h2>
        <div className="flex gap-8 items-center">
          <div className="text-center">
            <Loader size="sm" variant="spinner" />
            <p className="mt-2 text-sm">Petit spinner</p>
          </div>
          <div className="text-center">
            <Loader size="md" variant="spinner" />
            <p className="mt-2 text-sm">Spinner moyen</p>
          </div>
          <div className="text-center">
            <Loader size="lg" variant="spinner" />
            <p className="mt-2 text-sm">Grand spinner</p>
          </div>
          <div className="text-center">
            <Loader size="md" variant="dots" />
            <p className="mt-2 text-sm">Points</p>
          </div>
          <div className="text-center">
            <Loader size="md" variant="pulse" />
            <p className="mt-2 text-sm">Pulse</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Test des alertes */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Alertes</h2>
        <div className="space-y-4">
          <Alert>
            <AlertDescription>Ceci est une alerte par défaut.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertDescription>Ceci est une alerte d'erreur.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertDescription>Ceci est une alerte de succès.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertDescription>Ceci est une alerte d'avertissement.</AlertDescription>
          </Alert>
          <Alert variant="info">
            <AlertDescription>Ceci est une alerte d'information.</AlertDescription>
          </Alert>
        </div>
      </section>

      <Separator />

      {/* Test des statuts */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Statuts</h2>
        <div className="flex gap-4 flex-wrap">
          <Status variant="online">En ligne</Status>
          <Status variant="offline">Hors ligne</Status>
          <Status variant="success">Succès</Status>
          <Status variant="warning">Attention</Status>
          <Status variant="info">Information</Status>
          <Status variant="destructive">Erreur</Status>
        </div>
      </section>

      <Separator />

      {/* Test des badges */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Badges</h2>
        <div className="flex gap-4 flex-wrap">
          <Badge variant="default">Par défaut</Badge>
          <Badge variant="secondary">Secondaire</Badge>
          <Badge variant="destructive">Destructif</Badge>
          <Badge variant="outline">Contour</Badge>
          <Badge variant="success">Succès</Badge>
          <Badge variant="warning">Attention</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>
    </div>
  );
};

