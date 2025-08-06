// Enhanced Node.js API endpoint for contact form submissions
const nodemailer = require('nodemailer');

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME || 'default@bytewaveinnovations.ca',
      pass: process.env.SMTP_PASSWORD || 'nEEn@2024',
    },
  });
};

// Generate enhanced HTML email template
const generateContactEmailHTML = (data) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Form Submission</title>
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
        <div class="container">
            <div class="header">
                <h1>New Contact Form Submission</h1>
                <p>Received on ${currentDate}</p>
            </div>
            <div class="content">
                <div class="field-group">
                    <span class="field-label">Customer Name</span>
                    <div class="field-value">${data.name}</div>
                </div>
                
                <div class="field-group">
                    <span class="field-label">Email Address</span>
                    <div class="field-value">${data.email}</div>
                </div>
                
                <div class="service-info">
                    <div class="service-title">Service Requested: ${data.subject}</div>
                    ${data.component ? `<div class="component-title">Specific Component: ${data.component}</div>` : ''}
                </div>
                
                <div class="field-group">
                    <span class="field-label">Customer Message</span>
                    <div class="message-box">${data.message.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div class="priority-badge">⚡ Requires Response Within 24 Hours</div>
                
                <div class="footer">
                    <p>This email was sent from the ByteWave Innovations website contact form.</p>
                    <p>Please respond promptly to maintain excellent customer service.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

module.exports = async (req, res) => {
  // Enable CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed' 
    });
  }

  try {
    const { name, email, subject, component, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Create transporter
    const transporter = createTransporter();

    // Generate email content
    const emailData = { name, email, subject, component, message };
    const emailHtml = generateContactEmailHTML(emailData);

    // Email options
    const mailOptions = {
      from: `"ByteWave Innovations Contact Form" <${process.env.SMTP_USERNAME || 'default@bytewaveinnovations.ca'}>`,
      to: process.env.BUSINESS_EMAIL || 'info@bytewaveinnovations.ca',
      replyTo: email,
      subject: `New Contact Form Submission - ${subject}${component ? ` - ${component}` : ''}`,
      html: emailHtml,
      text: `
        New Contact Form Submission - ByteWave Innovations
        
        Customer Information:
        Name: ${name}
        Email: ${email}
        
        Service Details:
        Service: ${subject}${component ? `\nComponent: ${component}` : ''}
        
        Message:
        ${message}
        
        ---
        Please respond within 24 hours.
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Contact form email sent successfully:', info.messageId);

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully! We will respond within 24 hours.',
      messageId: info.messageId,
    });

  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again or contact us directly.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};