<?php

$dsn = "pgsql:host=localhost;port=5432;dbname=eclinichealth";
$user = "postgres";
$pass = "root12";

$doctorImages = [
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=223&h=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=223&h=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559839734-2b71f1536750?q=80&w=223&h=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=223&h=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=223&h=200&auto=format&fit=crop',
];

$sizes = [
    ["name" => "100x100", "w" => 100, "h" => 100],
    ["name" => "223x200", "w" => 223, "h" => 200],
    ["name" => "x200", "w" => 0, "h" => 200],
];

try {
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT d.id, u.email FROM doctor d JOIN users u ON d.user_id = u.id");
    $doctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($doctors as $doctor) {
        $id = $doctor['id'];
        
        
        $stmt = $pdo->prepare("SELECT count(*) FROM images WHERE parent_class = ? AND entity_id = ?");
        $stmt->execute(['App\\Entity\\Doctor', $id]);
        if ($stmt->fetchColumn() == 0) {
            echo "Seeding images for Doctor: " . $doctor['email'] . " (ID: $id)\n";
            
            $imageUrl = $doctorImages[array_rand($doctorImages)];
            $imageContent = @file_get_contents($imageUrl);
            
            if ($imageContent) {
                $uniqName = uniqid();
                $uploadedNameBase = 'doctor-' . $id . '-' . $uniqName;

                foreach ($sizes as $size) {
                    $sizeName = $size['name'];
                    $width = $size['w'];
                    $height = $size['h'];

                    $dir = __DIR__ . "/upload/doctor/$id/images/$sizeName";
                    if (!file_exists($dir)) {
                        mkdir($dir, 0777, true);
                    }

                    $filename = $uploadedNameBase . '.jpg';
                    $target = $dir . '/' . $filename;

                    $src = @imagecreatefromstring($imageContent);
                    if ($src) {
                        $w = imagesx($src);
                        $h = imagesy($src);
                        $dstWidth = $width ?: ($width == 0 ? round($w * ($height / $h)) : $w);
                        $dstHeight = $height ?: ($height == 0 ? round($h * ($width / $w)) : $h);
                        
                        $dst = imagecreatetruecolor($dstWidth, $dstHeight);
                        imagecopyresampled($dst, $src, 0, 0, 0, 0, $dstWidth, $dstHeight, $w, $h);
                        imagejpeg($dst, $target, 85);
                        
                        $stmt = $pdo->prepare("INSERT INTO images (entity_id, title, parent_class, size) VALUES (?, ?, ?, ?)");
                        $stmt->execute([$id, $filename, 'App\\Entity\\Doctor', $sizeName]);
                        
                        imagedestroy($src);
                        imagedestroy($dst);
                    }
                }
            }
        }
    }
    echo "Done.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
