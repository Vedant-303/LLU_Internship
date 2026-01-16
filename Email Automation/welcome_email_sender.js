const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
};

const transporter = nodemailer.createTransport(emailConfig);

const createWelcomeEmailTemplate = (userName, userEmail) => {
  return {
    from: `"Your Company" <${emailConfig.auth.user}>`,
    to: userEmail,
    subject: "Welcome to Our Platform! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Our Platform</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .email-container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #4CAF50;
            margin-bottom: 10px;
          }
          .welcome-text {
            font-size: 24px;
            color: #333;
            margin-bottom: 20px;
          }
          .content {
            margin-bottom: 30px;
          }
          .cta-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
          }
          .social-links {
            margin: 20px 0;
          }
          .social-links a {
            margin: 0 10px;
            color: #4CAF50;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <div class="logo">🚀 Your Platform</div>
            <div class="welcome-text">Welcome aboard, ${userName}!</div>
          </div>
          
          <div class="content">
            <p>Hi ${userName},</p>
            
            <p>Thank you for joining our platform! We're excited to have you as part of our community.</p>
            
            <p>Here's what you can do to get started:</p>
            <ul>
              <li>Complete your profile</li>
              <li>Explore our features</li>
              <li>Connect with other users</li>
              <li>Check out our tutorials</li>
            </ul>
            
            <p>If you have any questions, feel free to reach out to our support team. We're here to help!</p>
            
            <div style="text-align: center;">
              <a href="#" class="cta-button">Get Started</a>
            </div>
          </div>
          
          <div class="social-links">
            <p>Follow us on social media:</p>
            <a href="#">Twitter</a> | 
            <a href="#">Facebook</a> | 
            <a href="#">LinkedIn</a> | 
            <a href="#">Instagram</a>
          </div>
          
          <div class="footer">
            <p>© 2024 Your Platform. All rights reserved.</p>
            <p>You received this email because you signed up for our platform.</p>
            <p><a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

const sendWelcomeEmail = async (userName, userEmail) => {
  try {
    const mailOptions = createWelcomeEmailTemplate(userName, userEmail);
    
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully!');
    console.log('Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome Email Sender API',
    endpoints: {
      'POST /send-welcome-email': 'Send welcome email to a new user',
      'GET /health': 'Check API health'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/send-welcome-email', async (req, res) => {
  try {
    const { userName, userEmail } = req.body;
    
    if (!userName || !userEmail) {
      return res.status(400).json({
        success: false,
        error: 'userName and userEmail are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    const result = await sendWelcomeEmail(userName, userEmail);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Welcome email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error in send-welcome-email endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

app.post('/test-welcome-email', async (req, res) => {
  try {
    const testResult = await sendWelcomeEmail('Test User', 'test@example.com');
    res.json({
      success: true,
      message: 'Test welcome email sent',
      result: testResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Welcome Email Sender running on port ${PORT}`);
});

module.exports = { app, sendWelcomeEmail }; 