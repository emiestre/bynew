<?php
// Hostinger Email Configuration
// Replace these with your actual Hostinger email settings
$smtp_host = 'smtp.hostinger.com';
$smtp_port = 587; // or 465 for SSL
$smtp_username = 'default@bytewaveinnovations.ca'; // Your Hostinger email
$smtp_password = 'nEEn@2024'; // Your email password
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

// Validate input
if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['subject']) || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit();
}

// Sanitize input
$name = htmlspecialchars(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL);
$subject = htmlspecialchars(trim($input['subject']));
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

// Check if PHPMailer is available (most Hostinger accounts have it)
if (!class_exists('PHPMailer\PHPMailer\PHPMailer')) {
    // Fallback to basic PHP mail() function
    $email_subject = "New Contact Form Submission - " . $subject;
    $email_body = "
    New message from ByteWave Innovations website:
    
    Name: $name
    Email: $email
    Subject: $subject
    
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
    $mail->setFrom($from_email, 'ByteWave Innovations');
    $mail->addAddress($to_email, 'ByteWave Innovations');
    $mail->addReplyTo($email, $name);
    
    // Content
    $mail->isHTML(true);
    $mail->Subject = "New Contact Form Submission - " . $subject;
    $mail->Body = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6, #10b981); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #3b82f6; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #10b981; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>Name:</span> $name
                </div>
                <div class='field'>
                    <span class='label'>Email:</span> $email
                </div>
                <div class='field'>
                    <span class='label'>Subject:</span> $subject
                </div>
                <div class='message-box'>
                    <span class='label'>Message:</span><br>
                    " . nl2br($message) . "
                </div>
                <hr style='margin: 20px 0; border: none; border-top: 1px solid #ddd;'>
                <p style='color: #666; font-size: 12px;'>
                    This email was sent from the ByteWave Innovations website contact form.
                </p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $mail->AltBody = "
    New message from ByteWave Innovations website:
    
    Name: $name
    Email: $email
    Subject: $subject
    
    Message:
    $message
    
    ---
    Sent from ByteWave Innovations Contact Form
    ";
    
    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Mailer Error: ' . $mail->ErrorInfo]);
}
?>