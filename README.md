# RSS Digest Worker

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare%20Workers-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)](https://workers.cloudflare.com/)
[![Cloudflare D1](https://img.shields.io/badge/Cloudflare%20D1-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
[![Cloudflare AI](https://img.shields.io/badge/Cloudflare%20AI-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)](https://developers.cloudflare.com/workers-ai/)
[![SendGrid](https://img.shields.io/badge/SendGrid-1A82E2?style=for-the-badge&logo=sendgrid&logoColor=white)](https://sendgrid.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

A serverless RSS/Atom feed digest service that fetches your favorite blogs, summarizes them using AI, and sends beautiful email digests. Built with Cloudflare's edge technologies.

## 📺 Demo

[![Watch the demo](https://img.shields.io/badge/Watch%20the%20demo-blue)](https://www.loom.com/share/85d566fa5c044ec4913b008a212924de?sid=336e8499-5a52-49da-98ca-b88f97eae32a)

## ✨ Features

- 📨 **Automated Email Digests**: Get updates from your favorite blogs in one beautiful email
- 🤖 **AI-Powered Summaries**: Each article is automatically summarized using Cloudflare's Workers AI
- 🎨 **Modern Design**: Clean, responsive email template that works across all email clients
- ⏰ **Flexible Scheduling**: Configure your preferred delivery days and times
- 🔒 **Secure & Scalable**: Built on Cloudflare's global network
- 💨 **Fast & Efficient**: Parallel processing of feeds with batch support

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account (free tier works!)
- SendGrid account (free tier works **again!**)

### Manual Setup

1. Clone and install dependencies:
```bash
git clone https://github.com/m6un/rss-worker.git
cd rss-worker
npm install
```

2. Configure environment:
```bash
# Copy example env file
cp .env.example .dev.vars

# Add your SendGrid API key
echo "SENDGRID_API_KEY=your_key_here" >> .dev.vars
```

3. Set up database:
```bash
# Create D1 database
wrangler d1 create prod-rss-worker

# Apply schema
wrangler d1 execute prod-rss-worker --file=./schema.sql
```

4. Add your feeds:
```sql
INSERT INTO feeds (url, user_id, blog_name) VALUES 
('https://blog.example.com/feed.xml', 1, 'Example Blog');

INSERT INTO user_preferences (
    user_id, 
    cron_schedule, 
    email_to, 
    email_from, 
    email_subject
) VALUES (
    1,
    '0 9 * * *',  -- Daily at 9 AM
    'your.email@example.com',
    'digest@yourdomain.com',
    'Your Daily Tech Digest'
);
```

5. Deploy:
```bash
npm run deploy
```

## 💻 Development

### Local Development

```bash
# Start local development server
npm run dev
```

## 🏗️ Architecture

The service is built using modern serverless technologies:

- **[Cloudflare Workers](https://workers.cloudflare.com/)**: Edge computing platform
- **[D1 Database](https://developers.cloudflare.com/d1/)**: SQLite at the edge
- **[Workers AI](https://developers.cloudflare.com/workers-ai/)**: ML-powered summaries
- **[SendGrid](https://sendgrid.com)**: Reliable email delivery

### How It Works

1. **Feed Processing**:
   - Fetches RSS/Atom feeds in parallel batches
   - Filters out previously processed items
   - Generates AI summaries for new content

2. **Email Generation**:
   - Creates beautiful HTML emails
   - Mobile-responsive design
   - Sanitized content for security

3. **Delivery**:
   - Scheduled via cron triggers
   - Configurable delivery times
   - Error handling and retries

### Development Process

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

- Create a [GitHub Issue](https://github.com/m6un/rss-worker/issues)
- Email: hi@chandrxn.me
