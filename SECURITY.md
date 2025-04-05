# Security Policy

## Reporting a Vulnerability

I take the security of Fastlytics seriously. If you believe you've found a security vulnerability, please follow these steps:

1. **Do Not** disclose the vulnerability publicly on GitHub Issues or any public forum
2. Email me at [contact@fastlytics.app](mailto:contact@fastlytics.app) with details about the vulnerability
3. Include the following information in your report:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- You will receive an acknowledgment of your report within 48 hours
- I aim to validate and assess the severity of each report within 7 days
- I will work on a fix based on severity:
  - Critical: 24-48 hours
  - High: 1 week
  - Medium: 2 weeks
  - Low: Next release cycle

### What to Expect

- A timely response to your report
- Regular updates on our progress addressing the issue
- Credit for discovering the vulnerability (unless you request anonymity)
- Notification when the vulnerability is fixed

## Security Best Practices

### For Developers

1. **API Keys**: Never commit API keys or other secrets to GitHub
2. **Authentication**: Use Supabase authentication as documented
3. **Data Handling**: Sanitize all user inputs, especially when processing custom race/driver data
4. **Dependencies**: Keep dependencies updated and regularly run security audits

### For Users

1. **Strong Passwords**: Use strong, unique passwords for your Fastlytics account

## Security Features

Fastlytics employs several security measures:

1. **API Key Authentication**: Backend API endpoints are protected by API keys
2. **Authentication**: User authentication through Supabase
3. **Sanitized Inputs**: All user inputs are sanitized before processing
4. **Secure Data Storage**: Sensitive data is stored securely in Supabase/Cloudflare R2 
