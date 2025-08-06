<?php
// Enhanced Email Configuration for Contact Form
$smtp_host = 'smtp.hostinger.com';
$smtp_port = 587;
$smtp_username = 'default@bytewaveinnovations.ca';
$smtp_password = 'nEEn@2024';
$from_email = 'default@bytewaveinnovations.ca';
$to_email = 'info@bytewaveinnovations.ca';

// Set CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input - Updated for new contact form structure
if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['subject']) || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Sanitize input
$name = htmlspecialchars(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL);
$subject = htmlspecialchars(trim($input['subject']));
$component = isset($input['component']) ? htmlspecialchars(trim($input['component'])) : '';
$message = htmlspecialchars(trim($input['message']));

// Validate email
if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

// Import PHPMailer classes
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Check if PHPMailer is available
if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    // Fallback to basic PHP mail() function
    $email_subject = "New Contact Form Submission - " . $subject . ($component ? " - " . $component : "");
    $email_body = "
    New message from ByteWave Innovations website:
    
    Name: $name
    Email: $email
    Service: $subject" . ($component ? "\nComponent: $component" : "") . "
    
    Message:
    $message
    
    ---
    Sent from ByteWave Innovations Contact Form
    ";
    
    $headers = "From: $from_email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    if (mail($to_email, $email_subject, $email_body, $headers)) {
        echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send email']);
    }
    exit();
}

try {
    // Create PHPMailer instance
    $mail = new PHPMailer(true);
    
    // Server settings
    $mail->isSMTP();
    $mail->Host = $smtp_host;
    $mail->SMTPAuth = true;
    $mail->Username = $smtp_username;
    $mail->Password = $smtp_password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $smtp_port;
    
    // Recipients
    $mail->setFrom($from_email, 'ByteWave Innovations Contact Form');
    $mail->addAddress($to_email, 'ByteWave Innovations');
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Contact Form Submission - " . $subject . ($component ? " - " . $component : "");
    
    // Enhanced HTML email template
    $mail->Body = "
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; }
            .header { background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 30px 20px; border-radius: 12px 12px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
            .content { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .field-group { margin-bottom: 25px; }
            .field-label { font-weight: bold; color: #3b82f6; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; display: block; }
            .field-value { background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981; font-size: 16px; }
            .service-info { background: linear-gradient(135deg, #e0f2fe, #f0f9ff); padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid #0ea5e9; }
            .service-title { color: #0369a1; font-weight: bold; font-size: 18px; margin-bottom: 5px; }
            .component-title { color: #059669; font-weight: 600; font-size: 16px; }
            .message-box { background: #fefefe; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; border-top: 1px solid #e5e7eb; margin-top: 30px; }
            .priority-badge { background: #fef3c7; color: #92400e; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>New Contact Form Submission</h1>
                <p>Received on " . date('F j, Y \a\t g:i A') . "</p>
            </div>
            <div class='content'>
                <div class='field-group'>
                    <span class='field-label'>Customer Name</span>
                    <div class='field-value'>$name</div>
                </div>
                
                <div class='field-group'>
                    <span class='field-label'>Email Address</span>
                    <div class='field-value'>$email</div>
                </div>
                
                <div class='service-info'>
                    <div class='service-title'>Service Requested: $subject</div>" . 
                    ($component ? "<div class='component-title'>Specific Component: $component</div>" : "") . "
                </div>
                
                <div class='field-group'>
                    <span class='field-label'>Customer Message</span>
                    <div class='message-box'>" . nl2br($message) . "</div>
                </div>
                
                <div class='priority-badge'>⚡ Requires Response Within 24 Hours</div>
                
                <div class='footer'>
                    <p>This email was sent from the ByteWave Innovations website contact form.</p>
                    <p>Please respond promptly to maintain excellent customer service.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Plain text version
    $mail->AltBody = "
    New Contact Form Submission - ByteWave Innovations
    
    Customer Information:
    Name: $name
    Email: $email
    
    Service Details:
    Service: $subject" . ($component ? "\nComponent: $component" : "") . "
    
    Message:
    $message
    
    ---
    Received on " . date('F j, Y \a\t g:i A') . "
    Please respond within 24 hours.
    ";
    
    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Contact form submitted successfully! We will respond within 24 hours.']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email. Please try again or contact us directly.']);
}
?>