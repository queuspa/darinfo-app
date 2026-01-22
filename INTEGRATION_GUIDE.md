# Darinfo App - IA-Zap Integration Guide

## Overview
Darinfo is a React Native mobile app designed for customer support and subscription management. The app integrates seamlessly with IA-Zap for real-time messaging, payment processing, and automated reminders.

## Architecture

### App Screens
1. **LoginScreen** - Username-based login
2. **ConversationsScreen** - Chat conversations list
3. **MessagesScreen** - Message display and sending
4. **ProfileScreen** - User profile and settings

### Integration with IA-Zap
The app communicates with IA-Zap through the `iaZapService` module located at `src/services/iaZapService.js`.

## IA-Zap API Endpoints

### 1. Send Message
**Endpoint:** `POST /messages/send`
**Purpose:** Send a message from app to IA-Zap
**Payload:**
```javascript
{
  username: "client_username",
  conversationId: "conversation_id",
  message: "message text",
  attachments: [],
  timestamp: "2024-01-01T10:30:00Z",
  appName: "darinfo-app",
  version: "1.0.0"
}
```

### 2. Get Conversations
**Endpoint:** `GET /conversations/{username}`
**Purpose:** Fetch all conversations for a user
**Response:**
```javascript
{
  conversations: [
    {
      id: "conv_123",
      username: "client_username",
      topic: "Subscription Renewal",
      createdAt: "2024-01-01",
      messages: []
    }
  ]
}
```

### 3. Get Messages
**Endpoint:** `GET /conversations/{conversationId}/messages`
**Purpose:** Fetch messages from a specific conversation

### 4. Upload File
**Endpoint:** `POST /upload`
**Purpose:** Upload payment proof or documents
**Type:** Multipart form data

### 5. Send Reminder
**Endpoint:** `POST /reminders/send`
**Purpose:** Send scheduled reminder messages
**Payload:**
```javascript
{
  username: "client_username",
  message: "Your subscription expires soon",
  scheduledFor: "2024-01-15T09:00:00Z",
  reminderType: "renewal",
  appName: "darinfo-app"
}
```

### 6. Update Payment Status
**Endpoint:** `PUT /payments/status`
**Purpose:** Update payment verification status
**Payload:**
```javascript
{
  username: "client_username",
  paymentProofId: "proof_123",
  status: "verified", // 'pending', 'verified', 'rejected'
  amount: 50.00,
  systemType: "IPTV" // 'IPTV', 'P2P'
}
```

## Business Flow

### 1. Customer Login
- Customer enters username
- App stores username in AsyncStorage
- User navigated to main app screens

### 2. Sending Messages
- Customer types message in MessagesScreen
- App sends message to IA-Zap via `sendMessage()` function
- OpenAI/IA bot processes the message
- Response returned to customer in app

### 3. Payment Processing
- Customer uploads payment proof in ConversationsScreen
- App sends file to IA-Zap via `uploadFile()` function
- You (Admin) verify payment in IA-Zap
- App updates payment status via `updatePaymentStatus()` function
- Customer notified in app

### 4. Subscription Renewal
- You schedule reminder via IA-Zap
- `sendReminder()` function sends message to customer
- Customer receives reminder notification in app
- Customer initiates renewal conversation

### 5. Support Requests
- Customer can request IPTV tests or P2P access
- OpenAI bot handles initial support
- Complex issues forwarded to you in IA-Zap
- You provide solutions and generate test credentials

## Configuration

### Environment Variables
Create a `.env` file in the project root:
```
IA_ZAP_BASE_URL=https://app.ia-zap.app.br
IA_ZAP_TOKEN=1XmdXDf2v2RrYPVLFuqy8zD5JEauyw
```

### API Token
The IA-Zap API token is currently hardcoded in `iaZapService.js`. Update it with your actual token.

## Webhook Setup

To receive real-time messages from IA-Zap:

1. Deploy the app backend (Node.js server)
2. Register webhook endpoint:
```javascript
iaZapService.registerWebhook("https://yourdomain.com/webhooks/iazap")
```
3. Handle incoming messages in webhook handler

## Installation & Setup

```bash
# Install dependencies
npm install

# For Android
npm run android

# For iOS
npm run ios
```

## File Upload Support

The app supports uploading:
- Images (payment proof)
- Documents (invoices, receipts)
- Screenshots

Implementation uses:
- `react-native-image-picker` - for photos
- `react-native-document-picker` - for documents

## Message Features

1. **Text Messages** - Direct messaging
2. **File Attachments** - Upload documents and images
3. **Timestamps** - All messages timestamped
4. **Conversation Threading** - Messages grouped by conversation
5. **Read Status** - Message read/unread status tracking

## Payment System Integration

### Supported Payment Methods
- PIX (Brazil) - Primary method
- Other methods configured in IA-Zap

### Verification Flow
1. Customer sends payment proof
2. Admin verifies proof amount and system type
3. Admin activates/renews service
4. App sends confirmation message
5. Customer receives activation details

## Testing

### Test Credentials
- Username: `teste_cliente`
- Password: N/A (username login only)

### API Testing
```bash
curl -X POST https://app.ia-zap.app.br/messages/send \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","message":"Hello"}'
```

## Troubleshooting

### Messages not sending
1. Check IA-Zap token validity
2. Verify network connectivity
3. Check console logs in app
4. Verify API endpoint URLs

### Files not uploading
1. Check file permissions on device
2. Verify file size limits
3. Check network connection

### Messages not receiving
1. Verify webhook registration
2. Check webhook URL is publicly accessible
3. Verify token in webhook headers

## Support
For issues or questions about the integration, contact the development team or check IA-Zap documentation at https://app.ia-zap.app.br
