<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

include 'db_connect.php';
$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$status = $data['status']; // 'todo', 'inprogress', 'done', dll

$sql = "UPDATE tasks SET status = '$status' WHERE id = '$id'";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["status" => true]);
} else {
    echo json_encode(["status" => false, "message" => mysqli_error($conn)]);
}
?>