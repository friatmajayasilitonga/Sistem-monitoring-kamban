<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "db_connect.php";

// Ambil JSON dari React
$data = json_decode(file_get_contents("php://input"), true);

$email    = trim($data["email"]);
$password = trim($data["password"]);

// Validasi
if (!$email || !$password) {
    echo json_encode(["status" => false, "message" => "Email dan password wajib diisi"]);
    exit;
}

$check = mysqli_query($conn, "SELECT * FROM users WHERE email='$email'");

if (mysqli_num_rows($check) == 0) {
    echo json_encode(["status" => false, "message" => "Email tidak ditemukan"]);
    exit;
}

$user = mysqli_fetch_assoc($check);

if (!password_verify($password, $user["password"])) {
    echo json_encode(["status" => false, "message" => "Password salah"]);
    exit;
}

echo json_encode([
    "status" => true,
    "message" => "Login berhasil",
    "name" => $user["name"],
    "email" => $user["email"]
]);

mysqli_close($conn);
?>
