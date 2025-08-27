<?php

/**
 * Laravel - A PHP Framework For Web Artisans
 * 
 * Configuration serveur personnalisée pour le développement
 * Port: 8001 (configuré dans le frontend)
 */

// Définir le port du serveur
$port = 8001;

// Vérifier si le port est disponible
$socket = @socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
if ($socket === false) {
    die("Impossible de créer le socket");
}

$result = @socket_bind($socket, '127.0.0.1', $port);
if ($result === false) {
    die("Le port $port est déjà utilisé. Arrêtez le processus qui l'utilise.");
}

socket_close($socket);

// Configuration du serveur
$_SERVER['SERVER_PORT'] = $port;
$_SERVER['HTTP_HOST'] = "localhost:$port";

// Charger l'application Laravel
$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

// This file allows us to emulate Apache's "mod_rewrite" functionality from the
// built-in PHP web server. This provides a convenient way to test a Laravel
// application without having installed a "real" web server software here.
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

require_once __DIR__.'/public/index.php';
