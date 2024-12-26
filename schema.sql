-- Feeds table to store the feed URLs and last parsing time
CREATE TABLE feeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    last_parsed DATETIME,
    user_id INTEGER
);

-- User preferences table to store digest preferences
CREATE TABLE user_preferences (
    user_id INTEGER PRIMARY KEY,
    preferred_days TEXT, -- e.g., "Mon,Wed,Fri"
    preferred_time TIME  -- e.g., "09:00"
);

-- Insert a sample feed
INSERT INTO feeds (url, last_parsed, user_id) VALUES 
('https://blog.samaltman.com/posts.atom', '2024-12-24 15:00:00', 1);

-- Insert a sample user preference
INSERT INTO user_preferences (user_id, preferred_days, preferred_time) VALUES 
(1, 'Mon,Wed,Fri', '09:00');