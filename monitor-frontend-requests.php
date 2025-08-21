<?php

echo "🔍 Surveillance des requêtes frontend en temps réel\n";
echo "==================================================\n\n";

echo "📋 Instructions:\n";
echo "1. Ouvrez votre navigateur et allez sur le frontend\n";
echo "2. Connectez-vous si nécessaire\n";
echo "3. Essayez de créer une boutique\n";
echo "4. Ce script surveillera les requêtes en temps réel\n\n";

echo "⏳ Surveillance en cours... (Ctrl+C pour arrêter)\n";
echo "================================================\n\n";

$logFile = 'storage/logs/laravel.log';
$lastSize = file_exists($logFile) ? filesize($logFile) : 0;

while (true) {
    if (file_exists($logFile)) {
        $currentSize = filesize($logFile);
        
        if ($currentSize > $lastSize) {
            $handle = fopen($logFile, 'r');
            fseek($handle, $lastSize);
            
            while (($line = fgets($handle)) !== false) {
                $line = trim($line);
                if (!empty($line)) {
                    // Filtrer les logs pertinents
                    if (strpos($line, 'stores') !== false || 
                        strpos($line, 'auth') !== false || 
                        strpos($line, 'ERROR') !== false ||
                        strpos($line, 'INFO') !== false) {
                        
                        $timestamp = date('H:i:s');
                        echo "[$timestamp] $line\n";
                    }
                }
            }
            
            fclose($handle);
            $lastSize = $currentSize;
        }
    }
    
    sleep(1);
}
