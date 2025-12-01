<?php
// Izinkan akses CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Koneksi Database
include 'db_connect.php';

// Ambil data JSON
$data = json_decode(file_get_contents("php://input"), true);

// Pastikan data tidak kosong
if(!isset($data['name']) || !isset($data['email'])) {
    echo json_encode(["status" => false, "message" => "Data tidak lengkap!"]);
    exit();
}

$name  = $data['name'];
$email = $data['email'];
$phone = isset($data['phone']) ? $data['phone'] : ''; // Cegah error jika phone kosong
$role  = $data['role'];
$password = "123456"; // Password default

// 1. Cek Email Kembar
$check = mysqli_query($conn, "SELECT id FROM users WHERE email = '$email'");
if (!$check) {
    // Jika query SELECT error
    echo json_encode(["status" => false, "message" => "Error Cek Email: " . mysqli_error($conn)]);
    exit();
}

if(mysqli_num_rows($check) > 0){
    echo json_encode(["status" => false, "message" => "Email sudah terdaftar!"]);
    exit();
}

// 2. Proses Insert
$sql = "INSERT INTO users (name, email, phone, role, password) VALUES ('$name', '$email', '$phone', '$role', '$password')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["status" => true, "message" => "Berhasil menambah pegawai"]);
} else {
    // INI YANG PENTING: Kirim pesan error SQL yang asli ke React
    echo json_encode(["status" => false, "message" => "Gagal Insert Database: " . mysqli_error($conn)]);
}
?>