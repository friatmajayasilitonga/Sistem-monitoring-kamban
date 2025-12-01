<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Ubah jadi POST agar bisa terima data JSON

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db_connect.php';

// Ambil data JSON yang dikirim dari React (Siapa yang login?)
$data = json_decode(file_get_contents("php://input"), true);

$role = isset($data['role']) ? $data['role'] : '';
$name = isset($data['name']) ? $data['name'] : '';

// --- LOGIKA FILTER ---
if ($role === 'admin') {
    // 1. Jika Admin: Tampilkan SEMUA tugas
    $sql = "SELECT * FROM tasks ORDER BY id ASC";
} else {
    // 2. Jika Employee: Tampilkan HANYA tugas milik dia
    // Pastikan nama di database sama persis dengan nama di localStorage
    $sql = "SELECT * FROM tasks WHERE assignee = '$name' ORDER BY id ASC";
}

$result = mysqli_query($conn, $sql);

$tasks = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $tasks[] = [
            "id" => $row['id'],
            "columnId" => $row['status'],
            "content" => $row['title'],
            "avatar" => substr($row['assignee'], 0, 2),
            "priority" => $row['priority'],
            "meta" => [
                "assignee" => $row['assignee'],
                "description" => $row['description'],
                "startDate" => $row['start_date'],
                "endDate" => $row['end_date']
            ]
        ];
    }
}

echo json_encode($tasks);
?>