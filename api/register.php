<?php
header_remove();
session_set_cookie_params([
    'lifetime' => 86400,
    'path' => '/',
    'domain' => 'localhost',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Strict'
]);

ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__.'/php_errors.log');

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    ob_end_clean();
    exit;
}

require __DIR__.'/db.php';

$response = ['status' => 'error', 'message' => ''];

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Метод не поддерживается', 405);
    }

    $input = file_get_contents('php://input');
    if (empty($input)) {
        throw new Exception('Пустой запрос', 400);
    }
    
    $data = json_decode($input, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Неверный формат JSON', 400);
    }

    // Валидация reCAPTCHA
    if (empty($data['recaptcha_token'])) {
        throw new Exception('Подтвердите, что вы не робот', 400);
    }

    $recaptchaSecret = '6LfCASErAAAAAHzbmutmVNg8K63beZsdOKI_qXzI'; // Замените на реальный ключ
    $recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify?secret={$recaptchaSecret}&response={$data['recaptcha_token']}";
    $recaptchaResponse = file_get_contents($recaptchaUrl);
    $recaptchaData = json_decode($recaptchaResponse);

    if (!$recaptchaData || !$recaptchaData->success) {
        throw new Exception('Ошибка проверки reCAPTCHA', 400);
    }

    $required = [
        'first_name' => 'Имя',
        'last_name' => 'Фамилия',
        'email' => 'Email',
        'login' => 'Логин',
        'password' => 'Пароль',
        'gender' => 'Пол',
        'age' => 'Возраст'
    ];
    
    foreach ($required as $field => $name) {
        if (empty($data[$field])) {
            throw new Exception("Поле {$name} обязательно для заполнения", 400);
        }
    }

    $firstName = trim(htmlspecialchars($data['first_name']));
    $lastName = trim(htmlspecialchars($data['last_name']));
    $email = filter_var(trim($data['email']), FILTER_VALIDATE_EMAIL);
    $login = trim(htmlspecialchars($data['login']));
    $password = $data['password'];
    $gender = in_array($data['gender'], ['Male', 'Female']) ? $data['gender'] : null;
    $age = (int)$data['age'];

    if (!$email) {
        throw new Exception('Некорректный email', 400);
    }

    if (strlen($password) < 6) {
        throw new Exception('Пароль должен содержать минимум 6 символов', 400);
    }

    if (!$gender) {
        throw new Exception('Некорректно указан пол', 400);
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? OR login = ?");
    $stmt->execute([$email, $login]);
    
    if ($stmt->fetch()) {
        throw new Exception('Пользователь с таким email или логином уже существует', 409);
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, login, password, gender, age) VALUES (?, ?, ?, ?, ?, ?, ?)");
    
    if (!$stmt->execute([$firstName, $lastName, $email, $login, $passwordHash, $gender, $age])) {
        throw new Exception('Ошибка при создании пользователя', 500);
    }

    session_start();
    $_SESSION = [
        'user_id' => $pdo->lastInsertId(),
        'user_ip' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
    ];

    $response = [
        'status' => 'success',
        'message' => 'Регистрация успешно завершена',
        'user' => [
            'id' => $_SESSION['user_id'],
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $email
        ]
    ];

    http_response_code(201);

} catch (PDOException $e) {
    http_response_code(500);
    $response['message'] = 'Ошибка базы данных';
    error_log("PDO Error: " . $e->getMessage());
    
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 400);
    $response['message'] = $e->getMessage();
    error_log("Registration Error: " . $e->getMessage());
}

ob_end_clean();
echo json_encode($response, JSON_UNESCAPED_UNICODE);
exit;