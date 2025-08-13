import React from 'react';
import { CloudflareUpload } from '../components/CloudflareUpload';

export const CloudflareTestPage: React.FC = () => {
  const handleUploadSuccess = (result: any) => {
    console.log('Upload réussi:', result);
    // Vous pouvez ici sauvegarder l'URL dans votre base de données
    // ou mettre à jour l'état de votre application
  };

  const handleUploadError = (error: string) => {
    console.error('Erreur upload:', error);
    // Vous pouvez ici afficher une notification d'erreur
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test Cloudflare R2 Upload
            </h1>
            <p className="text-gray-600">
              Testez l'upload de fichiers vers Cloudflare R2
            </p>
          </div>

          <div className="grid gap-8">
            {/* Upload simple */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Upload Simple</h2>
              <CloudflareUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                directory="test/simple"
                type="image"
              />
            </div>

            {/* Upload multiple */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Upload Multiple</h2>
              <CloudflareUpload
                multiple={true}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                directory="test/multiple"
                type="image"
              />
            </div>

            {/* Upload pour une boutique */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Upload pour Boutique (ID: 1)</h2>
              <CloudflareUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                directory="stores/1/products"
                type="product"
                storeId={1}
              />
            </div>

            {/* Upload de documents */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Upload de Documents</h2>
              <CloudflareUpload
                accept=".pdf,.doc,.docx,.txt"
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                directory="test/documents"
                type="document"
              />
            </div>
          </div>

          {/* Informations */}
          <div className="mt-12 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Informations sur Cloudflare R2</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium mb-2">Avantages :</h4>
                <ul className="space-y-1">
                  <li>• 90% moins cher qu'AWS S3</li>
                  <li>• Réseau global Cloudflare</li>
                  <li>• CDN automatique</li>
                  <li>• Chiffrement en transit et au repos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Fonctionnalités :</h4>
                <ul className="space-y-1">
                  <li>• Upload drag & drop</li>
                  <li>• Génération automatique de thumbnails</li>
                  <li>• Validation des types de fichiers</li>
                  <li>• URLs CDN automatiques</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
