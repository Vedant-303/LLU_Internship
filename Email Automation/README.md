# Welcome Email Sender

A simple Express.js application for sending automated welcome emails to new users.

## Features

- 🚀 Express.js REST API
- 📧 Automated welcome email sending
- 🎨 Beautiful HTML email templates
- ✅ Input validation
- 🔧 Environment-based configuration
- 🧪 Test endpoints

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `env.example` to `.env`
   - Update the email configuration:
     ```env
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password
     ```

3. **For Gmail users:**
   - Enable 2-factor authentication
   - Generate an App Password
   - Use the App Password in `EMAIL_PASS`

## Usage

### Start the server:
```bash
npm start
```

### Development mode:
```bash
npm run dev
```

## API Endpoints

### 1. Send Welcome Email
**POST** `/send-welcome-email`

**Request Body:**
```json
{
  "userName": "John Doe",
  "userEmail": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully",
  "messageId": "message-id-here"
}
```

### 2. Test Welcome Email
**POST** `/test-welcome-email`

Sends a test welcome email to `test@example.com`

### 3. Health Check
**GET** `/health`

### 4. API Info
**GET** `/`

## Example Usage

### Using cURL:
```bash
curl -X POST http://localhost:3000/send-welcome-email \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "John Doe",
    "userEmail": "john@example.com"
  }'
```

### Using JavaScript:
```javascript
const response = await fetch('http://localhost:3000/send-welcome-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userName: 'John Doe',
    userEmail: 'john@example.com'
  })
});

const result = await response.json();
console.log(result);
```

## Email Template

The welcome email includes:
- Personalized greeting with user's name
- Welcome message
- Getting started guide
- Call-to-action button
- Social media links
- Footer with unsubscribe options

## Configuration

The email template can be customized by modifying the `createWelcomeEmailTemplate` function in `welcome_email_sender.js`.

## Error Handling

The API includes comprehensive error handling for:
- Missing required fields
- Invalid email format
- SMTP connection issues
- General server errors

## Security Notes

- Store sensitive credentials in environment variables
- Use App Passwords for Gmail
- Consider using a dedicated email service for production
- Implement rate limiting for production use 