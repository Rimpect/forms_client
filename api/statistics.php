<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173"); // Или ваш фронтенд-адрес
header("Access-Control-Allow-Credentials: true");

require __DIR__ . '/db.php';

$response = ['status' => 'error', 'message' => '', 'stats' => []];

try {
    // 1. Общее количество пользователей
    $stmt = $pdo->query("SELECT COUNT(id) AS total_users FROM users");
    $total = $stmt->fetch()['total_users'];
    
    // 2. Количество регистраций за последний месяц
    $begin_date = date("Y-m-01"); // Первый день текущего месяца
    $end_date = date("Y-m-t");    // Последний день текущего месяца
    
    $stmt = $pdo->prepare("SELECT COUNT(id) AS month_users FROM users 
                          WHERE created_at BETWEEN ? AND ?");
    $stmt->execute([$begin_date, $end_date]);
    $month_users = $stmt->fetch()['month_users'];
    
    // 3. Последний зарегистрированный пользователь
    $stmt = $pdo->query("SELECT first_name, last_name, created_at 
                         FROM users ORDER BY created_at DESC LIMIT 1");
    $last_user = $stmt->fetch();
    
    $response['status'] = 'success';
    $response['stats'] = [
        'total_users' => $total,
        'month_users' => $month_users,
        'last_user' => $last_user
    ];
} catch (PDOException $e) {
    $response['message'] = 'Ошибка базы данных: ' . $e->getMessage();
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
?>