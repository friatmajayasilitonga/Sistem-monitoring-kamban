<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

include 'db_connect.php';
$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'];
$assignee = $data['assignee'];
$priority = $data['priority'];
$desc = $data['description'];
$start = $data['startDate'];
$end = $data['endDate'];
$status = 'todo'; // Default status

$sql = "INSERT INTO tasks (title, assignee, priority, description, start_date, end_date, status) 
        VALUES ('$title', '$assignee', '$priority', '$desc', '$start', '$end', '$status')";

if (mysqli_query($conn, $sql)) {
    echo json_encode(["status" => true, "message" => "Tugas berhasil dibuat"]);
} else {
    echo json_encode(["status" => false, "message" => "Error: " . mysqli_error($conn)]);
}
?>