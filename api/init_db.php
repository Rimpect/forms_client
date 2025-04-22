<?php
// Подключение к базе данных
$host = 'localhost';
$dbname = 'web_lab';
$user = 'postgres'; 
$password = 'postgres';

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Подключение к базе данных успешно!\n";
} catch (PDOException $e) {
    die("Ошибка подключения: " . $e->getMessage());
}

// SQL-запросы для создания таблиц
// $sql = "
// CREATE TABLE IF NOT EXISTS users (
//     id SERIAL PRIMARY KEY,
//     first_name VARCHAR(15) NOT NULL,
//     last_name VARCHAR(15) NOT NULL,
//     email VARCHAR(100) NOT NULL UNIQUE,
//     login VARCHAR(50) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     gender VARCHAR(255) NOT NULL,
//     age VARCHAR(255) NOT NULL,
//     theme VARCHAR(255) DEFAULT 'light'
// );

// CREATE TABLE IF NOT EXISTS posts (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     content TEXT NOT NULL,
//     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id)
// );
// ";

// Выполнение SQL-запросов
try {
    $pdo->exec($sql);
    echo "Таблицы успешно созданы!\n";
} catch (PDOException $e) {
    die("Ошибка при создании таблиц: " . $e->getMessage());
}
?>