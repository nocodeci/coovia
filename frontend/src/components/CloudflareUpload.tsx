import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, File, Image, X, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadResult {
  success: boolean;
  path?: string;
  filename?: string;
  urls?: {
    original: string;
    cdn: string;
    thumbnails?: Record<string, any>;
  };
  size?: number;
  mime_type?: string;
  error?: string;
}

interface CloudflareUploadProps {
  onUploadSuccess?: (result: UploadResult) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // en bytes
  directory?: string;
  type?: 'image' | 'video' | 'document' | 'avatar' | 'product';
  storeId?: number;
}

export const CloudflareUpload: React.FC<CloudflareUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  multiple = false,
  accept = "image/*,video/*,.pdf,.doc,.docx,.txt",
  maxSize = 10 * 1024 * 1024, // 10MB par défaut
  directory = 'uploads',
  type = 'image',
  storeId
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        onUploadError?.(`Le fichier ${file.name} est trop volumineux (max: ${maxSize / 1024 / 1024}MB)`);
        return false;
      }
      return true;
    });

    if (multiple) {
      setFiles(prev => [...prev, ...validFiles]);
    } else {
      setFiles(validFiles);
    }
  }, [multiple, maxSize, onUploadError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);
    setResults([]);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('directory', directory);
        formData.append('type', type);
        if (storeId) {
          formData.append('store_id', storeId.toString());
        }

        const response = await fetch('http://localhost:8000/api/cloudflare/upload-frontend', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        const result: UploadResult = await response.json();
        
        // Mettre à jour le progrès
        setProgress(((index + 1) / files.length) * 100);
        
        return result;
      });

      const uploadResults = await Promise.all(uploadPromises);
      setResults(uploadResults);

      // Appeler les callbacks
      uploadResults.forEach((result, index) => {
        if (result.success) {
          onUploadSuccess?.(result);
        } else {
          onUploadError?.(result.error || 'Erreur lors de l\'upload');
        }
      });

    } catch (error) {
      console.error('Erreur upload:', error);
      onUploadError?.('Erreur de connexion au serveur');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <File className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload vers Cloudflare R2
        </CardTitle>
        <CardDescription>
          Glissez-déposez vos fichiers ou cliquez pour sélectionner
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Zone de drop */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
          <p className="text-sm text-gray-600 mb-2">
            Glissez-déposez vos fichiers ici ou
          </p>
          <Input
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
          >
            Sélectionner des fichiers
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Taille maximale: {formatFileSize(maxSize)}
          </p>
        </div>

        {/* Liste des fichiers */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Fichiers sélectionnés ({files.length})</h4>
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(file)}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {results[index] && (
                    results[index].success ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progrès */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Upload en cours...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Résultats */}
        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Résultats</h4>
            {results.map((result, index) => (
              <Alert key={index} variant={result.success ? "default" : "destructive"}>
                <AlertDescription>
                  {result.success ? (
                    <div className="space-y-1">
                      <p className="font-medium">✅ {files[index]?.name} uploadé avec succès</p>
                      {result.urls && (
                        <div className="text-xs space-y-1">
                          <p><strong>URL:</strong> <a href={result.urls.original} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.urls.original}</a></p>
                          <p><strong>CDN:</strong> <a href={result.urls.cdn} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.urls.cdn}</a></p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>❌ Erreur: {result.error}</p>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Bouton d'upload */}
        {files.length > 0 && !uploading && (
          <Button 
            onClick={uploadFiles} 
            className="w-full"
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Uploader {files.length} fichier{files.length > 1 ? 's' : ''}
          </Button>
        )}

        {/* Informations */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Les fichiers sont stockés sur Cloudflare R2</p>
          <p>• Les images génèrent automatiquement des thumbnails</p>
          <p>• Accès via CDN global pour de meilleures performances</p>
        </div>
      </CardContent>
    </Card>
  );
};
