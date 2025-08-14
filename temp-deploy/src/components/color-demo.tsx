'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export function ColorDemo() {
  const colorGroups = [
    {
      title: "Couleurs Principales",
      colors: [
        { name: "Primary", class: "bg-primary text-primary-foreground" },
        { name: "Secondary", class: "bg-secondary text-secondary-foreground" },
        { name: "Accent", class: "bg-accent text-accent-foreground" },
      ]
    },
    {
      title: "Couleurs de Base",
      colors: [
        { name: "Background", class: "bg-background text-foreground border" },
        { name: "Card", class: "bg-card text-card-foreground border" },
        { name: "Muted", class: "bg-muted text-muted-foreground" },
      ]
    },
    {
      title: "Couleurs de Bordure",
      colors: [
        { name: "Border", class: "bg-border text-foreground" },
        { name: "Input", class: "bg-input text-foreground border" },
        { name: "Ring", class: "bg-ring text-foreground" },
      ]
    },
    {
      title: "Couleurs d'État",
      colors: [
        { name: "Destructive", class: "bg-destructive text-destructive-foreground" },
        { name: "Success", class: "bg-green-500 text-white" },
        { name: "Warning", class: "bg-yellow-500 text-black" },
      ]
    }
  ];

  return (
    <div className="p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          🎨 Démonstration des Couleurs
        </h1>
        <p className="text-muted-foreground">
          Palette de couleurs appliquée à votre application
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {colorGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader>
              <CardTitle className="text-lg">{group.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.colors.map((color) => (
                <div key={color.name} className="flex items-center space-x-4">
                  <div className={`w-16 h-12 rounded-lg ${color.class} flex items-center justify-center text-sm font-medium`}>
                    {color.name}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{color.name}</p>
                    <p className="text-sm text-muted-foreground">{color.class}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exemples d'Utilisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Bouton Principal
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity">
              Bouton Secondaire
            </button>
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity">
              Bouton Destructif
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-card-foreground">Carte Standard</h3>
                <p className="text-muted-foreground text-sm">Contenu de la carte</p>
              </CardContent>
            </Card>
            
            <Card className="bg-muted">
              <CardContent className="p-4">
                <h3 className="font-semibold text-muted-foreground">Carte Muette</h3>
                <p className="text-muted-foreground text-sm">Contenu muet</p>
              </CardContent>
            </Card>
            
            <Card className="bg-accent">
              <CardContent className="p-4">
                <h3 className="font-semibold text-accent-foreground">Carte d'Accent</h3>
                <p className="text-accent-foreground text-sm">Contenu d'accent</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

