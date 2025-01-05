-- Feeds table to store the feed URLs and last parsing time
CREATE TABLE feeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    last_parsed DATETIME,
    user_id INTEGER,
    blog_name TEXT
);

-- User preferences table to store digest preferences
CREATE TABLE user_preferences (
    user_id INTEGER PRIMARY KEY,
    cron_schedule TEXT NOT NULL, -- e.g., "0 9 * * 1,5" (matches wrangler.toml)
    email_to TEXT NOT NULL,
    email_from TEXT NOT NULL,
    email_subject TEXT DEFAULT 'Your Weekly Digest'
);

-- Insert example data (replace with your own values)
INSERT INTO feeds (url, last_parsed, user_id, blog_name) VALUES 
('https://blog.samaltman.com/posts.atom', '2024-01-01 00:00:00', 1, 'Sam Altman blog');

INSERT INTO user_preferences (user_id, cron_schedule, email_to, email_from, email_subject) VALUES 
(1, '0 9 * * 1,5', 'your.email@example.com', 'digest@example.com', 'Your Weekly Digest');