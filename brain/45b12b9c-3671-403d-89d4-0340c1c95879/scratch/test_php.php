<?php
// Scratch script to manually seed some images without full symfony stack if possible
// Or just to test if I can run PHP at all

echo "PHP version: " . PHP_VERSION . "\n";
echo "Attempting to include autoloader...\n";
try {
    require __DIR__ . '/vendor/autoload.php';
    echo "Autoloader included successfully!\n";
} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
