'use client';

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>© 2024 Wozif Store. Tous droits réservés.</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Powered by Coovia</span>
        </div>
      </div>
    </footer>
  );
}

