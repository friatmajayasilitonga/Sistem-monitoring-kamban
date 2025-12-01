<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Handle preflight request (Penting untuk Chrome/Edge modern)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
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

// PREPARED STATEMENT (lebih aman)
$stmt = mysqli_prepare($conn, "SELECT id, name, email, password, role FROM users WHERE email = ?");
mysqli_stmt_bind_param($stmt, "s", $email);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

// Cek Email
if (mysqli_num_rows($result) == 0) {
    echo json_encode(["status" => false, "message" => "Email tidak ditemukan"]);
    exit;
}

$user = mysqli_fetch_assoc($result);

// Cek Password
if (!password_verify($password, $user["password"])) {
    echo json_encode(["status" => false, "message" => "Password salah"]);
    exit;
}

// KIRIM role ke React!!!
echo json_encode([
    "status" => true,
    "message" => "Login berhasil",
    "name" => $user["name"],
    "email" => $user["email"],
    "role" => $user["role"],   // <-- Tambah ini
]);

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>
