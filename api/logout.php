<?php
require_once 'db.php';

session_start();
$_SESSION = [];
session_destroy();

echo json_encode(["success" => true, "message" => "Вы вышли"]);
?>