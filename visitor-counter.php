<?php
// Shared counter for SUNNEX. Requires PHP enabled in Plesk.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
$action = $_GET['action'] ?? 'get';
if ($action !== 'hit' && $action !== 'get') { http_response_code(400); echo json_encode(['error' => 'invalid action']); exit; }
// Store count outside public_html if possible. This fallback folder is protected by .htaccess.
$dir = __DIR__ . '/counter-data';
if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) { http_response_code(500); echo json_encode(['error' => 'storage unavailable']); exit; }
$file = $dir . '/visits.dat';
$fp = @fopen($file, 'c+');
if (!$fp) { http_response_code(500); echo json_encode(['error' => 'storage unavailable']); exit; }
if (!flock($fp, LOCK_EX)) { fclose($fp); http_response_code(500); echo json_encode(['error' => 'lock unavailable']); exit; }
rewind($fp);
$raw = trim(stream_get_contents($fp));
$count = ctype_digit($raw) ? (int)$raw : 0;
if ($action === 'hit') {
    $count++;
    rewind($fp);
    ftruncate($fp, 0);
    fwrite($fp, (string)$count);
    fflush($fp);
}
flock($fp, LOCK_UN);
fclose($fp);
echo json_encode(['count' => $count], JSON_UNESCAPED_UNICODE);
