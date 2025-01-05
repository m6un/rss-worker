# RSS Digest Worker

A Cloudflare Worker that fetches RSS/Atom feeds, summarizes them using AI, and sends beautiful email digests.

## Features

- 📨 Automated email digests of your favorite blogs
- 🤖 AI-powered summaries of articles
- 🎨 Clean, modern email template
- ⏰ Configurable schedule via cron
- 🔒 Secure and scalable using Cloudflare Workers

## Setup

### Prerequisites

1. [Node.js](https://nodejs.org/) installed
2. [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed
3. A Cloudflare account
4. A SendGrid account and API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rss-worker.git
cd rss-worker
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.dev.vars` and fill in your SendGrid API key:
```bash
SENDGRID_API_KEY=your_key_here
```

4. Create a D1 database:
```bash
wrangler d1 create prod-rss-worker
```

5. Update the database ID in `wrangler.toml` with your new database ID

6. Apply the database schema:
```bash
wrangler d1 execute prod-rss-worker --file=./schema.sql
```

### Configuration

1. Update the cron schedule in `wrangler.toml` to your preferred time
2. Add your feeds and preferences to the database:
```sql
INSERT INTO feeds (url, user_id) VALUES 
('https://example.com/feed.xml', 1);

INSERT INTO user_preferences (user_id, cron_schedule, email_to, email_from, email_subject) 
VALUES (1, '0 9 * * 1,5', 'your.email@example.com', 'digest@yourdomain.com', 'Your Weekly Digest');
```

### Development

Run locally:
```bash
npm run dev
```

Preview the email template:
```
http://localhost:8787/?preview=true
```

### Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## Architecture

- **Cloudflare Workers**: Serverless execution environment
- **D1 Database**: Stores feed URLs and user preferences
- **Workers AI**: Generates article summaries
- **SendGrid**: Handles email delivery

## License

MIT

## Contributing

Pull requests are welcome!