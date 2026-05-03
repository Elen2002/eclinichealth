<?php
// seed_images.php - Standalone script to seed images directly via PDO

$dsn = "pgsql:host=localhost;port=5432;dbname=eclinichealth";
$user = "postgres";
$password = "root12";

try {
    $pdo = new PDO($dsn, $user, $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    echo "Connected to database successfully.\n";

    // 1. Clear existing Unsplash images
    $pdo->exec("DELETE FROM images WHERE title LIKE 'https://images.unsplash.com/%'");
    echo "Cleared old Unsplash images.\n";

    // 2. Seed Hospital Images
    $hospitals = $pdo->query("SELECT id FROM hospital")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($hospitals as $h) {
        $id = $h['id'];
        $url = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200&sig=" . $id;
        $stmt = $pdo->prepare("INSERT INTO images (parent_class, entity_id, title, size) VALUES (?, ?, ?, ?)");
        $stmt->execute(['App\Entity\Hospital', $id, $url, 'original']);
    }
    echo "Seeded images for " . count($hospitals) . " hospitals.\n";

    // 3. Seed Department Images
    $departments = $pdo->query("SELECT id, name FROM department")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($departments as $d) {
        $id = $d['id'];
        $name = $d['name'];
        
        $imgUrl = match($name) {
            'Կարդիոլոգիա' => 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=800',
            'Նյարդաբանություն' => 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800',
            'Ատամնաբուժություն' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
            'Մանկաբարձություն' => 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
            'Օրթոպեդիա' => 'https://images.unsplash.com/photo-1579154235602-3c2c2aa59ace?auto=format&fit=crop&q=80&w=800',
            'Թերապիա' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
            'Դիագնոստիկա' => 'https://images.unsplash.com/photo-1579154236605-e325091726a5?auto=format&fit=crop&q=80&w=800',
            default => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
        };

        $stmt = $pdo->prepare("INSERT INTO images (parent_class, entity_id, title, size) VALUES (?, ?, ?, ?)");
        $stmt->execute(['App\Entity\Department', $id, $imgUrl, 'original']);
    }
    echo "Seeded images for " . count($departments) . " departments.\n";

    echo "DONE!\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
