<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Обработка предварительного OPTIONS-запроса
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require __DIR__ . '/db.php';

// Проверяем существование сессии перед её стартом
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$response = ['status' => 'error', 'message' => ''];

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Метод не поддерживается';
    http_response_code(405);
    echo json_encode($response);
    exit;
}

// Проверка авторизации
if (empty($_SESSION['user_id'])) {
    $response['message'] = 'Требуется авторизация';
    http_response_code(401);
    echo json_encode($response);
    exit;
}

// Получение данных
$input = json_decode(file_get_contents('php://input'), true);

// Валидация данных
if (empty($input['theme'])) {
    $response['message'] = 'Не указана тема';
    http_response_code(400);
    echo json_encode($response);
    exit;
}

// Разрешенные темы
$allowedThemes = ['light', 'dark'];
if (!in_array($input['theme'], $allowedThemes)) {
    $response['message'] = 'Допустимые темы: light, dark';
    http_response_code(400);
    echo json_encode($response);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE users SET theme = ? WHERE id = ?");
    $stmt->execute([$input['theme'], $_SESSION['user_id']]);
    
    $response = [
        'status' => 'success',
        'message' => 'Тема обновлена',
        'theme' => $input['theme']
    ];
} catch (PDOException $e) {
    $response['message'] = 'Ошибка базы данных';
    error_log("Theme update error: " . $e->getMessage());
    http_response_code(500);
}

echo json_encode($response, JSON_UNESCAPED_UNICODE);
exit;
?>