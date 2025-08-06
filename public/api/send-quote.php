<?php
// API endpoint for sending quote requests via email using PHPMailer
// ---------------------------------------------------------------
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Include PHPMailer (ensure Composer's autoload is present)
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

try {
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    // Validate required fields
    if (empty($data['customer']['name']) || empty($data['customer']['email']) || empty($data['items'])) {
        throw new Exception('Missing required fields');
    }

    $customer = $data['customer'];
    $items = $data['items'];
    $totalItems = $data['totalItems'] ?? 0;
    $quoteId = 'QT-' . time() . '-' . rand(1000, 9999);

    // Create PHPMailer instance
    $mail = new PHPMailer(true);

    // Server settings (use getenv for environment variables)
    $mail->isSMTP();
    $mail->Host       = getenv('SMTP_HOST') ?: 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = getenv('SMTP_USERNAME') ?: 'default@bytewaveinnovations.ca';
    $mail->Password   = getenv('SMTP_PASSWORD') ?: 'nEEn@2024'; // Replace with secure method
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = getenv('SMTP_PORT') ?: 587;

    // Recipients
    $mail->setFrom(getenv('FROM_EMAIL') ?: 'default@bytewaveinnovations.ca', 'Quote System');
    $mail->addAddress(getenv('BUSINESS_EMAIL') ?: 'info@bytewaveinnovations.ca', 'Business Quotes');
    $mail->addReplyTo($customer['email'], $customer['name']);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Quote Request from {$customer['name']} - {$quoteId}";

    // Generate HTML email content
    $mail->Body = generateQuoteEmailHTML($customer, $items, $totalItems, $quoteId);
    $mail->AltBody = generateQuoteEmailText($customer, $items, $totalItems, $quoteId);

    // Send email
    $mail->send();

    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Quote request sent successfully',
        'quoteId' => $quoteId
    ]);

} catch (Exception $e) {
    http_response_code(500);
    // In production, avoid exposing sensitive error details
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email. Please try again later.'
    ]);
    // Optionally log $e->getMessage() to a secure server log
}

// Generate HTML email for the quote
function generateQuoteEmailHTML($customer, $items, $totalItems, $quoteId) {
    $currentDate = date('F j, Y');
    $html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Quote Request - ' . htmlspecialchars($quoteId) . '</title><style>body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; } .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); } .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; } .header h1 { margin: 0; font-size: 28px; font-weight: bold; } .header p { margin: 10px 0 0 0; opacity: 0.9; } .content { padding: 30px; } .section { margin-bottom: 30px; } .section h2 { color: #4a5568; font-size: 20px; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; } .customer-info { background: #f7fafc; padding: 20px; border-radius: 6px; border-left: 4px solid #667eea; } .info-row { margin-bottom: 10px; } .info-label { font-weight: bold; color: #4a5568; display: inline-block; width: 100px; } .services-summary { background: #e6fffa; padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #81e6d9; } .service-item { background: #f9f9f9; padding: 15px; margin-bottom: 15px; border-radius: 6px; border: 1px solid #e2e8f0; } .service-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; } .service-name { font-weight: bold; color: #2d3748; font-size: 16px; } .service-type { color: #667eea; font-size: 14px; font-weight: 500; } .service-quantity { background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; } .service-description { color: #718096; font-size: 14px; } .action-required { background: #fff5f5; border: 1px solid #feb2b2; padding: 20px; border-radius: 6px; margin: 20px 0; } .action-required h3 { color: #c53030; margin-top: 0; } .footer { text-align: center; padding: 20px; background: #f7fafc; color: #718096; font-size: 14px; } .highlight { background: #fef5e7; padding: 2px 6px; border-radius: 3px; } @media (max-width: 600px) { .service-header { flex-direction: column; align-items: flex-start; } .service-quantity { margin-top: 8px; } }</style></head><body><div class="container"><div class="header"><h1>New Quote Request</h1><p>Quote ID: ' . htmlspecialchars($quoteId) . ' • ' . $currentDate . '</p></div><div class="content"><div class="section"><h2>Customer Information</h2><div class="customer-info"><div class="info-row"><span class="info-label">Name:</span><span>' . htmlspecialchars($customer['name']) . '</span></div><div class="info-row"><span class="info-label">Email:</span><span>' . htmlspecialchars($customer['email']) . '</span></div><div class="info-row"><span class="info-label">Phone:</span><span>' . htmlspecialchars($customer['phone'] ?? 'Not provided') . '</span></div>';
    if (!empty($customer['message'])) {
        $html .= '<div class="info-row" style="margin-top: 15px;"><span class="info-label">Message:</span><br><div style="margin-top: 8px; padding: 10px; background: white; border-radius: 4px; border: 1px solid #e2e8f0;">' . nl2br(htmlspecialchars($customer['message'])) . '</div></div>';
    }
    $html .= '</div></div><div class="section"><h2>Requested Services</h2><div class="services-summary"><strong>Summary:</strong> ' . count($items) . ' service types • ' . $totalItems . ' total items</div>';
    foreach ($items as $item) {
        $html .= '<div class="service-item"><div class="service-header"><div><div class="service-name">' . htmlspecialchars($item['name']) . '</div><div class="service-type">' . htmlspecialchars($item['serviceType']) . '</div></div><div class="service-quantity">Qty: ' . (int)$item['quantity'] . '</div></div><div class="service-description">' . htmlspecialchars($item['description']) . '</div></div>';
    }
    $html .= '</div><div class="action-required"><h3>⚡ Action Required</h3><p>Please respond to this quote request within <span class="highlight">24-48 hours</span>.</p><p>Customer is waiting for pricing and timeline information.</p></div></div><div class="footer"><p>This quote request was generated automatically from your website.</p><p>Quote ID: ' . htmlspecialchars($quoteId) . ' • Generated on ' . $currentDate . '</p></div></div></body></html>';
    return $html;
}

// Generate plain text version of the quote email
function generateQuoteEmailText($customer, $items, $totalItems, $quoteId) {
    $currentDate = date('F j, Y');
    $text = "NEW QUOTE REQUEST\n";
    $text .= "Quote ID: {$quoteId}\n";
    $text .= "Date: {$currentDate}\n\n";
    $text .= "CUSTOMER INFORMATION\n====================\n";
    $text .= "Name: {$customer['name']}\n";
    $text .= "Email: {$customer['email']}\n";
    $text .= "Phone: " . ($customer['phone'] ?? 'Not provided') . "\n";
    if (!empty($customer['message'])) {
        $text .= "Message: {$customer['message']}\n";
    }
    $text .= "\nREQUESTED SERVICES\n==================\n";
    $text .= "Total Service Types: " . count($items) . "\n";
    $text .= "Total Items: {$totalItems}\n\n";
    foreach ($items as $item) {
        $text .= "• {$item['name']} (Qty: {$item['quantity']})\n";
        $text .= "  Service Type: {$item['serviceType']}\n";
        $text .= "  Description: {$item['description']}\n\n";
    }
    $text .= "ACTION REQUIRED\n===============\n";
    $text .= "Please respond to this quote request within 24-48 hours.\n";
    $text .= "Customer is waiting for pricing and timeline information.\n\n";
    $text .= "This quote request was generated automatically from your website.\n";
    $text .= "Quote ID: {$quoteId}";
    return $text;
}
?>