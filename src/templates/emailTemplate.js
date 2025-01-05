function sanitizeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function generateEmailHTML(feedsData) {
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    if (!Array.isArray(feedsData) || feedsData.length === 0) {
        return `
            <html>
                <head>
                    <title>Weekly Digest</title>
                    <style>
                        * { font-family: sans-serif; }
                    </style>
                </head>
                <body style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="text-align: center; color: #2c3e50;">No new updates</h1>
                    <p style="text-align: center; color: #7f8c8d;">There are no new posts in your feeds since the last digest.</p>
                </body>
            </html>
        `;
    }

    const feedItemsHTML = feedsData.map(feed => {
        if (!feed?.items?.length) return '';
        
        const items = feed.items.map(item => `
            <div style="padding: 12px; border-bottom: 1px solid #eee;">
                <h4 style="margin: 0 0 2px 0">
                    ${sanitizeHtml(item.title ? item.title.trim() : 'Untitled')}
                    ${item.link ? `<a href="${sanitizeHtml(item.link)}" style="color: #2c3e50; text-decoration: none;">&#128279;</a>` : ''}
                </h4>
                <p style="color: #7f8c8d; margin: 2px 0;">
                    ${item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'No date'}
                </p>
                <p style="color: #34495e; line-height: 1.4; margin: 10px 0 0 0;">
                    ${sanitizeHtml(item.summary ? item.summary.trim() : 'No summary available')}
                </p>
            </div>
        `).join('');

        return `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #2c3e50; font-weight: 600; border-bottom: 2px solid #ff4d4d; padding-bottom: 5px; margin: 5px 0 10px 0;">
                    ${sanitizeHtml(feed.source ? feed.source.trim() : 'Blog Feed')}
                </h4>
                ${items}
            </div>
        `;
    }).filter(Boolean).join('');

    return `
        <html>
            <head>
                <title>Weekly Digest</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100..1000:wght@500&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
           <style>
                    * { 
                        font-family: 'Inter', sans-serif;
                        font-weight: 400;
                    }
                    .digest-title {
                        font-family: 'DM Sans', sans-serif;
                        font-size: 1.5em;
                        font-weight: 600;
                    }
                    h4 {
                        font-weight: 500;
                    }
                    p {
                        font-size: 13px;
                    }
                </style>
            </head>
            <body style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 class="digest-title" style="text-align: center; color: #2c3e50;">
                    Weekly Digest - ${currentDate}
                </h1>
                ${feedItemsHTML}
            </body>
        </html>
    `;
} 