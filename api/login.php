<?php
ob_start();
error_reporting(0); // Отключаем вывод ошибок в ответ
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
require 'db.php';

$response = ['status' => 'error', 'message' => ''];
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['login']) || empty($data['password'])) {
        $response['message'] = 'Логин и пароль обязательны';
        echo json_encode($response);
        exit;
    }

    $login = trim($data['login']);
    $password = $data['password'];

    try {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE login = ?");
        $stmt->execute([$login]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION = [];
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_ip'] = $_SERVER['REMOTE_ADDR'];
            
            $response = [
                'status' => 'success',
                'message' => 'Авторизация успешна',
                'user' => [
                    'id' => $user['id'],
                    'first_name' => $user['first_name'],
                    'last_name' => $user['last_name'],
                    'email' => $user['email'],
                    'theme' => $user['theme']
                ]
            ];
        } else {
            $response['message'] = 'Неверный логин или пароль';
        }
    } catch (PDOException $e) {
        $response['message'] = 'Ошибка сервера: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Метод не поддерживается';
}
ob_end_flush();
echo json_encode($response);
?>