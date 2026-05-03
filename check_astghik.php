<?php
$dsn = "pgsql:host=localhost;port=5432;dbname=eclinichealth";
$user = "postgres";
$pass = "root12";

try {
    $pdo = new PDO($dsn, $user, $pass);
    echo "--- Hospitals ---\n";
    $stmt = $pdo->query("SELECT id, name FROM hospital");
    $hospitals = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($hospitals as $h) {
        echo "ID: " . $h['id'] . " | Name: " . $h['name'] . "\n";
    }
    
    echo "\n--- Hospital Departments for Astghik (if we find it) ---\n";
    $astghikId = null;
    foreach ($hospitals as $h) {
        if (strpos($h['name'], 'Աստղիկ') !== false || strpos($h['name'], 'Astghik') !== false) {
            $astghikId = $h['id'];
            echo "Found Astghik ID: " . $astghikId . "\n";
            break;
        }
    }
    
    if ($astghikId) {
        $stmt = $pdo->prepare("SELECT d.id, d.name FROM hospital_department hd JOIN department d ON hd.department_id = d.id WHERE hd.hospital_id = ?");
        $stmt->execute([$astghikId]);
        $depts = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "Departments found: " . count($depts) . "\n";
        foreach ($depts as $d) {
            echo "Dept ID: " . $d['id'] . " | Name: " . $d['name'] . "\n";
        }
    } else {
        echo "Astghik not found in hospital list.\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
