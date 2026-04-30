<?php

namespace App\Service;

use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Yaml\Yaml;

class Helper
{

    private $classGeneratorconfigExample = [
        'path' => 'src/TestBundle/Services/',
        'namespace' => 'App\TestBundle\Services',

        'name' => 'TestService',

        'extends' => 'BaseService',
        'implements' => ['LoggerAwareInterface'],

        'properties' => [
            ['visibility' => 'private', 'name' => 'logger', 'type' => 'Psr\Log\LoggerInterface'],
            ['visibility' => 'protected', 'name' => 'count', 'type' => 'int', 'default' => 0],
        ],

        'constructor' => [
            ['name' => 'logger', 'type' => 'Psr\Log\LoggerInterface']
        ],

        'methods' => [
            [
                'name' => 'method1',
                'params' => [['name' => 'id', 'type' => 'int']],
                'return' => 'string'
            ],
            [
                'name' => 'method2',
                'params' => [],
                'return' => 'void'
            ]
        ]
    ];

    public static function generateUniqNumber(string $prefix, int $length = 8): string
    {
        // Generate a unique ID based on the current time in microseconds
        $uniqueId = uniqid('', true); // Adds more entropy
        // Shorten the unique ID to the desired length
        $uniquePart = substr(bin2hex(random_bytes($length)), 0, $length);

        // Combine the prefix with the unique identifier
        return $prefix . '-' . $uniquePart;
    }

    public static function generateSerialNumber($prefix = 'PROD')
    {
        // Use a prefix for the product, like a category or 'PROD' for product
        $prefix = strtoupper($prefix);

        // Date and time in a sortable format: YYYYMMDDHHMMSS
        $dateTime = date('YmdHis');

        // A unique identifier, e.g., a random number or UUID (here using a 5-digit random number)
        $randomNumber = mt_rand(10000, 99999);

        // Combine them to form the serial number
        $serialNumber = $prefix . '-' . $dateTime . '-' . $randomNumber;

        return $serialNumber;
    }

    public static function generateWalletNumber($length = 12)
    {
        // Define the characters to use in the wallet number (alphanumeric)
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        // Get the current timestamp for uniqueness
        $timestamp = time();

        // Generate a random string for the wallet number
        $randomString = '';
        if ($length < strlen($timestamp)) {
            for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[rand(0, strlen($characters) - 1)];
            }
            $walletNumber = $randomString;
        } else {
            for ($i = 0; $i < $length - strlen($timestamp); $i++) {
                $randomString .= $characters[rand(0, strlen($characters) - 1)];
            }
            $walletNumber = $randomString . $timestamp;
        }

        return $walletNumber;
    }

    public static function getSelectedStatuses(Request $request, string $key = 'p_status'): array
    {
        $checked = [];
        $selectedStatus = $request->get($key);
        if (!empty($selectedStatus)) {
            foreach ($selectedStatus as $key => $selectedStatus) {
                $checked[] = $key;
            }
        }

        return $checked;
    }

    public static function filter(QueryBuilder $qb, array $params, string $key = ""): QueryBuilder
    {
        $startDate = date('Y-m-d');
        $endDate = date('Y-m-d');

        if (!empty($params[$key . "_startDate"]) || !empty($params[$key . "_startDate"])) {
            if (!empty($params[$key . "_startDate"])) {
                $startDate = $params[$key . "_startDate"];
            }
            if (!empty($params[$key . "_endDate"])) {
                $endDate = $params[$key . "_endDate"];
            }
            $qb->andWhere($key . ".startDate between '{$startDate}' and '{$endDate}' and {$key}.endDate between '{$startDate}' and '{$endDate}' ");
        }

        if (!empty($params[$key . "_status"])) {
            $statuses = $params[$key . "_status"];
            $conditionString = "";
            $index = 0;
            foreach ($statuses as $key => $status) {
                if ($index == 0) {
                    $conditionString = "a.key = '{$key}'";
                } else {
                    $conditionString .= " or a.key = '{$key}'";
                }
                $index++;
            }
            $qb->andWhere($conditionString);
        }

        return $qb;
    }

    public static function parseClass(string $entityClassName): array
    {
        $parts = explode('\\', $entityClassName);
        $class_name = $parts[2];
        $entity_name = preg_split('/(?=[A-Z])/', $class_name, -1, PREG_SPLIT_NO_EMPTY)[0];
        $entity_name_low = strtolower($entity_name);

        return ["entityName" => $entity_name, "class_name_low" => $entity_name_low];
    }

    public static function resizeImage(UploadedFile $file, $maxWidth, $maxHeight)
    {

        $imageInfo = getimagesize($file);
        $mgPath = $file->getFileInfo()->getPathname();
        if ($imageInfo) {
            $originalWidth = $imageInfo[0];
            $originalHeight = $imageInfo[1];
            $imageType = $imageInfo[2];
            if ($maxWidth == 0) {
                $r = 777;
            }

            $aspectRatio = $maxWidth / $maxHeight;
            if ($originalWidth > $maxWidth || $originalHeight > $maxHeight) {
                if ($maxWidth / $maxHeight > $aspectRatio) {
                    $newWidth = $maxHeight * $aspectRatio;
                    $newHeight = $maxHeight;
                } else {

                    if ($maxWidth == 0) {
                        $newWidth = $originalWidth;
                        $newHeight = $maxHeight;
                    } else {
                        $newWidth = $maxWidth;
                        $newHeight = $maxWidth / $aspectRatio;
                    }

                }
            } else {
                // No resizing needed, use original dimensions
                $newWidth = $originalWidth;
                $newHeight = $originalHeight;
            }

            switch ($imageType) {
                case IMAGETYPE_JPEG:

                    $srcImage = imagecreatefromjpeg($mgPath);
                    break;
                case IMAGETYPE_PNG:
                    $srcImage = imagecreatefrompng($mgPath);
                    break;
                case IMAGETYPE_GIF:
                    $srcImage = imagecreatefromgif($mgPath);
                    break;
                default:
                    die('Unsupported image type');
            }

            $dstImage = imagecreatetruecolor($newWidth, $newHeight);
            imagecopyresampled($dstImage, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $originalWidth, $originalHeight);

            return $dstImage;
        }


    }

    public static function setPreviousUrl(Request $request, string $prefix): void
    {
        $currentUrl = $request->getUri();
        $session = $request->getSession();
        $session->set($prefix, $currentUrl);
    }

    public static function getPreviousUrl(Request $request, string $prefix): string|null
    {
        $session = $request->getSession();
        return $session->get($prefix);
    }

    public static function assetTypeNameToCamelCase($string): string
    {
        $string = str_replace(' ', '', ucwords(str_replace('_', ' ', $string)));
        $excludedTypes = ['apartment', 'house', 'other', 'apartmentBuilding'];
        foreach ($excludedTypes as $excludedType) {
            if (lcfirst($string) == $excludedType) {
                $string = 'building';
                break;
            }
        }
        return lcfirst($string);
    }

    public static function generateOrderNumber($min = 3726001, $max = 3727000): int
    {
        return mt_rand($min, $max);
    }

    public static function generateOrderID(int $startNumber = 3726001, int $symbolCount = 7)
    {
        $value = str_pad((string)$startNumber, $symbolCount, '0', STR_PAD_LEFT);
        return (int)$value;
    }

    public function generateAmeriaOrderID(int $startNumber)
    {
        return $startNumber + 1;
    }

    public static function getHours(string $startDate, string $endDate)
    {
        $startDate = new \DateTime($startDate);
        $endDate = new \DateTime($endDate);

        $interval = $startDate->diff($endDate);

        $hours = $interval->h + ($interval->days * 24);

        return $hours;
    }

    public static function getDays(\DateTime $start, \DateTime $end): false|int
    {
        $interval = $start->diff($end);

        return $interval->days;
    }

    public static function generateHashCode($inputString): string
    {
        $hash = hash('sha256', $inputString);
        return substr($hash, 0, 9);
    }

    public static function generateEasyPayOrderNumber()
    {
        $uuid = uniqid(bin2hex(random_bytes(8)) . '-', true); // Unique identifier like '32faa424-858a-4f22-92c5-a5'
        $secondPart = bin2hex(random_bytes(5)); // Generate random hex for the second part

        return $uuid . ' ' . $secondPart;
    }

    public static function getAge(int $plantingYear): int
    {
        $currentYear = (int)date('Y');
        $age = $currentYear - $plantingYear;
        return $age;
    }

    public static function getCSVData(string $path)
    {
        $csvData = [];
        if (($handle = fopen($path, "r")) !== FALSE) {
            fgetcsv($handle);
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $x = (float)$data[0];
                $y = (float)$data[1];
                $csvData[] = [$y, $x];
            }
            fclose($handle);
        } else {
            echo "Failed to open file.";
        }

        return $csvData;
    }

    public static function getTxtData(string $filename)
    {

        $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!$lines) {
            die("Could not read the file or file is empty.");
        }
        $header = explode("\t", array_shift($lines));
        $data = [];

        foreach ($lines as $line) {
            $fields = explode("\t", $line);
            $row = array_combine($header, $fields);

            if ($row === false) {
                $fields = array_pad($fields, count($header), '');
                $row = array_combine($header, $fields);
            }

            $data[] = $row;
        }

        return $data;

    }

    public static function getWithBlocks($filename)
        {
            $lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if (!$lines) return [];

            $blocks = [];
            $currentBlock = [];
            $header = null;

            foreach ($lines as $line) {
                if (strpos($line, 'type') === 0) {
                    if ($currentBlock) {
                        $blocks[] = $currentBlock;
                        $currentBlock = [];
                    }
                    $header = explode("\t", $line);
                    continue; // заголовок не добавляем в блок данных
                }

                if ($header) {
                    $fields = explode("\t", $line);
                    $fields = array_pad($fields, count($header), '');
                    $row = array_combine($header, $fields);
                    $color = $row['color'];
                    if(!empty($color)){
                        $currentBlock['color'] = $color;
                        $currentBlock['fill_color'] = $row['fill_color'];
                    }
                    $currentBlock[] = [(float)$row['latitude'], (float)$row['longitude']];
                }
            }

            if ($currentBlock) {
                $blocks[] = $currentBlock;
            }

            return $blocks;

    }

    public static function webMercatorToLatLon($x, $y)
    {
        $radius = 6378137.0;

        // Convert Y to latitude
        $latRad = atan(sinh($y / $radius));
        $latitude = rad2deg($latRad);

        // Convert X to longitude
        $longitude = rad2deg($x / $radius);

        return ['latitude' => $latitude, 'longitude' => $longitude];
    }

    public static function isPointInPolygon($point, $polygon) {
        $x = $point['latitude'];
        $y = $point['longitude'];
        $inside = false;

        $n = count($polygon);
        for ($i = 0, $j = $n - 1; $i < $n; $j = $i++) {
            $xi = $polygon[$i][0];
            $yi = $polygon[$i][1];
            $xj = $polygon[$j][0];
            $yj = $polygon[$j][1];

            $intersect = (($yi > $y) != ($yj > $y)) &&
                ($x < ($xj - $xi) * ($y - $yi) / (($yj - $yi) ?: 1e-10) + $xi);
            if ($intersect) $inside = !$inside;
        }

        return $inside;
    }

    public static function isRowToPolygon(array $row, $polygon)
    {
        $res = false;
        $isInside = [];
        foreach ($row as $index => $point) {
            $inside = self::isPointInPolygon($point, $polygon);
            if($inside){
                $isInside[] = 1;
            }
        }
        if(count($isInside) == count($row)){
            $res = true;
        }

        return $res;
    }

    public static function getPolygonCenter($polygon) {
        $latSum = 0;
        $lngSum = 0;
        $count = count($polygon);

        if ($count === 0) return null;

        foreach ($polygon as $point) {
            $latSum += $point['latitude'];
            $lngSum += $point['longitude'];
        }

        return [
            'latitude' => $latSum / $count,
            'longitude' => $lngSum / $count
        ];
    }

    public static function toSnakeCase($input) {
        return strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $input));
    }
    public static function toFirstChars($input): string
    {
        $str = strtolower(preg_replace('/([a-z])([A-Z])/', '$1_$2', $input));
        $strParts = explode("_", $str);
        $result = "";
        foreach ($strParts as $part){
            $result.= $part[0];
        }

        return $result;
    }

    public static function camelCaseToUnderline(string $input)
    {
        $parts = explode('\\', $input);
        $lastPart = end($parts);
        $sqlEntityName = Helper::toSnakeCase($lastPart);
        return self::toSnakeCase($sqlEntityName);
    }

    public static function orderArrayByFirstKey(string $firstItem, array $array): array
    {
        $keys = array_keys($array);

        if (in_array($firstItem, $keys)) {
            $keys = array_diff($keys, [$firstItem]);
            array_unshift($keys, $firstItem);
        }

        $newArray = [];
        foreach ($keys as $key) {
            $newArray[$key] = $array[$key];
        }

        return $newArray;
    }

    public static function yamlData(string $baseDir, string $path): array
    {
        $yamlPath = $baseDir.'/'.$path.'.yaml';
        $fileSystem = new Filesystem();
        $yamlData = [];
        if ($fileSystem->exists($yamlPath)) {
            $yamlData = Yaml::parseFile($yamlPath);
        }

        return $yamlData;
    }



    public static function generateClassFile(array $config): string
    {
        //
        // ──────────────────────────────────────────────────────────────
        // 1. Extract config
        // ──────────────────────────────────────────────────────────────
        $path       = rtrim($config['path'] ?? 'src/', '/') . '/';
        $namespace  = $config['namespace'] ?? self::autodetectNamespace($path);
        $className  = $config['name'] ?? 'MyClass';
        $properties = $config['properties'] ?? [];
        $methods    = $config['methods'] ?? [];
        $constructor = $config['constructor'] ?? [];
        $extends    = $config['extends'] ?? null;
        $implements = $config['implements'] ?? [];

        //
        // ──────────────────────────────────────────────────────────────
        // 2. Build namespace + class signature
        // ──────────────────────────────────────────────────────────────
        $class  = "<?php\n\n";
        if ($namespace) $class .= "namespace {$namespace};\n\n";

        // Build EXTENDS / IMPLEMENTS
        $signature = "class {$className}";
        if ($extends) $signature .= " extends {$extends}";
        if ($implements) $signature .= " implements " . implode(', ', $implements);
        $class .= $signature . "\n{\n";

        //
        // ──────────────────────────────────────────────────────────────
        // 3. PROPERTIES
        // ──────────────────────────────────────────────────────────────
        foreach ($properties as $prop) {
            $vis = $prop['visibility'] ?? 'private';
            $type = $prop['type'] ?? null;
            $name = $prop['name'];
            $default = array_key_exists('default', $prop) ? " = " . self::varExportClean($prop['default']) : "";

            $typeStr = $type ? "{$type} " : "";

            // DocBlock
            if ($type) {
                $class .= "    /**\n";
                $class .= "     * @var {$type}\n";
                $class .= "     */\n";
            }

            $class .= "    {$vis} {$typeStr}\${$name}{$default};\n\n";
        }

        //
        // ──────────────────────────────────────────────────────────────
        // 4. CONSTRUCTOR
        // ──────────────────────────────────────────────────────────────
        if (!empty($constructor)) {
            $params = [];
            $body   = [];

            foreach ($constructor as $arg) {
                $type = $arg['type'] ?? null;
                $name = $arg['name'];

                $params[] = ($type ? "{$type} " : "") . "\${$name}";
                $body[] = "        \$this->{$name} = \${$name};";
            }

            $class .= "    /**\n";
            $class .= "     * {$className} constructor.\n";
            foreach ($constructor as $arg) {
                $class .= "     * @param {$arg['type']} \${$arg['name']}\n";
            }
            $class .= "     */\n";
            $class .= "    public function __construct(" . implode(', ', $params) . ")\n";
            $class .= "    {\n" . implode("\n", $body) . "\n    }\n\n";
        }

        //
        // ──────────────────────────────────────────────────────────────
        // 5. METHODS
        // ──────────────────────────────────────────────────────────────
        foreach ($methods as $method) {
            $name = $method['name'];
            $params = $method['params'] ?? [];
            $return = $method['return'] ?? null;

            $paramCode = [];
            $docParams = [];

            foreach ($params as $p) {
                $type = $p['type'] ?? null;
                $paramName = $p['name'];
                $paramCode[] = ($type ? "{$type} " : "") . "\${$paramName}";
                $docParams[] = "     * @param {$type} \${$paramName}";
            }

            // DocBlock
            $class .= "    /**\n";
            $class .= "     * {$name} method.\n";
            if ($docParams) $class .= implode("\n", $docParams) . "\n";
            if ($return) $class .= "     * @return {$return}\n";
            $class .= "     */\n";

            // Signature
            $returnStr = $return ? ": {$return}" : "";
            $class .= "    public function {$name}(" . implode(', ', $paramCode) . "){$returnStr}\n";
            $class .= "    {\n";
            $class .= "        // TODO: Implement {$name}()\n";
            $class .= "    }\n\n";
        }

        $class .= "}\n";

        //
        // ──────────────────────────────────────────────────────────────
        // 6. Ensure directory exists and save file
        // ──────────────────────────────────────────────────────────────
        if (!is_dir($path)) mkdir($path, 0777, true);

        $filePath = $path . $className . '.php';
        file_put_contents($filePath, $class);

        return $filePath;
    }

    private static function autodetectNamespace(string $path): ?string
    {
        $path = trim($path, '/');
        $parts = explode('/', $path);

        // Find "src"
        $srcIndex = array_search('src', array_map('strtolower', $parts));
        if ($srcIndex === false) return null;

        // Convert remaining path to namespace
        $namespaceParts = array_slice($parts, $srcIndex + 1);
        return 'App\\' . implode('\\', array_map('ucfirst', $namespaceParts));
    }

    private static function varExportClean($value)
    {
        if (is_string($value)) return "'{$value}'";
        if (is_bool($value)) return $value ? 'true' : 'false';
        if (is_null($value)) return 'null';
        return var_export($value, true);
    }
}
