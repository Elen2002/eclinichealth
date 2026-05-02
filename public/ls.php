<?php
echo "Current directory: " . getcwd() . "\n";
echo "Files in current directory:\n";
print_r(scandir('.'));
echo "\nFiles in ../src/:\n";
print_r(scandir('../src/'));
