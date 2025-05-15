<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");

require 'db.php';

// Отключаем вывод любых ошибок в ответ
error_reporting(0);
ini_set('display_errors', 0);

$response = ['status' => 'error', 'message' => ''];

try {
    session_start();
    
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('Пользователь не авторизован', 401);
    }

    $stmt = $pdo->prepare("SELECT id, first_name, last_name, email, theme FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user) {
        throw new Exception('Пользователь не найден', 404);
    }

    $response = [
        'status' => 'success',
        'user' => [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'theme' => $user['theme'] ?? 'light'
        ]
    ];

} catch (Exception $e) {
    $response['message'] = $e->getMessage();
    http_response_code($e->getCode() ?: 500);
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
exit;
?>