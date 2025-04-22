<?php
// Настройки кук ДО старта сессии!
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);

// Затем запускаем сессию
session_start();

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$host = 'localhost';
$dbname = 'lab_web';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die(json_encode([
        "success" => false,
        "error" => "Database connection failed: " . $e->getMessage()
    ]));
}
?>