<?php
/**
 * Quote Form Handler — egerena.com
 * Validates, rate-limits, sends via PHPMailer SMTP.
 * Redirects back to index.html with ?quote=<status>[&c=<code>]
 */

session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/phpmailer/PHPMailer.php';
require_once __DIR__ . '/phpmailer/SMTP.php';
require_once __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method not allowed');
}

function redirectBack($status, $code = null) {
    $url = 'index.html?quote=' . urlencode($status);
    if ($code !== null) $url .= '&c=' . urlencode($code);
    header('Location: ' . $url);
    exit;
}

function sanitize($data) {
    return trim(strip_tags((string)$data));
}

function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ── Rate limiting ────────────────────────────────────────────────
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateKey = 'rate_limit_' . md5($ip);
if (!isset($_SESSION[$rateKey]) || time() > $_SESSION[$rateKey]['reset']) {
    $_SESSION[$rateKey] = ['count' => 0, 'reset' => time() + 3600];
}
if ($_SESSION[$rateKey]['count'] >= RATE_LIMIT) {
    redirectBack('error', 'rate');
}
$_SESSION[$rateKey]['count']++;

// ── Honeypot ─────────────────────────────────────────────────────
if (!empty($_POST['website'])) {
    redirectBack('success');
}

// ── Inputs ───────────────────────────────────────────────────────
$name        = sanitize($_POST['name']          ?? '');
$email       = sanitize($_POST['email']         ?? '');
$company     = sanitize($_POST['company']       ?? '');
$description = sanitize($_POST['description']   ?? '');
$budget      = sanitize($_POST['budget']        ?? '');
$timeline    = sanitize($_POST['timeline']      ?? '');
$other       = sanitize($_POST['other_purpose'] ?? '');

// ── Validation ───────────────────────────────────────────────────
if ($name === '' || mb_strlen($name) > 200) {
    redirectBack('invalid', 'name');
}
if (!isValidEmail($email) || mb_strlen($email) > 254) {
    redirectBack('invalid', 'email');
}
if (mb_strlen($company) > 200) {
    redirectBack('invalid', 'company');
}
if (mb_strlen($description) < 120 || mb_strlen($description) > 1500) {
    redirectBack('invalid', 'description');
}

$purposes = [];
if (isset($_POST['purpose']) && is_array($_POST['purpose'])) {
    foreach ($_POST['purpose'] as $p) $purposes[] = sanitize($p);
}
if (empty($purposes)) {
    redirectBack('invalid', 'purpose');
}

// ── Maps ─────────────────────────────────────────────────────────
$purposeMap = [
    'web_design'           => 'Web Design',
    'graphic_branding'     => 'Graphic Design / Branding',
    'custom_app'           => 'Custom Application',
    'ui_ux'                => 'UI/UX Design',
    'media_production'     => 'Media Production (Audio/Video)',
    'music_podcast'        => 'Music/Podcast Production',
    'album_art'            => 'Album Art',
    'it_consulting'        => 'IT Consulting',
    'business_consulting'  => 'Business Consulting',
    'security_consulting'  => 'Security Consulting',
    'other'                => 'Other',
];

$budgetMap = [
    'under_500'   => 'Under $500',
    '500_2000'    => '$500 – $2,000',
    '2000_5000'   => '$2,000 – $5,000',
    '5000_10000'  => '$5,000 – $10,000',
    'other'       => 'Other',
];

$timelineMap = [
    'asap'           => 'ASAP',
    '1_3_months'     => '1–3 months',
    '3_6_months'     => '3–6 months',
    '6_plus_months'  => '6+ months',
    'flexible'       => 'Flexible',
];

$purposeLabels = [];
foreach ($purposes as $p) {
    $purposeLabels[] = $purposeMap[$p] ?? $p;
}
if (in_array('other', $purposes, true) && $other !== '') {
    $idx = array_search('Other', $purposeLabels, true);
    if ($idx !== false) $purposeLabels[$idx] = 'Other: ' . $other;
}

$budgetText   = $budgetMap[$budget]     ?? 'Not specified';
$timelineText = $timelineMap[$timeline] ?? 'Not specified';

// ── Email body ───────────────────────────────────────────────────
$body  = "New Quote Request from EGerena.com\n";
$body .= str_repeat('=', 50) . "\n\n";
$body .= "CONTACT\n";
$body .= "  Name:    $name\n";
$body .= "  Email:   $email\n";
if ($company !== '') $body .= "  Company: $company\n";
$body .= "\nPURPOSE\n";
foreach ($purposeLabels as $pl) $body .= "  • $pl\n";
$body .= "\nDESCRIPTION\n";
$body .= preg_replace('/^/m', '  ', $description) . "\n";
$body .= "\nBUDGET:   $budgetText\n";
$body .= "TIMELINE: $timelineText\n\n";
$body .= str_repeat('=', 50) . "\n";
$body .= "Submitted: " . date('Y-m-d H:i:s T') . "\n";
$body .= "IP:        $ip\n";
$body .= "User-Agent: " . substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 200) . "\n";
$body .= "\nReply directly to this message to respond to {$name}.\n";

// ── Send ─────────────────────────────────────────────────────────
try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->Port       = SMTP_PORT;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USERNAME;
    $mail->Password   = SMTP_PASSWORD;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Timeout    = 15;
    $mail->CharSet    = 'UTF-8';
    $mail->Encoding   = 'base64';

    $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
    $mail->addAddress(SMTP_TO_EMAIL);
    $mail->addReplyTo($email, $name);

    $mail->isHTML(false);
    $subjectName = mb_strlen($name) > 60 ? mb_substr($name, 0, 57) . '…' : $name;
    $mail->Subject = '[EGerena Quote] ' . $subjectName;
    $mail->Body    = $body;

    $mail->send();
    redirectBack('success');

} catch (Exception $e) {
    error_log('[EGerena Quote] PHPMailer error: ' . ($mail->ErrorInfo ?? $e->getMessage()));
    redirectBack('error', 'smtp');
}
