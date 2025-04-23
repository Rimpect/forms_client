<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");

require __DIR__ . '/db.php';

$response = ['status' => 'error', 'message' => '', 'users' => []];

try {
    $stmt = $pdo->query("SELECT id, first_name, last_name, email FROM users ORDER BY last_name");
    $users = $stmt->fetchAll();
    
    $response['status'] = 'success';
    $response['users'] = $users;
} catch (PDOException $e) {
    $response['message'] = 'Ошибка базы данных: ' . $e->getMessage();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>