<?php
header("Content-Type: application/json");
session_start();
require 'db.php';

$response = ['status' => 'error', 'message' => ''];

if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'Пользователь не авторизован';
    echo json_encode($response);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();

    if ($user) {
        $response['status'] = 'success';
        $response['user'] = [
            'id' => $user['id'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'theme' => $user['theme']
        ];
    } else {
        $response['message'] = 'Пользователь не найден';
    }
} catch (PDOException $e) {
    $response['message'] = 'Ошибка базы данных: ' . $e->getMessage();
}

echo json_encode($response);
?>