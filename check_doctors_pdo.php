<?php
$dsn = "pgsql:host=localhost;port=5432;dbname=eclinichealth";
$user = "postgres";
$pass = "root12";

try {
    $pdo = new PDO($dsn, $user, $pass);
    $stmt = $pdo->query("SELECT d.id, d.hospital_id, d.department_id FROM doctor d");
    $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo "Total Doctors: " . count($doctors) . "\n";
    foreach ($doctors as $d) {
        echo "Doctor ID: " . $d['id'] . " | Hospital: " . ($d['hospital_id'] ?: 'NULL') . " | Dept: " . ($d['department_id'] ?: 'NULL') . "\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
