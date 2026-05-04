<?php
/**
 * STDERR — Leaderboard endpoint
 * Version: 0.1
 *
 * GET  → returns { scores: [top 10], count, blocklist: [...] }
 * POST → submits { initials, score, duration }
 *
 * Storage: flat JSON file alongside this script.
 * No external dependencies. Same CSP origin (./).
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate');

// ── Config ─────────────────────────────────────────────
$DATA_FILE       = __DIR__ . '/game001-scores.json';
$RATELIMIT_FILE  = __DIR__ . '/game001-ratelimit.json';

const MAX_STORED       = 100;          // keep top 100 internally
const TOP_DISPLAY      = 10;           // expose top 10 to client
const RATELIMIT_WINDOW = 10;           // seconds between submits per IP
const RATELIMIT_TTL    = 86400;        // ratelimit entries cleaned after 24h
const MAX_SCORE        = 10000;        // hard cap (matches victory)
const MIN_SCORE        = 1;
const MAX_RATE_PER_SEC = 200;          // implausibility gate: more than this points/sec → reject

// Initials blocklist — exact match, case-sensitive on uppercase input.
// Edit this list to add or remove entries.
const BLOCKED_INITIALS = [
  // ── Brand reservations ───────────────
  'EGM',
  // ── Sexual / anatomical ─────────────
  'ASS', 'CUM', 'DIK', 'DIC', 'COC', 'COK', 'KOK',
  'TIT', 'SEX', 'JIZ', 'WAD', 'BJB',
  // ── Profanity (English) ─────────────
  'FUK', 'FUC', 'FCK', 'BCH', 'SHT',
  'CNT', 'KNT', 'TWT', 'PSY', 'PIS',
  // ── Slurs ───────────────────────────
  'FAG', 'NIG', 'JAP', 'GAY',
  // ── Hate / extremism ────────────────
  'KKK', 'NZI', 'NAZ',
];

// ── Helpers ────────────────────────────────────────────

function fail(int $code, string $msg): void {
  http_response_code($code);
  echo json_encode(['error' => $msg]);
  exit;
}

function readScores(string $file): array {
  if (!file_exists($file)) return [];
  $raw = @file_get_contents($file);
  if ($raw === false || $raw === '') return [];
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}

function writeScores(string $file, array $scores): bool {
  $fp = @fopen($file, 'c+');
  if (!$fp) return false;
  if (!flock($fp, LOCK_EX)) { fclose($fp); return false; }
  ftruncate($fp, 0);
  rewind($fp);
  fwrite($fp, json_encode($scores, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
  fflush($fp);
  flock($fp, LOCK_UN);
  fclose($fp);
  return true;
}

function clientIp(): string {
  $ip = $_SERVER['REMOTE_ADDR'] ?? '';
  return is_string($ip) ? $ip : '';
}

function checkAndRecordRateLimit(string $file, string $ip): bool {
  $now = time();
  $data = file_exists($file) ? json_decode(@file_get_contents($file) ?: '[]', true) : [];
  if (!is_array($data)) $data = [];
  // Clean stale entries
  foreach ($data as $key => $ts) {
    if (!is_int($ts) || ($now - $ts) > RATELIMIT_TTL) unset($data[$key]);
  }
  if (isset($data[$ip]) && ($now - (int)$data[$ip]) < RATELIMIT_WINDOW) {
    return false;
  }
  $data[$ip] = $now;
  $fp = @fopen($file, 'c+');
  if ($fp) {
    if (flock($fp, LOCK_EX)) {
      ftruncate($fp, 0);
      rewind($fp);
      fwrite($fp, json_encode($data));
      fflush($fp);
      flock($fp, LOCK_UN);
    }
    fclose($fp);
  }
  return true;
}

function sortAndTrim(array $scores): array {
  usort($scores, function($a, $b) {
    return ($b['score'] ?? 0) <=> ($a['score'] ?? 0);
  });
  return array_slice($scores, 0, MAX_STORED);
}

function publicScores(array $scores): array {
  // Strip any internal fields, return only initials + score + date
  return array_map(function($s) {
    return [
      'initials' => isset($s['initials']) ? (string)$s['initials'] : '???',
      'score'    => isset($s['score']) ? (int)$s['score'] : 0,
      'date'     => isset($s['date']) ? (string)$s['date'] : '',
    ];
  }, array_slice($scores, 0, TOP_DISPLAY));
}

// ── Routing ────────────────────────────────────────────

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
  $scores = sortAndTrim(readScores($DATA_FILE));
  echo json_encode([
    'scores'    => publicScores($scores),
    'count'     => count($scores),
    'blocklist' => array_values(BLOCKED_INITIALS),
    'version'   => '0.1',
  ]);
  exit;
}

if ($method !== 'POST') {
  fail(405, 'method not allowed');
}

// ── POST: validate and insert ─────────────────────────

$rawBody = file_get_contents('php://input');
if ($rawBody === false || $rawBody === '') fail(400, 'empty body');
$input = json_decode($rawBody, true);
if (!is_array($input)) fail(400, 'invalid json');

$initials = isset($input['initials']) ? strtoupper(trim((string)$input['initials'])) : '';
$score    = isset($input['score']) ? (int)$input['score'] : 0;
$duration = isset($input['duration']) ? (int)$input['duration'] : 0;

if (!preg_match('/^[A-Z]{3}$/', $initials))         fail(400, 'invalid initials');
if (in_array($initials, BLOCKED_INITIALS, true))    fail(400, 'initials reserved');
if ($score < MIN_SCORE || $score > MAX_SCORE)        fail(400, 'invalid score');
if ($duration < 1)                                   fail(400, 'invalid duration');
if (($score / max(1, $duration)) > MAX_RATE_PER_SEC) fail(400, 'implausible rate');

// Rate limit
$ip = clientIp();
if ($ip !== '' && !checkAndRecordRateLimit($RATELIMIT_FILE, $ip)) {
  fail(429, 'too many submissions');
}

// Insert
$scores = readScores($DATA_FILE);
$scores[] = [
  'initials' => $initials,
  'score'    => $score,
  'date'     => date('Y-m-d'),
];
$scores = sortAndTrim($scores);

if (!writeScores($DATA_FILE, $scores)) {
  fail(500, 'cannot save score');
}

// Find rank
$rank = 0;
foreach ($scores as $i => $s) {
  if (($s['initials'] ?? '') === $initials && (int)($s['score'] ?? 0) === $score) {
    $rank = $i + 1;
    break;
  }
}

echo json_encode([
  'success' => true,
  'rank'    => $rank,
  'scores'  => publicScores($scores),
]);
