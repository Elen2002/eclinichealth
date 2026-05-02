<?php
require 'vendor/autoload.php';
if (class_exists('App\\Kernel')) {
    echo "App\\Kernel found!\n";
} else {
    echo "App\\Kernel NOT found!\n";
}
