<?php
/**
 * GitHub star count for the landing page.
 *
 * Asks GitHub at most once an hour and keeps the answer in a small cache file.
 * If GitHub cannot be reached it serves the last good number. Visitors never
 * talk to GitHub themselves.
 *
 * Answers {"stars": 123}, or {"stars": null} when no number is known yet
 * (the page then simply hides the count).
 */

const STARS_REPO  = 'egmtm/EGM-Downloader';
const STARS_FRESH = 3600; // seconds a good answer stays fresh
const STARS_RETRY = 300;  // seconds to wait before asking again after a failure

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

if (!in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['GET', 'HEAD'], true)) {
    http_response_code(405);
    header('Allow: GET, HEAD');
    exit;
}

function stars_valid($n)
{
    return is_int($n) && $n >= 0;
}

function stars_save($file, $stars, $updated, $checked)
{
    $tmp = $file . '.' . bin2hex(random_bytes(4));
    $ok  = @file_put_contents($tmp, json_encode(['stars' => $stars, 'updated' => $updated, 'checked' => $checked])) !== false
        && @rename($tmp, $file);
    if (!$ok) {
        @unlink($tmp);
    }
}

$file    = __DIR__ . '/.stars-cache.json';
$now     = time();
$cache   = json_decode((string) @file_get_contents($file), true);
$cache   = is_array($cache) ? $cache : [];
$stars   = stars_valid($cache['stars'] ?? null) ? $cache['stars'] : null;
$updated = (int) ($cache['updated'] ?? 0);
$checked = (int) ($cache['checked'] ?? 0);

if ($now - $updated >= STARS_FRESH && $now - $checked >= STARS_RETRY) {
    // Note the attempt first, so a burst of visitors asks GitHub once, not once each.
    stars_save($file, $stars, $updated, $now);

    if (function_exists('curl_init')) {
        $ch = curl_init('https://api.github.com/repos/' . STARS_REPO);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_TIMEOUT        => 5,
            CURLOPT_HTTPHEADER     => ['Accept: application/vnd.github+json', 'User-Agent: egerena.com'],
        ]);
        $body = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $repo = $code === 200 ? json_decode((string) $body, true) : null;
        if (is_array($repo) && stars_valid($repo['stargazers_count'] ?? null)) {
            $stars   = $repo['stargazers_count'];
            $updated = $now;
            stars_save($file, $stars, $updated, $now);
        }
    }
}

echo json_encode(['stars' => $stars]);
