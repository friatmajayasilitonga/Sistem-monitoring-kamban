<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db_connect.php';

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$name = $data['name'];
$email = $data['email'];
$phone = $data['phone'];
$role = $data['role'];

// Query Update
$sql = "UPDATE users SET name='$name', email='$email', phone='$phone', role='$role' WHERE id='$id'";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["status" => true, "message" => "Data berhasil diperbarui"]);
} else {
    echo json_encode(["status" => false, "message" => "Gagal: " . mysqli_error($conn)]);
}
?>