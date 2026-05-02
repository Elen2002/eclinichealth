<?php
$passwords = ['root12', 'root', 'postgres', 'qwerty', '123456', ''];
foreach ($passwords as $p) {
    echo "Testing password: '$p'...\n";
    try {
        $conn = @pg_connect("host=localhost port=5432 dbname=eclinichealth user=postgres password=$p");
        if ($conn) {
            echo "SUCCESS! Password is: $p\n";
            exit;
        }
    } catch (Exception $e) {}
}
echo "Failed to find password.\n";
