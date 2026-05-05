<?php



echo "PHP version: " . PHP_VERSION . "\n";
echo "Attempting to include autoloader...\n";
try {
    require __DIR__ . '/vendor/autoload.php';
    echo "Autoloader included successfully!\n";
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
