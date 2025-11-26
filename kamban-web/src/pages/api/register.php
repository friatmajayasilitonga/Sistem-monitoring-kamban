<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include "db_connect.php";

// AMBIL DATA JSON DARI REACT
$data = json_decode(file_get_contents("php://input"), true);

$name     = trim($data["name"]);
$email    = trim($data["email"]);
$password = trim($data["password"]);
$confirm  = trim($data["confirm"]);

// VALIDASI
if (!$name || !$email || !$password || !$confirm) {
    echo json_encode(["status" => false, "message" => "Harap isi semua field"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["status" => false, "message" => "Format email tidak valid"]);
    exit;
}

if ($password !== $confirm) {
    echo json_encode(["status" => false, "message" => "Password tidak cocok"]);
    exit;
}

// CEK EMAIL SUDAH ADA
$check = mysqli_query($conn, "SELECT * FROM users WHERE email='$email'");
if (mysqli_num_rows($check) > 0) {
    echo json_encode(["status" => false, "message" => "Email sudah terdaftar"]);
    exit;
}

// HASH PASSWORD
$hashed = password_hash($password, PASSWORD_DEFAULT);

// INSERT USER
$stmt = mysqli_prepare($conn, "INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
mysqli_stmt_bind_param($stmt, "sss", $name, $email, $hashed);

if (mysqli_stmt_execute($stmt)) {
    echo json_encode(["status" => true, "message" => "Registrasi berhasil"]);
} else {
    echo json_encode(["status" => false, "message" => "Gagal mendaftar"]);
}

mysqli_stmt_close($stmt);
mysqli_close($conn);
?>