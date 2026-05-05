<?php
$dsn = "pgsql:host=localhost;port=5432;dbname=eclinichealth";
$user = "postgres";
$pass = "root12";

try {
    $pdo = new PDO($dsn, $user, $pass);
    echo "--- Doctors Table ---\n";
    $stmt = $pdo->query("SELECT d.id, d.hospital_id, d.department_id FROM doctor d");
    $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($doctors as $d) {
        echo "Doctor ID: " . $d['id'] . " | Hospital: " . ($d['hospital_id'] ?: 'NULL') . " | Dept: " . ($d['department_id'] ?: 'NULL') . "\n";
    }
    
    echo "\n--- HospitalDepartment Table ---\n";
    $stmt = $pdo->query("SELECT hd.id, hd.hospital_id, hd.department_id, hd.doctor_id FROM hospital_department hd");
    $hds = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($hds as $hd) {
        echo "HD ID: " . $hd['id'] . " | Hospital: " . $hd['hospital_id'] . " | Dept: " . $hd['department_id'] . " | Doctor (User ID): " . ($hd['doctor_id'] ?: 'NULL') . "\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
