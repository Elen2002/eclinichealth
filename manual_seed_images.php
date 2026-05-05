<?php

$dsn = "pgsql:host=localhost;port=5432;dbname=eclinichealth";
$user = "postgres";
$pass = "root12";

$hospitalImages = [
    'https://images.unsplash.com/photo-1586773860418-d3b978b8c647?q=80&w=970&h=440&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=970&h=440&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=970&h=440&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=970&h=440&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1504813184591-01572f98c85f?q=80&w=970&h=440&auto=format&fit=crop',
];

$sizes = [
    ["name" => "100x100", "w" => 100, "h" => 100],
    ["name" => "223x200", "w" => 223, "h" => 200],
    ["name" => "x200", "w" => 0, "h" => 200],
    ["name" => "650x450", "w" => 650, "h" => 450],
    ["name" => "970x440", "w" => 970, "h" => 440],
];

try {
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT id, name FROM hospital");
    $hospitals = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($hospitals as $hospital) {
        $id = $hospital['id'];
        
        
        $stmt = $pdo->prepare("SELECT count(*) FROM images WHERE parent_class = ? AND entity_id = ?");
        $stmt->execute(['App\\Entity\\Hospital', $id]);
        if ($stmt->fetchColumn() == 0) {
            echo "Seeding images for: " . $hospital['name'] . " (ID: $id)\n";
            
            $imageUrl = $hospitalImages[array_rand($hospitalImages)];
            $imageContent = @file_get_contents($imageUrl);
            
            if ($imageContent) {
                $uniqName = uniqid();
                $uploadedNameBase = 'hospital-' . $id . '-' . $uniqName;

                foreach ($sizes as $size) {
                    $sizeName = $size['name'];
                    $width = $size['w'];
                    $height = $size['h'];

                    $dir = __DIR__ . "/upload/hospital/$id/images/$sizeName";
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
                        $stmt->execute([$id, $filename, 'App\\Entity\\Hospital', $sizeName]);
                        
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
