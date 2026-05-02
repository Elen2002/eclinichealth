<?php
// Safety token - delete this file after use
$token = $_GET['token'] ?? '';
if ($token !== 'eclinic2026fix') {
    die('Unauthorized');
}

$projectRoot = dirname(__DIR__);

echo "<pre>";
echo "Project root: $projectRoot\n\n";

// Step 1: Check what autoload_classmap.php contains
$classmapFile = $projectRoot . '/vendor/composer/autoload_classmap.php';
if (file_exists($classmapFile)) {
    $classmap = require $classmapFile;
    $kernelEntry = $classmap['App\\Kernel'] ?? 'NOT FOUND';
    echo "Kernel in classmap: $kernelEntry\n";
    echo "Kernel file exists on disk: " . (file_exists($kernelEntry) ? 'YES' : 'NO') . "\n";
    echo "Expected path: $projectRoot/src/Kernel.php\n";
    echo "Expected exists: " . (file_exists($projectRoot . '/src/Kernel.php') ? 'YES' : 'NO') . "\n\n";
} else {
    echo "No classmap file found.\n\n";
}

// Step 2: Regenerate the autoloader classmap with correct server paths
echo "Regenerating autoloader...\n";
$descriptors = [
    0 => ['pipe', 'r'],
    1 => ['pipe', 'w'],
    2 => ['pipe', 'w'],
];
$process = proc_open(
    'composer dump-autoload',
    $descriptors,
    $pipes,
    $projectRoot,
    ['HOME' => '/root', 'COMPOSER_HOME' => '/root/.composer']
);

if (is_resource($process)) {
    $stdout = stream_get_contents($pipes[1]);
    $stderr = stream_get_contents($pipes[2]);
    fclose($pipes[0]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    $exitCode = proc_close($process);
    echo "Exit code: $exitCode\n";
    echo "STDOUT: $stdout\n";
    echo "STDERR: $stderr\n";
} else {
    echo "Failed to run composer.\n";
}

// Step 3: Clear Symfony cache
echo "\nClearing Symfony cache...\n";
$cacheDir = $projectRoot . '/var/cache';
if (is_dir($cacheDir)) {
    $devDir = $cacheDir . '/dev';
    if (is_dir($devDir)) {
        // Rename old cache and create fresh directory
        $oldCache = $cacheDir . '/dev_old_' . time();
        rename($devDir, $oldCache);
        mkdir($devDir, 0777, true);
        echo "Cache dev dir cleared (renamed to $oldCache)\n";
    } else {
        echo "No dev cache dir found.\n";
    }
} else {
    echo "No var/cache dir found.\n";
}

echo "\nDone! Now try refreshing the main site.\n";
echo "</pre>";
