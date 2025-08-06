<?php
// Enhanced API endpoint for sending quote requests via email using PHPMailer
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
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
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
    $quoteId = $data['quoteId'] ?? 'QT-' . time() . '-' . rand(1000, 9999);

    // Create PHPMailer instance
    $mail = new PHPMailer(true);

    // Server settings (use getenv for environment variables)
    $mail->isSMTP();
    $mail->Host       = getenv('SMTP_HOST') ?: 'smtp.hostinger.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = getenv('SMTP_USERNAME') ?: 'default@bytewaveinnovations.ca';
    $mail->Password   = getenv('SMTP_PASSWORD') ?: 'nEEn@2024';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = getenv('SMTP_PORT') ?: 587;

    // Recipients
    $mail->setFrom(getenv('FROM_EMAIL') ?: 'default@bytewaveinnovations.ca', 'ByteWave Quote System');
    $mail->addAddress(getenv('BUSINESS_EMAIL') ?: 'info@bytewaveinnovations.ca', 'ByteWave Business Quotes');
    $mail->addReplyTo($customer['email'], $customer['name']);

    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Quote Request from {$customer['name']} - {$quoteId}";

    // Generate enhanced HTML email content
    $mail->Body = generateEnhancedQuoteEmailHTML($customer, $items, $totalItems, $quoteId);
    $mail->AltBody = generateQuoteEmailText($customer, $items, $totalItems, $quoteId);

    // Send email
    $mail->send();

    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Quote request sent successfully! We will respond within 24-48 hours.',
        'quoteId' => $quoteId
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send quote request. Please try again later.',
        'details' => $e->getMessage()
    ]);
}

// Generate enhanced HTML email for the quote
function generateEnhancedQuoteEmailHTML($customer, $items, $totalItems, $quoteId) {
    $currentDate = date('F j, Y');
    $currentTime = date('g:i A');
    
    $html = '<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote Request - ' . htmlspecialchars($quoteId) . '</title>
        <style>
            body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
            .header p { margin: 15px 0 0 0; opacity: 0.95; font-size: 18px; }
            .content { padding: 40px 30px; }
            .section { margin-bottom: 35px; }
            .section h2 { color: #4a5568; font-size: 24px; margin-bottom: 20px; border-bottom: 3px solid #e2e8f0; padding-bottom: 10px; display: flex; align-items: center; }
            .section h2::before { content: "📋"; margin-right: 10px; font-size: 20px; }
            .customer-info { background: linear-gradient(135deg, #f7fafc, #edf2f7); padding: 25px; border-radius: 10px; border-left: 5px solid #667eea; }
            .info-row { margin-bottom: 15px; display: flex; align-items: center; }
            .info-label { font-weight: bold; color: #4a5568; display: inline-block; width: 120px; margin-right: 15px; }
            .info-value { color: #2d3748; font-size: 16px; }
            .services-summary { background: linear-gradient(135deg, #e6fffa, #f0fff4); padding: 20px; border-radius: 10px; margin-bottom: 25px; border: 2px solid #81e6d9; }
            .summary-stats { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
            .stat-item { text-align: center; padding: 10px; }
            .stat-number { font-size: 28px; font-weight: bold; color: #319795; display: block; }
            .stat-label { font-size: 14px; color: #4a5568; text-transform: uppercase; letter-spacing: 0.5px; }
            .service-item { background: #f9f9f9; padding: 20px; margin-bottom: 20px; border-radius: 10px; border: 1px solid #e2e8f0; position: relative; overflow: hidden; }
            .service-item::before { content: ""; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: linear-gradient(to bottom, #667eea, #764ba2); }
            .service-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
            .service-name { font-weight: bold; color: #2d3748; font-size: 18px; }
            .service-type { color: #667eea; font-size: 14px; font-weight: 600; margin-top: 4px; }
            .service-quantity { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 6px 16px; border-radius: 25px; font-size: 14px; font-weight: bold; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3); }
            .service-description { color: #718096; font-size: 15px; line-height: 1.5; }
            .action-required { background: linear-gradient(135deg, #fff5f5, #fed7d7); border: 2px solid #feb2b2; padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center; }
            .action-required h3 { color: #c53030; margin-top: 0; font-size: 20px; display: flex; align-items: center; justify-content: center; }
            .action-required h3::before { content: "⚡"; margin-right: 8px; font-size: 24px; }
            .priority-items { background: #fef5e7; padding: 15px; border-radius: 8px; margin-top: 15px; }
            .priority-items ul { margin: 0; padding-left: 20px; }
            .priority-items li { margin-bottom: 8px; color: #744210; }
            .footer { text-align: center; padding: 30px; background: #f7fafc; color: #718096; font-size: 14px; }
            .footer-logo { font-size: 18px; font-weight: bold; color: #4a5568; margin-bottom: 10px; }
            .highlight { background: linear-gradient(135deg, #fef5e7, #fed7aa); padding: 3px 8px; border-radius: 4px; font-weight: 600; }
            @media (max-width: 600px) { 
                .service-header { flex-direction: column; align-items: flex-start; } 
                .service-quantity { margin-top: 10px; } 
                .summary-stats { flex-direction: column; }
                .stat-item { margin-bottom: 15px; }
                .content { padding: 20px; }
                .header { padding: 30px 20px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Quote Request</h1>
                <p>Quote ID: ' . htmlspecialchars($quoteId) . ' • ' . $currentDate . ' at ' . $currentTime . '</p>
            </div>
            <div class="content">
                <div class="section">
                    <h2>Customer Information</h2>
                    <div class="customer-info">
                        <div class="info-row">
                            <span class="info-label">👤 Name:</span>
                            <span class="info-value">' . htmlspecialchars($customer['name']) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">📧 Email:</span>
                            <span class="info-value">' . htmlspecialchars($customer['email']) . '</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">📱 Phone:</span>
                            <span class="info-value">' . htmlspecialchars($customer['phone'] ?? 'Not provided') . '</span>
                        </div>';
    
    if (!empty($customer['message'])) {
        $html .= '<div class="info-row" style="margin-top: 20px; flex-direction: column; align-items: flex-start;">
                    <span class="info-label" style="margin-bottom: 8px;">💬 Message:</span>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; width: 100%; box-sizing: border-box;">' . nl2br(htmlspecialchars($customer['message'])) . '</div>
                  </div>';
    }
    
    $html .= '</div>
                </div>
                
                <div class="section">
                    <h2>Requested Services</h2>
                    <div class="services-summary">
                        <div class="summary-stats">
                            <div class="stat-item">
                                <span class="stat-number">' . count($items) . '</span>
                                <span class="stat-label">Service Types</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">' . $totalItems . '</span>
                                <span class="stat-label">Total Items</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">24-48h</span>
                                <span class="stat-label">Response Time</span>
                            </div>
                        </div>
                    </div>';
    
    foreach ($items as $item) {
        $html .= '<div class="service-item">
                    <div class="service-header">
                        <div>
                            <div class="service-name">' . htmlspecialchars($item['name']) . '</div>
                            <div class="service-type">' . htmlspecialchars($item['serviceType']) . '</div>
                        </div>
                        <div class="service-quantity">Qty: ' . (int)$item['quantity'] . '</div>
                    </div>
                    <div class="service-description">' . htmlspecialchars($item['description']) . '</div>
                  </div>';
    }
    
    $html .= '</div>
                
                <div class="action-required">
                    <h3>Action Required</h3>
                    <p>Please respond to this quote request within <span class="highlight">24-48 hours</span>.</p>
                    <div class="priority-items">
                        <strong>Next Steps:</strong>
                        <ul>
                            <li>Review customer requirements carefully</li>
                            <li>Prepare detailed pricing breakdown</li>
                            <li>Include timeline estimates</li>
                            <li>Send professional quote response</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-logo">ByteWave Innovations</div>
                <p>This quote request was generated automatically from your website.</p>
                <p><strong>Quote ID:</strong> ' . htmlspecialchars($quoteId) . ' • <strong>Generated:</strong> ' . $currentDate . ' at ' . $currentTime . '</p>
            </div>
        </div>
    </body>
    </html>';
    
    return $html;
}

// Generate plain text version of the quote email
function generateQuoteEmailText($customer, $items, $totalItems, $quoteId) {
    $currentDate = date('F j, Y');
    $currentTime = date('g:i A');
    
    $text = "NEW QUOTE REQUEST\n";
    $text .= "==================\n";
    $text .= "Quote ID: {$quoteId}\n";
    $text .= "Date: {$currentDate} at {$currentTime}\n\n";
    
    $text .= "CUSTOMER INFORMATION\n";
    $text .= "====================\n";
    $text .= "Name: {$customer['name']}\n";
    $text .= "Email: {$customer['email']}\n";
    $text .= "Phone: " . ($customer['phone'] ?? 'Not provided') . "\n";
    
    if (!empty($customer['message'])) {
        $text .= "Message: {$customer['message']}\n";
    }
    
    $text .= "\nREQUESTED SERVICES\n";
    $text .= "==================\n";
    $text .= "Total Service Types: " . count($items) . "\n";
    $text .= "Total Items: {$totalItems}\n\n";
    
    foreach ($items as $item) {
        $text .= "• {$item['name']} (Qty: {$item['quantity']})\n";
        $text .= "  Service Type: {$item['serviceType']}\n";
        $text .= "  Description: {$item['description']}\n\n";
    }
    
    $text .= "ACTION REQUIRED\n";
    $text .= "===============\n";
    $text .= "Please respond to this quote request within 24-48 hours.\n";
    $text .= "Customer is waiting for pricing and timeline information.\n\n";
    
    $text .= "Next Steps:\n";
    $text .= "- Review customer requirements carefully\n";
    $text .= "- Prepare detailed pricing breakdown\n";
    $text .= "- Include timeline estimates\n";
    $text .= "- Send professional quote response\n\n";
    
    $text .= "This quote request was generated automatically from your website.\n";
    $text .= "Quote ID: {$quoteId} • Generated: {$currentDate} at {$currentTime}";
    
    return $text;
}
?>